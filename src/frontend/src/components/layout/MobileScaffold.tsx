import { ReactNode } from 'react';
import BottomNav from './BottomNav';

interface MobileScaffoldProps {
  children: ReactNode;
}

export default function MobileScaffold({ children }: MobileScaffoldProps) {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background">
      <header className="relative h-24 flex-shrink-0 overflow-hidden">
        <img
          src="/assets/generated/header-bg.dim_1600x400.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 header-gradient-overlay" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-2xl font-display font-bold text-white drop-shadow-lg tracking-tight">
            SafeSpace
          </h1>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
