import { ReactNode } from 'react';
import { useLocation, useRouter } from 'wouter';
import { useAuth } from '@/lib/auth';
import Sidebar from './Sidebar';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { Toaster } from '@/components/ui/toaster';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();
  const [location, navigate] = useLocation();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  // Redirect if not authenticated or not admin
  if (!isLoading && (!isAuthenticated || !isAdmin)) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-xl">{t('common.loading')}</span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-100 ${isRtl ? 'rtl' : 'ltr'}`}>
      <Sidebar />
      
      <div className="ml-64 transition-all duration-300">
        {/* Admin Header */}
        <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {location === '/admin' && t('admin.dashboard.title')}
            {location === '/admin/apis' && t('admin.apiManagement.title')}
            {location === '/admin/bookings' && t('admin.bookings.title')}
            {location === '/admin/users' && t('admin.users.title')}
            {location === '/admin/content' && t('admin.content.title')}
            {location === '/admin/shipping-translation' && `${t('shipping.title')} & ${t('translation.title')}`}
            {location === '/admin/reports' && t('admin.reports.title')}
            {location === '/admin/settings' && t('admin.settings.title')}
            {location === '/admin/ai-chat' && t('admin.aiChat.title')}
          </h1>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <div className="text-sm">
              {isAuthenticated && (
                <span className="font-medium">{isAdmin ? 'Admin' : 'User'}</span>
              )}
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
};

export default AdminLayout;
