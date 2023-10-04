import { Inter } from 'next/font/google';

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: RootLayoutProps) => (
  <div className="flex flex-col h-[100vh]">
    <SiteHeader />
    <main className={`
      flex-grow overflow-y-auto w-full m-auto flex-col items-center justify-start gap-3
      ${inter.className}
    `}>
      {children}
    </main>
    <SiteFooter />
  </div>
);

export default Layout;
