import { useState } from 'react';
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
import { 
  Database, 
  Plus, 
  Edit2, 
  Trash2, 
  Key, 
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertTriangle
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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

// Sample API keys for the MVP
const mockApiKeys = [
  { 
    id: 1,
    provider: 'OpenAI',
    key: 'sk-**************************1234',
    active: true,
    createdAt: '2023-03-15T10:30:00Z',
    lastUsed: '2023-04-12T15:45:00Z'
  },
  { 
    id: 2,
    provider: 'Google Maps',
    key: 'AIza**************************5678',
    active: true,
    createdAt: '2023-01-20T09:15:00Z',
    lastUsed: '2023-04-10T11:20:00Z'
  },
  { 
    id: 3,
    provider: 'Stripe',
    key: 'sk_test_**************************abcd',
    active: false,
    createdAt: '2022-11-05T14:22:00Z',
    lastUsed: '2023-02-28T16:33:00Z'
  },
  { 
    id: 4,
    provider: 'Amadeus',
    key: 'amadeus_**************************efgh',
    active: true,
    createdAt: '2023-02-12T08:40:00Z',
    lastUsed: '2023-04-11T09:17:00Z'
  }
];

const apiKeyFormSchema = z.object({
  provider: z.string().min(1, { message: 'Provider name is required' }),
  key: z.string().min(10, { message: 'API key must be at least 10 characters' }),
  active: z.boolean().default(true)
});

const ApiManagementPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState<any>(null);
  const [revealKey, setRevealKey] = useState<{[key: number]: boolean}>({});
  
  // In a real app, this would be a fetch from the API
  const { data: apiKeys, isLoading, error } = useQuery({
    queryKey: ['/api/api-keys'],
    // Disabled for now, use mock data
    enabled: false,
  });
  
  const form = useForm<z.infer<typeof apiKeyFormSchema>>({
    resolver: zodResolver(apiKeyFormSchema),
    defaultValues: {
      provider: '',
      key: '',
      active: true,
    },
  });
  
  const editForm = useForm<z.infer<typeof apiKeyFormSchema>>({
    resolver: zodResolver(apiKeyFormSchema),
    defaultValues: {
      provider: '',
      key: '',
      active: true,
    },
  });
  
  // Mock mutations for MVP
  const createApiKey = useMutation({
    mutationFn: async (data: z.infer<typeof apiKeyFormSchema>) => {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ id: Date.now(), ...data, createdAt: new Date().toISOString(), lastUsed: null });
        }, 500);
      });
    },
    onSuccess: () => {
      toast({
        title: t('admin.apiManagement.success'),
        description: t('admin.apiManagement.apiKeyCreated', 'API key has been created successfully'),
      });
      setIsAddDialogOpen(false);
      form.reset();
      // In a real app, we would invalidate the query here
      // queryClient.invalidateQueries({ queryKey: ['/api/api-keys'] });
    }
  });
  
  const updateApiKey = useMutation({
    mutationFn: async (data: any) => {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ...selectedApiKey, ...data });
        }, 500);
      });
    },
    onSuccess: () => {
      toast({
        title: t('admin.apiManagement.success'),
        description: t('admin.apiManagement.apiKeyUpdated', 'API key has been updated successfully'),
      });
      setIsEditDialogOpen(false);
      editForm.reset();
      // In a real app, we would invalidate the query here
      // queryClient.invalidateQueries({ queryKey: ['/api/api-keys'] });
    }
  });
  
  const deleteApiKey = useMutation({
    mutationFn: async (id: number) => {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ id });
        }, 500);
      });
    },
    onSuccess: () => {
      toast({
        title: t('admin.apiManagement.success'),
        description: t('admin.apiManagement.apiKeyDeleted', 'API key has been deleted successfully'),
      });
      // In a real app, we would invalidate the query here
      // queryClient.invalidateQueries({ queryKey: ['/api/api-keys'] });
    }
  });
  
  const onSubmit = (data: z.infer<typeof apiKeyFormSchema>) => {
    createApiKey.mutate(data);
  };
  
  const onEditSubmit = (data: z.infer<typeof apiKeyFormSchema>) => {
    updateApiKey.mutate({ ...data, id: selectedApiKey.id });
  };
  
  const handleEdit = (apiKey: any) => {
    setSelectedApiKey(apiKey);
    editForm.reset({
      provider: apiKey.provider,
      key: apiKey.key,
      active: apiKey.active,
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (id: number) => {
    deleteApiKey.mutate(id);
  };
  
  const toggleRevealKey = (id: number) => {
    setRevealKey(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('common.copied'),
      description: t('admin.apiManagement.keyCopied', 'API key copied to clipboard'),
    });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  // For MVP, use mock data
  const displayApiKeys = apiKeys || mockApiKeys;
  
  return (
    <AdminLayout>
      <Helmet>
        <title>TravelEase - {t('admin.apiManagement.title')}</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {t('admin.apiManagement.title')}
          </h1>
          <p className="text-text-secondary">
            {t('admin.apiManagement.subtitle', 'Manage API keys and integrations')}
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white">
              <Plus className="mr-2 h-4 w-4" />
              {t('admin.apiManagement.addApiKey', 'Add API Key')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.apiManagement.addApiKey')}</DialogTitle>
              <DialogDescription>
                {t('admin.apiManagement.addApiKeyDescription', 'Add a new API key for integration with external services.')}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('admin.apiManagement.provider')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('admin.apiManagement.selectProvider', 'Select provider')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="OpenAI">OpenAI</SelectItem>
                          <SelectItem value="Google Maps">Google Maps</SelectItem>
                          <SelectItem value="Stripe">Stripe</SelectItem>
                          <SelectItem value="Amadeus">Amadeus</SelectItem>
                          <SelectItem value="Twilio">Twilio</SelectItem>
                          <SelectItem value="SendGrid">SendGrid</SelectItem>
                          <SelectItem value="Custom">{t('admin.apiManagement.custom', 'Custom')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('admin.apiManagement.apiKey')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder={t('admin.apiManagement.enterApiKey', 'Enter API key')} 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        {t('admin.apiManagement.apiKeySecure', 'Your API key will be stored securely.')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {t('admin.apiManagement.active')}
                        </FormLabel>
                        <FormDescription>
                          {t('admin.apiManagement.activeDescription', 'When disabled, this API key will not be used for any services.')}
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
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="bg-primary text-white"
                    disabled={createApiKey.isPending}
                  >
                    {createApiKey.isPending ? t('common.saving') : t('common.save')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.apiManagement.editApiKey')}</DialogTitle>
              <DialogDescription>
                {t('admin.apiManagement.editApiKeyDescription', 'Edit the API key details.')}
              </DialogDescription>
            </DialogHeader>
            
            {selectedApiKey && (
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
                  <FormField
                    control={editForm.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.apiManagement.provider')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('admin.apiManagement.selectProvider', 'Select provider')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="OpenAI">OpenAI</SelectItem>
                            <SelectItem value="Google Maps">Google Maps</SelectItem>
                            <SelectItem value="Stripe">Stripe</SelectItem>
                            <SelectItem value="Amadeus">Amadeus</SelectItem>
                            <SelectItem value="Twilio">Twilio</SelectItem>
                            <SelectItem value="SendGrid">SendGrid</SelectItem>
                            <SelectItem value="Custom">{t('admin.apiManagement.custom', 'Custom')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="key"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.apiManagement.apiKey')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder={t('admin.apiManagement.enterApiKey', 'Enter API key')} 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          {t('admin.apiManagement.apiKeySecure', 'Your API key will be stored securely.')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {t('admin.apiManagement.active')}
                          </FormLabel>
                          <FormDescription>
                            {t('admin.apiManagement.activeDescription', 'When disabled, this API key will not be used for any services.')}
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
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      className="bg-primary text-white"
                      disabled={updateApiKey.isPending}
                    >
                      {updateApiKey.isPending ? t('common.saving') : t('common.save')}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.apiManagement.apiKeys')}</CardTitle>
          <CardDescription>
            {t('admin.apiManagement.apiKeysDescription', 'Manage API keys for various service integrations')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {t('common.errorLoading', 'Error loading data. Please try again.')}
            </div>
          ) : (
            <Table>
              <TableCaption>{t('admin.apiManagement.tableCaption', 'List of API keys configured in the system.')}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.apiManagement.provider')}</TableHead>
                  <TableHead>{t('admin.apiManagement.apiKey')}</TableHead>
                  <TableHead>{t('admin.apiManagement.status')}</TableHead>
                  <TableHead>{t('admin.apiManagement.created')}</TableHead>
                  <TableHead>{t('admin.apiManagement.lastUsed')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayApiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Database className="h-4 w-4 mr-2 text-primary" />
                        {apiKey.provider}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="font-mono text-sm">
                          {revealKey[apiKey.id] ? apiKey.key : apiKey.key.substring(0, 4) + '**************************' + apiKey.key.slice(-4)}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toggleRevealKey(apiKey.id)}
                          title={revealKey[apiKey.id] ? t('admin.apiManagement.hideKey') : t('admin.apiManagement.showKey')}
                        >
                          {revealKey[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => copyToClipboard(apiKey.key)}
                          title={t('admin.apiManagement.copyKey')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {apiKey.active ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {t('admin.apiManagement.active')}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          {t('admin.apiManagement.inactive')}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(apiKey.createdAt)}</TableCell>
                    <TableCell>{apiKey.lastUsed ? formatDate(apiKey.lastUsed) : '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(apiKey)}
                          title={t('common.edit')}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              title={t('common.delete')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('admin.apiManagement.deleteApiKey')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('admin.apiManagement.deleteApiKeyConfirmation', 'Are you sure you want to delete this API key? This action cannot be undone.')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-500 text-white hover:bg-red-600"
                                onClick={() => handleDelete(apiKey.id)}
                              >
                                {t('common.delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {displayApiKeys.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      <Database className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>{t('admin.apiManagement.noApiKeys', 'No API keys found. Add your first API key to integrate with external services.')}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => setIsAddDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        {t('admin.apiManagement.addApiKey')}
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t('admin.apiManagement.services')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                OpenAI
                <Badge className="ml-2 bg-primary/10 text-primary border-0 font-normal">
                  {t('admin.apiManagement.configured')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">
                {t('admin.apiManagement.openaiDescription', 'Used for AI Chat functionality and translation services.')}
              </p>
              <p className="text-xs text-gray-500">
                {t('admin.apiManagement.lastUsed')}: {formatDate('2023-04-12T15:45:00Z')}
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full" onClick={() => handleEdit(mockApiKeys[0])}>
                {t('admin.apiManagement.manageKey')}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                Google Maps
                <Badge className="ml-2 bg-primary/10 text-primary border-0 font-normal">
                  {t('admin.apiManagement.configured')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">
                {t('admin.apiManagement.googleMapsDescription', 'Used for location services and mapping functionalities.')}
              </p>
              <p className="text-xs text-gray-500">
                {t('admin.apiManagement.lastUsed')}: {formatDate('2023-04-10T11:20:00Z')}
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full" onClick={() => handleEdit(mockApiKeys[1])}>
                {t('admin.apiManagement.manageKey')}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                Stripe
                <Badge className="ml-2 bg-gray-100 text-gray-700 border-0 font-normal">
                  {t('admin.apiManagement.inactive')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">
                {t('admin.apiManagement.stripeDescription', 'Used for payment processing and subscription management.')}
              </p>
              <p className="text-xs text-gray-500">
                {t('admin.apiManagement.lastUsed')}: {formatDate('2023-02-28T16:33:00Z')}
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full" onClick={() => handleEdit(mockApiKeys[2])}>
                {t('admin.apiManagement.manageKey')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ApiManagementPage;