import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  ////////////////////////////////
  // Persistent Manager Actor State
  ////////////////////////////////

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let confessions = Map.empty<Nat, Confession>();
  let threads = Map.empty<Nat, Thread>();
  let resources = Map.empty<Nat, Resource>();
  let events = Map.empty<Nat, Event>();
  let userSettings = Map.empty<Principal, UserSettings>();
  let moderationActions = Map.empty<Nat, ModerationAction>();
  let lastSeenConfessions = Map.empty<Principal, Nat>();

  // Matches and Swipes
  let userMatches = Map.empty<Principal, [Text]>();
  let userSwipes = Map.empty<Principal, [Text]>();

  var confessionId = 0;
  var threadId = 0;
  var resourceId = 0;
  var eventId = 0;
  var moderationActionId = 0;

  ////////////////////////////////
  // Core Data Structures
  ////////////////////////////////

  type Confession = {
    id : Nat;
    content : Text;
    timestamp : Time.Time;
    status : ContentStatus;
    reports : [Report];
  };

  type Report = {
    reason : Text;
    timestamp : Time.Time;
  };

  type ModerationAction = {
    id : Nat;
    contentId : Nat;
    contentType : ContentType;
    action : ModerationActionType;
    note : ?Text;
    timestamp : Time.Time;
    moderator : Principal;
  };

  type ModerationActionType = {
    #approve;
    #reject;
    #hide;
    #review;
  };

  type ContentStatus = {
    #pending;
    #approved;
    #hidden;
    #rejected;
  };

  type ContentType = {
    #confession;
    #thread;
    #event;
    #resource;
  };

  type Resource = {
    id : Nat;
    category : ResourceCategory;
    title : Text;
    description : Text;
    contactLink : Text;
  };

  type ResourceCategory = {
    #helplines;
    #therapists;
    #selfCare;
    #onlineSupport;
  };

  type Thread = {
    id : Nat;
    title : Text;
    posts : [Post];
    category : ThreadCategory;
    status : ContentStatus;
    timestamp : Time.Time;
  };

  type Post = {
    content : Text;
    timestamp : Time.Time;
  };

  type ThreadCategory = {
    #datingAdvice;
    #comingOut;
    #friendship;
    #mentalHealth;
  };

  type Event = {
    id : Nat;
    title : Text;
    dateTime : Time.Time;
    eventType : EventType;
    location : ?Text;
    description : Text;
  };

  type EventType = {
    #online;
    #offline;
  };

  public type UserProfile = {
    pseudonym : ?Text;
    pronouns : ?Text;
    interests : [Text];
    hideProfile : Bool;
    anonymousPosting : Bool;
    notificationPrefs : NotificationPrefs;
  };

  type UserSettings = {
    pseudonym : ?Text;
    pronouns : ?Text;
    interests : [Text];
    hideProfile : Bool;
    anonymousPosting : Bool;
    notificationPrefs : NotificationPrefs;
  };

  type NotificationPrefs = {
    email : Bool;
    sms : Bool;
    push : Bool;
  };

  ////////////////////////////////
  // User Profile Functions
  ////////////////////////////////

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    switch (userSettings.get(caller)) {
      case (null) { null };
      case (?settings) {
        ?{
          pseudonym = settings.pseudonym;
          pronouns = settings.pronouns;
          interests = settings.interests;
          hideProfile = settings.hideProfile;
          anonymousPosting = settings.anonymousPosting;
          notificationPrefs = settings.notificationPrefs;
        };
      };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (userSettings.get(user)) {
      case (null) { null };
      case (?settings) {
        ?{
          pseudonym = settings.pseudonym;
          pronouns = settings.pronouns;
          interests = settings.interests;
          hideProfile = settings.hideProfile;
          anonymousPosting = settings.anonymousPosting;
          notificationPrefs = settings.notificationPrefs;
        };
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let settings : UserSettings = {
      pseudonym = profile.pseudonym;
      pronouns = profile.pronouns;
      interests = profile.interests;
      hideProfile = profile.hideProfile;
      anonymousPosting = profile.anonymousPosting;
      notificationPrefs = profile.notificationPrefs;
    };
    userSettings.add(caller, settings);
  };

  ////////////////////////////////
  // Swipes and Selections
  ////////////////////////////////
  type Selector = {
    pseudonym : ?Text;
  };

  public query ({ caller }) func fetchSwipeCandidates() : async [Selector] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view selectors");
    };

    let profiles = List.empty<Selector>();
    let swipes = switch (userSwipes.get(caller)) {
      case (?p) { p };
      case (null) { [] };
    };

    for ((user, settings) in userSettings.entries()) {
      let alreadySwipedOrOwnProfile = swipes.find(
        func(pseudonym) {
          switch (settings.pseudonym) {
            case (?s) { pseudonym == s };
            case (null) { false };
          };
        },
      );
      if (caller != user and not settings.hideProfile and alreadySwipedOrOwnProfile == null) {
        profiles.add(
          {
            pseudonym = settings.pseudonym;
          },
        );
      };
    };

    profiles.reverse().toArray();
  };

  type SwipeStatus = {
    matches : [Text];
  };

  public shared ({ caller }) func recordSwipe(pseudonym : Text) : async SwipeStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record swipes");
    };

    let newSwipe = [pseudonym];

    let currentSwipes = switch (userSwipes.get(caller)) {
      case (null) { [pseudonym] };
      case (?swipes) { swipes.concat(newSwipe) };
    };
    userSwipes.add(caller, currentSwipes);
    var matches = [] : [Text];

    for ((user, settings) in userSettings.entries()) {
      if (user != caller and settings.pseudonym == ?pseudonym) {
        let theirSwipes = switch (userSwipes.get(user)) {
          case (?swipes) { swipes };
          case (null) { [] };
        };
        if (
          theirSwipes.filter(
              func(theirPseudonym) { switch (userSettings.get(caller)) { case (?callerSettings) { callerSettings.pseudonym == ?theirPseudonym }; case (null) { false } } },
            ).size() > 0
        ) {
          let newUserMatches = switch (userMatches.get(caller)) {
            case (null) { [pseudonym] };
            case (?matches) { matches.concat([pseudonym]) };
          };
          userMatches.add(caller, newUserMatches);
          return { matches = newUserMatches };
        };
      };
    };

    { matches };
  };

  public query ({ caller }) func getUserMatches() : async [Text] {
    let matches = switch (userMatches.get(caller)) {
      case (?p) { p };
      case (null) { [] };
    };
    matches;
  };

  ////////////////////////////////
  // Confessions Functionality
  ////////////////////////////////

  public shared ({ caller }) func submitConfession(content : Text) : async () {
    // Allow any user including guests (anonymous posting)
    let confession : Confession = {
      id = confessionId;
      content;
      timestamp = Time.now();
      status = #pending;
      reports = [];
    };
    confessions.add(confessionId, confession);
    confessionId += 1;
  };

  public query ({ caller }) func getApprovedConfessions(offset : Nat, limit : Nat) : async [Confession] {
    // Public read access - no authorization needed
    confessions.values().toArray().filter(
      func(c) {
        c.status == #approved;
      }
    ).sliceToArray(offset, offset + limit);
  };

  public shared ({ caller }) func reportConfession(confessionId : Nat, reason : Text) : async () {
    // Allow any user including guests to report
    let report : Report = {
      reason;
      timestamp = Time.now();
    };
    switch (confessions.get(confessionId)) {
      case (null) { Runtime.trap("Confession not found") };
      case (?confession) {
        let newReports = confession.reports.concat([report]);
        let updatedConfession = { confession with reports = newReports };
        confessions.add(confessionId, updatedConfession);
      };
    };
  };

  public shared ({ caller }) func lastSeenConfession() : async ?Nat {
    // Allow any user to track their last seen confession
    lastSeenConfessions.get(caller);
  };

  public type UpdateLastSeenConfessionParams = {
    lastSeenId : Nat;
  };

  public shared ({ caller }) func updateLastSeenConfession(params : UpdateLastSeenConfessionParams) : async () {
    // Allow any user to update their last seen confession
    lastSeenConfessions.add(caller, params.lastSeenId);
  };

  public shared ({ caller }) func updateConfessionStatus(id : Nat, status : ContentStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (confessions.get(id)) {
      case (null) { Runtime.trap("Confession not found") };
      case (?confession) {
        let updatedConfession = { confession with status };
        confessions.add(id, updatedConfession);
      };
    };
  };

  public shared ({ caller }) func deleteConfession(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not confessions.containsKey(id)) { Runtime.trap("Confession not found") };
    confessions.remove(id);
  };

  public query ({ caller }) func getReportedConfessions() : async [Confession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view reported confessions");
    };
    confessions.values().toArray().filter(
      func(confession) { confession.reports.size() > 0 }
    );
  };

  public query ({ caller }) func getReportedConfessionsByIds(ids : [Nat]) : async [Confession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view reported confessions");
    };
    let reportedConfessions = List.empty<Confession>();

    for (id in ids.values()) {
      switch (confessions.get(id)) {
        case (null) {};
        case (?confession) { reportedConfessions.add(confession) };
      };
    };

    reportedConfessions.reverse().toArray();
  };

  public query ({ caller }) func getConfession(id : Nat) : async Confession {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view individual confessions");
    };
    switch (confessions.get(id)) {
      case (null) { Runtime.trap("Confession not found") };
      case (?confession) { confession };
    };
  };

  public query ({ caller }) func getConfessions(ids : [Nat]) : async [Confession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view confessions");
    };
    let results = List.empty<Confession>();
    for (id in ids.values()) {
      switch (confessions.get(id)) {
        case (null) {};
        case (?confession) { results.add(confession) };
      };
    };
    results.reverse().toArray();
  };

  ////////////////////////////////
  // Moderation Actions Functionality
  ////////////////////////////////

  public shared ({ caller }) func recordModerationAction(contentId : Nat, contentType : ContentType, actionType : ModerationActionType, note : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let action : ModerationAction = {
      id = moderationActionId;
      contentId;
      contentType;
      action = actionType;
      note;
      timestamp = Time.now();
      moderator = caller;
    };
    moderationActions.add(moderationActionId, action);
    moderationActionId += 1;
  };

  public query ({ caller }) func getModerationActions(limit : Nat, offset : Nat) : async [ModerationAction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view moderation actions");
    };
    moderationActions.values().toArray().sliceToArray(offset, limit + offset);
  };

  module ModerationAction {
    public func compareByTimestampDescending(a : ModerationAction, b : ModerationAction) : Order.Order {
      Nat.compare(b.id, a.id);
    };
  };

  public query ({ caller }) func getLatestModerationActionIds(count : Nat) : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view moderation actions");
    };
    var result : [Nat] = [];
    let actions = moderationActions.values().toArray();
    let sortedActionIds = actions.sort(ModerationAction.compareByTimestampDescending).map(func(act) { act.id });
    let availableCount = if (actions.size() > count) { count } else { actions.size() };
    if (availableCount > 0) {
      result := sortedActionIds.sliceToArray(0, availableCount);
    };
    result;
  };

  public query ({ caller }) func getAllContentIds(contentType : ContentType) : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all content IDs");
    };
    switch (contentType) {
      case (#confession) { confessions.keys().toArray() };
      case (#thread) { threads.keys().toArray() };
      case (#event) { events.keys().toArray() };
      case (#resource) { resources.keys().toArray() };
    };
  };
};
