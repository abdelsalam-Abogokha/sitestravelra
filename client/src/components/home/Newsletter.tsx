import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

const newsletterSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

const Newsletter = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: NewsletterFormValues) {
    setIsSubmitting(true);
    try {
      // In a real app, you would call an API here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: t('common.success'),
        description: 'You have been subscribed to our newsletter!',
      });
      form.reset();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to subscribe. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6 font-poppins">
            {t('common.newsletter')}
          </h2>
          <p className="text-white/80 mb-8">
            {t('common.newsletterText', 'Get exclusive travel deals, insider tips, and more delivered straight to your inbox.')}
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder={t('common.emailPlaceholder')} 
                        className="py-3 px-4 rounded-lg border-0 focus:ring-2 focus:ring-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-white" />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="bg-secondary text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <i className="animate-spin mr-2">⟳</i> {t('common.submitting', 'Submitting...')}
                  </span>
                ) : (
                  t('common.subscribe')
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
