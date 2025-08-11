import SmarTableApp from '@/components/smar-table-app';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <a className="flex items-center space-x-2" href="/">
            <Image src="/images/logo.png" alt="SmarTable Logo" width={24} height={24} />
              <span className="font-bold">SmarTable</span>
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <SmarTableApp />
      </main>
    </div>
  );
}
