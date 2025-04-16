import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  CheckCircle, 
  Database, 
  Globe, 
  Lock, 
  MailIcon, 
  Server, 
  Settings, 
  User 
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";

// Site settings schema
const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "اسم الموقع مطلوب"),
  siteDescription: z.string().min(1, "وصف الموقع مطلوب"),
  siteUrl: z.string().url("الرجاء إدخال عنوان URL صحيح"),
  supportEmail: z.string().email("الرجاء إدخال بريد إلكتروني صحيح"),
  supportPhone: z.string().optional(),
  defaultLanguage: z.enum(["ar", "en"]),
});

// Database settings schema
const databaseSettingsSchema = z.object({
  databaseType: z.enum(["postgresql", "mysql"]),
  databaseHost: z.string().min(1, "اسم المضيف مطلوب"),
  databasePort: z.string().min(1, "منفذ قاعدة البيانات مطلوب"),
  databaseName: z.string().min(1, "اسم قاعدة البيانات مطلوب"),
  databaseUser: z.string().min(1, "اسم المستخدم مطلوب"),
  databasePassword: z.string().min(1, "كلمة المرور مطلوبة"),
});

// Admin user schema
const adminUserSchema = z.object({
  username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
  email: z.string().email("الرجاء إدخال بريد إلكتروني صحيح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  confirmPassword: z.string(),
  fullName: z.string().min(1, "الاسم الكامل مطلوب"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

// API settings schema
const apiSettingsSchema = z.object({
  enableOpenAI: z.boolean().optional(),
  openaiApiKey: z.string().optional(),
  enableGoogleMaps: z.boolean().optional(),
  googleMapsApiKey: z.string().optional(),
});

const InstallPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [installProgress, setInstallProgress] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const totalSteps = 4;

  // Form hooks for each settings section
  const siteForm = useForm<z.infer<typeof siteSettingsSchema>>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: "TravelEase",
      siteDescription: "توفير حلول سفر شاملة للرحلات والفنادق والتأشيرات والمزيد",
      siteUrl: window.location.origin,
      supportEmail: "",
      supportPhone: "",
      defaultLanguage: "ar",
    },
  });

  const databaseForm = useForm<z.infer<typeof databaseSettingsSchema>>({
    resolver: zodResolver(databaseSettingsSchema),
    defaultValues: {
      databaseType: "postgresql",
      databaseHost: "localhost",
      databasePort: "5432",
      databaseName: "travelease",
      databaseUser: "",
      databasePassword: "",
    },
  });

  const adminForm = useForm<z.infer<typeof adminUserSchema>>({
    resolver: zodResolver(adminUserSchema),
    defaultValues: {
      username: "admin",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });

  const apiForm = useForm<z.infer<typeof apiSettingsSchema>>({
    resolver: zodResolver(apiSettingsSchema),
    defaultValues: {
      enableOpenAI: true,
      openaiApiKey: "",
      enableGoogleMaps: false,
      googleMapsApiKey: "",
    },
  });

  // Mutation for installation
  const installMutation = useMutation({
    mutationFn: async (data: any) => {
      setIsInstalling(true);
      try {
        // Step 1: Configure site settings
        setInstallProgress(10);
        await apiRequest("POST", "/api/install/site-settings", data.siteSettings);
        
        setInstallProgress(30);
        // Step 2: Configure database
        await apiRequest("POST", "/api/install/database", data.databaseSettings);
        
        setInstallProgress(50);
        // Step 3: Create admin user
        await apiRequest("POST", "/api/install/admin-user", data.adminUser);
        
        setInstallProgress(70);
        // Step 4: Configure APIs
        await apiRequest("POST", "/api/install/api-settings", data.apiSettings);
        
        setInstallProgress(90);
        // Step 5: Complete installation
        await apiRequest("POST", "/api/install/complete", {});
        
        setInstallProgress(100);
        return { success: true };
      } catch (error) {
        console.error("Installation error:", error);
        throw error;
      } finally {
        setIsInstalling(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "تم التثبيت بنجاح",
        description: "تم تثبيت النظام بنجاح وهو جاهز للاستخدام",
      });
      setIsComplete(true);
    },
    onError: (error: any) => {
      toast({
        title: "فشل التثبيت",
        description: error.message || "حدث خطأ أثناء تثبيت النظام. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  });

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSiteSubmit = (data: z.infer<typeof siteSettingsSchema>) => {
    nextStep();
  };

  const onDatabaseSubmit = (data: z.infer<typeof databaseSettingsSchema>) => {
    nextStep();
  };

  const onAdminSubmit = (data: z.infer<typeof adminUserSchema>) => {
    nextStep();
  };

  const onFinalSubmit = (data: z.infer<typeof apiSettingsSchema>) => {
    const installData = {
      siteSettings: siteForm.getValues(),
      databaseSettings: databaseForm.getValues(),
      adminUser: adminForm.getValues(),
      apiSettings: data,
    };
    installMutation.mutate(installData);
  };

  const getProgressPercentage = () => {
    if (isInstalling) {
      return installProgress;
    }
    return ((currentStep - 1) / totalSteps) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 rtl">
      <Helmet>
        <title>تثبيت نظام TravelEase</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            تثبيت نظام TravelEase
          </h1>
          <p className="text-lg text-gray-600">
            قم بإعداد نظام إدارة السفر الخاص بك في خطوات بسيطة
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">التقدم</span>
            <span className="text-sm font-medium">
              {isInstalling ? `${Math.round(installProgress)}%` : `الخطوة ${currentStep} من ${totalSteps}`}
            </span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>
        
        <div className="flex mb-6 border-b">
          <button
            onClick={() => setCurrentStep(1)}
            className={`px-4 py-2 font-medium ${
              currentStep === 1 ? "border-b-2 border-primary text-primary" : "text-gray-500"
            }`}
            disabled={isInstalling}
          >
            <Globe className="h-4 w-4 inline-block ml-2" />
            إعدادات الموقع
          </button>
          <button
            onClick={() => currentStep >= 2 && setCurrentStep(2)}
            className={`px-4 py-2 font-medium ${
              currentStep === 2 ? "border-b-2 border-primary text-primary" : "text-gray-500"
            } ${currentStep < 2 ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={currentStep < 2 || isInstalling}
          >
            <Database className="h-4 w-4 inline-block ml-2" />
            قاعدة البيانات
          </button>
          <button
            onClick={() => currentStep >= 3 && setCurrentStep(3)}
            className={`px-4 py-2 font-medium ${
              currentStep === 3 ? "border-b-2 border-primary text-primary" : "text-gray-500"
            } ${currentStep < 3 ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={currentStep < 3 || isInstalling}
          >
            <User className="h-4 w-4 inline-block ml-2" />
            مستخدم المسؤول
          </button>
          <button
            onClick={() => currentStep >= 4 && setCurrentStep(4)}
            className={`px-4 py-2 font-medium ${
              currentStep === 4 ? "border-b-2 border-primary text-primary" : "text-gray-500"
            } ${currentStep < 4 ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={currentStep < 4 || isInstalling}
          >
            <Settings className="h-4 w-4 inline-block ml-2" />
            إعدادات API
          </button>
        </div>
        
        {isComplete ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">تم التثبيت بنجاح!</h2>
                <p className="text-gray-600 mb-6">
                  تم تثبيت نظام TravelEase بنجاح وهو جاهز للاستخدام الآن.
                </p>
                <div className="flex justify-center gap-4">
                  <Button asChild>
                    <Link to="/login">
                      تسجيل الدخول
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/admin">
                      لوحة التحكم
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">إعدادات الموقع</h2>
                  <p className="text-gray-600 mb-6">
                    قم بتكوين المعلومات الأساسية للموقع
                  </p>
                  
                  <Form {...siteForm}>
                    <form onSubmit={siteForm.handleSubmit(onSiteSubmit)} className="space-y-6">
                      <div className="grid gap-6">
                        <FormField
                          control={siteForm.control}
                          name="siteName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>اسم الموقع</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>
                                اسم موقعك كما سيظهر للزوار
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={siteForm.control}
                          name="siteDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>وصف الموقع</FormLabel>
                              <FormControl>
                                <Textarea {...field} className="min-h-[80px]" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={siteForm.control}
                          name="siteUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>عنوان الموقع URL</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={siteForm.control}
                            name="supportEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>البريد الإلكتروني للدعم</FormLabel>
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
                            control={siteForm.control}
                            name="supportPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>هاتف الدعم</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={siteForm.control}
                          name="defaultLanguage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>اللغة الافتراضية</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="اختر اللغة الافتراضية" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="ar">العربية</SelectItem>
                                  <SelectItem value="en">الإنجليزية</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit">
                          التالي
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}
              
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">إعدادات قاعدة البيانات</h2>
                  <p className="text-gray-600 mb-6">
                    قم بتكوين اتصال قاعدة البيانات
                  </p>
                  
                  <Alert className="mb-6">
                    <Server className="h-4 w-4" />
                    <AlertTitle>معلومات</AlertTitle>
                    <AlertDescription>
                      تأكد من إنشاء قاعدة بيانات قبل المتابعة. يجب أن يكون لديك بيانات الاتصال المناسبة.
                    </AlertDescription>
                  </Alert>
                  
                  <Form {...databaseForm}>
                    <form onSubmit={databaseForm.handleSubmit(onDatabaseSubmit)} className="space-y-6">
                      <div className="grid gap-6">
                        <FormField
                          control={databaseForm.control}
                          name="databaseType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>نوع قاعدة البيانات</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="اختر نوع قاعدة البيانات" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                                  <SelectItem value="mysql">MySQL</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={databaseForm.control}
                            name="databaseHost"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>المضيف (Host)</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={databaseForm.control}
                            name="databasePort"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>المنفذ (Port)</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={databaseForm.control}
                          name="databaseName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>اسم قاعدة البيانات</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={databaseForm.control}
                            name="databaseUser"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>اسم المستخدم</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={databaseForm.control}
                            name="databasePassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>كلمة المرور</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                          السابق
                        </Button>
                        <Button type="submit">
                          التالي
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}
              
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">إنشاء حساب المسؤول</h2>
                  <p className="text-gray-600 mb-6">
                    قم بإنشاء حساب المسؤول الرئيسي للنظام
                  </p>
                  
                  <Form {...adminForm}>
                    <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-6">
                      <div className="grid gap-6">
                        <FormField
                          control={adminForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>الاسم الكامل</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={adminForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>اسم المستخدم</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={adminForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>البريد الإلكتروني</FormLabel>
                                <FormControl>
                                  <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={adminForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>كلمة المرور</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={adminForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>تأكيد كلمة المرور</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                          السابق
                        </Button>
                        <Button type="submit">
                          التالي
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}
              
              {currentStep === 4 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">إعدادات واجهات API</h2>
                  <p className="text-gray-600 mb-6">
                    قم بتكوين مفاتيح API المطلوبة (اختياري)
                  </p>
                  
                  <Form {...apiForm}>
                    <form onSubmit={apiForm.handleSubmit(onFinalSubmit)} className="space-y-6">
                      <div className="grid gap-6">
                        <div className="border rounded-md p-4">
                          <div className="flex items-start space-x-reverse space-x-3 space-y-0 rtl:space-x-reverse">
                            <div className="flex h-4 w-4 items-center justify-center">
                              <input
                                type="checkbox"
                                id="enableOpenAI"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={apiForm.watch("enableOpenAI")}
                                onChange={(e) => apiForm.setValue("enableOpenAI", e.target.checked)}
                              />
                            </div>
                            <div className="leading-none flex-1">
                              <label htmlFor="enableOpenAI" className="text-sm font-medium leading-none">
                                تمكين خدمة OpenAI
                              </label>
                              <p className="text-sm text-gray-500 mt-1">
                                تمكين الدردشة الذكية والمساعدة في الموقع
                              </p>
                              
                              {apiForm.watch("enableOpenAI") && (
                                <div className="mt-4">
                                  <FormField
                                    control={apiForm.control}
                                    name="openaiApiKey"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>مفتاح API الخاص بـ OpenAI</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                          الحصول على المفتاح من <a href="https://openai.com/api" target="_blank" rel="noopener noreferrer" className="text-primary underline">https://openai.com/api</a>
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-md p-4">
                          <div className="flex items-start space-x-reverse space-x-3 space-y-0 rtl:space-x-reverse">
                            <div className="flex h-4 w-4 items-center justify-center">
                              <input
                                type="checkbox"
                                id="enableGoogleMaps"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={apiForm.watch("enableGoogleMaps")}
                                onChange={(e) => apiForm.setValue("enableGoogleMaps", e.target.checked)}
                              />
                            </div>
                            <div className="leading-none flex-1">
                              <label htmlFor="enableGoogleMaps" className="text-sm font-medium leading-none">
                                تمكين خرائط Google
                              </label>
                              <p className="text-sm text-gray-500 mt-1">
                                عرض الخرائط وتحديد المواقع في الموقع
                              </p>
                              
                              {apiForm.watch("enableGoogleMaps") && (
                                <div className="mt-4">
                                  <FormField
                                    control={apiForm.control}
                                    name="googleMapsApiKey"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>مفتاح API الخاص بخرائط Google</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                          الحصول على المفتاح من <a href="https://cloud.google.com/maps-platform" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Maps Platform</a>
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-6 mt-6">
                        <div className="mb-6">
                          <h3 className="text-lg font-medium mb-2">الملخص</h3>
                          <p className="text-gray-600">
                            راجع المعلومات التي أدخلتها قبل إكمال التثبيت
                          </p>
                        </div>
                        
                        <div className="grid gap-4 mb-6">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">معلومات الموقع</h4>
                            <p><strong>اسم الموقع:</strong> {siteForm.getValues().siteName}</p>
                            <p><strong>البريد الإلكتروني للدعم:</strong> {siteForm.getValues().supportEmail}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">معلومات قاعدة البيانات</h4>
                            <p><strong>نوع قاعدة البيانات:</strong> {databaseForm.getValues().databaseType}</p>
                            <p><strong>المضيف:</strong> {databaseForm.getValues().databaseHost}</p>
                            <p><strong>اسم قاعدة البيانات:</strong> {databaseForm.getValues().databaseName}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">معلومات المسؤول</h4>
                            <p><strong>اسم المستخدم:</strong> {adminForm.getValues().username}</p>
                            <p><strong>البريد الإلكتروني:</strong> {adminForm.getValues().email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                          السابق
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={isInstalling}
                        >
                          {isInstalling ? "جارِ التثبيت..." : "إكمال التثبيت"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InstallPage;