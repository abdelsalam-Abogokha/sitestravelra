import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';

interface Destination {
  id: number;
  name: string;
  country: string;
  image: string;
  price: number;
  discount?: string;
  rating: number;
  popular?: boolean;
}

const featuredDestinations: Destination[] = [
  {
    id: 1,
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    price: 899,
    discount: '20% OFF',
    rating: 4.8
  },
  {
    id: 2,
    name: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    price: 1199,
    popular: true,
    rating: 4.9
  },
  {
    id: 3,
    name: 'New York',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    price: 1299,
    rating: 4.7
  },
  {
    id: 4,
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    price: 1599,
    discount: '15% OFF',
    rating: 4.8
  }
];

const FeaturedDestinations = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  // Fetch destinations
  const { data: destinations, isLoading, error } = useQuery({
    queryKey: ['/api/travel-packages'],
    enabled: false, // Disable for now, use mock data
  });

  // For the MVP, use the static data instead of API call
  const displayDestinations = destinations || featuredDestinations;

  return (
    <section className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold font-poppins">{t('common.popularDestinations')}</h2>
          <Link href="/packages" className="text-primary hover:text-primary-dark transition-colors duration-200 flex items-center">
            <span>{t('common.viewAll')}</span>
            <ArrowRight className={`ml-2 h-4 w-4 ${isRtl ? 'transform rotate-180' : ''}`} />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-10 w-20 rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-error py-10">
            <p>Failed to load destinations. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="w-full h-full object-cover"
                  />
                  {destination.discount && (
                    <div className="absolute top-4 right-4 bg-secondary text-white text-sm py-1 px-2 rounded-lg">
                      {destination.discount}
                    </div>
                  )}
                  {destination.popular && (
                    <div className="absolute top-4 right-4 bg-info text-white text-sm py-1 px-2 rounded-lg">
                      {t('flights.popular', 'POPULAR')}
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold">{destination.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="ml-1">{destination.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-text-secondary mb-4">
                    <MapPin className="mr-2 h-4 w-4 text-primary" />
                    <span>{destination.country}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-bold">${destination.price}</span>
                      <span className="text-text-secondary text-sm"> / {t('packages.person', 'person')}</span>
                    </div>
                    <Button className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-200">
                      {t('common.bookNow')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDestinations;
