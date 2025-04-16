import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Link } from 'wouter';
import { Checkbox } from '@/components/ui/checkbox';
import UserLayout from '@/components/layout/UserLayout';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

const loginFormSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional(),
});

const LoginPage = () => {
  const { t } = useTranslation();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  
  // Redirect if already authenticated
  if (!isLoading && isAuthenticated) {
    navigate('/');
    return null;
  }
  
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });
  
  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      const success = await login(values.username, values.password);
      
      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-primary/5 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>TravelEase - {t('common.login')}</title>
        <meta name="description" content="Log in to your TravelEase account to manage your bookings and access exclusive deals." />
      </Helmet>
      
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/" className="text-2xl font-bold text-primary">
              TravelEase
            </Link>
          </div>
          <LanguageSwitcher />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t('common.login')}</CardTitle>
            <CardDescription className="text-center">
              {t('login.welcomeBack', 'Welcome back! Please sign in to continue.')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.username')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('login.usernamePlaceholder', 'Enter your username')} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>{t('common.password')}</FormLabel>
                        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                          {t('login.forgotPassword', 'Forgot password?')}
                        </Link>
                      </div>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder={t('login.passwordPlaceholder', 'Enter your password')} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {t('login.rememberMe', 'Remember me')}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <i className="animate-spin mr-2">⟳</i> {t('login.loggingIn', 'Logging in...')}
                    </span>
                  ) : (
                    t('common.login')
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-text-secondary">
              {t('login.noAccount', "Don't have an account?")} {' '}
              <Link href="/register" className="text-primary hover:underline font-medium">
                {t('login.registerNow', 'Register now')}
              </Link>
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-sm text-text-secondary">
          <p>
            &copy; {new Date().getFullYear()} TravelEase. {t('common.copyrights')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;