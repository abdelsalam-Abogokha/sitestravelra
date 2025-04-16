import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/components/layout/AdminLayout';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
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
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Truck, 
  MessageSquare, 
  Search,
  AlertTriangle 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Sample shipping requests for the MVP
const mockShippingRequests = [
  {
    id: 'SH1234',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    origin: 'Dubai, UAE',
    destination: 'New York, USA',
    packageDetails: '2 boxes, 15kg total',
    requestDate: '2023-07-10T14:30:00Z',
    status: 'processing',
    estimatedDelivery: '2023-07-18T00:00:00Z'
  },
  {
    id: 'SH1235',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    origin: 'London, UK',
    destination: 'Dubai, UAE',
    packageDetails: '1 box, 8kg',
    requestDate: '2023-07-12T09:15:00Z',
    status: 'confirmed',
    estimatedDelivery: '2023-07-16T00:00:00Z'
  },
  {
    id: 'SH1236',
    customerName: 'Ahmed Ali',
    customerEmail: 'ahmed.ali@example.com',
    origin: 'Cairo, Egypt',
    destination: 'Riyadh, Saudi Arabia',
    packageDetails: '3 boxes, 22kg total',
    requestDate: '2023-07-14T11:45:00Z',
    status: 'in_transit',
    estimatedDelivery: '2023-07-19T00:00:00Z'
  },
  {
    id: 'SH1237',
    customerName: 'Michael Chen',
    customerEmail: 'michael.c@example.com',
    origin: 'Singapore',
    destination: 'Hong Kong',
    packageDetails: '1 box, 5kg',
    requestDate: '2023-07-08T10:00:00Z',
    status: 'delivered',
    estimatedDelivery: '2023-07-13T00:00:00Z',
    deliveryDate: '2023-07-12T16:45:00Z'
  }
];

// Sample translation requests for the MVP
const mockTranslationRequests = [
  {
    id: 'TR1234',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    sourceLanguage: 'English',
    targetLanguage: 'Arabic',
    documentType: 'Legal Document',
    wordCount: 1200,
    requestDate: '2023-07-11T15:30:00Z',
    status: 'processing',
    estimatedCompletion: '2023-07-16T00:00:00Z'
  },
  {
    id: 'TR1235',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@example.com',
    sourceLanguage: 'French',
    targetLanguage: 'English',
    documentType: 'Business Contract',
    wordCount: 3500,
    requestDate: '2023-07-09T11:15:00Z',
    status: 'completed',
    estimatedCompletion: '2023-07-15T00:00:00Z',
    completionDate: '2023-07-14T14:20:00Z'
  },
  {
    id: 'TR1236',
    customerName: 'Mohammed Al-Farsi',
    customerEmail: 'mohammed.f@example.com',
    sourceLanguage: 'Arabic',
    targetLanguage: 'English',
    documentType: 'Personal Document',
    wordCount: 800,
    requestDate: '2023-07-13T09:45:00Z',
    status: 'pending',
    estimatedCompletion: '2023-07-17T00:00:00Z'
  },
  {
    id: 'TR1237',
    customerName: 'Laura Garcia',
    customerEmail: 'laura.g@example.com',
    sourceLanguage: 'Spanish',
    targetLanguage: 'French',
    documentType: 'Academic Document',
    wordCount: 2200,
    requestDate: '2023-07-07T10:30:00Z',
    status: 'completed',
    estimatedCompletion: '2023-07-12T00:00:00Z',
    completionDate: '2023-07-11T16:15:00Z'
  }
];

const ShippingTranslationPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('shipping');
  const [searchTerm, setSearchTerm] = useState('');
  
  // In a real app, this would be a fetch from the API
  const { data: shippingRequests, isLoading: isShippingLoading, error: shippingError } = useQuery({
    queryKey: ['/api/admin/shipping-requests'],
    // Disabled for now, use mock data
    enabled: false,
  });
  
  const { data: translationRequests, isLoading: isTranslationLoading, error: translationError } = useQuery({
    queryKey: ['/api/admin/translation-requests'],
    // Disabled for now, use mock data
    enabled: false,
  });
  
  // For MVP, use mock data
  const shippingData = shippingRequests || mockShippingRequests;
  const translationData = translationRequests || mockTranslationRequests;
  
  // Filter data based on search term
  const filteredShippingRequests = shippingData.filter(request => {
    if (
      searchTerm &&
      !request.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !request.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !request.origin.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !request.destination.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });
  
  const filteredTranslationRequests = translationData.filter(request => {
    if (
      searchTerm &&
      !request.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !request.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !request.sourceLanguage.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !request.targetLanguage.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !request.documentType.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const getShippingStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-0">{t('admin.shipping.processing')}</Badge>;
      case 'confirmed':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-0">{t('admin.shipping.confirmed')}</Badge>;
      case 'in_transit':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0">{t('admin.shipping.inTransit')}</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0">{t('admin.shipping.delivered')}</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-0">{status}</Badge>;
    }
  };
  
  const getTranslationStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0">{t('admin.translation.pending')}</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-0">{t('admin.translation.processing')}</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0">{t('admin.translation.completed')}</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-0">{status}</Badge>;
    }
  };
  
  return (
    <AdminLayout>
      <Helmet>
        <title>TravelEase - {t('admin.shippingTranslation.title', 'Shipping & Translation')}</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {t('admin.shippingTranslation.title', 'Shipping & Translation')}
          </h1>
          <p className="text-text-secondary">
            {t('admin.shippingTranslation.subtitle', 'Manage shipping and translation requests')}
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <Tabs defaultValue="shipping" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="shipping">
                <Truck className="h-4 w-4 mr-2" />
                {t('admin.shipping.title', 'Shipping')}
              </TabsTrigger>
              <TabsTrigger value="translation">
                <MessageSquare className="h-4 w-4 mr-2" />
                {t('admin.translation.title', 'Translation')}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6 w-full md:w-1/3">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder={activeTab === 'shipping' ? t('admin.shipping.searchPlaceholder', 'Search shipping requests...') : t('admin.translation.searchPlaceholder', 'Search translation requests...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <TabsContent value="shipping">
            {isShippingLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : shippingError ? (
              <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {t('common.errorLoading', 'Error loading data. Please try again.')}
              </div>
            ) : filteredShippingRequests.length === 0 ? (
              <div className="text-center py-12">
                <Truck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">{t('admin.shipping.noRequestsFound')}</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {t('admin.shipping.noRequestsFoundDescription', 'No shipping requests match your search criteria. Try adjusting your search term.')}
                </p>
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  {t('admin.shipping.clearSearch')}
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('admin.shipping.requestId')}</TableHead>
                      <TableHead>{t('admin.shipping.customer')}</TableHead>
                      <TableHead>{t('admin.shipping.route')}</TableHead>
                      <TableHead>{t('admin.shipping.details')}</TableHead>
                      <TableHead>{t('admin.shipping.status')}</TableHead>
                      <TableHead>{t('admin.shipping.requestDate')}</TableHead>
                      <TableHead>{t('admin.shipping.estimatedDelivery')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShippingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.customerName}</p>
                            <p className="text-xs text-gray-500">{request.customerEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">{t('admin.shipping.from')}:</span> {request.origin}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">{t('admin.shipping.to')}:</span> {request.destination}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{request.packageDetails}</TableCell>
                        <TableCell>{getShippingStatusBadge(request.status)}</TableCell>
                        <TableCell>{formatDate(request.requestDate)}</TableCell>
                        <TableCell>{formatDate(request.estimatedDelivery)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="translation">
            {isTranslationLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : translationError ? (
              <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {t('common.errorLoading', 'Error loading data. Please try again.')}
              </div>
            ) : filteredTranslationRequests.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">{t('admin.translation.noRequestsFound')}</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {t('admin.translation.noRequestsFoundDescription', 'No translation requests match your search criteria. Try adjusting your search term.')}
                </p>
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  {t('admin.translation.clearSearch')}
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('admin.translation.requestId')}</TableHead>
                      <TableHead>{t('admin.translation.customer')}</TableHead>
                      <TableHead>{t('admin.translation.languages')}</TableHead>
                      <TableHead>{t('admin.translation.documentType')}</TableHead>
                      <TableHead>{t('admin.translation.wordCount')}</TableHead>
                      <TableHead>{t('admin.translation.status')}</TableHead>
                      <TableHead>{t('admin.translation.requestDate')}</TableHead>
                      <TableHead>{t('admin.translation.estimatedCompletion')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTranslationRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.customerName}</p>
                            <p className="text-xs text-gray-500">{request.customerEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">{t('admin.translation.from')}:</span> {request.sourceLanguage}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">{t('admin.translation.to')}:</span> {request.targetLanguage}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{request.documentType}</TableCell>
                        <TableCell>{request.wordCount}</TableCell>
                        <TableCell>{getTranslationStatusBadge(request.status)}</TableCell>
                        <TableCell>{formatDate(request.requestDate)}</TableCell>
                        <TableCell>{formatDate(request.estimatedCompletion)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.shipping.overview', 'Shipping Overview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-600 mb-1">{t('admin.shipping.totalRequests')}</h3>
                  <p className="text-2xl font-bold">158</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-600 mb-1">{t('admin.shipping.onTimeDelivery')}</h3>
                  <p className="text-2xl font-bold">96%</p>
                </div>
              </div>
              
              <div className="text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">{t('admin.shipping.pendingRequests')}</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">{t('admin.shipping.inTransit')}</span>
                  <span className="font-medium">42</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">{t('admin.shipping.deliveredThisMonth')}</span>
                  <span className="font-medium">76</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">{t('admin.shipping.topDestination')}</span>
                  <span className="font-medium">London, UK</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.translation.overview', 'Translation Overview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-600 mb-1">{t('admin.translation.totalRequests')}</h3>
                  <p className="text-2xl font-bold">219</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-amber-600 mb-1">{t('admin.translation.avgCompletionTime')}</h3>
                  <p className="text-2xl font-bold">2.3 {t('common.days')}</p>
                </div>
              </div>
              
              <div className="text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">{t('admin.translation.pendingRequests')}</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">{t('admin.translation.inProgress')}</span>
                  <span className="font-medium">32</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">{t('admin.translation.completedThisMonth')}</span>
                  <span className="font-medium">65</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">{t('admin.translation.topLanguagePair')}</span>
                  <span className="font-medium">Arabic → English</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ShippingTranslationPage;