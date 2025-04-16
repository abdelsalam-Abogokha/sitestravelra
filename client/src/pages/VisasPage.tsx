import { useTranslation } from 'react-i18next';
import UserLayout from '@/components/layout/UserLayout';
import { Helmet } from 'react-helmet';

const VisasPage = () => {
  const { t } = useTranslation();
  
  return (
    <UserLayout>
      <Helmet>
        <title>TravelEase - {t('common.visas')}</title>
        <meta name="description" content="Apply for visa services to any destination with our streamlined application process." />
      </Helmet>
      
      <div className="bg-primary/10 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center font-poppins">
            {t('common.visas')}
          </h1>
          <p className="text-lg text-center text-text-secondary mb-8 max-w-2xl mx-auto">
            {t('visas.subtitle', 'Apply for visa services to any destination with our streamlined application process.')}
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <p className="text-lg mb-4">
            {t('visas.comingSoon', 'Visa application functionality is coming soon!')}
          </p>
          <p className="text-text-secondary max-w-lg mx-auto">
            {t('common.underDevelopment', 'This page is currently under development. Please check back later for updates.')}
          </p>
        </div>
      </div>
    </UserLayout>
  );
};

export default VisasPage;