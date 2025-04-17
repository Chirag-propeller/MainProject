import Sidebar from '@/components/sidebar';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex">
      <main className=" p-6 w-full">{children}</main>
    </div>
  );
}

export default Layout