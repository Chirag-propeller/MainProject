'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LineChart, Users, Phone, File, PhoneCall, Headphones, ChartArea, Folder, History, ChartBar, PhoneCallIcon } from 'lucide-react';
import SidebarLink from './sidebar/SidebarLink';
import Logo from './sidebar/Logo';

const navItemsMain = [
  // { name: 'Home', href: '/dashboard', icon: Home },
  // { name: 'Analysis', href: '/dashboard/analysis', icon: LineChart },
  { name: 'Agent', href: '/dashboard/agent', icon: Users },
  // { name: 'Contact', href: '/dashboard/contact', icon: Phone },
  { name: 'Knowledge Base', href: '/dashboard/knowledgeBase', icon: File },
  { name: 'Phone Number', href: '/dashboard/phoneNumber', icon: PhoneCall },
  { name: 'Call History', href: '/dashboard/callHistory', icon: History },
  { name: 'Analytics', href: '/dashboard/analytics', icon: LineChart },
  { name: 'Send a Call', href: '/dashboard/sendCall', icon: PhoneCallIcon },
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
    <aside className="w-52 h-[100vh]  scroll overflow-y-auto text-gray-600 p-4 ps-0 pt-0 pb-10 fixed">
    {/* <aside className="w-64 h-screen fixed left-0 top-0 bg-white text-gray-600"> */}


        <div className="w-48 bg-white fixed border-b border-gray-200">
            <Link href="/dashboard/agent">
              <Logo className="mx-auto" />
            </Link>
          </div>
        {/* <Link href='/dashboard/agent' className=''>


          <Logo className='mt-2'/>

        </Link> */}
      <nav className="flex flex-col gap-3 mt-3 ps-3 ">
        <h1 className='p-2 text-sm  pb-0 text-gray-500'> MAIN </h1>
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
