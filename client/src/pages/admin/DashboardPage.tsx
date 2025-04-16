import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Card,
  CardContent,
  CardDescription,
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
  Users, 
  CreditCard, 
  Calendar, 
  Map, 
  BarChart4, 
  TrendingUp,
  TrendingDown,
  Package,
  FileText,
  Globe,
  Truck
} from 'lucide-react';

const DashboardPage = () => {
  const { t } = useTranslation();
  
  return (
    <AdminLayout>
      <Helmet>
        <title>TravelEase - {t('admin.dashboard.title', 'Admin Dashboard')}</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {t('admin.dashboard.overview', 'Overview')}
        </h1>
        <div className="flex space-x-2">
          <Tabs defaultValue="day">
            <TabsList>
              <TabsTrigger value="day">{t('admin.dashboard.today', 'Today')}</TabsTrigger>
              <TabsTrigger value="week">{t('admin.dashboard.thisWeek', 'This Week')}</TabsTrigger>
              <TabsTrigger value="month">{t('admin.dashboard.thisMonth', 'This Month')}</TabsTrigger>
              <TabsTrigger value="year">{t('admin.dashboard.thisYear', 'This Year')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  {t('admin.dashboard.totalRevenue', 'Total Revenue')}
                </p>
                <h3 className="text-2xl font-bold">$24,345</h3>
                <div className="flex items-center mt-1 text-green-500 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+5.2%</span>
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  {t('admin.dashboard.totalBookings', 'Total Bookings')}
                </p>
                <h3 className="text-2xl font-bold">345</h3>
                <div className="flex items-center mt-1 text-green-500 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+2.4%</span>
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  {t('admin.dashboard.totalUsers', 'Total Users')}
                </p>
                <h3 className="text-2xl font-bold">1,247</h3>
                <div className="flex items-center mt-1 text-green-500 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+10.2%</span>
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  {t('admin.dashboard.conversionRate', 'Conversion Rate')}
                </p>
                <h3 className="text-2xl font-bold">3.2%</h3>
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span>-0.4%</span>
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <BarChart4 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Service Activity */}
      <h2 className="text-xl font-bold mb-4">
        {t('admin.dashboard.serviceActivity', 'Service Activity')}
      </h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  {t('common.flights')}
                </p>
                <h3 className="text-2xl font-bold">128</h3>
                <div className="text-sm text-text-secondary">
                  {t('admin.dashboard.thisMonth', 'This Month')}
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  {t('common.hotels')}
                </p>
                <h3 className="text-2xl font-bold">95</h3>
                <div className="text-sm text-text-secondary">
                  {t('admin.dashboard.thisMonth', 'This Month')}
                </div>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Map className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  {t('common.visas')}
                </p>
                <h3 className="text-2xl font-bold">67</h3>
                <div className="text-sm text-text-secondary">
                  {t('admin.dashboard.thisMonth', 'This Month')}
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  {t('common.packages')}
                </p>
                <h3 className="text-2xl font-bold">43</h3>
                <div className="text-sm text-text-secondary">
                  {t('admin.dashboard.thisMonth', 'This Month')}
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Globe className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('admin.dashboard.recentBookings', 'Recent Bookings')}</CardTitle>
            <CardDescription>
              {t('admin.dashboard.lastBookings', 'Last 10 bookings across all services')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-5 text-sm font-medium text-text-secondary">
                <div>{t('admin.bookings.bookingId', 'ID')}</div>
                <div>{t('admin.bookings.customer', 'Customer')}</div>
                <div>{t('admin.bookings.type', 'Type')}</div>
                <div>{t('admin.bookings.amount', 'Amount')}</div>
                <div>{t('admin.bookings.status', 'Status')}</div>
              </div>
              
              <div className="space-y-2">
                {[
                  { id: 'BK1234', customer: 'John Doe', type: 'Flight', amount: '$349', status: 'confirmed' },
                  { id: 'BK1235', customer: 'Jane Smith', type: 'Hotel', amount: '$520', status: 'confirmed' },
                  { id: 'BK1236', customer: 'Ahmed Ali', type: 'Package', amount: '$1,250', status: 'pending' },
                  { id: 'BK1237', customer: 'Sarah Johnson', type: 'Visa', amount: '$200', status: 'confirmed' },
                  { id: 'BK1238', customer: 'Michael Chen', type: 'Flight', amount: '$425', status: 'cancelled' },
                  { id: 'BK1239', customer: 'Laura Garcia', type: 'Hotel', amount: '$380', status: 'confirmed' },
                  { id: 'BK1240', customer: 'Robert Kim', type: 'Package', amount: '$1,800', status: 'pending' },
                ].map((booking, index) => (
                  <div key={index} className="grid grid-cols-5 text-sm py-2 border-b border-gray-100">
                    <div className="font-medium">{booking.id}</div>
                    <div>{booking.customer}</div>
                    <div>{booking.type}</div>
                    <div>{booking.amount}</div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {t(`admin.bookings.${booking.status}`)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Activity Log */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t('admin.dashboard.activityLog', 'Activity Log')}</CardTitle>
            <CardDescription>
              {t('admin.dashboard.recentActivity', 'Recent system activities')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  text: 'User John Doe made a new booking', 
                  time: '5 minutes ago', 
                  icon: <Calendar className="h-4 w-4 text-primary" /> 
                },
                { 
                  text: 'New user Sarah Johnson registered', 
                  time: '25 minutes ago', 
                  icon: <Users className="h-4 w-4 text-primary" /> 
                },
                { 
                  text: 'Payment processed for booking #BK1235', 
                  time: '1 hour ago',
                  icon: <CreditCard className="h-4 w-4 text-primary" /> 
                },
                { 
                  text: 'New visa application submitted', 
                  time: '2 hours ago', 
                  icon: <FileText className="h-4 w-4 text-primary" /> 
                },
                { 
                  text: 'Hotel reservation confirmed', 
                  time: '3 hours ago', 
                  icon: <Map className="h-4 w-4 text-primary" /> 
                },
                { 
                  text: 'Shipping request received', 
                  time: '4 hours ago', 
                  icon: <Truck className="h-4 w-4 text-primary" /> 
                },
                { 
                  text: 'New package deal published', 
                  time: '5 hours ago', 
                  icon: <Globe className="h-4 w-4 text-primary" /> 
                },
              ].map((activity, index) => (
                <div key={index} className="flex">
                  <div className="mr-3">{activity.icon}</div>
                  <div>
                    <p className="text-sm">{activity.text}</p>
                    <p className="text-xs text-text-secondary">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;