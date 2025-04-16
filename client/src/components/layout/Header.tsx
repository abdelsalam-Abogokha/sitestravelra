import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X, PlaneTakeoff } from 'lucide-react';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [location] = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isRtl = i18n.language === 'ar';

  const navItems = [
    { path: '/', label: t('common.home') },
    { path: '/flights', label: t('common.flights') },
    { path: '/hotels', label: t('common.hotels') },
    { path: '/packages', label: t('common.packages') },
    { path: '/visas', label: t('common.visas') },
    { path: '/shipping', label: t('common.shipping') },
    { path: '/translation', label: t('common.translation') },
    { path: '/blog', label: t('common.blog') },
    { path: '/contact', label: t('common.contact') },
  ];

  return (
    <header className="bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-dark text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className={`flex items-center ${isRtl ? 'space-x-reverse' : ''} space-x-4`}>
            <a href="tel:+123456789" className="text-sm hover:text-primary">
              <i className="fas fa-phone-alt mr-1"></i> +123 456 789
            </a>
            <a href="mailto:info@travelagency.com" className="text-sm hover:text-primary">
              <i className="fas fa-envelope mr-1"></i> info@travelagency.com
            </a>
          </div>
          <div className={`flex items-center ${isRtl ? 'space-x-reverse' : ''} space-x-4`}>
            <LanguageSwitcher />
            
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link href="/admin" className="text-sm hover:text-primary">
                    <i className="fas fa-tachometer-alt mr-1"></i> {t('admin.dashboard.title')}
                  </Link>
                )}
                <button 
                  onClick={() => logout()} 
                  className="text-sm hover:text-primary"
                >
                  <i className="fas fa-sign-out-alt mr-1"></i> {t('common.logout')}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm hover:text-primary">
                  <i className="fas fa-user mr-1"></i> {t('common.login')}
                </Link>
                <Link href="/register" className="text-sm hover:text-primary">
                  <i className="fas fa-user-plus mr-1"></i> {t('common.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center">
            <PlaneTakeoff className="h-8 w-8 text-primary mr-2" />
            <span className="text-2xl font-bold font-poppins text-dark">TravelEase</span>
          </Link>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6 rtl:space-x-reverse">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "font-medium py-2 transition-colors duration-200",
                  location === item.path 
                    ? "text-primary border-b-2 border-primary" 
                    : "hover:text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden p-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side={isRtl ? "right" : "left"} className="w-[300px] sm:w-[400px]">
              <div className="px-4 py-6 flex flex-col space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <PlaneTakeoff className="h-6 w-6 text-primary mr-2" />
                    <span className="text-xl font-bold font-poppins">TravelEase</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsMenuOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "py-2 block transition-colors",
                      location === item.path 
                        ? "text-primary font-medium" 
                        : "text-gray-700 hover:text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
