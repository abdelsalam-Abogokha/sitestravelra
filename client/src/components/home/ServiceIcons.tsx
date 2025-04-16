import { useTranslation } from 'react-i18next';
import { Plane, Hotel, FileText, Globe, Truck, Briefcase } from 'lucide-react';

const ServiceIcons = () => {
  const { t } = useTranslation();

  const services = [
    { 
      icon: <Plane className="text-2xl" />, 
      title: t('common.flights'), 
      description: t('flights.economy')
    },
    { 
      icon: <Hotel className="text-2xl" />, 
      title: t('common.hotels'), 
      description: t('hotels.pricePerNight')
    },
    { 
      icon: <FileText className="text-2xl" />, 
      title: t('common.visas'), 
      description: t('visas.processingTime')
    },
    { 
      icon: <Globe className="text-2xl" />, 
      title: t('common.translation'), 
      description: t('translation.certified')
    },
    { 
      icon: <Truck className="text-2xl" />, 
      title: t('common.shipping'), 
      description: t('shipping.trackShipment')
    },
    { 
      icon: <Briefcase className="text-2xl" />, 
      title: t('common.packages'), 
      description: t('packages.type')
    },
  ];

  return (
    <section className="pt-40 pb-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 font-poppins">{t('common.ourServices')}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          {services.map((service, index) => (
            <div key={index} className="bg-light hover:shadow-lg transition-shadow duration-300 p-4 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                {service.icon}
              </div>
              <h3 className="font-medium mb-1">{service.title}</h3>
              <p className="text-sm text-text-secondary">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceIcons;
