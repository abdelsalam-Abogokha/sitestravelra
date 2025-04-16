import { useTranslation } from 'react-i18next';
import UserLayout from '@/components/layout/UserLayout';
import { Helmet } from 'react-helmet';

const HotelsPage = () => {
  const { t } = useTranslation();
  
  return (
    <UserLayout>
      <Helmet>
        <title>TravelEase - {t('common.hotels')}</title>
        <meta name="description" content="Find and book hotels, resorts, and apartments worldwide." />
      </Helmet>
      
      <div className="bg-primary/10 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center font-poppins">
            {t('common.hotels')}
          </h1>
          <p className="text-lg text-center text-text-secondary mb-8 max-w-2xl mx-auto">
            {t('hotels.subtitle', 'Find and book hotels, resorts, and apartments worldwide.')}
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <p className="text-lg mb-4">
            {t('hotels.comingSoon', 'Hotel booking functionality is coming soon!')}
          </p>
          <p className="text-text-secondary max-w-lg mx-auto">
            {t('common.underDevelopment', 'This page is currently under development. Please check back later for updates.')}
          </p>
        </div>
      </div>
    </UserLayout>
  );
};

export default HotelsPage;