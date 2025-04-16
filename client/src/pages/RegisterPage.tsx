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
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

const registerFormSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  fullName: z.string().min(1, { message: 'Full name is required' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  agreeTerms: z.boolean()
    .refine(val => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const RegisterPage = () => {
  const { t } = useTranslation();
  const { register, isLoading, isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  
  // Redirect if already authenticated
  if (!isLoading && isAuthenticated) {
    navigate('/');
    return null;
  }
  
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      phone: '',
      agreeTerms: false,
    },
  });
  
  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    try {
      const success = await register({
        username: values.username,
        email: values.email,
        fullName: values.fullName,
        password: values.password,
        phone: values.phone,
      });
      
      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-primary/5 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>TravelEase - {t('common.register')}</title>
        <meta name="description" content="Create an account with TravelEase to access exclusive travel deals and manage your bookings." />
      </Helmet>
      
      <div className="w-full max-w-lg">
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
            <CardTitle className="text-2xl text-center">{t('common.register')}</CardTitle>
            <CardDescription className="text-center">
              {t('register.createAccount', 'Create an account to get started')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.fullName', 'Full Name')}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t('register.fullNamePlaceholder', 'Enter your full name')} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.username')}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t('register.usernamePlaceholder', 'Choose a username')} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.email')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder={t('register.emailPlaceholder', 'Enter your email')} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.phone')}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t('register.phonePlaceholder', 'Enter your phone number (optional)')} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.password')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder={t('register.passwordPlaceholder', 'Create a password')} 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          {t('register.passwordHint', 'At least 8 characters')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('register.confirmPassword', 'Confirm Password')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder={t('register.confirmPasswordPlaceholder', 'Confirm your password')} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="agreeTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">
                          {t('register.agreeTerms', 'I agree to the')} {' '}
                          <Link href="/terms" className="text-primary hover:underline">
                            {t('register.termsOfService', 'Terms of Service')}
                          </Link>
                          {' '} {t('register.and', 'and')} {' '}
                          <Link href="/privacy" className="text-primary hover:underline">
                            {t('register.privacyPolicy', 'Privacy Policy')}
                          </Link>
                        </FormLabel>
                        <FormMessage />
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
                      <i className="animate-spin mr-2">⟳</i> {t('register.processing', 'Processing...')}
                    </span>
                  ) : (
                    t('register.createAccount', 'Create Account')
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-text-secondary">
              {t('register.alreadyHaveAccount', 'Already have an account?')} {' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                {t('common.login')}
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

export default RegisterPage;