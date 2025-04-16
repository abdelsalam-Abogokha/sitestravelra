import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Bell,
  CreditCard,
  Info,
  Lock,
  MailIcon,
  MapPin,
  Phone,
  Save,
  Settings,
  UploadCloud,
} from "lucide-react";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

// General settings schema
const generalSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string(),
  supportEmail: z.string().email("Invalid email address"),
  supportPhone: z.string().optional(),
  address: z.string().optional(),
  defaultLanguage: z.enum(["en", "ar"]),
  logo: z.string().optional(),
  socialMedia: z.object({
    facebook: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
  }),
});

// Notification settings schema
const notificationSettingsSchema = z.object({
  enableEmailNotifications: z.boolean(),
  enableSmsNotifications: z.boolean(),
  enablePushNotifications: z.boolean(),
  enableBrowserNotifications: z.boolean(),
  notifyOnNewBooking: z.boolean(),
  notifyOnBookingStatusChange: z.boolean(),
  notifyOnNewUserRegistration: z.boolean(),
});

// Payment settings schema
const paymentSettingsSchema = z.object({
  enableStripe: z.boolean(),
  enablePaypal: z.boolean(),
  enableCashOnArrival: z.boolean(),
  enableBankTransfer: z.boolean(),
  currencyCode: z.string().min(1, "Currency code is required"),
  currencySymbol: z.string().min(1, "Currency symbol is required"),
  stripePublicKey: z.string().optional(),
  stripeSecretKey: z.string().optional(),
  paypalClientId: z.string().optional(),
  paypalSecretKey: z.string().optional(),
  bankAccountDetails: z.string().optional(),
});

// Security settings schema
const securitySettingsSchema = z.object({
  enableTwoFactorAuth: z.boolean(),
  requireStrongPasswords: z.boolean(),
  passwordMinLength: z.number().min(8).max(32),
  sessionTimeout: z.number().min(5).max(1440),
  maxLoginAttempts: z.number().min(3).max(10),
  allowRegistration: z.boolean(),
  requireEmailVerification: z.boolean(),
  enableRecaptcha: z.boolean(),
});

const SettingsPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");

  // Fetch settings data
  const { data: settingsData = {} } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/settings");
      return response.json();
    },
  });

  // Form hooks for each settings section
  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      siteName: settingsData.general?.siteName || "TravelEase",
      siteDescription: settingsData.general?.siteDescription || "",
      supportEmail: settingsData.general?.supportEmail || "",
      supportPhone: settingsData.general?.supportPhone || "",
      address: settingsData.general?.address || "",
      defaultLanguage: settingsData.general?.defaultLanguage || "en",
      logo: settingsData.general?.logo || "/logo.png",
      socialMedia: {
        facebook: settingsData.general?.socialMedia?.facebook || "",
        twitter: settingsData.general?.socialMedia?.twitter || "",
        instagram: settingsData.general?.socialMedia?.instagram || "",
        linkedin: settingsData.general?.socialMedia?.linkedin || "",
      },
    },
  });

  const notificationsForm = useForm<z.infer<typeof notificationSettingsSchema>>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      enableEmailNotifications: settingsData.notifications?.enableEmailNotifications || true,
      enableSmsNotifications: settingsData.notifications?.enableSmsNotifications || false,
      enablePushNotifications: settingsData.notifications?.enablePushNotifications || false,
      enableBrowserNotifications: settingsData.notifications?.enableBrowserNotifications || true,
      notifyOnNewBooking: settingsData.notifications?.notifyOnNewBooking || true,
      notifyOnBookingStatusChange: settingsData.notifications?.notifyOnBookingStatusChange || true,
      notifyOnNewUserRegistration: settingsData.notifications?.notifyOnNewUserRegistration || true,
    },
  });

  const paymentForm = useForm<z.infer<typeof paymentSettingsSchema>>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      enableStripe: settingsData.payment?.enableStripe || false,
      enablePaypal: settingsData.payment?.enablePaypal || false,
      enableCashOnArrival: settingsData.payment?.enableCashOnArrival || true,
      enableBankTransfer: settingsData.payment?.enableBankTransfer || true,
      currencyCode: settingsData.payment?.currencyCode || "USD",
      currencySymbol: settingsData.payment?.currencySymbol || "$",
      stripePublicKey: settingsData.payment?.stripePublicKey || "",
      stripeSecretKey: settingsData.payment?.stripeSecretKey || "",
      paypalClientId: settingsData.payment?.paypalClientId || "",
      paypalSecretKey: settingsData.payment?.paypalSecretKey || "",
      bankAccountDetails: settingsData.payment?.bankAccountDetails || "",
    },
  });

  const securityForm = useForm<z.infer<typeof securitySettingsSchema>>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      enableTwoFactorAuth: settingsData.security?.enableTwoFactorAuth || false,
      requireStrongPasswords: settingsData.security?.requireStrongPasswords || true,
      passwordMinLength: settingsData.security?.passwordMinLength || 8,
      sessionTimeout: settingsData.security?.sessionTimeout || 120,
      maxLoginAttempts: settingsData.security?.maxLoginAttempts || 5,
      allowRegistration: settingsData.security?.allowRegistration || true,
      requireEmailVerification: settingsData.security?.requireEmailVerification || true,
      enableRecaptcha: settingsData.security?.enableRecaptcha || false,
    },
  });

  // Mutations for updating settings
  const updateGeneralSettings = useMutation({
    mutationFn: async (data: z.infer<typeof generalSettingsSchema>) => {
      const response = await apiRequest("PATCH", "/api/settings/general", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: t('admin.settings.settingsSaved'),
        description: t('admin.settings.generalSettingsSaved', 'General settings have been saved successfully'),
      });
    }
  });

  const updateNotificationSettings = useMutation({
    mutationFn: async (data: z.infer<typeof notificationSettingsSchema>) => {
      const response = await apiRequest("PATCH", "/api/settings/notifications", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: t('admin.settings.settingsSaved'),
        description: t('admin.settings.notificationSettingsSaved', 'Notification settings have been saved successfully'),
      });
    }
  });

  const updatePaymentSettings = useMutation({
    mutationFn: async (data: z.infer<typeof paymentSettingsSchema>) => {
      const response = await apiRequest("PATCH", "/api/settings/payment", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: t('admin.settings.settingsSaved'),
        description: t('admin.settings.paymentSettingsSaved', 'Payment settings have been saved successfully'),
      });
    }
  });

  const updateSecuritySettings = useMutation({
    mutationFn: async (data: z.infer<typeof securitySettingsSchema>) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ...data });
        }, 500);
      });
    },
    onSuccess: () => {
      toast({
        title: t('admin.settings.settingsSaved'),
        description: t('admin.settings.securitySettingsSaved', 'Security settings have been saved successfully'),
      });
    }
  });
  
  const onGeneralSubmit = (data: z.infer<typeof generalSettingsSchema>) => {
    updateGeneralSettings.mutate(data);
  };
  
  const onNotificationsSubmit = (data: z.infer<typeof notificationSettingsSchema>) => {
    updateNotificationSettings.mutate(data);
  };
  
  const onPaymentSubmit = (data: z.infer<typeof paymentSettingsSchema>) => {
    updatePaymentSettings.mutate(data);
  };
  
  const onSecuritySubmit = (data: z.infer<typeof securitySettingsSchema>) => {
    updateSecuritySettings.mutate(data);
  };
  
  return (
    <AdminLayout>
      <Helmet>
        <title>TravelEase - {t('admin.settings.title')}</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {t('admin.settings.title')}
          </h1>
          <p className="text-text-secondary">
            {t('admin.settings.subtitle', 'Configure system settings and preferences')}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <Tabs 
              defaultValue="general" 
              value={activeTab} 
              onValueChange={setActiveTab}
              orientation="vertical"
              className="w-full"
            >
              <TabsList className="flex flex-col h-auto items-stretch gap-1">
                <TabsTrigger value="general" className="justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  {t('admin.settings.general')}
                </TabsTrigger>
                <TabsTrigger value="notifications" className="justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  {t('admin.settings.notifications')}
                </TabsTrigger>
                <TabsTrigger value="payment" className="justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t('admin.settings.payment')}
                </TabsTrigger>
                <TabsTrigger value="security" className="justify-start">
                  <Lock className="h-4 w-4 mr-2" />
                  {t('admin.settings.security')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-4">
          <CardContent className="p-6">
            <Tabs value={activeTab} className="hidden">
              <TabsContent value="general" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{t('admin.settings.general')}</h2>
                    <p className="text-muted-foreground">{t('admin.settings.generalSettingsDescription', 'Basic website information and configuration')}</p>
                  </div>
                  
                  <Separator />
                  
                  <Form {...generalForm}>
                    <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
                      <div className="grid gap-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={generalForm.control}
                            name="siteName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('admin.settings.siteName')}</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={generalForm.control}
                            name="defaultLanguage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('admin.settings.defaultLanguage')}</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={t('admin.settings.selectLanguage')} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="ar">Arabic</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={generalForm.control}
                          name="siteDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('admin.settings.siteDescription')}</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  className="min-h-[80px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={generalForm.control}
                            name="supportEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('admin.settings.supportEmail')}</FormLabel>
                                <FormControl>
                                  <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                                      <MailIcon className="h-4 w-4" />
                                    </span>
                                    <Input
                                      {...field}
                                      className="rounded-l-none"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={generalForm.control}
                            name="supportPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('admin.settings.supportPhone')}</FormLabel>
                                <FormControl>
                                  <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                                      <Phone className="h-4 w-4" />
                                    </span>
                                    <Input
                                      {...field}
                                      className="rounded-l-none"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={generalForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('admin.settings.address')}</FormLabel>
                              <FormControl>
                                <div className="flex">
                                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                  </span>
                                  <Input
                                    {...field}
                                    className="rounded-l-none"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">{t('admin.settings.socialMedia')}</h3>
                          <div className="space-y-4">
                            <FormField
                              control={generalForm.control}
                              name="socialMedia.facebook"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Facebook</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="https://facebook.com/yourpage" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={generalForm.control}
                              name="socialMedia.twitter"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Twitter</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="https://twitter.com/yourhandle" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={generalForm.control}
                              name="socialMedia.instagram"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Instagram</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="https://instagram.com/yourhandle" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={generalForm.control}
                              name="socialMedia.linkedin"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>LinkedIn</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="https://linkedin.com/company/yourcompany" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">{t('admin.settings.logo')}</h3>
                          <div className="flex items-center gap-4">
                            <div className="border rounded-md p-2 w-24 h-24 flex items-center justify-center">
                              <img 
                                src={generalForm.getValues().logo || "/logo.png"} 
                                alt="Logo" 
                                className="max-w-full max-h-full"
                              />
                            </div>
                            <Button type="button" variant="outline">
                              <UploadCloud className="h-4 w-4 mr-2" />
                              {t('admin.settings.uploadLogo')}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Button type="submit" className="bg-primary text-white">
                        <Save className="h-4 w-4 mr-2" />
                        {t('admin.settings.saveSettings')}
                      </Button>
                    </form>
                  </Form>
                </div>
              </TabsContent>
            
              <TabsContent value="notifications" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{t('admin.settings.notifications')}</h2>
                    <p className="text-muted-foreground">{t('admin.settings.notificationsDescription', 'Configure how notifications are sent to users and administrators')}</p>
                  </div>
                  
                  <Separator />
                  
                  <Form {...notificationsForm}>
                    <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                      <div className="grid gap-6">
                        <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                          <Info className="h-4 w-4" />
                          <AlertTitle>{t('admin.settings.notificationSettings')}</AlertTitle>
                          <AlertDescription>
                            {t('admin.settings.notificationSettingsDescription', 'Configure notification preferences for the system. These settings affect how users and administrators receive updates.')}
                          </AlertDescription>
                        </Alert>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">{t('admin.settings.channels')}</h3>
                          
                          <FormField
                            control={notificationsForm.control}
                            name="enableEmailNotifications"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    {t('admin.settings.enableEmailNotifications')}
                                  </FormLabel>
                                  <FormDescription>
                                    {t('admin.settings.enableEmailNotificationsDescription', 'Send email notifications to users and administrators')}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={notificationsForm.control}
                            name="enableSmsNotifications"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    {t('admin.settings.enableSmsNotifications')}
                                  </FormLabel>
                                  <FormDescription>
                                    {t('admin.settings.enableSmsNotificationsDescription', 'Send SMS notifications to users (requires SMS service integration)')}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={notificationsForm.control}
                            name="enablePushNotifications"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    {t('admin.settings.enablePushNotifications')}
                                  </FormLabel>
                                  <FormDescription>
                                    {t('admin.settings.enablePushNotificationsDescription', 'Send push notifications to mobile app users')}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={notificationsForm.control}
                            name="enableBrowserNotifications"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    {t('admin.settings.enableBrowserNotifications')}
                                  </FormLabel>
                                  <FormDescription>
                                    {t('admin.settings.enableBrowserNotificationsDescription', 'Send browser notifications to website users')}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">{t('admin.settings.events')}</h3>
                          
                          <FormField
                            control={notificationsForm.control}
                            name="notifyOnNewBooking"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    {t('admin.settings.notifyOnNewBooking')}
                                  </FormLabel>
                                  <FormDescription>
                                    {t('admin.settings.notifyOnNewBookingDescription', 'Send notifications when a new booking is created')}
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={notificationsForm.control}
                            name="notifyOnBookingStatusChange"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    {t('admin.settings.notifyOnBookingStatusChange')}
                                  </FormLabel>
                                  <FormDescription>
                                    {t('admin.settings.notifyOnBookingStatusChangeDescription', 'Send notifications when a booking status changes')}
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={notificationsForm.control}
                            name="notifyOnNewUserRegistration"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    {t('admin.settings.notifyOnNewUserRegistration')}
                                  </FormLabel>
                                  <FormDescription>
                                    {t('admin.settings.notifyOnNewUserRegistrationDescription', 'Send notifications when a new user registers')}
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" className="bg-primary text-white">
                        <Save className="h-4 w-4 mr-2" />
                        {t('admin.settings.saveSettings')}
                      </Button>
                    </form>
                  </Form>
                </div>
              </TabsContent>
              
              <TabsContent value="payment" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{t('admin.settings.payment')}</h2>
                    <p className="text-muted-foreground">{t('admin.settings.paymentSettingsDescription', 'Configure payment methods and gateway integrations')}</p>
                  </div>
                  
                  <Separator />
                  
                  <Form {...paymentForm}>
                    <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
                      <div className="grid gap-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={paymentForm.control}
                            name="currencyCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('admin.settings.currencyCode')}</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                    <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                                    <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={paymentForm.control}
                            name="currencySymbol"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('admin.settings.currencySymbol')}</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">{t('admin.settings.paymentMethods')}</h3>
                          
                          <FormField
                            control={paymentForm.control}
                            name="enableStripe"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    {t('admin.settings.enableStripe')}
                                  </FormLabel>
                                  <FormDescription>
                                    {t('admin.settings.enableStripeDescription', 'Accept payments via Stripe')}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          {paymentForm.watch("enableStripe") && (
                            <div className="pl-6 border-l-2 border-l-gray-200 ml-2 space-y-4">
                              <FormField
                                control={paymentForm.control}
                                name="stripePublicKey"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t('admin.settings.stripePublicKey')}</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={paymentForm.control}
                                name="stripeSecretKey"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t('admin.settings.stripeSecretKey')}</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}
                          
                          <FormField
                            control={paymentForm.control}
                            name="enablePaypal"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    {t('admin.settings.enablePaypal')}
                                  </FormLabel>
                                  <FormDescription>
                                    {t('admin.settings.enablePaypalDescription', 'Accept payments via PayPal')}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          {paymentForm.watch("enablePaypal") && (
                            <div className="pl-6 border-l-2 border-l-gray-200 ml-2 space-y-4">
                              <FormField
                                control={paymentForm.control}
                                name="paypalClientId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t('admin.settings.paypalClientId')}</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={paymentForm.control}
                                name="paypalSecretKey"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t('admin.settings.paypalSecretKey')}</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}
                          
                          <FormField
                            control={paymentForm.control}
                            name="enableCashOnArrival"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    {t('admin.settings.enableCashOnArrival')}
                                  </FormLabel>
                                  <FormDescription>
                                    {t('admin.settings.enableCashOnArrivalDescription', 'Allow customers to pay in cash on arrival')}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={paymentForm.control}
                            name="enableBankTransfer"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    {t('admin.settings.enableBankTransfer')}
                                  </FormLabel>
                                  <FormDescription>
                                    {t('admin.settings.enableBankTransferDescription', 'Allow customers to pay via bank transfer')}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          {paymentForm.watch("enableBankTransfer") && (
                            <div className="pl-6 border-l-2 border-l-gray-200 ml-2">
                              <FormField
                                control={paymentForm.control}
                                name="bankAccountDetails"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t('admin.settings.bankAccountDetails')}</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        {...field} 
                                        placeholder="Bank Name: Your Bank&#10;Account Number: 1234567890&#10;IBAN: ..."
                                        className="min-h-[120px]"
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      {t('admin.settings.bankAccountDetailsDescription', 'These details will be shown to customers who choose to pay via bank transfer')}
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button type="submit" className="bg-primary text-white">
                        <Save className="h-4 w-4 mr-2" />
                        {t('admin.settings.saveSettings')}
                      </Button>
                    </form>
                  </Form>
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{t('admin.settings.security')}</h2>
                    <p className="text-muted-foreground">{t('admin.settings.securitySettingsDescription', 'Configure security options for your application')}</p>
                  </div>
                  
                  <Separator />
                  
                  <Form {...securityForm}>
                    <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                      <div className="grid gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">{t('admin.settings.authentication')}</h3>
                          
                          <FormField
                            control={securityForm.control}
                            name="enableTwoFactorAuth"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    {t('admin.settings.enableTwoFactorAuth')}
                                  </FormLabel>
                                  <FormDescription>
                                    {t('admin.settings.enableTwoFactorAuthDescription', 'Enable two-factor authentication for added security')}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={securityForm.control}
                            name="requireStrongPasswords"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    {t('admin.settings.requireStrongPasswords')}
                                  </FormLabel>
                                  <FormDescription>
                                    {t('admin.settings.requireStrongPasswordsDescription', 'Require passwords to contain uppercase, lowercase, numbers, and special characters')}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={securityForm.control}
                              name="passwordMinLength"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('admin.settings.passwordMinLength')}</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field} 
                                      onChange={(e) => field.onChange(parseInt(e.target.value || "8"))}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    {t('admin.settings.passwordMinLengthDescription', 'Minimum password length (8-32 characters)')}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={securityForm.control}
                              name="maxLoginAttempts"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('admin.settings.maxLoginAttempts')}</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field} 
                                      onChange={(e) => field.onChange(parseInt(e.target.value || "5"))}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    {t('admin.settings.maxLoginAttemptsDescription', 'Maximum login attempts before account lockout (3-10 attempts)')}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={securityForm.control}
                            name="sessionTimeout"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('admin.settings.sessionTimeout')}</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    onChange={(e) => field.onChange(parseInt(e.target.value || "120"))}
                                  />
                                </FormControl>
                                <FormDescription>
                                  {t('admin.settings.sessionTimeoutDescription', 'Session timeout in minutes (5-1440 minutes)')}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">{t('admin.settings.registration')}</h3>
                          
                          <FormField
                            control={securityForm.control}
                            name="allowRegistration"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    {t('admin.settings.allowRegistration')}
                                  </FormLabel>
                                  <FormDescription>
                                    {t('admin.settings.allowRegistrationDescription', 'Allow new users to register accounts')}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={securityForm.control}
                            name="requireEmailVerification"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    {t('admin.settings.requireEmailVerification')}
                                  </FormLabel>
                                  <FormDescription>
                                    {t('admin.settings.requireEmailVerificationDescription', 'Require email verification for new accounts')}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={securityForm.control}
                            name="enableRecaptcha"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    {t('admin.settings.enableRecaptcha')}
                                  </FormLabel>
                                  <FormDescription>
                                    {t('admin.settings.enableRecaptchaDescription', 'Enable reCAPTCHA to protect forms from spam and abuse')}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" className="bg-primary text-white">
                        <Save className="h-4 w-4 mr-2" />
                        {t('admin.settings.saveSettings')}
                      </Button>
                    </form>
                  </Form>
                </div>
              </TabsContent>
            </Tabs>
            
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{t('admin.settings.general')}</h2>
                  <p className="text-muted-foreground">{t('admin.settings.generalSettingsDescription', 'Basic website information and configuration')}</p>
                </div>
                
                <Separator />
                
                <Form {...generalForm}>
                  <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
                    <div className="grid gap-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={generalForm.control}
                          name="siteName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('admin.settings.siteName')}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={generalForm.control}
                          name="defaultLanguage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('admin.settings.defaultLanguage')}</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t('admin.settings.selectLanguage')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="ar">Arabic</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={generalForm.control}
                        name="siteDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('admin.settings.siteDescription')}</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                className="min-h-[80px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" className="bg-primary text-white">
                      <Save className="h-4 w-4 mr-2" />
                      {t('admin.settings.saveSettings')}
                    </Button>
                  </form>
                </Form>
              </div>
            )}
            
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{t('admin.settings.notifications')}</h2>
                  <p className="text-muted-foreground">{t('admin.settings.notificationsDescription', 'Configure how notifications are sent to users and administrators')}</p>
                </div>
                
                <Separator />
                
                <Form {...notificationsForm}>
                  <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                    <div className="grid gap-6">
                      <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                        <Info className="h-4 w-4" />
                        <AlertTitle>{t('admin.settings.notificationSettings')}</AlertTitle>
                        <AlertDescription>
                          {t('admin.settings.notificationSettingsDescription', 'Configure notification preferences for the system.')}
                        </AlertDescription>
                      </Alert>
                    </div>
                    <Button type="submit" className="bg-primary text-white">
                      <Save className="h-4 w-4 mr-2" />
                      {t('admin.settings.saveSettings')}
                    </Button>
                  </form>
                </Form>
              </div>
            )}
            
            {activeTab === "payment" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{t('admin.settings.payment')}</h2>
                  <p className="text-muted-foreground">{t('admin.settings.paymentSettingsDescription', 'Configure payment methods and gateway integrations')}</p>
                </div>
                
                <Separator />
                
                <Form {...paymentForm}>
                  <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
                    <div className="grid gap-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={paymentForm.control}
                          name="currencyCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('admin.settings.currencyCode')}</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="bg-primary text-white">
                      <Save className="h-4 w-4 mr-2" />
                      {t('admin.settings.saveSettings')}
                    </Button>
                  </form>
                </Form>
              </div>
            )}
            
            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{t('admin.settings.security')}</h2>
                  <p className="text-muted-foreground">{t('admin.settings.securitySettingsDescription', 'Configure security options for your application')}</p>
                </div>
                
                <Separator />
                
                <Form {...securityForm}>
                  <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                    <div className="grid gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">{t('admin.settings.authentication')}</h3>
                        
                        <FormField
                          control={securityForm.control}
                          name="enableTwoFactorAuth"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  {t('admin.settings.enableTwoFactorAuth')}
                                </FormLabel>
                                <FormDescription>
                                  {t('admin.settings.enableTwoFactorAuthDescription', 'Enable two-factor authentication for added security')}
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="bg-primary text-white">
                      <Save className="h-4 w-4 mr-2" />
                      {t('admin.settings.saveSettings')}
                    </Button>
                  </form>
                </Form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;