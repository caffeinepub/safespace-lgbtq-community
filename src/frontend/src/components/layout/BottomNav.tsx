import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Heart, MessageCircle, BookOpen, Calendar, User } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const tabs = [
    { path: '/confessions', icon: Heart, label: 'Confessions' },
    { path: '/discussions', icon: MessageCircle, label: 'Discussions' },
    { path: '/resources', icon: BookOpen, label: 'Resources' },
    { path: '/events', icon: Calendar, label: 'Events' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/confessions') {
      return currentPath === '/' || currentPath.startsWith('/confessions');
    }
    return currentPath.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => navigate({ to: tab.path })}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
