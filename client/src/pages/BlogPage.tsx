import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserLayout from '@/components/layout/UserLayout';
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
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Calendar, 
  User, 
  Tag, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  tags: string[];
  image: string;
}

// Sample blog posts data
const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Top 10 Must-Visit Destinations in 2023',
    slug: 'top-10-destinations-2023',
    excerpt: 'Discover the most beautiful and exciting destinations to visit this year. From tropical beaches to historic cities.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    author: 'John Doe',
    publishDate: '2023-06-25',
    tags: ['travel', 'destinations', 'vacation'],
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'How to Pack Light for a Long Trip',
    slug: 'pack-light-long-trip',
    excerpt: 'Learn the art of minimalist packing and travel with ease. Essential tips for efficient packing.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    author: 'Jane Smith',
    publishDate: '2023-07-12',
    tags: ['travel tips', 'packing', 'light travel'],
    image: 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'Local Cuisines You Must Try in Southeast Asia',
    slug: 'southeast-asia-cuisines',
    excerpt: 'Embark on a culinary journey through the diverse flavors of Southeast Asia. From street food to fine dining.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    author: 'Michael Chen',
    publishDate: '2023-07-05',
    tags: ['food', 'culture', 'asia'],
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    title: 'Budget Travel Guide: Europe Edition',
    slug: 'budget-travel-europe',
    excerpt: 'Travel through Europe without breaking the bank. Tips, tricks, and recommendations for budget travelers.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    author: 'Sarah Johnson',
    publishDate: '2023-06-18',
    tags: ['budget travel', 'europe', 'tips'],
    image: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    title: 'A Weekend in Dubai: Complete Itinerary',
    slug: 'weekend-in-dubai',
    excerpt: 'Make the most of a short stay in the dazzling city of Dubai. From skyscrapers to desert adventures.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
    author: 'Ahmed Al-Farsi',
    publishDate: '2023-07-18',
    tags: ['dubai', 'weekend trip', 'itinerary'],
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

const BlogPage = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Fetch blog posts
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['/api/blog-posts'],
    enabled: false, // Disable for now, use mock data
  });
  
  // For MVP, use mock data
  const allPosts = posts || mockBlogPosts;
  
  // Filter posts based on search and tags
  const filteredPosts = allPosts.filter(post => {
    // Search term filter
    if (
      searchTerm &&
      !post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    
    // Tag filter
    if (selectedTag && !post.tags.includes(selectedTag)) {
      return false;
    }
    
    return true;
  });
  
  // Get all unique tags from posts
  const allTags = Array.from(
    new Set(allPosts.flatMap(post => post.tags))
  );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <UserLayout>
      <Helmet>
        <title>TravelEase - {t('common.travelBlog', 'Travel Blog')}</title>
        <meta name="description" content="Discover travel tips, destination guides, and insights to enhance your travel experience." />
      </Helmet>
      
      <div className="bg-primary/10 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center font-poppins">
            {t('common.travelBlog', 'Travel Blog')}
          </h1>
          <p className="text-lg text-center text-text-secondary mb-8 max-w-2xl mx-auto">
            {t('blog.subtitle', 'Travel inspiration, tips, and stories to fuel your next adventure')}
          </p>
          
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder={t('blog.searchPlaceholder', 'Search articles...')}
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{t('blog.categories', 'Categories')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={selectedTag === null ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedTag(null)}
                  >
                    {t('blog.allPosts', 'All Posts')}
                  </Button>
                  
                  {allTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t('blog.recentPosts', 'Recent Posts')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBlogPosts.slice(0, 3).map((post) => (
                    <div key={post.id} className="flex items-start space-x-3">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-medium hover:text-primary cursor-pointer">
                          {post.title}
                        </h4>
                        <p className="text-xs text-text-secondary">
                          {formatDate(post.publishDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-[300px] w-full rounded-t-lg" />
                    <CardContent className="pt-6">
                      <Skeleton className="h-8 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-lg text-error">Failed to load blog posts. Please try again later.</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg">{t('blog.noPostsFound', 'No posts found matching your criteria.')}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTag(null);
                  }}
                >
                  {t('blog.clearFilters', 'Clear Filters')}
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <div className="relative h-[300px]">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2 text-sm text-text-secondary mb-3">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.publishDate)}</span>
                        <Separator orientation="vertical" className="h-4" />
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      
                      <h2 className="text-2xl font-bold mb-3 hover:text-primary cursor-pointer">
                        {post.title}
                      </h2>
                      
                      <p className="text-text-secondary mb-4">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Button
                            key={tag}
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => setSelectedTag(tag)}
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Button>
                        ))}
                      </div>
                      
                      <Button 
                        variant="link" 
                        className="text-primary px-0 hover:text-primary-dark"
                      >
                        {t('common.readMore', 'Read More')}
                        <ChevronRight className={`ml-1 h-4 w-4 ${isRtl ? 'transform rotate-180' : ''}`} />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                
                <div className="flex justify-center mt-8">
                  <Button variant="outline">
                    {t('blog.loadMore', 'Load More Posts')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default BlogPage;