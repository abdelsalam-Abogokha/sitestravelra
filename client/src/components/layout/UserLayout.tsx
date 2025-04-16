import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import {
  Plane,
  Building2,
  Globe,
  FileText,
  Truck,
  MessageSquare,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Phone,
  ChevronDown,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { Toaster } from '@/components/ui/toaster';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const mainNavItems = [
    { href: '/flights', label: t('common.flights'), icon: <Plane className="h-4 w-4 mr-2" /> },
    { href: '/hotels', label: t('common.hotels'), icon: <Building2 className="h-4 w-4 mr-2" /> },
    { href: '/packages', label: t('common.packages'), icon: <Globe className="h-4 w-4 mr-2" /> },
    { href: '/visas', label: t('common.visas'), icon: <FileText className="h-4 w-4 mr-2" /> },
    { href: '/translation', label: t('common.translation'), icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { href: '/shipping', label: t('common.shipping'), icon: <Truck className="h-4 w-4 mr-2" /> },
  ];
  
  const secondaryNavItems = [
    { href: '/blog', label: t('common.blog'), icon: <FileText className="h-4 w-4 mr-2" /> },
    { href: '/contact', label: t('common.contact'), icon: <Phone className="h-4 w-4 mr-2" /> },
  ];
  
  const handleLogout = async () => {
    await logout();
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-primary">
              TravelEase
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${
                    location === item.href ? 'text-primary' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm">
                    {t('common.more')}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {secondaryNavItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <DropdownMenuItem className="cursor-pointer">
                        {item.icon}
                        {item.label}
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Right side items */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="font-medium">
                      {t('common.myAccount')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <Link href="/bookings">
                      <DropdownMenuItem className="cursor-pointer">
                        {t('common.myBookings')}
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        {t('common.profile')}
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/settings">
                      <DropdownMenuItem className="cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        {t('common.settings')}
                      </DropdownMenuItem>
                    </Link>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <Link href="/admin">
                          <DropdownMenuItem className="cursor-pointer">
                            {t('common.adminDashboard')}
                          </DropdownMenuItem>
                        </Link>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('common.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      {t('common.login')}
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-primary text-white">
                      {t('common.register')}
                    </Button>
                  </Link>
                </div>
              )}
              
              {/* Mobile menu button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side={isRtl ? 'right' : 'left'} className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b">
                      <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="text-xl font-bold text-primary">TravelEase</span>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <X className="h-6 w-6" />
                      </Button>
                    </div>
                    
                    <div className="flex-1 overflow-auto py-4">
                      <div className="space-y-1 px-2">
                        {mainNavItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Button
                              variant="ghost"
                              className={`w-full justify-start ${
                                location === item.href
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-gray-700'
                              }`}
                            >
                              {item.icon}
                              {item.label}
                            </Button>
                          </Link>
                        ))}
                        
                        <div className="pt-4 pb-2">
                          <div className="border-t border-gray-200"></div>
                        </div>
                        
                        {secondaryNavItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Button
                              variant="ghost"
                              className={`w-full justify-start ${
                                location === item.href
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-gray-700'
                              }`}
                            >
                              {item.icon}
                              {item.label}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 border-t">
                      {isAuthenticated ? (
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-5 w-5 mr-2" />
                          {t('common.logout')}
                        </Button>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full">
                              {t('common.login')}
                            </Button>
                          </Link>
                          <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button className="w-full bg-primary text-white">
                              {t('common.register')}
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.aboutUs')}</h3>
              <p className="text-gray-400 mb-4">
                {t('footer.aboutDescription', 'TravelEase provides comprehensive travel solutions including flights, hotels, visa services, and more.')}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.services')}</h3>
              <ul className="space-y-2 text-gray-400">
                {mainNavItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.support')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    {t('footer.faq')}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    {t('footer.contactUs')}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    {t('footer.termsOfService')}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    {t('footer.privacyPolicy')}
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.contactUs')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                  <span>
                    123 Travel Street, Downtown
                    <br />
                    Dubai, United Arab Emirates
                  </span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-primary" />
                  <span>+971 4 123 4567</span>
                </li>
                <li className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                  <span>info@travelease.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 mt-6 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} TravelEase. {t('footer.allRightsReserved')}
            </p>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default UserLayout;