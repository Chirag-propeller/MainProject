'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
type SidebarLinkProps = {
    href: string;
    name: string;
    icon: React.ElementType;
  };
  
  const SidebarLink = ({ href, name, icon: Icon }: SidebarLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname?.includes(href);
    // console.log(pathname, href, pathname?.includes(href));
  
    return (
      <Link
        href={href}
        className={`flex group items-center p-1 gap-2 rounded transition-colors ${
            isActive
            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
            : 'text-gray-600 hover:text-black hover:bg-gray-50 dark:text-gray-100 dark:hover:text-gray-100 dark:hover:bg-gray-950'
        }`}
      >
        <Icon 
            className={`w-4 h-4 transition-colors ${
                isActive
                    ? 'text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-400 group-hover:text-indigo-500 dark:text-gray-100 dark:group-hover:text-indigo-400'
                }`}
        />
        <span className='text-md'>{name}</span>
      </Link>
    );
  };
export default SidebarLink;
