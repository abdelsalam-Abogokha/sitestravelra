import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserLayout from '@/components/layout/UserLayout';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Plane, 
  Building2, 
  Globe, 
  FileText, 
  Truck, 
  MessageSquare,
  MapPin,
  CalendarRange,
  Users,
  PlaneTakeoff,
  Hotel,
  Compass,
  Briefcase,
  ArrowRight,
  Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const popularDestinations = [
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews: 1204
  },
  {
    name: 'Istanbul',
    country: 'Turkey',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviews: 982
  },
  {
    name: 'Cairo',
    country: 'Egypt',
    image: 'https://images.unsplash.com/photo-1539768942896-daf3f4431a4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviews: 756
  },
  {
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviews: 1503
  }
];

const featuredPackages = [
  {
    title: 'Dubai City Tour',
    description: '5 days of luxury experience in the heart of Dubai',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    savings: 15
  },
  {
    title: 'Turkish Delight',
    description: '7 days exploring Istanbul and Cappadocia',
    price: 999,
    image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    savings: 20
  },
  {
    title: 'Egyptian Wonders',
    description: '8 days visiting pyramids and cruising the Nile',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    savings: 12
  }
];

const services = [
  { 
    name: 'Flights', 
    description: 'Book international and domestic flights at competitive prices',
    icon: <PlaneTakeoff className="h-10 w-10 text-primary" />,
    link: '/flights'
  },
  { 
    name: 'Hotels', 
    description: 'Find and book hotels, resorts, and apartments worldwide',
    icon: <Hotel className="h-10 w-10 text-primary" />,
    link: '/hotels'
  },
  { 
    name: 'Visa Services', 
    description: 'Hassle-free visa application and processing services',
    icon: <FileText className="h-10 w-10 text-primary" />,
    link: '/visas'
  },
  { 
    name: 'Travel Packages', 
    description: 'Explore our curated travel packages for unforgettable experiences',
    icon: <Globe className="h-10 w-10 text-primary" />,
    link: '/packages'
  },
  { 
    name: 'Translation Services', 
    description: 'Professional translation services for all your travel documents',
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    link: '/translation'
  },
  { 
    name: 'Shipping Services', 
    description: 'Reliable shipping and logistics solutions worldwide',
    icon: <Truck className="h-10 w-10 text-primary" />,
    link: '/shipping'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Business Traveler',
    content: 'TravelEase made my business trip planning so much easier. Their visa services were especially helpful and saved me a lot of time.',
    image: 'https://randomuser.me/api/portraits/women/32.jpg'
  },
  {
    name: 'Mohammed Al-Farsi',
    role: 'Adventure Seeker',
    content: 'The Dubai package was amazing! Everything was well-organized and the customer service was exceptional. Will definitely book through them again.',
    image: 'https://randomuser.me/api/portraits/men/22.jpg'
  },
  {
    name: 'Emily Chen',
    role: 'Family Traveler',
    content: 'As a mother of two, planning family trips can be stressful. TravelEase took care of everything and made our family vacation truly memorable.',
    image: 'https://randomuser.me/api/portraits/women/56.jpg'
  }
];

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [flightSearch, setFlightSearch] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: '1'
  });
  
  return (
    <UserLayout>
      <Helmet>
        <title>TravelEase - {t('home.title', 'Your Travel Partner')}</title>
        <meta name="description" content="TravelEase offers comprehensive travel services including flights, hotels, visa processing, travel packages, and more." />
      </Helmet>
      
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/70 opacity-90 z-10"></div>
        <div className="h-[70vh] min-h-[600px] bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 font-poppins">
              {t('home.heroTitle', 'Discover the World with TravelEase')}
            </h1>
            <p className="text-xl sm:text-2xl max-w-3xl mx-auto mb-10">
              {t('home.heroSubtitle', 'Your one-stop solution for flights, hotels, visa services, and more')}
            </p>
            <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden shadow-xl">
              <Tabs defaultValue="flights" className="w-full">
                <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-gray-100">
                  <TabsTrigger value="flights" className="data-[state=active]:bg-white">
                    <Plane className="mr-2 h-4 w-4" />
                    {t('common.flights')}
                  </TabsTrigger>
                  <TabsTrigger value="hotels" className="data-[state=active]:bg-white">
                    <Building2 className="mr-2 h-4 w-4" />
                    {t('common.hotels')}
                  </TabsTrigger>
                  <TabsTrigger value="packages" className="data-[state=active]:bg-white">
                    <Globe className="mr-2 h-4 w-4" />
                    {t('common.packages')}
                  </TabsTrigger>
                  <TabsTrigger value="visas" className="data-[state=active]:bg-white">
                    <FileText className="mr-2 h-4 w-4" />
                    {t('common.visas')}
                  </TabsTrigger>
                  <TabsTrigger value="translation" className="data-[state=active]:bg-white">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {t('common.translation')}
                  </TabsTrigger>
                  <TabsTrigger value="shipping" className="data-[state=active]:bg-white">
                    <Truck className="mr-2 h-4 w-4" />
                    {t('common.shipping')}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="flights" className="p-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-2">
                      <Label htmlFor="from">{t('flights.from')}</Label>
                      <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="from" 
                          className="pl-10" 
                          placeholder={t('flights.fromPlaceholder', 'City or airport')}
                          value={flightSearch.from}
                          onChange={e => setFlightSearch({...flightSearch, from: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <Label htmlFor="to">{t('flights.to')}</Label>
                      <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="to" 
                          className="pl-10" 
                          placeholder={t('flights.toPlaceholder', 'City or airport')}
                          value={flightSearch.to}
                          onChange={e => setFlightSearch({...flightSearch, to: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="lg:col-span-1 row-start-2 md:row-start-1 lg:row-start-1">
                      <Label htmlFor="passengers">{t('flights.passengers')}</Label>
                      <div className="relative mt-1">
                        <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Select 
                          defaultValue="1"
                          onValueChange={value => setFlightSearch({...flightSearch, passengers: value})}
                        >
                          <SelectTrigger id="passengers" className="pl-10">
                            <SelectValue placeholder={t('flights.selectPassengers', 'Select')} />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map(num => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? t('flights.passenger', 'Passenger') : t('flights.passengers', 'Passengers')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <Label htmlFor="depart">{t('flights.departDate')}</Label>
                      <div className="relative mt-1">
                        <CalendarRange className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="depart" 
                          type="date" 
                          className="pl-10"
                          value={flightSearch.departDate}
                          onChange={e => setFlightSearch({...flightSearch, departDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <Label htmlFor="return">{t('flights.returnDate')}</Label>
                      <div className="relative mt-1">
                        <CalendarRange className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          id="return" 
                          type="date" 
                          className="pl-10"
                          value={flightSearch.returnDate}
                          onChange={e => setFlightSearch({...flightSearch, returnDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="lg:col-span-1 flex items-end">
                      <Button className="w-full mt-1 bg-primary text-white" size="lg">
                        <Search className="mr-2 h-4 w-4" />
                        {t('common.search')}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="hotels" className="p-6 text-center">
                  <Link href="/hotels">
                    <Button className="bg-primary text-white" size="lg">
                      {t('common.searchHotels', 'Search Hotels')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </TabsContent>
                
                <TabsContent value="packages" className="p-6 text-center">
                  <Link href="/packages">
                    <Button className="bg-primary text-white" size="lg">
                      {t('common.browsePackages', 'Browse Packages')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </TabsContent>
                
                <TabsContent value="visas" className="p-6 text-center">
                  <Link href="/visas">
                    <Button className="bg-primary text-white" size="lg">
                      {t('common.applyForVisa', 'Apply for Visa')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </TabsContent>
                
                <TabsContent value="translation" className="p-6 text-center">
                  <Link href="/translation">
                    <Button className="bg-primary text-white" size="lg">
                      {t('common.requestTranslation', 'Request Translation')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </TabsContent>
                
                <TabsContent value="shipping" className="p-6 text-center">
                  <Link href="/shipping">
                    <Button className="bg-primary text-white" size="lg">
                      {t('common.shipPackage', 'Ship Package')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      {/* Services Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-2 font-poppins">
          {t('home.ourServices', 'Our Services')}
        </h2>
        <p className="text-text-secondary text-center mb-12 max-w-3xl mx-auto">
          {t('home.servicesSubtitle', 'Comprehensive travel solutions to make your journey seamless from planning to return')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link href={service.link} key={index}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{t(`common.${service.name.toLowerCase()}`, service.name)}</h3>
                  <p className="text-text-secondary">{t(`home.${service.name.toLowerCase()}Description`, service.description)}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="text-primary p-0 hover:bg-transparent hover:text-primary-dark">
                    {t('common.learnMore', 'Learn More')}
                    <ArrowRight className={`ml-2 h-4 w-4 ${isRtl ? 'transform rotate-180' : ''}`} />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Featured Packages */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2 font-poppins">
            {t('home.featuredPackages', 'Featured Travel Packages')}
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-3xl mx-auto">
            {t('home.packagesSubtitle', 'Exclusive offers on our most popular destinations')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPackages.map((pkg, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
                    {t('common.save', 'Save')} {pkg.savings}%
                  </div>
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                  <p className="text-text-secondary mb-4">{pkg.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-primary">${pkg.price}</span>
                      <span className="text-sm text-text-secondary ml-1">{t('common.perPerson', '/person')}</span>
                    </div>
                    <Button className="bg-primary text-white">
                      {t('common.viewDetails', 'View Details')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/packages">
              <Button variant="outline" size="lg">
                {t('home.viewAllPackages', 'View All Packages')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Popular Destinations */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-2 font-poppins">
          {t('home.popularDestinations', 'Popular Destinations')}
        </h2>
        <p className="text-text-secondary text-center mb-12 max-w-3xl mx-auto">
          {t('home.destinationsSubtitle', 'Discover our travelers\' favorite places to visit')}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((destination, index) => (
            <div key={index} className="group relative rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors z-10"></div>
              <img src={destination.image} alt={destination.name} className="w-full h-80 object-cover transition-transform group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <div className="flex items-center mb-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-sm ml-1">{destination.rating}</span>
                  <span className="text-white/70 text-xs ml-2">({destination.reviews} {t('common.reviews', 'reviews')})</span>
                </div>
                <h3 className="text-white text-xl font-bold">{destination.name}</h3>
                <p className="text-white/70">{destination.country}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2 font-poppins">
            {t('home.whatClientsSay', 'What Our Clients Say')}
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-3xl mx-auto">
            {t('home.testimonialsSubtitle', 'Read testimonials from our satisfied customers')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <p className="text-sm text-text-secondary">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className="inline-block h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-text-secondary italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 font-poppins">
            {t('home.readyToTravel', 'Ready to Explore the World?')}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('home.ctaSubtitle', 'Sign up now to receive exclusive offers and travel inspirations')}
          </p>
          
          <div className="flex flex-col sm:flex-row max-w-md mx-auto space-y-4 sm:space-y-0 sm:space-x-4">
            <Input 
              type="email" 
              placeholder={t('home.emailPlaceholder', 'Your email address')}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70 sm:flex-1"
            />
            <Button variant="secondary">
              {t('common.subscribe', 'Subscribe')}
            </Button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default HomePage;