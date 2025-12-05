"use client";

import { useState } from "react";
import { Card, CardContent, Button, Input, Textarea } from "@/components/ui";
import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Contact form submitted:", formData);
    setIsSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral font-serif mb-2">
          Contact Us
        </h1>
        <p className="text-base-content">
          We're here to help with your wholesale needs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiMail className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-base-content">
                    We'll get back to you within 1 business day.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-neutral mb-6">
                    Send Us a Message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        className="bg-base-200"
                        label="Your Name"
                        required
                        fullWidth
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />

                      <Input
                        className="bg-base-200"
                        label="Email Address"
                        type="email"
                        required
                        fullWidth
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>

                    <Input
                      className="bg-base-200"
                      label="Subject"
                      required
                      fullWidth
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                    />

                    <Textarea
                      label="Message"
                      className="bg-base-200"
                      required
                      fullWidth
                      rows={6}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      Send Message
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-neutral mb-4">
                Get in Touch
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FiMail className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-neutral mb-1">
                      Email
                    </p>
                    <a
                      href="mailto:wholesale@luckybeepress.com"
                      className="text-sm text-secondary hover:underline"
                    >
                      wholesale@luckybeepress.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FiPhone className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-neutral mb-1">
                      Phone
                    </p>
                    <a
                      href="tel:+15551234567"
                      className="text-sm text-secondary hover:underline"
                    >
                      (831) 419-0778
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FiMapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-neutral mb-1">
                      Location
                    </p>
                    <p className="text-sm text-base-content">
                      Santa Cruz, California
                      <br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FiClock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-neutral mb-1">
                      Business Hours
                    </p>
                    <p className="text-sm text-base-content">
                      Monday - Friday
                      <br />
                      9:00 AM - 5:00 PM PST
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-base-100">
            <CardContent>
              <h3 className="text-lg font-semibold text-neutral mb-2">
                Wholesale Inquiries
              </h3>
              <p className="text-sm text-base-content mb-4">
                Interested in opening a wholesale account? Our sales team is
                ready to help you get started.
              </p>
              <p className="text-sm text-base-content">
                Response time: Within 1 business day
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
