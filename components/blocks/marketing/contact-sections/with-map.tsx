import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function WithMap() {
  return (
    <div className="container mx-auto px-4 py-24 md:px-6 lg:py-32 2xl:max-w-[1400px]">
      <div className="mx-auto max-w-2xl lg:max-w-5xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Get in touch</h1>
          <p className="text-muted-foreground mt-3">
            We&apos;d love to hear from you. Please fill out this form.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <Card className="p-0">
            <CardContent className="p-6">
              <form>
                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First name</Label>
                      <Input id="first-name" placeholder="First name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input id="last-name" placeholder="Last name" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Email" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="Phone" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Your message"
                      className="min-h-[350px]"
                      rows={14}
                    />
                  </div>

                  <Button type="submit">Send message</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Map and Contact Info */}
          <div className="space-y-6">
            <div className="bg-muted relative aspect-square w-full overflow-hidden rounded-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.9416307263784!2d-0.12574468422944231!3d51.50718397963522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604c7c7eb9be3%3A0x3918653583725b56!2sRiver%20Thames!5e0!3m2!1sen!2suk!4v1647095757714!5m2!1sen!2suk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="text-muted-foreground mt-1 h-5 w-5 shrink-0" />
                <div>
                  <h3 className="font-medium">Visit us</h3>
                  <p className="text-muted-foreground text-sm">
                    100 Smith Street, Melbourne VIC 3000, Australia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="text-muted-foreground mt-1 h-5 w-5 shrink-0" />
                <div>
                  <h3 className="font-medium">Email us</h3>
                  <a
                    href="mailto:hello@example.com"
                    className="text-primary text-sm hover:underline"
                  >
                    hello@example.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="text-muted-foreground mt-1 h-5 w-5 shrink-0" />
                <div>
                  <h3 className="font-medium">Call us</h3>
                  <a
                    href="tel:+1234567890"
                    className="text-primary text-sm hover:underline"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
