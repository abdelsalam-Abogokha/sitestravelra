import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { CalendarIcon, Search, Plane, Hotel, MapPin, UserCircle, CalendarCheck, CalendarX, DoorOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabType = 'flights' | 'hotels' | 'packages';

const SearchBox = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('flights');
  const isRtl = i18n.language === 'ar';

  // Flight form state
  const [flightOrigin, setFlightOrigin] = useState<string>('');
  const [flightDestination, setFlightDestination] = useState<string>('');
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = useState<string>('1 Adult');

  // Hotel form state
  const [hotelDestination, setHotelDestination] = useState<string>('');
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [rooms, setRooms] = useState<string>('1 Room');
  const [adults, setAdults] = useState<string>('2 Adults');
  const [children, setChildren] = useState<string>('0 Children');

  // Package form state
  const [packageDestination, setPackageDestination] = useState<string>('');
  const [packageDeparture, setPackageDeparture] = useState<Date | undefined>(undefined);
  const [packageAdults, setPackageAdults] = useState<string>('2 Adults');
  const [packageChildren, setPackageChildren] = useState<string>('0 Children');

  const handleFlightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!flightOrigin || !flightDestination || !departureDate) {
      toast({
        title: t('common.error'),
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: t('common.success'),
      description: 'Flight search initiated',
    });
  };

  const handleHotelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hotelDestination || !checkInDate || !checkOutDate) {
      toast({
        title: t('common.error'),
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: t('common.success'),
      description: 'Hotel search initiated',
    });
  };

  const handlePackageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!packageDestination || !packageDeparture) {
      toast({
        title: t('common.error'),
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: t('common.success'),
      description: 'Package search initiated',
    });
  };

  return (
    <div className="relative">
      <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-xl p-4 md:p-6">
          <div className="mb-4 border-b">
            <div className="flex flex-wrap -mx-2">
              <div className="px-2 w-1/3">
                <button 
                  onClick={() => setActiveTab('flights')} 
                  className={cn(
                    "w-full py-2 font-medium text-center transition-colors duration-200",
                    activeTab === 'flights' 
                      ? 'border-b-2 border-primary text-primary' 
                      : 'text-gray-500 hover:text-primary'
                  )}
                >
                  <Plane className="inline-block h-4 w-4 mr-2" />
                  <span>{t('common.flights')}</span>
                </button>
              </div>
              <div className="px-2 w-1/3">
                <button 
                  onClick={() => setActiveTab('hotels')} 
                  className={cn(
                    "w-full py-2 font-medium text-center transition-colors duration-200",
                    activeTab === 'hotels' 
                      ? 'border-b-2 border-primary text-primary' 
                      : 'text-gray-500 hover:text-primary'
                  )}
                >
                  <Hotel className="inline-block h-4 w-4 mr-2" />
                  <span>{t('common.hotels')}</span>
                </button>
              </div>
              <div className="px-2 w-1/3">
                <button 
                  onClick={() => setActiveTab('packages')} 
                  className={cn(
                    "w-full py-2 font-medium text-center transition-colors duration-200",
                    activeTab === 'packages' 
                      ? 'border-b-2 border-primary text-primary' 
                      : 'text-gray-500 hover:text-primary'
                  )}
                >
                  <i className="fas fa-suitcase mr-2"></i>
                  <span>{t('common.packages')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Flight Search Form */}
          {activeTab === 'flights' && (
            <div className="pt-2">
              <form onSubmit={handleFlightSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-1">
                  <label className="block mb-1 text-sm text-gray-600">{t('common.origin')}</label>
                  <div className="relative">
                    <Plane className="absolute left-3 top-3 text-gray-400" />
                    <Input 
                      type="text" 
                      placeholder="New York" 
                      className="w-full pl-10" 
                      value={flightOrigin}
                      onChange={(e) => setFlightOrigin(e.target.value)}
                    />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block mb-1 text-sm text-gray-600">{t('common.destination')}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" />
                    <Input 
                      type="text" 
                      placeholder="London" 
                      className="w-full pl-10" 
                      value={flightDestination}
                      onChange={(e) => setFlightDestination(e.target.value)}
                    />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block mb-1 text-sm text-gray-600">{t('common.departure')}</label>
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal pl-10",
                            !departureDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          {departureDate ? (
                            format(departureDate, "PPP", { locale: isRtl ? ar : enUS })
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={departureDate}
                          onSelect={setDepartureDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block mb-1 text-sm text-gray-600">{t('common.returnDate')}</label>
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal pl-10",
                            !returnDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          {returnDate ? (
                            format(returnDate, "PPP", { locale: isRtl ? ar : enUS })
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={returnDate}
                          onSelect={setReturnDate}
                          initialFocus
                          disabled={(date) => 
                            (departureDate ? date < departureDate : false) || 
                            date < new Date()
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block mb-1 text-sm text-gray-600">{t('common.passengers')}</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-3 text-gray-400" />
                    <Select value={passengers} onValueChange={setPassengers}>
                      <SelectTrigger className="w-full pl-10">
                        <SelectValue placeholder="Select passengers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 Adult">1 Adult</SelectItem>
                        <SelectItem value="2 Adults">2 Adults</SelectItem>
                        <SelectItem value="2 Adults, 1 Child">2 Adults, 1 Child</SelectItem>
                        <SelectItem value="2 Adults, 2 Children">2 Adults, 2 Children</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="lg:col-span-5 flex justify-center mt-2">
                  <Button type="submit" className="px-8 py-6 bg-secondary text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium">
                    <Search className="mr-2 h-4 w-4" />
                    <span>{t('common.searchNow')}</span>
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Hotel Search Form */}
          {activeTab === 'hotels' && (
            <div className="pt-2">
              <form onSubmit={handleHotelSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-1">
                  <label className="block mb-1 text-sm text-gray-600">{t('common.destination')}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" />
                    <Input 
                      type="text" 
                      placeholder="Paris" 
                      className="w-full pl-10" 
                      value={hotelDestination}
                      onChange={(e) => setHotelDestination(e.target.value)}
                    />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block mb-1 text-sm text-gray-600">{t('common.checkIn')}</label>
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal pl-10",
                            !checkInDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          {checkInDate ? (
                            format(checkInDate, "PPP", { locale: isRtl ? ar : enUS })
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkInDate}
                          onSelect={setCheckInDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block mb-1 text-sm text-gray-600">{t('common.checkOut')}</label>
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal pl-10",
                            !checkOutDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarX className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          {checkOutDate ? (
                            format(checkOutDate, "PPP", { locale: isRtl ? ar : enUS })
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkOutDate}
                          onSelect={setCheckOutDate}
                          initialFocus
                          disabled={(date) => 
                            (checkInDate ? date <= checkInDate : false) || 
                            date < new Date()
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block mb-1 text-sm text-gray-600">{t('common.rooms')}</label>
                  <div className="relative">
                    <DoorOpen className="absolute left-3 top-3 text-gray-400" />
                    <Select value={rooms} onValueChange={setRooms}>
                      <SelectTrigger className="w-full pl-10">
                        <SelectValue placeholder="Select rooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 Room">1 Room</SelectItem>
                        <SelectItem value="2 Rooms">2 Rooms</SelectItem>
                        <SelectItem value="3 Rooms">3 Rooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block mb-1 text-sm text-gray-600">{t('common.adults')}</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-3 text-gray-400" />
                    <Select value={adults} onValueChange={setAdults}>
                      <SelectTrigger className="w-full pl-10">
                        <SelectValue placeholder="Select adults" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 Adult">1 Adult</SelectItem>
                        <SelectItem value="2 Adults">2 Adults</SelectItem>
                        <SelectItem value="3 Adults">3 Adults</SelectItem>
                        <SelectItem value="4 Adults">4 Adults</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="lg:col-span-5 flex justify-center mt-2">
                  <Button type="submit" className="px-8 py-6 bg-secondary text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium">
                    <Search className="mr-2 h-4 w-4" />
                    <span>{t('common.searchNow')}</span>
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Package Search Form */}
          {activeTab === 'packages' && (
            <div className="pt-2">
              <form onSubmit={handlePackageSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <label className="block mb-1 text-sm text-gray-600">{t('common.destination')}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" />
                    <Input 
                      type="text" 
                      placeholder="Dubai" 
                      className="w-full pl-10" 
                      value={packageDestination}
                      onChange={(e) => setPackageDestination(e.target.value)}
                    />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block mb-1 text-sm text-gray-600">{t('common.departure')}</label>
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal pl-10",
                            !packageDeparture && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          {packageDeparture ? (
                            format(packageDeparture, "PPP", { locale: isRtl ? ar : enUS })
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={packageDeparture}
                          onSelect={setPackageDeparture}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block mb-1 text-sm text-gray-600">{t('common.adults')}</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-3 text-gray-400" />
                    <Select value={packageAdults} onValueChange={setPackageAdults}>
                      <SelectTrigger className="w-full pl-10">
                        <SelectValue placeholder="Select adults" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 Adult">1 Adult</SelectItem>
                        <SelectItem value="2 Adults">2 Adults</SelectItem>
                        <SelectItem value="3 Adults">3 Adults</SelectItem>
                        <SelectItem value="4 Adults">4 Adults</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block mb-1 text-sm text-gray-600">{t('common.children')}</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-3 text-gray-400" />
                    <Select value={packageChildren} onValueChange={setPackageChildren}>
                      <SelectTrigger className="w-full pl-10">
                        <SelectValue placeholder="Select children" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0 Children">0 Children</SelectItem>
                        <SelectItem value="1 Child">1 Child</SelectItem>
                        <SelectItem value="2 Children">2 Children</SelectItem>
                        <SelectItem value="3 Children">3 Children</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="lg:col-span-5 flex justify-center mt-2">
                  <Button type="submit" className="px-8 py-6 bg-secondary text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium">
                    <Search className="mr-2 h-4 w-4" />
                    <span>{t('common.searchNow')}</span>
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
