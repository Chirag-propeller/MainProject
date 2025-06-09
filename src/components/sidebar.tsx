'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LineChart, Users, Phone, File, PhoneCall, Headphones, ChartArea, Folder, History, ChartBar, PhoneCallIcon, CreditCard, UserIcon, Loader2, User, Mail, Zap } from 'lucide-react';
import SidebarLink from './sidebar/SidebarLink';
import Logo from './sidebar/Logo';
import { useState, useEffect } from 'react';

// UserCard component for bottom of sidebar
const UserCard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user/getCurrentUser');
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        
        // Process credits like in UserDataContext
        const credits = parseFloat(userData.credits?.$numberDecimal) || 0;
        const creditsUsed = parseFloat(userData.creditsUsed?.$numberDecimal) || 0;
        
        setUser({
          ...userData,
          credits,
          creditsUsed
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="w-44 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          <span className="ml-2 text-sm text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const creditBalance = user.credits - user.creditsUsed;

  return (
    <Link href="/dashboard/profile">
      <div className="w-44 p-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg border border-gray-200 cursor-pointer">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">{user.name}</h4>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Mail className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-600 truncate">{user.email}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-green-500" />
            <span className="text-xs font-medium text-gray-900">
              ${creditBalance.toFixed(2)} credits
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const navItemsMain = [
  // { name: 'Home', href: '/dashboard', icon: Home },
  // { name: 'Analysis', href: '/dashboard/analysis', icon: LineChart },
  // { name: 'Agent', href: '/dashboard/agent', icon: Users },
  { name: 'Agents', href: '/dashboard/agents', icon: Users },
  // { name: 'Contact', href: '/dashboard/contact', icon: Phone },
  { name: 'Knowledge Base', href: '/dashboard/knowledgeBase', icon: File },
  { name: 'Phone Number', href: '/dashboard/phoneNumber', icon: PhoneCall },
  { name: 'Call History', href: '/dashboard/callHistory', icon: History },
  // { name: 'Call Logs', href: '/dashboard/callLogs', icon: ChartBar },
  { name: 'Analytics', href: '/dashboard/analytics', icon: LineChart },
  { name: 'Send a Call', href: '/dashboard/sendCall', icon: PhoneCallIcon },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: Folder },
  { name: 'Integration', href: '/dashboard/integration', icon: Headphones },
];

// const navItemsTool = [
//   { name: 'Campaigns', href: '/dashboard/campaigns', icon: Folder },
//   { name: 'Integration', href: '/dashboard/integration', icon: Headphones },
//   { name: 'Call Logs', href: '/dashboard/callLogs', icon: ChartArea },
// ];

// const navItems = [
//   { name: 'Home', href: '/dashboard' },
//   { name: 'Analysis', href: '/dashboard/analysis' },
//   { name: 'Agent', href: '/dashboard/agent' },
//   { name: 'Contact', href: '/dashboard/contact' },
// ];




const Sidebar = ()=> {
  const pathname = usePathname();

  return (
    <aside className="w-52 h-[100vh]  scroll overflow-y-auto text-gray-600 p-4 ps-0 pt-0 pb-10 fixed border-r border-gray-200">
    {/* <aside className="w-64 h-screen fixed left-0 top-0 bg-white text-gray-600"> */}


        <div className="w-48 bg-white fixed border-b border-gray-200">
            <Link href="/dashboard/agent">
              <Logo className="mx-auto" />
            </Link>
          </div>
        {/* <Link href='/dashboard/agent' className=''>


          <Logo className='mt-2'/>

        </Link> */}
      <nav className="flex flex-col gap-1 mt-3 ps-3 pt-10">
        {/* <h1 className='p-2 text-sm  pb-0 text-gray-500'> MAIN </h1> */}
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
        {/* <h1 className='p-2 text-sm mt-4 pb-0 text-gray-500'> TOOLS </h1> */}
        {/* {navItemsTool.map(item => (
          <SidebarLink
            key={item.href}
            href={item.href}
            name={item.name}
            icon={item.icon}
          />
        ))} */}

        <div className='absolute bottom-3'>
          <UserCard />
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar
