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
    const isActive = pathname === href;
  
    return (
      <Link
        href={href}
        className={`flex group items-center gap-2 p-2 rounded  ${
            isActive
            ? 'bg-blue-100 text-blue-700 font-semibold'
            : 'text-gray-600 hover:text-black'
  
        }`}
      >
        <Icon 
            className={`w-5 h-5 transition-colors ${
                isActive
                    ? 'text-blue-700'
                    : 'text-gray-400 group-hover:text-blue-500'
                }`}
        />
        <span>{name}</span>
      </Link>
    );
  };
export default SidebarLink;
