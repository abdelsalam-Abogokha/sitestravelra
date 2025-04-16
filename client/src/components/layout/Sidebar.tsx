import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import {
  LayoutDashboard,
  Database,
  CalendarCheck,
  Users,
  FileEdit,
  TruckIcon,
  BarChart2,
  Settings,
  MessageSquare,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';

const Sidebar = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [location] = useLocation();
  const [servicesOpen, setServicesOpen] = useState(false);
  
  const links = [
    { href: '/admin', label: t('admin.dashboard.title'), icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/admin/apis', label: t('admin.apiManagement.title'), icon: <Database className="h-5 w-5" /> },
    { href: '/admin/bookings', label: t('admin.bookings.title'), icon: <CalendarCheck className="h-5 w-5" /> },
    { href: '/admin/users', label: t('admin.users.title'), icon: <Users className="h-5 w-5" /> },
    { href: '/admin/content', label: t('admin.content.title'), icon: <FileEdit className="h-5 w-5" /> },
    { 
      label: `${t('shipping.title')} & ${t('translation.title')}`, 
      icon: <TruckIcon className="h-5 w-5" />,
      href: '/admin/shipping-translation',
    },
    { href: '/admin/reports', label: t('admin.reports.title'), icon: <BarChart2 className="h-5 w-5" /> },
    { href: '/admin/settings', label: t('admin.settings.title'), icon: <Settings className="h-5 w-5" /> },
    { href: '/admin/ai-chat', label: t('admin.aiChat.title'), icon: <MessageSquare className="h-5 w-5" /> },
  ];
  
  const handleLogout = async () => {
    await logout();
  };
  
  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow z-10">
      <div className="h-full flex flex-col">
        <div className="p-6 border-b">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">TravelEase</span>
            <span className="ml-2 px-2 py-1 bg-primary text-white text-xs rounded-md">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  <a
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-primary/10 transition-colors",
                      location === link.href ? "bg-primary/10 text-primary" : "text-gray-700"
                    )}
                  >
                    {link.icon}
                    <span className="ml-3">{link.label}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {t('common.logout')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;