import type { Metadata } from "next";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import { Poppins, Outfit } from "next/font/google";
import { Navigation, Footer } from "@/components/layout";
import { CartProvider } from "@/lib/cart-context";
import "@/app/globals.css";
import { DrawerProvider } from "@/providers/DrawerProvider";
import Drawer from "@/components/layout/Drawer";

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
  title: "Lucky Bee Press - Wholesale Letterpress Cards",
  description:
    "Premium letterpress greeting cards for independent retailers. Handcrafted with care, designed to delight your customers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${poppinsMono.variable} ${outfitMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Auth0Provider>
          <CartProvider>
            <DrawerProvider>
              <Drawer />
              <Navigation />
              <div className="flex-1">{children}</div>
              <Footer />
            </DrawerProvider>
          </CartProvider>
        </Auth0Provider>
      </body>
    </html>
  );
}
