
import { Akshar } from "next/font/google";
import "./globals.css";

const akshar = Akshar({ subsets: ["latin"], weight:['300', '400', '500', '600', '700'] });

import Header from "../components/layouts/Header.js";
import Footer from "../components/layouts/Footer.js";
import AuthProvider from "../components/AuthProvider.js"
import { CartContextProvider } from '@/components/CartContextProvider';
import toast, { Toaster } from 'react-hot-toast';
// import Head from 'next/head'

export const metadata = {
  title: "Order-Food",
  description: "Best place to order food online",
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <Head>
      <link rel="icon" href="/favicon.ico" sizes="any"/>
      </Head> */}
      <body className={akshar.className}>
        <AuthProvider>
        <CartContextProvider>
        <Toaster />

          <Header />

          {children}

          <Footer />

        </CartContextProvider>
        </AuthProvider>
        
        </body>
    </html>
  );
}
