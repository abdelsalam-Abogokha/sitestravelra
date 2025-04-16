import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { PlaneTakeoff, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { 
  FacebookIcon, 
  TwitterIcon, 
  InstagramIcon, 
  YoutubeIcon 
} from 'lucide-react';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <footer className="bg-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <PlaneTakeoff className="h-8 w-8 text-primary mr-2" />
              <span className="text-2xl font-bold font-poppins">TravelEase</span>
            </div>
            <p className="text-white/70 mb-6">{t('common.footerText')}</p>
            <div className={`flex ${isRtl ? 'space-x-reverse' : ''} space-x-4`}>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary transition-colors duration-200 flex items-center justify-center">
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary transition-colors duration-200 flex items-center justify-center">
                <TwitterIcon className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary transition-colors duration-200 flex items-center justify-center">
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary transition-colors duration-200 flex items-center justify-center">
                <YoutubeIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-white/70 hover:text-primary transition-colors duration-200">About Us</Link></li>
              <li><Link href="/blog" className="text-white/70 hover:text-primary transition-colors duration-200">Travel Guides</Link></li>
              <li><Link href="/faq" className="text-white/70 hover:text-primary transition-colors duration-200">FAQs</Link></li>
              <li><Link href="/privacy" className="text-white/70 hover:text-primary transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-white/70 hover:text-primary transition-colors duration-200">Terms & Conditions</Link></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6">{t('common.ourServices')}</h3>
            <ul className="space-y-3">
              <li><Link href="/flights" className="text-white/70 hover:text-primary transition-colors duration-200">{t('common.flights')}</Link></li>
              <li><Link href="/hotels" className="text-white/70 hover:text-primary transition-colors duration-200">{t('common.hotels')}</Link></li>
              <li><Link href="/visas" className="text-white/70 hover:text-primary transition-colors duration-200">{t('common.visas')}</Link></li>
              <li><Link href="/translation" className="text-white/70 hover:text-primary transition-colors duration-200">{t('common.translation')}</Link></li>
              <li><Link href="/shipping" className="text-white/70 hover:text-primary transition-colors duration-200">{t('common.shipping')}</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6">{t('common.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mt-1 mr-3" />
                <span className="text-white/70">123 Travel Street, City, Country</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-primary mt-1 mr-3" />
                <span className="text-white/70">+123 456 7890</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-primary mt-1 mr-3" />
                <span className="text-white/70">info@travelease.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-primary mt-1 mr-3" />
                <span className="text-white/70">Mon-Fri: 9AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-white/10 text-center text-white/70">
          <p>&copy; {new Date().getFullYear()} TravelEase. {t('common.copyrights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
