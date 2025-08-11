import SmarTableApp from '@/components/smar-table-app';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <SmarTableApp />
      </main>
    </div>
  );
}
