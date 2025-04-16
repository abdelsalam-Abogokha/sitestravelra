import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/components/layout/AdminLayout';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Search, 
  Filter, 
  Eye, 
  Download,
  FileText,
  Check,
  X,
  AlertTriangle,
  Package,
  Hotel,
  CalendarRange,
  CreditCard
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
import { Badge } from '@/components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

// Sample bookings for the MVP
const mockBookings = [
  {
    id: 'BK1234',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '+1 555-123-4567',
    type: 'flight',
    description: 'Dubai to London, Round Trip',
    amount: 549.99,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2023-04-10T14:30:00Z',
    travelDate: '2023-05-15T10:00:00Z'
  },
  {
    id: 'BK1235',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerPhone: '+1 555-987-6543',
    type: 'hotel',
    description: 'Luxury Hotel, Dubai - 3 nights',
    amount: 799.99,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2023-04-12T09:15:00Z',
    travelDate: '2023-05-20T14:00:00Z'
  },
  {
    id: 'BK1236',
    customerName: 'Ahmed Ali',
    customerEmail: 'ahmed.ali@example.com',
    customerPhone: '+971 50 123 4567',
    type: 'package',
    description: 'Dubai City Tour - 5 days',
    amount: 1299.99,
    status: 'pending',
    paymentStatus: 'unpaid',
    createdAt: '2023-04-14T11:45:00Z',
    travelDate: '2023-06-01T08:30:00Z'
  },
  {
    id: 'BK1237',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@example.com',
    customerPhone: '+1 555-555-5555',
    type: 'flight',
    description: 'New York to Paris, One Way',
    amount: 425.50,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2023-04-15T16:20:00Z',
    travelDate: '2023-05-25T07:45:00Z'
  },
  {
    id: 'BK1238',
    customerName: 'Michael Chen',
    customerEmail: 'michael.c@example.com',
    customerPhone: '+1 555-789-0123',
    type: 'hotel',
    description: 'Business Hotel, London - 5 nights',
    amount: 1250.00,
    status: 'cancelled',
    paymentStatus: 'refunded',
    createdAt: '2023-04-09T10:00:00Z',
    travelDate: '2023-05-10T15:00:00Z'
  },
  {
    id: 'BK1239',
    customerName: 'Fatima Hassan',
    customerEmail: 'fatima.h@example.com',
    customerPhone: '+971 55 987 6543',
    type: 'package',
    description: 'Egyptian Wonders - 7 days',
    amount: 1899.99,
    status: 'confirmed',
    paymentStatus: 'partially_paid',
    createdAt: '2023-04-16T08:30:00Z',
    travelDate: '2023-06-15T09:00:00Z'
  }
];

const BookingsPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  
  // In a real app, this would be a fetch from the API
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['/api/bookings'],
    // Disabled for now, use mock data
    enabled: false,
  });
  
  // For MVP, use mock data
  const allBookings = bookings || mockBookings;
  
  // Filter bookings based on search and filters
  const filteredBookings = allBookings.filter(booking => {
    // Search term filter
    if (
      searchTerm &&
      !booking.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !booking.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    
    // Status filter
    if (filterStatus !== 'all' && booking.status !== filterStatus) {
      return false;
    }
    
    // Type filter
    if (filterType !== 'all' && booking.type !== filterType) {
      return false;
    }
    
    // Payment status filter
    if (filterPayment !== 'all' && booking.paymentStatus !== filterPayment) {
      return false;
    }
    
    return true;
  });
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0">{t('admin.bookings.confirmed')}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-0">{t('admin.bookings.pending')}</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-0">{t('admin.bookings.cancelled')}</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-0">{status}</Badge>;
    }
  };
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0">{t('admin.bookings.paid')}</Badge>;
      case 'unpaid':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-0">{t('admin.bookings.unpaid')}</Badge>;
      case 'partially_paid':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-0">{t('admin.bookings.partiallyPaid')}</Badge>;
      case 'refunded':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-0">{t('admin.bookings.refunded')}</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-0">{status}</Badge>;
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Badge className="bg-blue-50 text-blue-700 border-0"><Package className="h-3 w-3 mr-1" />{t('common.flights')}</Badge>;
      case 'hotel':
        return <Badge className="bg-green-50 text-green-700 border-0"><Hotel className="h-3 w-3 mr-1" />{t('common.hotels')}</Badge>;
      case 'package':
        return <Badge className="bg-purple-50 text-purple-700 border-0"><CalendarRange className="h-3 w-3 mr-1" />{t('common.packages')}</Badge>;
      default:
        return <Badge className="bg-gray-50 text-gray-700 border-0">{type}</Badge>;
    }
  };
  
  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setViewDetailsOpen(true);
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterType('all');
    setFilterPayment('all');
  };
  
  return (
    <AdminLayout>
      <Helmet>
        <title>TravelEase - {t('admin.bookings.title')}</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {t('admin.bookings.title')}
          </h1>
          <p className="text-text-secondary">
            {t('admin.bookings.subtitle', 'Manage all bookings and reservations')}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t('admin.bookings.exportData', 'Export')}
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>{t('admin.bookings.overview', 'Bookings Overview')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-600 mb-1">{t('admin.bookings.totalBookings')}</h3>
              <p className="text-2xl font-bold">156</p>
              <p className="text-xs text-blue-600 mt-1">+12% {t('admin.bookings.fromLastMonth')}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-600 mb-1">{t('admin.bookings.confirmedBookings')}</h3>
              <p className="text-2xl font-bold">124</p>
              <p className="text-xs text-green-600 mt-1">+8% {t('admin.bookings.fromLastMonth')}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-600 mb-1">{t('admin.bookings.pendingBookings')}</h3>
              <p className="text-2xl font-bold">27</p>
              <p className="text-xs text-yellow-600 mt-1">-3% {t('admin.bookings.fromLastMonth')}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-600 mb-1">{t('admin.bookings.cancelledBookings')}</h3>
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-red-600 mt-1">-15% {t('admin.bookings.fromLastMonth')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{t('admin.bookings.allBookings')}</CardTitle>
          <CardDescription>
            {t('admin.bookings.allBookingsDescription', 'Manage and view all booking details')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10"
                placeholder={t('admin.bookings.searchPlaceholder', 'Search by ID, customer name or email')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="w-full sm:w-auto">
                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={t('admin.bookings.filterByStatus', 'Filter by Status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="confirmed">{t('admin.bookings.confirmed')}</SelectItem>
                    <SelectItem value="pending">{t('admin.bookings.pending')}</SelectItem>
                    <SelectItem value="cancelled">{t('admin.bookings.cancelled')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-auto">
                <Select value={filterType} onValueChange={(value) => setFilterType(value)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={t('admin.bookings.filterByType', 'Filter by Type')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="flight">{t('common.flights')}</SelectItem>
                    <SelectItem value="hotel">{t('common.hotels')}</SelectItem>
                    <SelectItem value="package">{t('common.packages')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-auto">
                <Select value={filterPayment} onValueChange={(value) => setFilterPayment(value)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={t('admin.bookings.filterByPayment', 'Filter by Payment')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="paid">{t('admin.bookings.paid')}</SelectItem>
                    <SelectItem value="unpaid">{t('admin.bookings.unpaid')}</SelectItem>
                    <SelectItem value="partially_paid">{t('admin.bookings.partiallyPaid')}</SelectItem>
                    <SelectItem value="refunded">{t('admin.bookings.refunded')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" size="icon" onClick={resetFilters} title={t('admin.bookings.resetFilters')}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
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
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-2">{t('admin.bookings.noBookingsFound')}</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {t('admin.bookings.noBookingsFoundDescription', 'No bookings match your search criteria. Try adjusting your filters or search term.')}
              </p>
              <Button variant="outline" onClick={resetFilters}>
                {t('admin.bookings.resetFilters')}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.bookings.bookingId')}</TableHead>
                    <TableHead>{t('admin.bookings.customer')}</TableHead>
                    <TableHead>{t('admin.bookings.type')}</TableHead>
                    <TableHead>{t('admin.bookings.details')}</TableHead>
                    <TableHead>{t('admin.bookings.amount')}</TableHead>
                    <TableHead>{t('admin.bookings.status')}</TableHead>
                    <TableHead>{t('admin.bookings.payment')}</TableHead>
                    <TableHead>{t('admin.bookings.travelDate')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-xs text-gray-500">{booking.customerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeIcon(booking.type)}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={booking.description}>
                        {booking.description}
                      </TableCell>
                      <TableCell>{formatCurrency(booking.amount)}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>{getPaymentStatusBadge(booking.paymentStatus)}</TableCell>
                      <TableCell>{formatDate(booking.travelDate)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8"
                          onClick={() => handleViewDetails(booking)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {t('common.view')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption>
                  {t('admin.bookings.showingResults', 'Showing {{count}} out of {{total}} bookings', { 
                    count: filteredBookings.length, total: allBookings.length 
                  })}
                </TableCaption>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {t('admin.bookings.bookingDetails', 'Booking Details')} - {selectedBooking?.id}
            </DialogTitle>
            <DialogDescription>
              {t('admin.bookings.createdOn', 'Created on')} {selectedBooking && formatDate(selectedBooking.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t('admin.bookings.customerInformation')}</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">{t('common.name')}</p>
                    <p>{selectedBooking.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t('common.email')}</p>
                    <p>{selectedBooking.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t('common.phone')}</p>
                    <p>{selectedBooking.customerPhone}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{t('admin.bookings.bookingInformation')}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">{t('admin.bookings.bookingType')}</p>
                      <p>{getTypeIcon(selectedBooking.type)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t('admin.bookings.bookingStatus')}</p>
                      <p>{getStatusBadge(selectedBooking.status)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t('admin.bookings.travelDate')}</p>
                      <p>{formatDate(selectedBooking.travelDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t('admin.bookings.bookingDetails')}</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">{t('admin.bookings.description')}</p>
                    <p>{selectedBooking.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t('admin.bookings.amount')}</p>
                    <p className="text-lg font-bold">{formatCurrency(selectedBooking.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t('admin.bookings.paymentStatus')}</p>
                    <p>{getPaymentStatusBadge(selectedBooking.paymentStatus)}</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{t('admin.bookings.actions')}</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <CreditCard className="h-4 w-4 mr-2" />
                      {t('admin.bookings.viewPaymentDetails')}
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      {t('admin.bookings.downloadInvoice')}
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      {t('admin.bookings.viewItinerary')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDetailsOpen(false)}>
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default BookingsPage;