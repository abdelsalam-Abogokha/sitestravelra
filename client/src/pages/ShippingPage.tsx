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
import { Truck, Package, MapPin, Weight, FileUp, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const shippingFormSchema = z.object({
  origin: z.string().min(1, { message: 'Origin is required' }),
  destination: z.string().min(1, { message: 'Destination is required' }),
  weight: z.string().min(1, { message: 'Weight is required' }),
  dimensions: z.string().min(1, { message: 'Dimensions are required' }),
  shippingType: z.string().min(1, { message: 'Shipping type is required' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
});

interface ShippingRequest {
  id: string;
  origin: string;
  destination: string;
  status: string;
  trackingNumber: string;
  createdAt: string;
  estimatedDelivery: string;
}

// Sample shipping requests for tracking tab
const mockShippingRequests: ShippingRequest[] = [
  {
    id: 'SH12345',
    origin: 'New York, USA',
    destination: 'Dubai, UAE',
    status: 'in_transit',
    trackingNumber: 'TR-987654',
    createdAt: '2023-07-10',
    estimatedDelivery: '2023-07-18'
  },
  {
    id: 'SH12346',
    origin: 'London, UK',
    destination: 'Cairo, Egypt',
    status: 'delivered',
    trackingNumber: 'TR-123456',
    createdAt: '2023-06-20',
    estimatedDelivery: '2023-06-28',
  },
  {
    id: 'SH12347',
    origin: 'Berlin, Germany',
    destination: 'Riyadh, Saudi Arabia',
    status: 'processing',
    trackingNumber: 'TR-567890',
    createdAt: '2023-07-15',
    estimatedDelivery: '2023-07-25',
  }
];

const ShippingPage = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('request');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResults, setTrackingResults] = useState<ShippingRequest | null>(null);
  
  const form = useForm<z.infer<typeof shippingFormSchema>>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      origin: '',
      destination: '',
      weight: '',
      dimensions: '',
      shippingType: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });
  
  const onSubmit = (values: z.infer<typeof shippingFormSchema>) => {
    // In a real app, this would be an API call
    console.log('Shipping request:', values);
    
    toast({
      title: t('success', 'Success'),
      description: 'Your shipping request has been submitted successfully!',
    });
    
    // Reset form
    form.reset();
    setActiveTab('track');
  };
  
  const handleTrackShipment = () => {
    if (!trackingNumber.trim()) {
      toast({
        title: t('error', 'Error'),
        description: 'Please enter a tracking number',
        variant: 'destructive',
      });
      return;
    }
    
    // Simulate a tracking lookup
    setIsTracking(true);
    setTimeout(() => {
      const result = mockShippingRequests.find(req => req.trackingNumber === trackingNumber);
      
      setTrackingResults(result || null);
      setIsTracking(false);
      
      if (!result) {
        toast({
          title: t('error', 'Error'),
          description: 'Tracking number not found. Please check and try again.',
          variant: 'destructive',
        });
      }
    }, 1500);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'in_transit':
        return <Truck className="h-5 w-5 text-amber-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return t('shipping.statusProcessing', 'Processing');
      case 'in_transit':
        return t('shipping.statusInTransit', 'In Transit');
      case 'delivered':
        return t('shipping.statusDelivered', 'Delivered');
      case 'failed':
        return t('shipping.statusFailed', 'Failed');
      default:
        return status;
    }
  };

  return (
    <UserLayout>
      <Helmet>
        <title>TravelEase - {t('shipping.title', 'Shipping Services')}</title>
        <meta name="description" content="Ship packages internationally with our reliable shipping services. Fast and secure." />
      </Helmet>
      
      <div className="bg-primary/10 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center font-poppins">
            {t('shipping.title', 'Shipping Services')}
          </h1>
          
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="request">{t('shipping.requestQuote', 'Request Quote')}</TabsTrigger>
                <TabsTrigger value="track">{t('shipping.trackShipment', 'Track Shipment')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="request" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('shipping.requestShipping', 'Request Shipping')}</CardTitle>
                    <CardDescription>
                      {t('shipping.requestDescription', 'Fill out the form below to get a shipping quote. We offer international shipping to most countries.')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">{t('shipping.shipmentDetails', 'Shipment Details')}</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="origin"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('shipping.origin', 'Origin')}</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                      <Input className="pl-10" placeholder="City, Country" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="destination"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('shipping.destination', 'Destination')}</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                      <Input className="pl-10" placeholder="City, Country" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                              control={form.control}
                              name="weight"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('shipping.weight', 'Weight (kg)')}</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Weight className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                      <Input type="number" className="pl-10" placeholder="0.5" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="dimensions"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('shipping.dimensions', 'Dimensions (cm)')}</FormLabel>
                                  <FormControl>
                                    <Input placeholder="L x W x H" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="shippingType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('shipping.type', 'Type')}</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder={t('shipping.selectType', 'Select shipping type')} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="documents">
                                        {t('shipping.documents', 'Documents')}
                                      </SelectItem>
                                      <SelectItem value="package">
                                        {t('shipping.package', 'Package')}
                                      </SelectItem>
                                      <SelectItem value="fragile">
                                        {t('shipping.fragile', 'Fragile Items')}
                                      </SelectItem>
                                      <SelectItem value="heavy">
                                        {t('shipping.heavy', 'Heavy Freight')}
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">{t('shipping.contactInformation', 'Contact Information')}</h3>
                          
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
                            {t('shipping.requestQuote', 'Request Quote')}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="track" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('shipping.trackYourShipment', 'Track Your Shipment')}</CardTitle>
                    <CardDescription>
                      {t('shipping.trackDescription', 'Enter your tracking number to get real-time updates on your shipment.')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Package className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          className="pl-10"
                          placeholder={t('shipping.trackingNumber', 'Tracking Number')}
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                        />
                      </div>
                      <Button 
                        onClick={handleTrackShipment} 
                        disabled={isTracking}
                        className="bg-primary text-white"
                      >
                        {isTracking ? (
                          <span className="flex items-center">
                            <i className="animate-spin mr-2">⟳</i> {t('common.loading', 'Loading...')}
                          </span>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            {t('shipping.track', 'Track')}
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {trackingResults && (
                      <div className="mt-8 p-6 border rounded-lg">
                        <div className="flex items-center mb-4">
                          {getStatusIcon(trackingResults.status)}
                          <span className="ml-2 text-lg font-medium">
                            {getStatusText(trackingResults.status)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">{t('shipping.origin')}</p>
                            <p className="font-medium">{trackingResults.origin}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{t('shipping.destination')}</p>
                            <p className="font-medium">{trackingResults.destination}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{t('shipping.trackingNumber')}</p>
                            <p className="font-medium">{trackingResults.trackingNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{t('shipping.estimatedDelivery')}</p>
                            <p className="font-medium">{trackingResults.estimatedDelivery}</p>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="font-medium mb-2">{t('shipping.shipmentHistory')}</h4>
                          
                          <ul className="space-y-4">
                            {trackingResults.status === 'delivered' && (
                              <li className="flex">
                                <div className="mr-4 flex items-center">
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                  <p className="font-medium">{t('shipping.delivered')}</p>
                                  <p className="text-sm text-gray-500">
                                    {trackingResults.estimatedDelivery} 14:30
                                  </p>
                                </div>
                              </li>
                            )}
                            
                            {(trackingResults.status === 'in_transit' || trackingResults.status === 'delivered') && (
                              <li className="flex">
                                <div className="mr-4 flex items-center">
                                  <Truck className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                  <p className="font-medium">{t('shipping.inTransit')}</p>
                                  <p className="text-sm text-gray-500">
                                    {trackingResults.createdAt} 10:15
                                  </p>
                                </div>
                              </li>
                            )}
                            
                            <li className="flex">
                              <div className="mr-4 flex items-center">
                                <Package className="h-5 w-5 text-blue-500" />
                              </div>
                              <div>
                                <p className="font-medium">{t('shipping.received')}</p>
                                <p className="text-sm text-gray-500">
                                  {trackingResults.createdAt} 08:20
                                </p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    {isAuthenticated && (
                      <div className="mt-8">
                        <h3 className="text-lg font-medium mb-4">{t('shipping.yourShipments')}</h3>
                        
                        <div className="space-y-4">
                          {mockShippingRequests.map((request) => (
                            <div 
                              key={request.id} 
                              className="p-4 border rounded-lg cursor-pointer hover:bg-primary/5"
                              onClick={() => {
                                setTrackingNumber(request.trackingNumber);
                                handleTrackShipment();
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  {getStatusIcon(request.status)}
                                  <div className="ml-3">
                                    <p className="font-medium">
                                      {request.origin} → {request.destination}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {request.trackingNumber}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium">
                                    {getStatusText(request.status)}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {request.estimatedDelivery}
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

export default ShippingPage;