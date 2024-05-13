'use client'

import Hero from "@/components/layouts/Hero";

import HomeScreenMenu from "@/components/layouts/HomeScreenMenu";
import About from '@/components/layouts/About'
import Contact from '@/components/layouts/Contact'
import ShortCuts from '@/components/layouts/ShortCuts'


export default function Home() {
  return (
    <>
      <Hero />

      <HomeScreenMenu count={6}/>
      
      <About />

      <Contact />

      <ShortCuts />

    </>
  );
}
