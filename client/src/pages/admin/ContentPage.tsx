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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  FileText,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Image,
  Calendar,
  Tag,
  AlertTriangle,
  Save,
  X
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Sample blog posts for the MVP
const mockBlogPosts = [
  {
    id: 1,
    title: 'Top 10 Must-Visit Destinations in 2023',
    slug: 'top-10-destinations-2023',
    excerpt: 'Discover the most beautiful and exciting destinations to visit this year. From tropical beaches to historic cities.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    author: 'John Doe',
    published: true,
    publishDate: '2023-06-25',
    tags: ['travel', 'destinations', 'vacation'],
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: '2023-06-20T10:30:00Z'
  },
  {
    id: 2,
    title: 'How to Pack Light for a Long Trip',
    slug: 'pack-light-long-trip',
    excerpt: 'Learn the art of minimalist packing and travel with ease. Essential tips for efficient packing.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    author: 'Jane Smith',
    published: true,
    publishDate: '2023-07-12',
    tags: ['travel tips', 'packing', 'light travel'],
    image: 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: '2023-07-10T09:15:00Z'
  },
  {
    id: 3,
    title: 'Local Cuisines You Must Try in Southeast Asia',
    slug: 'southeast-asia-cuisines',
    excerpt: 'Embark on a culinary journey through the diverse flavors of Southeast Asia. From street food to fine dining.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    author: 'Michael Chen',
    published: true,
    publishDate: '2023-07-05',
    tags: ['food', 'culture', 'asia'],
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: '2023-07-01T14:22:00Z'
  },
  {
    id: 4,
    title: 'Budget Travel Guide: Europe Edition',
    slug: 'budget-travel-europe',
    excerpt: 'Travel through Europe without breaking the bank. Tips, tricks, and recommendations for budget travelers.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    author: 'Sarah Johnson',
    published: true,
    publishDate: '2023-06-18',
    tags: ['budget travel', 'europe', 'tips'],
    image: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: '2023-06-15T08:40:00Z'
  },
  {
    id: 5,
    title: 'A Weekend in Dubai: Complete Itinerary',
    slug: 'weekend-in-dubai',
    excerpt: 'Make the most of a short stay in the dazzling city of Dubai. From skyscrapers to desert adventures.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    author: 'Ahmed Al-Farsi',
    published: false,
    publishDate: null,
    tags: ['dubai', 'weekend trip', 'itinerary'],
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    createdAt: '2023-07-18T15:45:00Z'
  }
];

// Sample static pages for the MVP
const mockStaticPages = [
  {
    id: 1,
    title: 'About Us',
    slug: 'about-us',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    published: true,
    lastUpdated: '2023-06-10T10:30:00Z'
  },
  {
    id: 2,
    title: 'Terms of Service',
    slug: 'terms-of-service',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    published: true,
    lastUpdated: '2023-05-15T14:22:00Z'
  },
  {
    id: 3,
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    published: true,
    lastUpdated: '2023-05-15T14:30:00Z'
  },
  {
    id: 4,
    title: 'FAQ',
    slug: 'faq',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    published: true,
    lastUpdated: '2023-06-28T09:15:00Z'
  },
  {
    id: 5,
    title: 'Coming Soon',
    slug: 'coming-soon',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    published: false,
    lastUpdated: '2023-07-02T16:40:00Z'
  }
];

const ContentPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('blog');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPublished, setFilterPublished] = useState('all');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isPageDialogOpen, setIsPageDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // In a real app, these would be real queries
  const { data: blogPosts, isLoading: isPostsLoading } = useQuery({
    queryKey: ['/api/admin/blog-posts'],
    // Disabled for now, use mock data
    enabled: false,
  });
  
  const { data: staticPages, isLoading: isPagesLoading } = useQuery({
    queryKey: ['/api/admin/static-pages'],
    // Disabled for now, use mock data
    enabled: false,
  });
  
  // For MVP, use mock data
  const posts = blogPosts || mockBlogPosts;
  const pages = staticPages || mockStaticPages;
  
  // Filter blog posts
  const filteredPosts = posts.filter(post => {
    // Search term filter
    if (
      searchTerm &&
      !post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return false;
    }
    
    // Published filter
    if (filterPublished === 'published' && !post.published) {
      return false;
    } else if (filterPublished === 'draft' && post.published) {
      return false;
    }
    
    return true;
  });
  
  // Filter static pages
  const filteredPages = pages.filter(page => {
    // Search term filter
    if (
      searchTerm &&
      !page.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !page.slug.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    
    // Published filter
    if (filterPublished === 'published' && !page.published) {
      return false;
    } else if (filterPublished === 'draft' && page.published) {
      return false;
    }
    
    return true;
  });
  
  // Mock mutations for MVP
  const deletePost = useMutation({
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
        title: t('admin.content.postDeleted'),
        description: t('admin.content.postDeletedDescription', 'Blog post has been deleted successfully'),
      });
      setIsDeleteDialogOpen(false);
      // In a real app, we would invalidate the query here
      // queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
    }
  });
  
  const deletePage = useMutation({
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
        title: t('admin.content.pageDeleted'),
        description: t('admin.content.pageDeletedDescription', 'Page has been deleted successfully'),
      });
      setIsDeleteDialogOpen(false);
      // In a real app, we would invalidate the query here
      // queryClient.invalidateQueries({ queryKey: ['/api/admin/static-pages'] });
    }
  });
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };
  
  const handleEditPost = (post: any) => {
    setSelectedPost(post);
    setIsPostDialogOpen(true);
  };
  
  const handleEditPage = (page: any) => {
    setSelectedPage(page);
    setIsPageDialogOpen(true);
  };
  
  const handleDeleteContent = (type: 'post' | 'page', id: number) => {
    if (type === 'post') {
      setSelectedPost(posts.find(p => p.id === id));
    } else {
      setSelectedPage(pages.find(p => p.id === id));
    }
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (activeTab === 'blog' && selectedPost) {
      deletePost.mutate(selectedPost.id);
    } else if (activeTab === 'pages' && selectedPage) {
      deletePage.mutate(selectedPage.id);
    }
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilterPublished('all');
  };
  
  return (
    <AdminLayout>
      <Helmet>
        <title>TravelEase - {t('admin.content.title')}</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {t('admin.content.title')}
          </h1>
          <p className="text-text-secondary">
            {t('admin.content.subtitle', 'Manage blog posts, pages and website content')}
          </p>
        </div>
        
        <div className="flex space-x-2">
          {activeTab === 'blog' && (
            <Button className="bg-primary text-white">
              <Plus className="mr-2 h-4 w-4" />
              {t('admin.content.newPost')}
            </Button>
          )}
          {activeTab === 'pages' && (
            <Button className="bg-primary text-white">
              <Plus className="mr-2 h-4 w-4" />
              {t('admin.content.newPage')}
            </Button>
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <Tabs defaultValue="blog" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="blog">
                <FileText className="h-4 w-4 mr-2" />
                {t('admin.content.blogPosts')}
              </TabsTrigger>
              <TabsTrigger value="pages">
                <FileText className="h-4 w-4 mr-2" />
                {t('admin.content.staticPages')}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative md:w-1/3">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10"
                placeholder={t('admin.content.searchPlaceholder', 'Search content...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="w-full sm:w-auto">
                <Select value={filterPublished} onValueChange={(value) => setFilterPublished(value)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={t('admin.content.filterByStatus', 'Filter by Status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="published">{t('admin.content.published')}</SelectItem>
                    <SelectItem value="draft">{t('admin.content.draft')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" size="icon" onClick={resetFilters} title={t('admin.content.resetFilters')}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value="blog">
            {isPostsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-16 w-16 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('admin.content.noPostsFound')}</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {t('admin.content.noPostsFoundDescription', 'No blog posts match your search criteria. Try adjusting your filters or search term.')}
                </p>
                <Button variant="outline" onClick={resetFilters}>
                  {t('admin.content.resetFilters')}
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('admin.content.title')}</TableHead>
                      <TableHead>{t('admin.content.slug')}</TableHead>
                      <TableHead>{t('admin.content.author')}</TableHead>
                      <TableHead>{t('admin.content.status')}</TableHead>
                      <TableHead>{t('admin.content.publishDate')}</TableHead>
                      <TableHead>{t('admin.content.tags')}</TableHead>
                      <TableHead className="text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="h-10 w-10 rounded object-cover"
                            />
                            <div>
                              <div className="font-medium">{post.title}</div>
                              <div className="text-xs text-gray-500 truncate max-w-[200px]">{post.excerpt}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{post.slug}</TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>
                          {post.published ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-0">
                              {t('admin.content.published')}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-0">
                              {t('admin.content.draft')}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(post.publishDate)}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{post.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleEditPost(post)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteContent('post', post.id)}
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
          </TabsContent>
          
          <TabsContent value="pages">
            {isPagesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                ))}
              </div>
            ) : filteredPages.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('admin.content.noPagesFound')}</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {t('admin.content.noPagesFoundDescription', 'No pages match your search criteria. Try adjusting your filters or search term.')}
                </p>
                <Button variant="outline" onClick={resetFilters}>
                  {t('admin.content.resetFilters')}
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('admin.content.title')}</TableHead>
                      <TableHead>{t('admin.content.slug')}</TableHead>
                      <TableHead>{t('admin.content.status')}</TableHead>
                      <TableHead>{t('admin.content.lastUpdated')}</TableHead>
                      <TableHead className="text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPages.map((page) => (
                      <TableRow key={page.id}>
                        <TableCell className="font-medium">{page.title}</TableCell>
                        <TableCell className="font-mono text-xs">{page.slug}</TableCell>
                        <TableCell>
                          {page.published ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-0">
                              {t('admin.content.published')}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-0">
                              {t('admin.content.draft')}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(page.lastUpdated)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleEditPage(page)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteContent('page', page.id)}
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
          </TabsContent>
        </CardContent>
      </Card>
      
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedPost ? t('admin.content.editPost') : t('admin.content.newPost')}</DialogTitle>
            <DialogDescription>
              {selectedPost 
                ? t('admin.content.editPostDescription', 'Edit blog post details and content') 
                : t('admin.content.newPostDescription', 'Create a new blog post')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPost && (
            <div className="grid grid-cols-1 gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="post-title" className="text-right">
                  {t('admin.content.title')}
                </Label>
                <Input 
                  id="post-title" 
                  defaultValue={selectedPost.title} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="post-slug" className="text-right">
                  {t('admin.content.slug')}
                </Label>
                <Input 
                  id="post-slug" 
                  defaultValue={selectedPost.slug} 
                  className="col-span-3 font-mono" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="post-excerpt" className="text-right pt-2">
                  {t('admin.content.excerpt')}
                </Label>
                <Textarea 
                  id="post-excerpt" 
                  defaultValue={selectedPost.excerpt} 
                  className="col-span-3" 
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="post-content" className="text-right pt-2">
                  {t('admin.content.content')}
                </Label>
                <Textarea 
                  id="post-content" 
                  defaultValue={selectedPost.content} 
                  className="col-span-3" 
                  rows={10}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="post-author" className="text-right">
                  {t('admin.content.author')}
                </Label>
                <Input 
                  id="post-author" 
                  defaultValue={selectedPost.author} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="post-tags" className="text-right">
                  {t('admin.content.tags')}
                </Label>
                <Input 
                  id="post-tags" 
                  defaultValue={selectedPost.tags.join(', ')} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="post-image" className="text-right">
                  {t('admin.content.featuredImage')}
                </Label>
                <div className="col-span-3 flex items-center gap-4">
                  <img 
                    src={selectedPost.image} 
                    alt={selectedPost.title} 
                    className="h-16 w-24 object-cover rounded" 
                  />
                  <Button variant="outline">
                    <Image className="h-4 w-4 mr-2" />
                    {t('admin.content.changeImage')}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">
                  {t('admin.content.publishStatus')}
                </div>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch id="post-published" defaultChecked={selectedPost.published} />
                  <Label htmlFor="post-published" className="cursor-pointer">
                    {selectedPost.published 
                      ? t('admin.content.published') 
                      : t('admin.content.draft')}
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
              <Save className="mr-2 h-4 w-4" />
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isPageDialogOpen} onOpenChange={setIsPageDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedPage ? t('admin.content.editPage') : t('admin.content.newPage')}</DialogTitle>
            <DialogDescription>
              {selectedPage 
                ? t('admin.content.editPageDescription', 'Edit page details and content') 
                : t('admin.content.newPageDescription', 'Create a new static page')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPage && (
            <div className="grid grid-cols-1 gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="page-title" className="text-right">
                  {t('admin.content.title')}
                </Label>
                <Input 
                  id="page-title" 
                  defaultValue={selectedPage.title} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="page-slug" className="text-right">
                  {t('admin.content.slug')}
                </Label>
                <Input 
                  id="page-slug" 
                  defaultValue={selectedPage.slug} 
                  className="col-span-3 font-mono" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="page-content" className="text-right pt-2">
                  {t('admin.content.content')}
                </Label>
                <Textarea 
                  id="page-content" 
                  defaultValue={selectedPage.content} 
                  className="col-span-3" 
                  rows={10}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">
                  {t('admin.content.publishStatus')}
                </div>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch id="page-published" defaultChecked={selectedPage.published} />
                  <Label htmlFor="page-published" className="cursor-pointer">
                    {selectedPage.published 
                      ? t('admin.content.published') 
                      : t('admin.content.draft')}
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
              <Save className="mr-2 h-4 w-4" />
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {activeTab === 'blog' 
                ? t('admin.content.deletePost') 
                : t('admin.content.deletePage')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {activeTab === 'blog' 
                ? t('admin.content.deletePostConfirmation', 'Are you sure you want to delete this blog post? This action cannot be undone.')
                : t('admin.content.deletePageConfirmation', 'Are you sure you want to delete this page? This action cannot be undone.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={confirmDelete}
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ContentPage;