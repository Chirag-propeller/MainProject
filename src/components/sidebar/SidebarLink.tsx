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
  
    return (
      <Link
        href={href}
        className={`flex group items-center p-1 gap-2 rounded  ${
            isActive
            ? 'bg-indigo-100 text-indigo-700'
            : 'text-gray-600 hover:text-black'
  
        }`}
      >
        <Icon 
            className={`w-4 h-4 transition-colors ${
                isActive
                    ? 'text-indigo-700'
                    : 'text-gray-400 group-hover:text-indigo-500'
                }`}
        />
        <span className='text-md'>{name}</span>
      </Link>
    );
  };
export default SidebarLink;
