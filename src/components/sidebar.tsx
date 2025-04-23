'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Home, LineChart, Users, Phone, File, PhoneCall, Headphones, ChartArea, Folder, History, ChartBar, PhoneCallIcon } from 'lucide-react';
import SidebarLink from './sidebar/SidebarLink';

const navItemsMain = [
  { name: 'Home', href: '/dashboard', icon: Home },
  // { name: 'Analysis', href: '/dashboard/analysis', icon: LineChart },
  { name: 'Agent', href: '/dashboard/agent', icon: Users },
  // { name: 'Contact', href: '/dashboard/contact', icon: Phone },
  { name: 'Knowledge Base', href: '/dashboard/knowledgeBase', icon: File },
  { name: 'Phone Number', href: '/dashboard/phoneNumber', icon: PhoneCall },
  { name: 'Call History', href: '/dashboard/callHistory', icon: History },
  { name: 'Analytics', href: '/dashboard/analytics', icon: LineChart },
  { name: 'Throw a Call', href: '/dashboard/throwCall', icon: PhoneCallIcon },
];

const navItemsTool = [
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: Folder },
  { name: 'Integration', href: '/dashboard/integration', icon: Headphones },
  { name: 'Call Logs', href: '/dashboard/callLogs', icon: ChartArea },
];

// const navItems = [
//   { name: 'Home', href: '/dashboard' },
//   { name: 'Analysis', href: '/dashboard/analysis' },
//   { name: 'Agent', href: '/dashboard/agent' },
//   { name: 'Contact', href: '/dashboard/contact' },
// ];




const Sidebar = ()=> {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-[100vh] overflow-y-auto text-gray-600 p-4 pt-0 pb-5 fixed">

        <Link href='/dashboard'>
          <div className='fixed bg-white w-64 air-logo text-2xl pt-5 text-blue-600'>
          proPAL AI
              
          </div>

        </Link>
      <nav className="flex flex-col gap-4 ">
        <h1 className='p-2 text-sm mt-4 pb-0 text-gray-500'> MAIN </h1>
        {/* {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`p-2 rounded hover:text-black ${
              pathname === item.href ? 'bg-blue-100 text-blue-700 font-semibold ' : ''
            } `}
          >
            {item.name}
          </Link>
        ))} */}


        {navItemsMain.map(item => (
          <SidebarLink
            key={item.href}
            href={item.href}
            name={item.name}
            icon={item.icon}
          />
        ))}
        <h1 className='p-2 text-sm mt-4 pb-0 text-gray-500'> TOOLS </h1>
        {navItemsTool.map(item => (
          <SidebarLink
            key={item.href}
            href={item.href}
            name={item.name}
            icon={item.icon}
          />
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar
