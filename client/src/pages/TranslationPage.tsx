import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth';
import UserLayout from '@/components/layout/UserLayout';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
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
import { FileUp, Globe, CheckCircle, Clock, AlertCircle, FileText, Search } from 'lucide-react';

const translationFormSchema = z.object({
  sourceLanguage: z.string().min(1, { message: 'Source language is required' }),
  targetLanguage: z.string().min(1, { message: 'Target language is required' }),
  documentType: z.string().min(1, { message: 'Document type is required' }),
  isUrgent: z.boolean().optional(),
  isCertified: z.boolean().optional(),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
});

interface TranslationRequest {
  id: string;
  sourceLanguage: string;
  targetLanguage: string;
  documentType: string;
  status: string;
  requestId: string;
  createdAt: string;
  estimatedCompletion: string;
}

// Sample translation requests data
const mockTranslationRequests: TranslationRequest[] = [
  {
    id: 'TR12345',
    sourceLanguage: 'English',
    targetLanguage: 'Arabic',
    documentType: 'Legal Document',
    status: 'in_progress',
    requestId: 'REQ-987654',
    createdAt: '2023-07-05',
    estimatedCompletion: '2023-07-10'
  },
  {
    id: 'TR12346',
    sourceLanguage: 'Arabic',
    targetLanguage: 'French',
    documentType: 'Business Contract',
    status: 'completed',
    requestId: 'REQ-123456',
    createdAt: '2023-06-15',
    estimatedCompletion: '2023-06-20',
  },
  {
    id: 'TR12347',
    sourceLanguage: 'English',
    targetLanguage: 'Spanish',
    documentType: 'Personal Document',
    status: 'submitted',
    requestId: 'REQ-567890',
    createdAt: '2023-07-08',
    estimatedCompletion: '2023-07-15',
  }
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
  { value: 'de', label: 'German' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ru', label: 'Russian' },
];

const documentTypes = [
  { value: 'legal', label: 'Legal Document' },
  { value: 'business', label: 'Business Document' },
  { value: 'academic', label: 'Academic Document' },
  { value: 'personal', label: 'Personal Document' },
  { value: 'medical', label: 'Medical Document' },
  { value: 'technical', label: 'Technical Manual' },
];

const TranslationPage = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('request');
  const [requestId, setRequestId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<TranslationRequest | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const form = useForm<z.infer<typeof translationFormSchema>>({
    resolver: zodResolver(translationFormSchema),
    defaultValues: {
      sourceLanguage: '',
      targetLanguage: '',
      documentType: '',
      isUrgent: false,
      isCertified: false,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const onSubmit = (values: z.infer<typeof translationFormSchema>) => {
    // Check if file is uploaded
    if (!selectedFile) {
      toast({
        title: t('error', 'Error'),
        description: 'Please upload a document for translation',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real app, this would be an API call
    console.log('Translation request:', values);
    console.log('File:', selectedFile);
    
    toast({
      title: t('success', 'Success'),
      description: 'Your translation request has been submitted successfully!',
    });
    
    // Reset form
    form.reset();
    setSelectedFile(null);
    setActiveTab('status');
  };
  
  const handleSearchRequest = () => {
    if (!requestId.trim()) {
      toast({
        title: t('error', 'Error'),
        description: 'Please enter a request ID',
        variant: 'destructive',
      });
      return;
    }
    
    // Simulate a request search
    setIsSearching(true);
    setTimeout(() => {
      const result = mockTranslationRequests.find(req => req.requestId === requestId);
      
      setSearchResults(result || null);
      setIsSearching(false);
      
      if (!result) {
        toast({
          title: t('error', 'Error'),
          description: 'Request ID not found. Please check and try again.',
          variant: 'destructive',
        });
      }
    }, 1500);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted':
        return t('translation.statusSubmitted', 'Submitted');
      case 'in_progress':
        return t('translation.statusInProgress', 'In Progress');
      case 'completed':
        return t('translation.statusCompleted', 'Completed');
      case 'rejected':
        return t('translation.statusRejected', 'Rejected');
      default:
        return status;
    }
  };

  return (
    <UserLayout>
      <Helmet>
        <title>TravelEase - {t('translation.title', 'Translation Services')}</title>
        <meta name="description" content="Professional and certified translation services in multiple languages." />
      </Helmet>
      
      <div className="bg-primary/10 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center font-poppins">
            {t('translation.title', 'Translation Services')}
          </h1>
          
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="request">{t('translation.requestTranslation', 'Request Translation')}</TabsTrigger>
                <TabsTrigger value="status">{t('translation.checkStatus', 'Check Status')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="request" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('translation.requestTranslation')}</CardTitle>
                    <CardDescription>
                      {t('translation.requestDescription', 'Fill out the form below to request a document translation. We offer certified translations for official documents.')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">{t('translation.documentInformation', 'Document Information')}</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="sourceLanguage"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('translation.sourceLanguage', 'Source Language')}</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder={t('translation.selectLanguage', 'Select Language')} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {languages.map((language) => (
                                        <SelectItem key={language.value} value={language.value}>
                                          {language.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="targetLanguage"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('translation.targetLanguage', 'Target Language')}</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder={t('translation.selectLanguage', 'Select Language')} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {languages.map((language) => (
                                        <SelectItem key={language.value} value={language.value}>
                                          {language.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="documentType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('translation.documentType', 'Document Type')}</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={t('translation.selectDocumentType', 'Select Document Type')} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {documentTypes.map((docType) => (
                                      <SelectItem key={docType.value} value={docType.value}>
                                        {docType.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="isCertified"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <input
                                      type="checkbox"
                                      checked={field.value}
                                      onChange={field.onChange}
                                      className="h-4 w-4 text-primary focus:ring-primary"
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>
                                      {t('translation.certified', 'Certified Translation')}
                                    </FormLabel>
                                    <FormDescription>
                                      {t('translation.certifiedDescription', 'Required for legal documents')}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="isUrgent"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <input
                                      type="checkbox"
                                      checked={field.value}
                                      onChange={field.onChange}
                                      className="h-4 w-4 text-primary focus:ring-primary"
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>
                                      {t('translation.expressDelivery', 'Express Delivery')}
                                    </FormLabel>
                                    <FormDescription>
                                      {t('translation.expressDeliveryDescription', '24-48 hour turnaround (additional charges apply)')}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="document" className="block text-sm font-medium mb-1">
                              {t('translation.uploadDocument', 'Upload Document')}
                            </Label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                              <div className="space-y-1 text-center">
                                <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none"
                                  >
                                    <span>{t('translation.uploadFile', 'Upload a file')}</span>
                                    <input
                                      id="file-upload"
                                      name="file-upload"
                                      type="file"
                                      className="sr-only"
                                      onChange={handleFileChange}
                                    />
                                  </label>
                                  <p className="pl-1">{t('translation.dragDrop', 'or drag and drop')}</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {t('translation.allowedFormats', 'PDF, DOCX, TXT up to 10MB')}
                                </p>
                                {selectedFile && (
                                  <p className="mt-2 text-sm text-primary">
                                    {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">{t('translation.contactInformation', 'Contact Information')}</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('common.firstName', 'First Name')}</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('common.lastName', 'Last Name')}</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
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
                                  <FormLabel>{t('common.email', 'Email')}</FormLabel>
                                  <FormControl>
                                    <Input type="email" {...field} />
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
                                  <FormLabel>{t('common.phone', 'Phone')}</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-center mt-6">
                          <Button type="submit" className="bg-primary text-white px-8 py-6">
                            {t('translation.submitRequest', 'Submit Request')}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="status" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('translation.checkRequestStatus', 'Check Request Status')}</CardTitle>
                    <CardDescription>
                      {t('translation.checkStatusDescription', 'Enter your request ID to check the status of your translation request.')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          className="pl-10"
                          placeholder={t('translation.requestId', 'Request ID')}
                          value={requestId}
                          onChange={(e) => setRequestId(e.target.value)}
                        />
                      </div>
                      <Button 
                        onClick={handleSearchRequest} 
                        disabled={isSearching}
                        className="bg-primary text-white"
                      >
                        {isSearching ? (
                          <span className="flex items-center">
                            <i className="animate-spin mr-2">⟳</i> {t('common.loading', 'Loading...')}
                          </span>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            {t('translation.search', 'Search')}
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {searchResults && (
                      <div className="mt-8 p-6 border rounded-lg">
                        <div className="flex items-center mb-4">
                          {getStatusIcon(searchResults.status)}
                          <span className="ml-2 text-lg font-medium">
                            {getStatusText(searchResults.status)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">{t('translation.sourceLanguage')}</p>
                            <p className="font-medium">{searchResults.sourceLanguage}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{t('translation.targetLanguage')}</p>
                            <p className="font-medium">{searchResults.targetLanguage}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{t('translation.documentType')}</p>
                            <p className="font-medium">{searchResults.documentType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{t('translation.requestId')}</p>
                            <p className="font-medium">{searchResults.requestId}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{t('translation.submissionDate')}</p>
                            <p className="font-medium">{searchResults.createdAt}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{t('translation.estimatedCompletion')}</p>
                            <p className="font-medium">{searchResults.estimatedCompletion}</p>
                          </div>
                        </div>
                        
                        {searchResults.status === 'completed' && (
                          <div className="mt-6">
                            <Button className="bg-primary text-white">
                              <FileText className="mr-2 h-4 w-4" />
                              {t('translation.downloadTranslation', 'Download Translation')}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {isAuthenticated && (
                      <div className="mt-8">
                        <h3 className="text-lg font-medium mb-4">{t('translation.yourRequests')}</h3>
                        
                        <div className="space-y-4">
                          {mockTranslationRequests.map((request) => (
                            <div 
                              key={request.id} 
                              className="p-4 border rounded-lg cursor-pointer hover:bg-primary/5"
                              onClick={() => {
                                setRequestId(request.requestId);
                                handleSearchRequest();
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  {getStatusIcon(request.status)}
                                  <div className="ml-3">
                                    <p className="font-medium">
                                      {request.sourceLanguage} → {request.targetLanguage}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {request.documentType}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium">
                                    {getStatusText(request.status)}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {request.estimatedCompletion}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default TranslationPage;