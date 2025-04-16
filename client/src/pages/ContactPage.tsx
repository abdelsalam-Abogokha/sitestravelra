import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserLayout from '@/components/layout/UserLayout';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const contactFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  subject: z.string().min(1, { message: 'Subject is required' }),
  message: z.string().min(10, { message: 'Message should be at least 10 characters' }),
});

const ContactPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });
  
  const onSubmit = async (values: z.infer<typeof contactFormSchema>) => {
    setIsSubmitting(true);
    try {
      // In a real application, we would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: t('common.success'),
        description: t('contact.messageSent', 'Your message has been sent. We will get back to you soon!'),
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('contact.messageError', 'Failed to send your message. Please try again.'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <UserLayout>
      <Helmet>
        <title>TravelEase - {t('common.contact')}</title>
        <meta name="description" content="Contact our team for any inquiries about travel packages, bookings, or customer support." />
      </Helmet>
      
      <div className="bg-primary/10 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center font-poppins">
            {t('common.contact')}
          </h1>
          <p className="text-lg text-center text-text-secondary mb-8 max-w-2xl mx-auto">
            {t('contact.subtitle', 'Have questions or need assistance? Reach out to our team and we will get back to you as soon as possible.')}
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{t('contact.getInTouch', 'Get In Touch')}</CardTitle>
                <CardDescription>
                  {t('contact.reachOut', 'Reach out to us through any of these channels')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex">
                  <div className="mr-4 bg-primary/10 rounded-full p-3">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{t('contact.visitUs', 'Visit Us')}</h3>
                    <p className="text-text-secondary">
                      123 Travel Street, Downtown
                      <br />
                      Dubai, United Arab Emirates
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 bg-primary/10 rounded-full p-3">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{t('contact.emailUs', 'Email Us')}</h3>
                    <p className="text-text-secondary">
                      info@travelease.com
                      <br />
                      support@travelease.com
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 bg-primary/10 rounded-full p-3">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{t('contact.callUs', 'Call Us')}</h3>
                    <p className="text-text-secondary">
                      +971 4 123 4567
                      <br />
                      +971 50 987 6543
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 bg-primary/10 rounded-full p-3">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{t('contact.workingHours', 'Working Hours')}</h3>
                    <p className="text-text-secondary">
                      {t('contact.weekdays', 'Monday - Friday: 9am - 6pm')}
                      <br />
                      {t('contact.weekends', 'Saturday: 10am - 4pm')}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <h3 className="font-medium mb-4">{t('contact.followUs', 'Follow Us')}</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors">
                      <Facebook className="h-5 w-5 text-primary" />
                    </a>
                    <a href="#" className="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors">
                      <Twitter className="h-5 w-5 text-primary" />
                    </a>
                    <a href="#" className="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors">
                      <Instagram className="h-5 w-5 text-primary" />
                    </a>
                    <a href="#" className="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors">
                      <Linkedin className="h-5 w-5 text-primary" />
                    </a>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('contact.sendMessage', 'Send Us a Message')}</CardTitle>
                <CardDescription>
                  {t('contact.fillForm', 'Fill out the form below and we will get back to you as soon as possible')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('common.name')}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('contact.yourName', 'Your Name')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('common.email')}</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder={t('contact.yourEmail', 'Your Email')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('contact.subject')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('contact.messageSubject', 'Message Subject')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('contact.message')}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={t('contact.yourMessage', 'Write your message here...')} 
                              className="min-h-[200px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="bg-primary text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <i className="animate-spin mr-2">⟳</i> {t('common.submitting', 'Submitting...')}
                        </span>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          {t('contact.sendMessage', 'Send Message')}
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">{t('contact.location', 'Our Location')}</h3>
              {/* Replace with an actual Google Maps embed in a real application */}
              <div className="w-full h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
                <MapPin className="h-8 w-8 text-gray-400 mr-2" />
                <span className="text-gray-500">Google Maps would be embedded here</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            {t('contact.faq', 'Frequently Asked Questions')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('contact.bookingCancellation', 'How can I cancel my booking?')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  {t('contact.cancellationAnswer', 'You can cancel your booking by logging into your account and navigating to the "My Bookings" section. Click on the booking you wish to cancel and follow the cancellation instructions. Note that cancellation policies vary depending on the service provider.')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('contact.paymentMethods', 'What payment methods do you accept?')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  {t('contact.paymentAnswer', 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. For certain destinations, we also offer payment on arrival options.')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('contact.refundPolicy', 'What is your refund policy?')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  {t('contact.refundAnswer', 'Refund policies depend on the type of service and the terms set by our partners. Generally, cancellations made 48 hours or more before the scheduled service are eligible for a full refund. Please check the specific terms for each booking.')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('contact.groupBookings', 'Do you offer discounts for group bookings?')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  {t('contact.groupBookingsAnswer', 'Yes, we offer special rates for group bookings of 10 or more people. Please contact our customer service team for more information and to receive a customized quote for your group.')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ContactPage;