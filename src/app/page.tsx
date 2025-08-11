import LinguaTableApp from '@/components/lingua-table-app';
import { Logo } from '@/components/icons';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <a className="flex items-center space-x-2" href="/">
              <Logo className="h-6 w-6" />
              <span className="font-bold">LinguaTable</span>
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <LinguaTableApp />
      </main>
    </div>
  );
}
