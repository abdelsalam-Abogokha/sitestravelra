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
import { Button } from '@/components/ui/button';
import { 
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  AlertTriangle,
  ArrowUpDown,
  LineChart
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

// Sample booking data for the MVP
const mockBookingStats = {
  totalBookings: 583,
  bookingsThisMonth: 78,
  revenueTotal: 215450,
  revenueThisMonth: 37200,
  averageBookingValue: 370,
  topDestinations: [
    { destination: 'Dubai, UAE', count: 89, percentage: 15.3 },
    { destination: 'London, UK', count: 67, percentage: 11.5 },
    { destination: 'Paris, France', count: 58, percentage: 10.0 },
    { destination: 'Bali, Indonesia', count: 52, percentage: 8.9 },
    { destination: 'Bangkok, Thailand', count: 47, percentage: 8.1 }
  ],
  monthlyBookings: [
    { month: 'Jan', count: 42, revenue: 15400 },
    { month: 'Feb', count: 38, revenue: 14200 },
    { month: 'Mar', count: 45, revenue: 16800 },
    { month: 'Apr', count: 56, revenue: 21000 },
    { month: 'May', count: 62, revenue: 23500 },
    { month: 'Jun', count: 78, revenue: 28900 },
    { month: 'Jul', count: 92, revenue: 34200 },
    { month: 'Aug', count: 85, revenue: 31500 },
    { month: 'Sep', count: 67, revenue: 24800 },
    { month: 'Oct', count: 58, revenue: 21600 },
    { month: 'Nov', count: 45, revenue: 16700 },
    { month: 'Dec', count: 51, revenue: 19000 }
  ],
  serviceDistribution: [
    { service: 'Flights', count: 210, percentage: 36.0 },
    { service: 'Hotels', count: 175, percentage: 30.0 },
    { service: 'Packages', count: 120, percentage: 20.6 },
    { service: 'Visas', count: 48, percentage: 8.2 },
    { service: 'Other Services', count: 30, percentage: 5.2 }
  ]
};

// Sample user data for the MVP
const mockUserStats = {
  totalUsers: 1248,
  newUsersThisMonth: 87,
  activeUsers: 845,
  userRetentionRate: 68,
  usersByCountry: [
    { country: 'United Arab Emirates', count: 432, percentage: 34.6 },
    { country: 'Saudi Arabia', count: 287, percentage: 23.0 },
    { country: 'United Kingdom', count: 156, percentage: 12.5 },
    { country: 'United States', count: 145, percentage: 11.6 },
    { country: 'India', count: 98, percentage: 7.9 },
    { country: 'Other Countries', count: 130, percentage: 10.4 }
  ],
  monthlySignups: [
    { month: 'Jan', count: 65 },
    { month: 'Feb', count: 58 },
    { month: 'Mar', count: 72 },
    { month: 'Apr', count: 78 },
    { month: 'May', count: 82 },
    { month: 'Jun', count: 90 },
    { month: 'Jul', count: 105 },
    { month: 'Aug', count: 95 },
    { month: 'Sep', count: 87 },
    { month: 'Oct', count: 78 },
    { month: 'Nov', count: 68 },
    { month: 'Dec', count: 75 }
  ],
  deviceDistribution: [
    { device: 'Mobile', count: 724, percentage: 58.0 },
    { device: 'Desktop', count: 415, percentage: 33.3 },
    { device: 'Tablet', count: 109, percentage: 8.7 }
  ]
};

const ReportsPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('bookings');
  const [timeRange, setTimeRange] = useState('12months');
  
  // In a real app, these would be real queries
  const { data: bookingStats, isLoading: isBookingLoading, error: bookingError } = useQuery({
    queryKey: ['/api/admin/reports/bookings', timeRange],
    // Disabled for now, use mock data
    enabled: false,
  });
  
  const { data: userStats, isLoading: isUserLoading, error: userError } = useQuery({
    queryKey: ['/api/admin/reports/users', timeRange],
    // Disabled for now, use mock data
    enabled: false,
  });
  
  // For MVP, use mock data
  const bookingData = bookingStats || mockBookingStats;
  const userData = userStats || mockUserStats;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '30days':
        return t('admin.reports.last30Days');
      case '90days':
        return t('admin.reports.last90Days');
      case '6months':
        return t('admin.reports.last6Months');
      case '12months':
      default:
        return t('admin.reports.last12Months');
    }
  };
  
  return (
    <AdminLayout>
      <Helmet>
        <title>TravelEase - {t('admin.reports.title')}</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {t('admin.reports.title')}
          </h1>
          <p className="text-text-secondary">
            {t('admin.reports.subtitle', 'View analytics and reports for your business')}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('admin.reports.selectTimeRange')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">{t('admin.reports.last30Days')}</SelectItem>
              <SelectItem value="90days">{t('admin.reports.last90Days')}</SelectItem>
              <SelectItem value="6months">{t('admin.reports.last6Months')}</SelectItem>
              <SelectItem value="12months">{t('admin.reports.last12Months')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t('admin.reports.export')}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="bookings" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="bookings">
            <Calendar className="h-4 w-4 mr-2" />
            {t('admin.reports.bookings')}
          </TabsTrigger>
          <TabsTrigger value="users">
            <BarChart3 className="h-4 w-4 mr-2" />
            {t('admin.reports.users')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings">
          {isBookingLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-[100px] w-full rounded-lg" />
                <Skeleton className="h-[100px] w-full rounded-lg" />
                <Skeleton className="h-[100px] w-full rounded-lg" />
              </div>
            </div>
          ) : bookingError ? (
            <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {t('common.errorLoading', 'Error loading data. Please try again.')}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {t('admin.reports.totalBookings')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{bookingData.totalBookings}</div>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      +{bookingData.bookingsThisMonth} {t('admin.reports.thisMonth')}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {t('admin.reports.totalRevenue')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(bookingData.revenueTotal)}</div>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      {formatCurrency(bookingData.revenueThisMonth)} {t('admin.reports.thisMonth')}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {t('admin.reports.averageBookingValue')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(bookingData.averageBookingValue)}</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('admin.reports.monthlyBookings')}</CardTitle>
                    <CardDescription>
                      {getTimeRangeLabel()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full bg-gray-50 rounded-lg flex items-center justify-center">
                      <LineChart className="h-16 w-16 text-gray-300" />
                      {/* This would be a real chart in a production app */}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{t('admin.reports.bookingsByService')}</CardTitle>
                    <CardDescription>
                      {t('admin.reports.distribution')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full bg-gray-50 rounded-lg flex items-center justify-center">
                      <PieChart className="h-16 w-16 text-gray-300" />
                      {/* This would be a real chart in a production app */}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.reports.topDestinations')}</CardTitle>
                  <CardDescription>
                    {t('admin.reports.mostBookedDestinations')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookingData.topDestinations.map((destination, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{destination.destination}</span>
                          <span className="text-sm text-gray-500">
                            {destination.count} ({destination.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${destination.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="users">
          {isUserLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-[100px] w-full rounded-lg" />
                <Skeleton className="h-[100px] w-full rounded-lg" />
                <Skeleton className="h-[100px] w-full rounded-lg" />
              </div>
            </div>
          ) : userError ? (
            <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {t('common.errorLoading', 'Error loading data. Please try again.')}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {t('admin.reports.totalUsers')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userData.totalUsers}</div>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      +{userData.newUsersThisMonth} {t('admin.reports.thisMonth')}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {t('admin.reports.activeUsers')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userData.activeUsers}</div>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      {Math.round(userData.activeUsers / userData.totalUsers * 100)}% {t('admin.reports.ofTotalUsers')}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {t('admin.reports.retentionRate')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userData.userRetentionRate}%</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('admin.reports.monthlySignups')}</CardTitle>
                    <CardDescription>
                      {getTimeRangeLabel()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full bg-gray-50 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-16 w-16 text-gray-300" />
                      {/* This would be a real chart in a production app */}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{t('admin.reports.deviceDistribution')}</CardTitle>
                    <CardDescription>
                      {t('admin.reports.usersByDevice')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full bg-gray-50 rounded-lg flex items-center justify-center">
                      <PieChart className="h-16 w-16 text-gray-300" />
                      {/* This would be a real chart in a production app */}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.reports.usersByCountry')}</CardTitle>
                  <CardDescription>
                    {t('admin.reports.geographicDistribution')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.usersByCountry.map((country, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{country.country}</span>
                          <span className="text-sm text-gray-500">
                            {country.count} ({country.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${country.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default ReportsPage;