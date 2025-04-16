import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <div className="relative h-[500px] lg:h-[600px] overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1580655653885-65763b2597d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
        alt="Luxury travel destination" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
      <div className="absolute inset-0 flex flex-col justify-center items-center px-4 z-10 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-poppins mb-4">
          {t('home.heroTitle')}
        </h1>
        <p className="text-xl text-white mb-8 max-w-3xl">
          {t('home.heroSubtitle')}
        </p>
      </div>
    </div>
  );
};

export default Hero;
