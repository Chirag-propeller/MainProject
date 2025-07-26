"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LineChart,
  Users,
  File,
  PhoneCall,
  Headphones,
  Folder,
  History,
  PhoneCallIcon,
  CreditCard,
  Loader2,
  User,
  Mail,
  Zap,
  Workflow,
  ChevronsLeftRightEllipsis,
  Unplug,
  UserIcon,
} from "lucide-react";
import SidebarLink from "./sidebar/SidebarLink";
import Logo from "./sidebar/Logo";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DarkModeToggle from "./ui/DarkModeToggle";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

// UserCard component for bottom of sidebar
const UserCard = ({ collapsed }: { collapsed: boolean }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user/getCurrentUser");

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();

        // Process credits like in UserDataContext
        const credits = parseFloat(userData.credits?.$numberDecimal) || 0;
        const creditsUsed =
          parseFloat(userData.creditsUsed?.$numberDecimal) || 0;

        setUser({
          ...userData,
          credits,
          creditsUsed,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="w-44 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400 dark:text-gray-300" />
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const creditBalance = user.credits - user.creditsUsed;

  if (collapsed) {
    return (
      <Link href="/dashboard/profile">
        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center cursor-pointer border border-gray-200 dark:border-gray-800 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors">
          <UserIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
        </div>
      </Link>
    );
  }

  return (
    <Link href="/dashboard/profile">
      <div className="w-39 p-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-[6px] border border-gray-200 dark:border-gray-800 cursor-pointer">
        <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
          <UserIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {user.name}
          </h4>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Mail className="w-3 h-3 text-gray-400 dark:text-gray-300" />
            <span className="text-[10px] text-gray-600 dark:text-gray-300 truncate">
              {user.email}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-green-500" />
            <span className="text-xs font-medium text-gray-900 dark:text-white">
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
  { name: "Agents", href: "/dashboard/agents", icon: Users },
  // { name: 'Contact', href: '/dashboard/contact', icon: Phone },
  { name: "Knowledge Base", href: "/dashboard/knowledgeBase", icon: File },
  { name: "Phone Number", href: "/dashboard/phoneNumber", icon: PhoneCall },
  { name: "Call History", href: "/dashboard/callHistory", icon: History },
  // { name: 'Call Logs', href: '/dashboard/callLogs', icon: ChartBar },
  { name: "Analytics", href: "/dashboard/analytics", icon: LineChart },
  { name: "Send a Call", href: "/dashboard/sendCall", icon: PhoneCallIcon },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Folder },
  { name: "Integration", href: "/dashboard/integration", icon: Headphones },
  { name: "Workflows", href: "/dashboard/workflows", icon: Workflow },
  { name: "APIs", href: "/dashboard/apiTool", icon: Unplug },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();

  return (
    <aside
      className={`transition-all duration-200 ${collapsed ? "w-16" : "w-45"} h-screen overflow-y-auto text-gray-600 dark:text-gray-200 p-2 ps-0 pt-0 pb-10 fixed border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900`}
    >
      <div
        className={`fixed border-b border-gray-200 dark:border-gray-800 flex items-center justify-between ${
          collapsed ? "w-16" : "w-45"
        } bg-white dark:bg-gray-900`}
      >
        <div className="flex items-center justify-center w-full">
          <Logo collapsed={collapsed} />
        </div>

        <button
          className="p-1 focus:outline-none cursor-pointer"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-200" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-200" />
          )}
        </button>
      </div>

      <nav className="flex flex-col gap-1 ps-3 mt-3 pt-10 h-[64px]">
        {navItemsMain.map((item) => (
          <SidebarLink
            key={item.href}
            href={item.href}
            name={item.name}
            icon={item.icon}
            collapsed={collapsed}
          />
        ))}

        <div className="absolute bottom-3">
          <DarkModeToggle />
          <UserCard collapsed={collapsed} />
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
