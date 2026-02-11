# Specification

## Summary
**Goal:** Add swipe-style mutual profile matching, a Matches list, and a clear path to open the existing encrypted chat only after two users mutually like each other.

**Planned changes:**
- Add backend storage and APIs to submit swipe actions (like/pass), compute mutual matches, and fetch the signed-in user’s matches list with privacy/anonymity preserved.
- Add a backend API to fetch swipe candidates, excluding the caller, profiles with `hideProfile = true`, and profiles already swiped by the caller.
- Add a mobile-first Swipe Matching route (e.g., `/matches/swipe`) to view candidates one at a time and Like/Pass, with an empty state that links to Matches when no candidates remain.
- Add a Matches route (e.g., `/matches`) inside `MobileScaffold` that lists mutual matches with loading/empty/error states and an “Open chat” action per match (navigating to the existing encrypted chat entry point or a stub if needed).
- Add navigation entry points: a “Matches” control on the Profile screen and a “Find matches” control on the Matches screen to reach the swipe flow.
- Add React Query hooks for candidates, submitting swipes, and fetching matches; invalidate/refetch Matches after a swipe creates a new mutual match.
- Ensure principals are never shown in matching/matches UI and all new user-facing copy is in English.

**User-visible outcome:** Users can discover the matching feature, swipe through candidate profiles with Like/Pass, see a list of mutual matches, and open an encrypted chat only with matched users.
