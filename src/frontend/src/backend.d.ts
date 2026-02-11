import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ModerationAction {
    id: bigint;
    contentId: bigint;
    action: ModerationActionType;
    moderator: Principal;
    contentType: ContentType;
    note?: string;
    timestamp: Time;
}
export type Time = bigint;
export interface Selector {
    pseudonym?: string;
}
export interface UpdateLastSeenConfessionParams {
    lastSeenId: bigint;
}
export interface Confession {
    id: bigint;
    status: ContentStatus;
    content: string;
    timestamp: Time;
    reports: Array<Report>;
}
export interface Report {
    timestamp: Time;
    reason: string;
}
export interface SwipeStatus {
    matches: Array<string>;
}
export interface UserProfile {
    pseudonym?: string;
    anonymousPosting: boolean;
    interests: Array<string>;
    pronouns?: string;
    notificationPrefs: NotificationPrefs;
    hideProfile: boolean;
}
export interface NotificationPrefs {
    sms: boolean;
    push: boolean;
    email: boolean;
}
export enum ContentStatus {
    pending = "pending",
    hidden = "hidden",
    approved = "approved",
    rejected = "rejected"
}
export enum ContentType {
    resource = "resource",
    event = "event",
    thread = "thread",
    confession = "confession"
}
export enum ModerationActionType {
    reject = "reject",
    review = "review",
    hide = "hide",
    approve = "approve"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteConfession(id: bigint): Promise<void>;
    fetchSwipeCandidates(): Promise<Array<Selector>>;
    getAllContentIds(contentType: ContentType): Promise<Array<bigint>>;
    getApprovedConfessions(offset: bigint, limit: bigint): Promise<Array<Confession>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConfession(id: bigint): Promise<Confession>;
    getConfessions(ids: Array<bigint>): Promise<Array<Confession>>;
    getLatestModerationActionIds(count: bigint): Promise<Array<bigint>>;
    getModerationActions(limit: bigint, offset: bigint): Promise<Array<ModerationAction>>;
    getReportedConfessions(): Promise<Array<Confession>>;
    getReportedConfessionsByIds(ids: Array<bigint>): Promise<Array<Confession>>;
    getUserMatches(): Promise<Array<string>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    lastSeenConfession(): Promise<bigint | null>;
    recordModerationAction(contentId: bigint, contentType: ContentType, actionType: ModerationActionType, note: string | null): Promise<void>;
    recordSwipe(pseudonym: string): Promise<SwipeStatus>;
    reportConfession(confessionId: bigint, reason: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitConfession(content: string): Promise<void>;
    updateConfessionStatus(id: bigint, status: ContentStatus): Promise<void>;
    updateLastSeenConfession(params: UpdateLastSeenConfessionParams): Promise<void>;
}
