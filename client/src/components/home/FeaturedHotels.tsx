import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';

interface Hotel {
  id: number;
  name: string;
  location: string;
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  description: string;
}

const featuredHotels: Hotel[] = [
  {
    id: 1,
    name: 'Luxury Beach Resort',
    location: 'Maldives',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    price: 399,
    originalPrice: 599,
    rating: 5.0,
    reviews: 120,
    description: 'Beachfront villa with private pool and butler service'
  },
  {
    id: 2,
    name: 'Mountain Retreat',
    location: 'Switzerland',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    price: 299,
    originalPrice: 459,
    rating: 4.5,
    reviews: 85,
    description: 'Alpine suite with panoramic mountain views'
  },
  {
    id: 3,
    name: 'Historic City Hotel',
    location: 'Rome, Italy',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    price: 249,
    originalPrice: 349,
    rating: 4.0,
    reviews: 102,
    description: 'Elegant room in a historic building near landmarks'
  }
];

const FeaturedHotels = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  // Fetch hotels
  const { data: hotels, isLoading, error } = useQuery({
    queryKey: ['/api/hotels'],
    enabled: false, // Disable for now, use mock data
  });

  // For the MVP, use the static data instead of API call
  const displayHotels = hotels || featuredHotels;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold font-poppins">{t('common.bestOffers')}</h2>
          <Link href="/hotels" className="text-primary hover:text-primary-dark transition-colors duration-200 flex items-center">
            <span>{t('common.viewAll')}</span>
            <ArrowRight className={`ml-2 h-4 w-4 ${isRtl ? 'transform rotate-180' : ''}`} />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-36 mb-2" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-20 rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-error py-10">
            <p>Failed to load hotels. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayHotels.map((hotel) => (
              <Card key={hotel.id} className="bg-light rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-64">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-xl font-semibold text-white">{hotel.name}</h3>
                    <div className="flex items-center text-white">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>{hotel.location}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(hotel.rating) ? 'fill-yellow-500' : ''}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-text-secondary">{hotel.rating} ({hotel.reviews} reviews)</span>
                  </div>
                  <p className="text-text-secondary mb-4">{hotel.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-bold">${hotel.price}</span>
                      <span className="text-text-secondary line-through ml-2">${hotel.originalPrice}</span>
                      <span className="text-text-secondary text-sm"> / night</span>
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

export default FeaturedHotels;
