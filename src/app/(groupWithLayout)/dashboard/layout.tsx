import Sidebar from '@/components/sidebar';
import { ReactNode } from 'react';
import Footer from '@/components/Footer';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className='bg-white dark:bg-gray-950 min-h-screen'>
      <div className="flex">
        <Sidebar/>
        <main className="ml-52 w-full bg-white dark:bg-gray-950">{children}</main>
      </div>
      {/* <Footer/> */}
    </div>
  );
}

export default DashboardLayout