import Sidebar from '@/components/sidebar';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex">
      <Sidebar/>
      <main className="ml-64 p-6 w-full">{children}</main>
    </div>
  );
}

export default DashboardLayout