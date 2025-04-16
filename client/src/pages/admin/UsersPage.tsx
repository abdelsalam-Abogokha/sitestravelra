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
  User,
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Key,
  Shield,
  Mail,
  Phone,
  Clock,
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
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';

// Sample users for the MVP
const mockUsers = [
  {
    id: 1,
    username: 'johndoe',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 555-123-4567',
    role: 'admin',
    status: 'active',
    lastLogin: '2023-04-15T10:30:00Z',
    createdAt: '2023-01-10T14:30:00Z',
  },
  {
    id: 2,
    username: 'janedoe',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 555-987-6543',
    role: 'user',
    status: 'active',
    lastLogin: '2023-04-16T08:45:00Z',
    createdAt: '2023-02-05T16:20:00Z',
  },
  {
    id: 3,
    username: 'ahmedali',
    name: 'Ahmed Ali',
    email: 'ahmed.ali@example.com',
    phone: '+971 50 123 4567',
    role: 'user',
    status: 'active',
    lastLogin: '2023-04-12T11:15:00Z',
    createdAt: '2023-03-20T09:10:00Z',
  },
  {
    id: 4,
    username: 'sarahjohnson',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 555-555-5555',
    role: 'user',
    status: 'inactive',
    lastLogin: '2023-03-28T15:20:00Z',
    createdAt: '2023-02-15T13:40:00Z',
  },
  {
    id: 5,
    username: 'michaelchen',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    phone: '+1 555-789-0123',
    role: 'user',
    status: 'active',
    lastLogin: '2023-04-14T12:30:00Z',
    createdAt: '2023-01-25T10:15:00Z',
  },
  {
    id: 6,
    username: 'fatimahassan',
    name: 'Fatima Hassan',
    email: 'fatima.h@example.com',
    phone: '+971 55 987 6543',
    role: 'manager',
    status: 'active',
    lastLogin: '2023-04-15T17:45:00Z',
    createdAt: '2023-02-10T14:30:00Z',
  }
];

const UsersPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // In a real app, this would be a fetch from the API
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['/api/users'],
    // Disabled for now, use mock data
    enabled: false,
  });
  
  // For MVP, use mock data
  const allUsers = users || mockUsers;
  
  // Filter users based on search and filters
  const filteredUsers = allUsers.filter(user => {
    // Search term filter
    if (
      searchTerm &&
      !user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    
    // Role filter
    if (filterRole !== 'all' && user.role !== filterRole) {
      return false;
    }
    
    // Status filter
    if (filterStatus !== 'all' && user.status !== filterStatus) {
      return false;
    }
    
    return true;
  });
  
  // Mock mutation for MVP
  const deleteUser = useMutation({
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
        title: t('admin.users.userDeleted'),
        description: t('admin.users.userDeletedDescription', 'User has been deleted successfully'),
      });
      setIsDeleteDialogOpen(false);
      // In a real app, we would invalidate the query here
      // queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    }
  });
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteUser = () => {
    if (selectedUser) {
      deleteUser.mutate(selectedUser.id);
    }
  };
  
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-0">{t('admin.users.admin')}</Badge>;
      case 'manager':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-0">{t('admin.users.manager')}</Badge>;
      case 'user':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-0">{t('admin.users.regularUser')}</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-0">{role}</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0">{t('admin.users.active')}</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-0">{t('admin.users.inactive')}</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-0">{status}</Badge>;
    }
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilterRole('all');
    setFilterStatus('all');
  };
  
  return (
    <AdminLayout>
      <Helmet>
        <title>TravelEase - {t('admin.users.title')}</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {t('admin.users.title')}
          </h1>
          <p className="text-text-secondary">
            {t('admin.users.subtitle', 'Manage users and permissions')}
          </p>
        </div>
        
        <Button className="bg-primary text-white">
          <Plus className="mr-2 h-4 w-4" />
          {t('admin.users.addUser')}
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>{t('admin.users.overview')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-600 mb-1">{t('admin.users.totalUsers')}</h3>
              <p className="text-2xl font-bold">{allUsers.length}</p>
              <p className="text-xs text-blue-600 mt-1">+3 {t('admin.users.thisMonth')}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-600 mb-1">{t('admin.users.activeUsers')}</h3>
              <p className="text-2xl font-bold">{allUsers.filter(u => u.status === 'active').length}</p>
              <p className="text-xs text-purple-600 mt-1">92% {t('admin.users.activeRate')}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-600 mb-1">{t('admin.users.recentLogins')}</h3>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-green-600 mt-1">{t('admin.users.last24Hours')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.users.allUsers')}</CardTitle>
          <CardDescription>
            {t('admin.users.allUsersDescription', 'Manage all users and their roles')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative md:w-1/3">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10"
                placeholder={t('admin.users.searchPlaceholder', 'Search by name, username or email')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="w-full sm:w-auto">
                <Select value={filterRole} onValueChange={(value) => setFilterRole(value)}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder={t('admin.users.filterByRole', 'Filter by Role')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="admin">{t('admin.users.admin')}</SelectItem>
                    <SelectItem value="manager">{t('admin.users.manager')}</SelectItem>
                    <SelectItem value="user">{t('admin.users.regularUser')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-auto">
                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder={t('admin.users.filterByStatus', 'Filter by Status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="active">{t('admin.users.active')}</SelectItem>
                    <SelectItem value="inactive">{t('admin.users.inactive')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" size="icon" onClick={resetFilters} title={t('admin.users.resetFilters')}>
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
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">{t('admin.users.noUsersFound')}</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {t('admin.users.noUsersFoundDescription', 'No users match your search criteria. Try adjusting your filters or search term.')}
              </p>
              <Button variant="outline" onClick={resetFilters}>
                {t('admin.users.resetFilters')}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.users.user')}</TableHead>
                    <TableHead>{t('admin.users.contact')}</TableHead>
                    <TableHead>{t('admin.users.role')}</TableHead>
                    <TableHead>{t('admin.users.status')}</TableHead>
                    <TableHead>{t('admin.users.lastLogin')}</TableHead>
                    <TableHead>{t('admin.users.joinDate')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-gray-500">@{user.username}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1 text-gray-400" />
                            {user.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                            {user.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-gray-400" />
                          {formatDate(user.lastLogin)}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('admin.users.deleteUser')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('admin.users.deleteUserConfirmation', 'Are you sure you want to delete this user? This action cannot be undone.')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={confirmDeleteUser}
                >
                  {t('common.delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('admin.users.editUser')}</DialogTitle>
                <DialogDescription>
                  {t('admin.users.editUserDescription', 'Edit user details and permissions')}
                </DialogDescription>
              </DialogHeader>
              
              {selectedUser && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      {t('common.name')}
                    </Label>
                    <Input id="name" defaultValue={selectedUser.name} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      {t('common.username')}
                    </Label>
                    <Input id="username" defaultValue={selectedUser.username} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      {t('common.email')}
                    </Label>
                    <Input id="email" defaultValue={selectedUser.email} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      {t('common.phone')}
                    </Label>
                    <Input id="phone" defaultValue={selectedUser.phone} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      {t('admin.users.role')}
                    </Label>
                    <Select defaultValue={selectedUser.role}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={t('admin.users.selectRole')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">{t('admin.users.admin')}</SelectItem>
                        <SelectItem value="manager">{t('admin.users.manager')}</SelectItem>
                        <SelectItem value="user">{t('admin.users.regularUser')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      {t('admin.users.status')}
                    </Label>
                    <div className="flex items-center space-x-2 col-span-3">
                      <Switch id="status" defaultChecked={selectedUser.status === 'active'} />
                      <Label htmlFor="status" className="cursor-pointer">
                        {selectedUser.status === 'active' ? t('admin.users.active') : t('admin.users.inactive')}
                      </Label>
                    </div>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline">
                  {t('common.cancel')}
                </Button>
                <Button className="bg-primary text-white">
                  {t('common.save')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default UsersPage;