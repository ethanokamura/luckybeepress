"use client";

import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ContactSectionProps {
  className?: string;
}

export function ContactSection({ className = "" }: ContactSectionProps) {
  return (
    <section className={`py-16 md:py-24 bg-base-200/50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
              Get in Touch
            </h2>
            <p className="text-base-content/60 text-lg">
              Questions about wholesale ordering? We&apos;re here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact info */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <a
                    href="mailto:wholesale@luckybeepress.com"
                    className="flex items-center gap-4 text-base-content/70 hover:text-primary transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/50">Email</p>
                      <p className="font-medium text-base-content">
                        wholesale@luckybeepress.com
                      </p>
                    </div>
                  </a>

                  <a
                    href="tel:+15551234567"
                    className="flex items-center gap-4 text-base-content/70 hover:text-primary transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/50">Phone</p>
                      <p className="font-medium text-base-content">
                        (555) 123-4567
                      </p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-base-content/50">
                        Business Hours
                      </p>
                      <p className="font-medium text-base-content">
                        Mon-Fri 9am-5pm PST
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA card */}
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-content">
              <CardContent className="p-8 flex flex-col justify-center h-full">
                <h3 className="text-xl font-semibold mb-4">
                  Ready to Start Ordering?
                </h3>
                <p className="text-primary-content/80 mb-6">
                  Create a wholesale account to access our full catalog,
                  wholesale pricing, and Net 30 payment terms.
                </p>
                <Link href="/auth/login">
                  <Button
                    variant="secondary"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Create Account
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* FAQ teaser */}
          <div className="mt-12 text-center">
            <p className="text-base-content/60">
              Have questions about our wholesale program?{" "}
              <Link href="/faq" className="text-primary hover:underline">
                Check out our FAQ
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Simple contact bar for footer
export function ContactBar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-6 text-sm ${className}`}
    >
      <a
        href="mailto:wholesale@luckybeepress.com"
        className="flex items-center gap-2 text-base-content/60 hover:text-primary"
      >
        <Mail className="h-4 w-4" />
        wholesale@luckybeepress.com
      </a>
      <a
        href="tel:+15551234567"
        className="flex items-center gap-2 text-base-content/60 hover:text-primary"
      >
        <Phone className="h-4 w-4" />
        (555) 123-4567
      </a>
    </div>
  );
}
