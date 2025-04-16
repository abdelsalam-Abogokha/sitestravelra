import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/components/layout/AdminLayout';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
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
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare,
  Save,
  Check,
  X,
  AlertTriangle,
  Play,
  Pause,
  Settings,
  RefreshCw,
  Sparkles,
  Trash2,
  Bot,
  MessageCircle,
  Clock,
  Globe
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Sample AI Chat settings for the MVP
const mockChatSettings = {
  enabled: true,
  model: 'gpt-4o',
  temperature: 0.7,
  max_tokens: 1000,
  system_prompt: "You are a helpful travel assistant for TravelEase, a full-service travel agency. You can help users find flights, hotels, and vacation packages, provide travel tips, and answer questions about visa requirements and travel documents. Always be polite, helpful, and informative.",
  greeting_message: "Hello! I'm your TravelEase assistant. How can I help you plan your trip today?",
  fallback_message: "I'm sorry, I'm having trouble understanding your request. Could you please rephrase or provide more details about your travel needs?",
  suggested_prompts: [
    "What are the best destinations to visit in May?",
    "Do I need a visa to travel to Dubai?",
    "How can I book a flight through TravelEase?",
    "What documents do I need for international travel?"
  ],
  active_hours: {
    enabled: true,
    start_time: "08:00",
    end_time: "20:00",
    time_zone: "UTC",
    outside_hours_message: "Our AI assistant is currently offline. Operating hours are 8AM to 8PM UTC. Please try again during those hours or leave a message and we'll get back to you."
  },
  languages: [
    { code: "en", enabled: true },
    { code: "ar", enabled: true },
    { code: "fr", enabled: false },
    { code: "es", enabled: false }
  ],
  updated_at: "2023-04-15T10:30:00Z"
};

// Sample chat history for the MVP
const mockChatHistory = [
  {
    id: 1,
    session_id: "chat_123456",
    user_id: null,
    user_message: "Hi, I'm looking for flights to Dubai next month",
    assistant_message: "Hello! I'd be happy to help you find flights to Dubai next month. Could you please let me know your departure city and specific travel dates?",
    created_at: "2023-04-16T09:15:00Z",
    user_feedback: "positive"
  },
  {
    id: 2,
    session_id: "chat_123456",
    user_id: null,
    user_message: "I'll be traveling from New York, from May 15 to May 25",
    assistant_message: "Thank you for providing those details. For flights from New York to Dubai from May 15 to May 25, I recommend checking our flight search page where you can see all available options. Would you like direct flights only, or are connections okay?",
    created_at: "2023-04-16T09:17:00Z",
    user_feedback: null
  },
  {
    id: 3,
    session_id: "chat_789012",
    user_id: 42,
    user_message: "What documents do I need for a visa to Egypt?",
    assistant_message: "For an Egyptian tourist visa, you'll typically need: a valid passport with at least 6 months validity beyond your return date, completed visa application form, passport-sized photos, proof of accommodation in Egypt, round-trip flight itinerary, and sometimes proof of sufficient funds. The exact requirements can vary depending on your nationality. Would you like me to help you with the visa application process?",
    created_at: "2023-04-16T11:30:00Z",
    user_feedback: "positive"
  },
  {
    id: 4,
    session_id: "chat_345678",
    user_id: null,
    user_message: "Do you have any travel packages for honeymoon?",
    assistant_message: "Congratulations on your upcoming wedding! We have several romantic honeymoon packages available. Popular destinations include Maldives, Bali, Santorini, Paris, and Venice. Each package includes luxury accommodations, special romantic dinners, and activities. Would you prefer a beach destination, a city, or perhaps a mix of both?",
    created_at: "2023-04-16T14:45:00Z",
    user_feedback: "positive"
  },
  {
    id: 5,
    session_id: "chat_345678",
    user_id: null,
    user_message: "Bali sounds perfect! What's included in the Bali package?",
    assistant_message: "Our Bali honeymoon package includes: 7 nights in a 5-star beach resort with a private villa, daily breakfast, a romantic candlelit dinner on the beach, couples spa treatment, private car with driver for sightseeing, a sunset cruise, and airport transfers. The package starts at $2,899 per couple. Would you like more information or help with booking this package?",
    created_at: "2023-04-16T14:48:00Z",
    user_feedback: null
  }
];

const generalSettingsSchema = z.object({
  enabled: z.boolean(),
  model: z.string().min(1, { message: 'AI model is required' }),
  temperature: z.number().min(0).max(1),
  max_tokens: z.number().min(100).max(4000),
  system_prompt: z.string().min(10),
  greeting_message: z.string().min(10),
  fallback_message: z.string().min(10),
});

const activeHoursSchema = z.object({
  enabled: z.boolean(),
  start_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Please enter a valid time in 24-hour format (HH:MM)' }),
  end_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Please enter a valid time in 24-hour format (HH:MM)' }),
  time_zone: z.string(),
  outside_hours_message: z.string().min(10),
});

const suggestedPromptsSchema = z.object({
  prompts: z.array(z.string().min(5)).min(1),
});

const AiChatSettingsPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const [newPrompt, setNewPrompt] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<{[key: string]: boolean}>({});
  
  // In a real app, these would be real queries and mutations
  const { data: chatSettings, isLoading, error } = useQuery({
    queryKey: ['/api/admin/ai-chat-settings'],
    // Disabled for now, use mock data
    enabled: false,
  });
  
  const { data: chatHistory, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['/api/admin/ai-chat-history'],
    // Disabled for now, use mock data
    enabled: false,
  });
  
  // For MVP, use mock data
  const settings = chatSettings || mockChatSettings;
  const history = chatHistory || mockChatHistory;
  
  useEffect(() => {
    if (settings) {
      setSuggestedPrompts(settings.suggested_prompts || []);
      
      // Initialize language selection
      const langs: {[key: string]: boolean} = {};
      settings.languages.forEach(lang => {
        langs[lang.code] = lang.enabled;
      });
      setSelectedLanguages(langs);
    }
  }, [settings]);
  
  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      enabled: settings.enabled,
      model: settings.model,
      temperature: settings.temperature,
      max_tokens: settings.max_tokens,
      system_prompt: settings.system_prompt,
      greeting_message: settings.greeting_message,
      fallback_message: settings.fallback_message,
    },
  });
  
  const activeHoursForm = useForm<z.infer<typeof activeHoursSchema>>({
    resolver: zodResolver(activeHoursSchema),
    defaultValues: {
      enabled: settings.active_hours.enabled,
      start_time: settings.active_hours.start_time,
      end_time: settings.active_hours.end_time,
      time_zone: settings.active_hours.time_zone,
      outside_hours_message: settings.active_hours.outside_hours_message,
    },
  });
  
  // Mock mutations for MVP
  const updateGeneralSettings = useMutation({
    mutationFn: async (data: z.infer<typeof generalSettingsSchema>) => {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ...data, updated_at: new Date().toISOString() });
        }, 500);
      });
    },
    onSuccess: () => {
      toast({
        title: t('admin.aiChat.settingsSaved'),
        description: t('admin.aiChat.generalSettingsSaved', 'General settings have been saved successfully'),
      });
    }
  });
  
  const updateActiveHours = useMutation({
    mutationFn: async (data: z.infer<typeof activeHoursSchema>) => {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ...data, updated_at: new Date().toISOString() });
        }, 500);
      });
    },
    onSuccess: () => {
      toast({
        title: t('admin.aiChat.settingsSaved'),
        description: t('admin.aiChat.availabilitySettingsSaved', 'Availability settings have been saved successfully'),
      });
    }
  });
  
  const updateSuggestedPrompts = useMutation({
    mutationFn: async (data: string[]) => {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ suggested_prompts: data, updated_at: new Date().toISOString() });
        }, 500);
      });
    },
    onSuccess: () => {
      toast({
        title: t('admin.aiChat.settingsSaved'),
        description: t('admin.aiChat.promptsSaved', 'Suggested prompts have been saved successfully'),
      });
    }
  });
  
  const updateLanguageSettings = useMutation({
    mutationFn: async (data: {[key: string]: boolean}) => {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ 
            languages: Object.entries(data).map(([code, enabled]) => ({ code, enabled })),
            updated_at: new Date().toISOString() 
          });
        }, 500);
      });
    },
    onSuccess: () => {
      toast({
        title: t('admin.aiChat.settingsSaved'),
        description: t('admin.aiChat.languageSettingsSaved', 'Language settings have been saved successfully'),
      });
    }
  });
  
  const onGeneralSubmit = (data: z.infer<typeof generalSettingsSchema>) => {
    updateGeneralSettings.mutate(data);
  };
  
  const onActiveHoursSubmit = (data: z.infer<typeof activeHoursSchema>) => {
    updateActiveHours.mutate(data);
  };
  
  const saveSuggestedPrompts = () => {
    updateSuggestedPrompts.mutate(suggestedPrompts);
  };
  
  const saveLanguageSettings = () => {
    updateLanguageSettings.mutate(selectedLanguages);
  };
  
  const handleAddPrompt = () => {
    if (newPrompt.trim()) {
      setSuggestedPrompts([...suggestedPrompts, newPrompt.trim()]);
      setNewPrompt('');
    }
  };
  
  const handleRemovePrompt = (index: number) => {
    const newPrompts = [...suggestedPrompts];
    newPrompts.splice(index, 1);
    setSuggestedPrompts(newPrompts);
  };
  
  const toggleLanguage = (code: string) => {
    setSelectedLanguages({
      ...selectedLanguages,
      [code]: !selectedLanguages[code]
    });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <AdminLayout>
      <Helmet>
        <title>TravelEase - {t('admin.aiChat.title')}</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {t('admin.aiChat.title')}
          </h1>
          <p className="text-text-secondary">
            {t('admin.aiChat.subtitle', 'Configure AI chat assistant settings and behavior')}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.aiChat.configuration')}</CardTitle>
              <CardDescription>
                {t('admin.aiChat.configurationDescription', 'Customize your AI chat assistant behavior and appearance')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="general">
                    <Settings className="h-4 w-4 mr-2" />
                    {t('admin.aiChat.general')}
                  </TabsTrigger>
                  <TabsTrigger value="availability">
                    <Clock className="h-4 w-4 mr-2" />
                    {t('admin.aiChat.availability')}
                  </TabsTrigger>
                  <TabsTrigger value="prompts">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t('admin.aiChat.suggestedPrompts')}
                  </TabsTrigger>
                  <TabsTrigger value="languages">
                    <Globe className="h-4 w-4 mr-2" />
                    {t('admin.aiChat.languages')}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="py-4">
                  <Form {...generalForm}>
                    <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
                      <FormField
                        control={generalForm.control}
                        name="enabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                {t('admin.aiChat.enableChat')}
                              </FormLabel>
                              <FormDescription>
                                {t('admin.aiChat.enableChatDescription', 'When disabled, the chat widget will not be shown to users')}
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
                        control={generalForm.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('admin.aiChat.aiModel')}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t('admin.aiChat.selectModel', 'Select an AI model')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              {t('admin.aiChat.modelDescription', 'Select the OpenAI model to power your chat assistant')}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={generalForm.control}
                          name="temperature"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('admin.aiChat.temperature')}</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="1"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                {t('admin.aiChat.temperatureDescription', 'Higher values (0.7-1.0) make output more random, lower values (0-0.3) make it more deterministic')}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={generalForm.control}
                          name="max_tokens"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('admin.aiChat.maxTokens')}</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="100"
                                  min="100"
                                  max="4000"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                />
                              </FormControl>
                              <FormDescription>
                                {t('admin.aiChat.maxTokensDescription', 'Maximum response length. Higher values allow more detailed responses but cost more')}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={generalForm.control}
                        name="system_prompt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('admin.aiChat.systemPrompt')}</FormLabel>
                            <FormControl>
                              <Textarea 
                                rows={5}
                                placeholder={t('admin.aiChat.systemPromptPlaceholder', 'Enter system instructions for the AI assistant')}
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              {t('admin.aiChat.systemPromptDescription', 'Instructions that define how the AI assistant should behave and what knowledge it should have')}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="greeting_message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('admin.aiChat.greetingMessage')}</FormLabel>
                            <FormControl>
                              <Textarea 
                                rows={3}
                                placeholder={t('admin.aiChat.greetingMessagePlaceholder', 'Enter the first message the assistant will say to users')}
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              {t('admin.aiChat.greetingMessageDescription', 'The first message the assistant will display when a user opens the chat')}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="fallback_message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('admin.aiChat.fallbackMessage')}</FormLabel>
                            <FormControl>
                              <Textarea 
                                rows={3}
                                placeholder={t('admin.aiChat.fallbackMessagePlaceholder', 'Enter message to show when the AI cannot understand a request')}
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              {t('admin.aiChat.fallbackMessageDescription', 'Message displayed when the AI cannot understand or process a user request')}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="bg-primary text-white"
                        disabled={updateGeneralSettings.isPending}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {updateGeneralSettings.isPending ? t('common.saving') : t('common.saveChanges')}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="availability" className="py-4">
                  <Form {...activeHoursForm}>
                    <form onSubmit={activeHoursForm.handleSubmit(onActiveHoursSubmit)} className="space-y-6">
                      <FormField
                        control={activeHoursForm.control}
                        name="enabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                {t('admin.aiChat.restrictHours')}
                              </FormLabel>
                              <FormDescription>
                                {t('admin.aiChat.restrictHoursDescription', 'Limit when the chat assistant is available to users')}
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={activeHoursForm.control}
                          name="start_time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('admin.aiChat.startTime')}</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={activeHoursForm.control}
                          name="end_time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('admin.aiChat.endTime')}</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={activeHoursForm.control}
                          name="time_zone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('admin.aiChat.timeZone')}</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t('admin.aiChat.selectTimeZone', 'Select a time zone')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="UTC">UTC</SelectItem>
                                  <SelectItem value="America/New_York">America/New_York (EDT/EST)</SelectItem>
                                  <SelectItem value="Europe/London">Europe/London (BST/GMT)</SelectItem>
                                  <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                                  <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={activeHoursForm.control}
                        name="outside_hours_message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('admin.aiChat.outsideHoursMessage')}</FormLabel>
                            <FormControl>
                              <Textarea 
                                rows={3}
                                placeholder={t('admin.aiChat.outsideHoursMessagePlaceholder', 'Enter message to show when chat is outside operating hours')}
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              {t('admin.aiChat.outsideHoursMessageDescription', 'Message displayed when users attempt to use the chat outside of operating hours')}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="bg-primary text-white"
                        disabled={updateActiveHours.isPending}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {updateActiveHours.isPending ? t('common.saving') : t('common.saveChanges')}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="prompts" className="py-4">
                  <div className="space-y-6">
                    <div>
                      <Label>{t('admin.aiChat.suggestedPrompts')}</Label>
                      <p className="text-sm text-gray-500 mb-4">
                        {t('admin.aiChat.suggestedPromptsDescription', 'Add example questions that will be shown to users in the chat interface')}
                      </p>
                      
                      <div className="flex space-x-2 mb-4">
                        <Input 
                          placeholder={t('admin.aiChat.enterPrompt', 'Enter a suggested prompt...')}
                          value={newPrompt}
                          onChange={(e) => setNewPrompt(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          onClick={handleAddPrompt}
                          disabled={!newPrompt.trim()}
                        >
                          {t('common.add')}
                        </Button>
                      </div>
                      
                      <div className="space-y-2 mb-6">
                        {suggestedPrompts.map((prompt, index) => (
                          <div key={index} className="flex items-center justify-between border rounded-md p-3">
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                              <span>{prompt}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemovePrompt(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                        
                        {suggestedPrompts.length === 0 && (
                          <div className="text-center py-8 border border-dashed rounded-md">
                            <p className="text-gray-500">
                              {t('admin.aiChat.noPromptsAdded', 'No suggested prompts added yet')}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        onClick={saveSuggestedPrompts} 
                        className="bg-primary text-white"
                        disabled={updateSuggestedPrompts.isPending}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {updateSuggestedPrompts.isPending ? t('common.saving') : t('common.saveChanges')}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="languages" className="py-4">
                  <div className="space-y-6">
                    <div>
                      <Label>{t('admin.aiChat.supportedLanguages')}</Label>
                      <p className="text-sm text-gray-500 mb-4">
                        {t('admin.aiChat.supportedLanguagesDescription', 'Select which languages the AI chat assistant should support')}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center justify-between border rounded-md p-4">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">🇺🇸</span>
                            <span>English</span>
                          </div>
                          <Switch
                            checked={selectedLanguages['en'] || false}
                            onCheckedChange={() => toggleLanguage('en')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between border rounded-md p-4">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">🇦🇪</span>
                            <span>Arabic</span>
                          </div>
                          <Switch
                            checked={selectedLanguages['ar'] || false}
                            onCheckedChange={() => toggleLanguage('ar')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between border rounded-md p-4">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">🇫🇷</span>
                            <span>French</span>
                          </div>
                          <Switch
                            checked={selectedLanguages['fr'] || false}
                            onCheckedChange={() => toggleLanguage('fr')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between border rounded-md p-4">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">🇪🇸</span>
                            <span>Spanish</span>
                          </div>
                          <Switch
                            checked={selectedLanguages['es'] || false}
                            onCheckedChange={() => toggleLanguage('es')}
                          />
                        </div>
                      </div>
                      
                      <Button 
                        onClick={saveLanguageSettings} 
                        className="bg-primary text-white"
                        disabled={updateLanguageSettings.isPending}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {updateLanguageSettings.isPending ? t('common.saving') : t('common.saveChanges')}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.aiChat.status')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      {t('admin.aiChat.status')}
                    </span>
                    {settings.enabled ? (
                      <Badge className="bg-green-100 text-green-800 border-0">
                        {t('common.active')}
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 border-0">
                        {t('common.inactive')}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm text-gray-500">
                    {t('admin.aiChat.aiModel')}
                  </span>
                  <p className="font-medium">{settings.model}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm text-gray-500">
                    {t('admin.aiChat.operatingHours')}
                  </span>
                  {settings.active_hours.enabled ? (
                    <p className="font-medium">
                      {settings.active_hours.start_time} - {settings.active_hours.end_time} ({settings.active_hours.time_zone})
                    </p>
                  ) : (
                    <p className="font-medium">{t('admin.aiChat.alwaysAvailable', 'Always available')}</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm text-gray-500">
                    {t('admin.aiChat.supportedLanguages')}
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {settings.languages.filter(l => l.enabled).map(lang => (
                      <Badge key={lang.code} variant="outline">
                        {lang.code === 'en' ? 'English' : 
                         lang.code === 'ar' ? 'Arabic' :
                         lang.code === 'fr' ? 'French' :
                         lang.code === 'es' ? 'Spanish' : lang.code}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm text-gray-500">
                    {t('admin.aiChat.lastUpdated')}
                  </span>
                  <p className="font-medium">{formatDate(settings.updated_at)}</p>
                </div>
                
                <div className="pt-4 border-t">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      // In a real app, this would test the chat
                      toast({
                        title: t('admin.aiChat.testSuccessful'),
                        description: t('admin.aiChat.testSuccessfulDescription', 'The AI chat assistant is working correctly'),
                      });
                    }}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {t('admin.aiChat.testChat')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('admin.aiChat.statistics')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-xs font-medium text-blue-600 mb-1">{t('admin.aiChat.totalChats')}</h3>
                    <p className="text-xl font-bold">328</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-xs font-medium text-green-600 mb-1">{t('admin.aiChat.positiveFeedback')}</h3>
                    <p className="text-xl font-bold">92%</p>
                  </div>
                </div>
                
                <div className="text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">{t('admin.aiChat.chatSessionsToday')}</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">{t('admin.aiChat.avgSessionDuration')}</span>
                    <span className="font-medium">3.5 {t('common.minutes')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">{t('admin.aiChat.messagesPerSession')}</span>
                    <span className="font-medium">5.2</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">{t('admin.aiChat.topRequest')}</span>
                    <span className="font-medium">{t('admin.aiChat.flightBooking')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('admin.aiChat.conversationHistory')}</CardTitle>
          <CardDescription>
            {t('admin.aiChat.conversationHistoryDescription', 'View recent chat interactions and user feedback')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.aiChat.sessionId')}</TableHead>
                  <TableHead>{t('admin.aiChat.userMessage')}</TableHead>
                  <TableHead>{t('admin.aiChat.assistantResponse')}</TableHead>
                  <TableHead>{t('admin.aiChat.timestamp')}</TableHead>
                  <TableHead>{t('admin.aiChat.feedback')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.session_id}</TableCell>
                    <TableCell className="max-w-[250px] truncate">
                      {item.user_message}
                    </TableCell>
                    <TableCell className="max-w-[250px] truncate">
                      {item.assistant_message}
                    </TableCell>
                    <TableCell>{formatDate(item.created_at)}</TableCell>
                    <TableCell>
                      {item.user_feedback === 'positive' ? (
                        <Badge className="bg-green-100 text-green-800 border-0">
                          <Check className="h-3 w-3 mr-1" />
                          {t('admin.aiChat.positive')}
                        </Badge>
                      ) : item.user_feedback === 'negative' ? (
                        <Badge className="bg-red-100 text-red-800 border-0">
                          <X className="h-3 w-3 mr-1" />
                          {t('admin.aiChat.negative')}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};



export default AiChatSettingsPage;