import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { useComplianceGate } from './hooks/useComplianceGate';
import { useQuickTour } from './hooks/useQuickTour';
import OnboardingGate from './pages/OnboardingGate';
import QuickTour from './components/onboarding/QuickTour';
import MobileScaffold from './components/layout/MobileScaffold';
import ConfessionsFeed from './pages/confessions/ConfessionsFeed';
import NewConfession from './pages/confessions/NewConfession';
import Discussions from './pages/discussions/Discussions';
import NewThread from './pages/discussions/NewThread';
import ThreadDetail from './pages/discussions/ThreadDetail';
import Resources from './pages/resources/Resources';
import Events from './pages/events/Events';
import EventDetail from './pages/events/EventDetail';
import NewEvent from './pages/events/NewEvent';
import Profile from './pages/profile/Profile';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';
import ModeratorDashboard from './pages/moderation/ModeratorDashboard';
import Matches from './pages/matches/Matches';
import SwipeMatching from './pages/matches/SwipeMatching';
import EncryptedChatEntry from './pages/chat/EncryptedChatEntry';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function Layout() {
  return (
    <MobileScaffold>
      <Outlet />
    </MobileScaffold>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ConfessionsFeed,
});

const confessionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/confessions',
  component: ConfessionsFeed,
});

const newConfessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/confessions/new',
  component: NewConfession,
});

const discussionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/discussions',
  component: Discussions,
});

const newThreadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/discussions/new',
  component: NewThread,
});

const threadDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/discussions/$threadId',
  component: ThreadDetail,
});

const resourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/resources',
  component: Resources,
});

const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events',
  component: Events,
});

const eventDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/$eventId',
  component: EventDetail,
});

const newEventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/new',
  component: NewEvent,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: Profile,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
});

const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help',
  component: HelpSupport,
});

const moderatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/moderator',
  component: ModeratorDashboard,
});

const matchesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/matches',
  component: Matches,
});

const swipeMatchingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/matches/swipe',
  component: SwipeMatching,
});

const encryptedChatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat/$matchId',
  component: EncryptedChatEntry,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  confessionsRoute,
  newConfessionRoute,
  discussionsRoute,
  newThreadRoute,
  threadDetailRoute,
  resourcesRoute,
  eventsRoute,
  eventDetailRoute,
  newEventRoute,
  profileRoute,
  settingsRoute,
  helpRoute,
  moderatorRoute,
  matchesRoute,
  swipeMatchingRoute,
  encryptedChatRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { hasAccepted } = useComplianceGate();
  const { hasCompleted, isLoading: tourLoading } = useQuickTour();

  // Show compliance gate first
  if (!hasAccepted) {
    return <OnboardingGate />;
  }

  // Show Quick Tour after compliance gate is accepted (only for first-time users)
  if (!tourLoading && !hasCompleted) {
    return <QuickTour />;
  }

  // Show main app after both compliance and tour are completed
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
