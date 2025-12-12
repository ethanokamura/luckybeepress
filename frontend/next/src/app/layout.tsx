import type { Metadata } from "next";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import { Poppins, Outfit } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { DrawerProvider } from "@/providers/DrawerProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { CartProvider } from "@/providers/CartProvider";
import AppBar from "@/components/AppBar";
import AppDrawer from "@/components/AppDrawer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import Footer from "@/components/Footer";
import * as config from "@/lib/constants";
import "./globals.css";

const poppinsMono = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins-mono",
  subsets: ["latin"],
});

const outfitMono = Outfit({
  variable: "--font-outfit-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true} data-lt-installed="true">
      <body
        className={`${poppinsMono.variable} ${outfitMono.variable} antialiased`}
      >
        <Auth0Provider>
          <ThemeProvider>
            <DrawerProvider>
              <ToastProvider>
                <CartProvider>
                  <div className="flex flex-col min-h-screen">
                    <AppBar />
                    <AppDrawer />
                    <CartDrawer />
                    <div className="flex-1 pt-[73px]">{children}</div>
                    <Footer />
                  </div>
                </CartProvider>
              </ToastProvider>
            </DrawerProvider>
          </ThemeProvider>
        </Auth0Provider>
      </body>
    </html>
  );
}
