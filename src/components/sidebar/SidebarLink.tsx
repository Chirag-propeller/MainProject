"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarLinkProps = {
  href: string;
  name: string;
  icon: React.ElementType;
  collapsed: boolean;
};

const SidebarLink = ({
  href,
  name,
  icon: Icon,
  collapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname?.includes(href);

  return (
    <Link
      href={href}
      className={`flex group items-center transition-colors ${
        !collapsed ? "gap-2 p-1 rounded-[6px]" : "gap-2 p-2 pl-3 rounded-full"
      } 
        ${
          isActive
            ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
            : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
        }`}
    >
      <Icon
        className={`w-4 h-4 transition-colors ${
          isActive
            ? "text-indigo-700 dark:text-indigo-300"
            : "text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-300"
        }`}
      />
      {!collapsed && <span className="text-[14px]">{name}</span>}
    </Link>
  );
};

export default SidebarLink;
