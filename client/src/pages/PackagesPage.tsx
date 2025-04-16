import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserLayout from '@/components/layout/UserLayout';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { 
  Search, 
  MapPin, 
  Users, 
  CalendarDays, 
  CircleDollarSign, 
  Filter, 
  Star,
  Calendar as CalendarIcon,
  Heart,
  ChevronRight,
  Clock,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface TravelPackage {
  id: number;
  name: string;
  destination: string;
  description: string;
  duration: number;
  price: number;
  inclusions: string[];
  exclusions: string[];
  images: string[];
  type: string;
  category: string;
  rating: number;
  discount?: number;
}

// Mock travel packages data
const mockPackages: TravelPackage[] = [
  {
    id: 1,
    name: 'Dubai Adventure',
    destination: 'Dubai, UAE',
    description: 'Experience the best of Dubai with this premium package, including desert safari, city tour, and visit to Burj Khalifa.',
    duration: 5,
    price: 129900, // in cents
    inclusions: ['Hotel accommodation', 'Daily breakfast', 'City tours', 'Desert safari', 'Burj Khalifa entry'],
    exclusions: ['Flights', 'Travel insurance', 'Personal expenses'],
    images: ['https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'],
    type: 'family',
    category: 'standard',
    rating: 4.8,
    discount: 15
  },
  {
    id: 2,
    name: 'Paris Romance',
    destination: 'Paris, France',
    description: 'Enjoy the city of love with this romantic package featuring Eiffel Tower visit, Seine River cruise, and luxury dining.',
    duration: 7,
    price: 189900, // in cents
    inclusions: ['Luxury hotel', 'Daily breakfast', 'Seine River cruise', 'Eiffel Tower visit', 'Louvre Museum entry'],
    exclusions: ['Flights', 'Airport transfers', 'Personal expenses'],
    images: ['https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'],
    type: 'honeymoon',
    category: 'luxury',
    rating: 4.9
  },
  {
    id: 3,
    name: 'Swiss Alps Explorer',
    destination: 'Switzerland',
    description: 'Discover the breathtaking landscapes of Switzerland with this adventure package featuring hiking, skiing, and mountain views.',
    duration: 8,
    price: 219900, // in cents
    inclusions: ['Mountain lodge', 'Daily meals', 'Guided hiking', 'Cable car tickets', 'Equipment rental'],
    exclusions: ['Flights', 'Travel insurance', 'Personal expenses'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'],
    type: 'adventure',
    category: 'standard',
    rating: 4.7
  },
  {
    id: 4,
    name: 'Tokyo Experience',
    destination: 'Tokyo, Japan',
    description: 'Immerse yourself in Japanese culture with this Tokyo package featuring traditional experiences, city tours, and Mt. Fuji visit.',
    duration: 6,
    price: 169900, // in cents
    inclusions: ['Hotel accommodation', 'Daily breakfast', 'City tours', 'Mt. Fuji excursion', 'Traditional tea ceremony'],
    exclusions: ['Flights', 'Some meals', 'Personal expenses'],
    images: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'],
    type: 'family',
    category: 'standard',
    rating: 4.6,
    discount: 10
  },
  {
    id: 5,
    name: 'Bali Retreat',
    destination: 'Bali, Indonesia',
    description: 'Relax and rejuvenate with this Bali package featuring beach stays, spa treatments, and cultural experiences.',
    duration: 10,
    price: 149900, // in cents
    inclusions: ['Villa accommodation', 'Daily breakfast', 'Spa treatments', 'Cultural tours', 'Water activities'],
    exclusions: ['Flights', 'Travel insurance', 'Personal expenses'],
    images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80'],
    type: 'honeymoon',
    category: 'luxury',
    rating: 4.8,
  },
  {
    id: 6,
    name: 'Patagonian Trek',
    destination: 'Patagonia, Argentina & Chile',
    description: 'Embark on an epic adventure through the wilderness of Patagonia, with guided treks, wildlife spotting, and glacier exploration.',
    duration: 12,
    price: 259900, // in cents
    inclusions: ['Accommodation', 'All meals', 'Guided treks', 'National park fees', 'Equipment'],
    exclusions: ['Flights', 'Travel insurance', 'Alcoholic beverages'],
    images: ['https://images.unsplash.com/photo-1504204267155-aaad8e81290d?auto=format&fit=crop&w=600&q=80'],
    type: 'adventure',
    category: 'premium',
    rating: 4.9
  }
];

// Package types and categories
const packageTypes = [
  { id: 'family', name: 'Family' },
  { id: 'honeymoon', name: 'Honeymoon' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'cultural', name: 'Cultural' },
  { id: 'beach', name: 'Beach' }
];

const packageCategories = [
  { id: 'budget', name: 'Budget' },
  { id: 'standard', name: 'Standard' },
  { id: 'premium', name: 'Premium' },
  { id: 'luxury', name: 'Luxury' }
];

const PackagesPage = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const isRtl = i18n.language === 'ar';
  
  // Search state
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [duration, setDuration] = useState<number[]>([3, 14]);
  const [travelers, setTravelers] = useState('2');
  
  // Filters state
  const [priceRange, setPriceRange] = useState([500, 3000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  
  // UI state
  const [activePackage, setActivePackage] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  // Fetch packages
  const { data: packages, isLoading, error } = useQuery({
    queryKey: ['/api/travel-packages'],
    enabled: false, // Disable for now, use mock data
  });
  
  // For MVP, use mock data
  const allPackages = packages || mockPackages;
  
  // Filter packages based on search and filters
  const filteredPackages = allPackages.filter(pkg => {
    // Destination filter
    if (destination && !pkg.destination.toLowerCase().includes(destination.toLowerCase())) {
      return false;
    }
    
    // Duration filter
    if (pkg.duration < duration[0] || pkg.duration > duration[1]) {
      return false;
    }
    
    // Price filter (convert cents to dollars)
    const packagePrice = pkg.price / 100;
    if (packagePrice < priceRange[0] || packagePrice > priceRange[1]) {
      return false;
    }
    
    // Type filter
    if (selectedTypes.length > 0 && !selectedTypes.includes(pkg.type)) {
      return false;
    }
    
    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(pkg.category)) {
      return false;
    }
    
    // Rating filter
    if (pkg.rating < minRating) {
      return false;
    }
    
    return true;
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Would normally trigger query with search parameters
    console.log('Search parameters:', { destination, departureDate, duration, travelers });
    
    toast({
      title: t('common.search'),
      description: t('packages.searchingFor', { destination: destination || 'all destinations' }),
    });
  };
  
  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };
  
  const handleBook = (id: number) => {
    toast({
      title: t('packages.bookingInitiated'),
      description: t('packages.redirectingToBooking'),
    });
    // Would normally redirect to booking page or open booking modal
  };

  return (
    <UserLayout>
      <Helmet>
        <title>TravelEase - {t('packages.title')}</title>
        <meta name="description" content="Browse and book all-inclusive travel packages to destinations worldwide. Find the perfect vacation package for your next trip." />
      </Helmet>
      
      <div className="bg-primary/10 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center font-poppins">{t('packages.title')}</h1>
          
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>{t('packages.findPackage')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('common.destination')}</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" />
                      <Input 
                        type="text" 
                        placeholder={t('packages.destinationPlaceholder')}
                        className="pl-10" 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('packages.departureDate')}</label>
                    <div className="relative">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !departureDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {departureDate ? (
                              format(departureDate, "PPP", { locale: isRtl ? ar : enUS })
                            ) : (
                              <span>{t('packages.selectDate')}</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={departureDate}
                            onSelect={setDepartureDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('packages.duration')}</label>
                    <div className="px-2 pt-6 pb-2">
                      <Slider
                        defaultValue={[3, 14]}
                        min={1}
                        max={21}
                        step={1}
                        value={duration}
                        onValueChange={setDuration}
                      />
                      <div className="flex justify-between mt-2 text-sm">
                        <span>{duration[0]} {t('days')}</span>
                        <span>{duration[1]} {t('days')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('packages.travelers')}</label>
                    <Select value={travelers} onValueChange={setTravelers}>
                      <SelectTrigger className="w-full">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-gray-400" />
                          <SelectValue placeholder={t('packages.selectTravelers')} />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 {t('common.adults')}</SelectItem>
                        <SelectItem value="2">2 {t('common.adults')}</SelectItem>
                        <SelectItem value="2-1">2 {t('common.adults')}, 1 {t('common.children')}</SelectItem>
                        <SelectItem value="2-2">2 {t('common.adults')}, 2 {t('common.children')}</SelectItem>
                        <SelectItem value="3">3 {t('common.adults')}</SelectItem>
                        <SelectItem value="4">4 {t('common.adults')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button type="submit" className="bg-primary text-white px-8 py-6">
                    <Search className="mr-2 h-4 w-4" />
                    {t('packages.findPackages')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Packages Results Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  {t('common.filters')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Range Filter */}
                <div>
                  <h3 className="font-medium mb-4 flex items-center">
                    <CircleDollarSign className="mr-2 h-4 w-4 text-primary" />
                    {t('packages.price')}
                  </h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[500, 3000]}
                      min={0}
                      max={5000}
                      step={100}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex justify-between mt-2 text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Duration Filter */}
                <div>
                  <h3 className="font-medium mb-4 flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4 text-primary" />
                    {t('packages.duration')}
                  </h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[3, 14]}
                      min={1}
                      max={21}
                      step={1}
                      value={duration}
                      onValueChange={setDuration}
                    />
                    <div className="flex justify-between mt-2 text-sm">
                      <span>{duration[0]} {t('days')}</span>
                      <span>{duration[1]} {t('days')}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Package Type Filter */}
                <div>
                  <h3 className="font-medium mb-4">{t('packages.type')}</h3>
                  <div className="space-y-2">
                    {packageTypes.map((type) => (
                      <div key={type.id} className="flex items-center">
                        <Checkbox 
                          id={`type-${type.id}`} 
                          checked={selectedTypes.includes(type.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTypes([...selectedTypes, type.id]);
                            } else {
                              setSelectedTypes(selectedTypes.filter(t => t !== type.id));
                            }
                          }}
                        />
                        <label htmlFor={`type-${type.id}`} className="ml-2 text-sm font-medium">
                          {t(`packages.${type.id}`, type.name)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Package Category Filter */}
                <div>
                  <h3 className="font-medium mb-4">{t('packages.category')}</h3>
                  <div className="space-y-2">
                    {packageCategories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <Checkbox 
                          id={`category-${category.id}`} 
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([...selectedCategories, category.id]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(c => c !== category.id));
                            }
                          }}
                        />
                        <label htmlFor={`category-${category.id}`} className="ml-2 text-sm font-medium">
                          {t(`packages.${category.id}`, category.name)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Rating Filter */}
                <div>
                  <h3 className="font-medium mb-4">{t('packages.rating')}</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <Checkbox 
                          id={`rating-${rating}`} 
                          checked={minRating === rating}
                          onCheckedChange={(checked) => {
                            if (checked) setMinRating(rating);
                            else if (minRating === rating) setMinRating(0);
                          }}
                        />
                        <label htmlFor={`rating-${rating}`} className="ml-2 text-sm font-medium flex items-center">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          ))}
                          {Array.from({ length: 5 - rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-gray-300" />
                          ))}
                          <span className="ml-2">{t('andAbove', '& above')}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Results */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{t('packages.availablePackages')}</h2>
              <p className="text-sm text-gray-500">{filteredPackages.length} {t('packages.found')}</p>
            </div>
            
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-60 md:h-full" />
                    <div className="md:col-span-2 p-6 space-y-4">
                      <Skeleton className="h-8 w-48" />
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex justify-between items-center mt-6">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-10 w-32 rounded-md" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">Failed to load packages. Please try again later.</p>
              </div>
            ) : filteredPackages.length === 0 ? (
              <div className="text-center py-8">
                <p>No packages found matching your criteria. Try adjusting your filters.</p>
              </div>
            ) : (
              // Package results
              <div className="space-y-6">
                {filteredPackages.map((pkg) => (
                  <Card key={pkg.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative h-60 md:h-auto overflow-hidden">
                        <img 
                          src={pkg.images[0]} 
                          alt={pkg.name} 
                          className="w-full h-full object-cover"
                        />
                        {pkg.discount && (
                          <div className="absolute top-4 left-4 bg-secondary text-white text-sm font-medium px-2 py-1 rounded">
                            {pkg.discount}% {t('discount')}
                          </div>
                        )}
                        <button 
                          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                          onClick={() => toggleFavorite(pkg.id)}
                        >
                          <Heart 
                            className={cn(
                              "h-5 w-5", 
                              favorites.includes(pkg.id) 
                                ? "fill-red-500 text-red-500" 
                                : "text-gray-400"
                            )} 
                          />
                        </button>
                      </div>
                      <div className="md:col-span-2 p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{pkg.name}</h3>
                            <div className="flex items-center mb-2">
                              <MapPin className="h-4 w-4 text-primary mr-1" />
                              <span className="text-gray-600">{pkg.destination}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center justify-end mb-1">
                              {Array.from({ length: Math.floor(pkg.rating) }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              ))}
                              {pkg.rating % 1 !== 0 && (
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              )}
                              {Array.from({ length: 5 - Math.ceil(pkg.rating) }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-gray-300" />
                              ))}
                              <span className="ml-2 text-sm">{pkg.rating}</span>
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{pkg.duration} {t('days')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4 line-clamp-2">{pkg.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="inline-flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-xs">
                            {t(`packages.${pkg.type}`, pkg.type)}
                          </span>
                          <span className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs">
                            {t(`packages.${pkg.category}`, pkg.category)}
                          </span>
                          {pkg.inclusions.slice(0, 3).map((inclusion, idx) => (
                            <span key={idx} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                              {inclusion}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex flex-wrap justify-between items-center mt-4">
                          <div>
                            {pkg.discount ? (
                              <div>
                                <span className="text-2xl font-bold">${((pkg.price * (100 - pkg.discount) / 100) / 100).toFixed(2)}</span>
                                <span className="text-gray-500 line-through ml-2">${(pkg.price / 100).toFixed(2)}</span>
                                <span className="text-gray-600 text-sm"> / {t('person')}</span>
                              </div>
                            ) : (
                              <div>
                                <span className="text-2xl font-bold">${(pkg.price / 100).toFixed(2)}</span>
                                <span className="text-gray-600 text-sm"> / {t('person')}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={() => setActivePackage(activePackage === pkg.id ? null : pkg.id)}
                            >
                              {t('packages.details')}
                            </Button>
                            <Button 
                              className="bg-primary text-white"
                              onClick={() => handleBook(pkg.id)}
                            >
                              {t('common.bookNow')}
                            </Button>
                          </div>
                        </div>
                        
                        {activePackage === pkg.id && (
                          <div className="mt-6 pt-6 border-t">
                            <Tabs defaultValue="inclusions">
                              <TabsList>
                                <TabsTrigger value="inclusions">{t('packages.inclusions')}</TabsTrigger>
                                <TabsTrigger value="exclusions">{t('packages.exclusions')}</TabsTrigger>
                                <TabsTrigger value="itinerary">{t('packages.itinerary')}</TabsTrigger>
                              </TabsList>
                              <TabsContent value="inclusions">
                                <ul className="list-disc list-inside space-y-1 mt-4">
                                  {pkg.inclusions.map((item, idx) => (
                                    <li key={idx} className="text-sm text-gray-700 flex items-start">
                                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </TabsContent>
                              <TabsContent value="exclusions">
                                <ul className="list-disc list-inside space-y-1 mt-4">
                                  {pkg.exclusions.map((item, idx) => (
                                    <li key={idx} className="text-sm text-gray-700">
                                      <span className="text-red-500 mr-2">✕</span>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </TabsContent>
                              <TabsContent value="itinerary">
                                <div className="space-y-4 mt-4">
                                  {Array.from({ length: Math.min(pkg.duration, 3) }).map((_, idx) => (
                                    <div key={idx} className="border-l-2 border-primary pl-4 pb-4">
                                      <h4 className="font-medium">{t('day')} {idx + 1}</h4>
                                      <p className="text-sm text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac magna at nunc fermentum.</p>
                                    </div>
                                  ))}
                                  <button className="text-primary text-sm font-medium flex items-center hover:underline">
                                    {t('packages.viewFullItinerary')}
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                  </button>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Featured Destinations */}
      <div className="bg-light py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center font-poppins">
            {t('packages.popularDestinations')}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group overflow-hidden hover:shadow-lg transition-all">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="Paris" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">Paris</h3>
                  <p className="text-sm text-white/80">France</p>
                </div>
              </div>
              <CardFooter className="p-4 bg-white">
                <Button className="w-full bg-primary text-white">{t('packages.explorePackages')}</Button>
              </CardFooter>
            </Card>
            
            <Card className="group overflow-hidden hover:shadow-lg transition-all">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="Dubai" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">Dubai</h3>
                  <p className="text-sm text-white/80">UAE</p>
                </div>
              </div>
              <CardFooter className="p-4 bg-white">
                <Button className="w-full bg-primary text-white">{t('packages.explorePackages')}</Button>
              </CardFooter>
            </Card>
            
            <Card className="group overflow-hidden hover:shadow-lg transition-all">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="Venice" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">Venice</h3>
                  <p className="text-sm text-white/80">Italy</p>
                </div>
              </div>
              <CardFooter className="p-4 bg-white">
                <Button className="w-full bg-primary text-white">{t('packages.explorePackages')}</Button>
              </CardFooter>
            </Card>
            
            <Card className="group overflow-hidden hover:shadow-lg transition-all">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="Tokyo" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">Tokyo</h3>
                  <p className="text-sm text-white/80">Japan</p>
                </div>
              </div>
              <CardFooter className="p-4 bg-white">
                <Button className="w-full bg-primary text-white">{t('packages.explorePackages')}</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default PackagesPage;
