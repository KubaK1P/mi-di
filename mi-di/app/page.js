"use client"; 
import { useEffect, useState } from "react";

export default function Home() {
    const handleScroll = (section) => {
        document.getElementById(section)?.scrollIntoView({ behavior: "smooth", alignToTop: true });
      };
    return (
        <>
        <div className="p-4 text-white main-layout">
            <a onClick={() => handleScroll("introduction")} className="group transition-all relative top-0 hover:top-4 p-4 block cursor-pointer main-card rounded-lg bg-dark">
                <h3 className="transition-all group-hover:underline group-hover:text-3xl text-2xl font-bold tracking-wide text-lighter">Short introduction</h3>
            </a>
            <a onClick={() => handleScroll("midi")} className="group transition-all relative top-0 hover:top-4 p-4 block cursor-pointer main-card rounded-lg bg-main">
                <h3 className="transition-all group-hover:underline group-hover:text-3xl text-2xl font-bold tracking-wide text-lighter">Mi-di project</h3>
            </a>
            <a onClick={() => handleScroll("music")} className="group transition-all relative top-0 hover:top-4 p-4 block cursor-pointer main-card rounded-lg bg-accent">
                <h3 className="transition-all group-hover:underline group-hover:text-3xl text-2xl font-bold tracking-wide text-dark">My music</h3>
            </a>
            <a onClick={() => handleScroll("legacy")} className="group transition-all relative top-0 hover:top-4 p-4 block cursor-pointer main-card rounded-lg bg-light">
                <h3 className="transition-all group-hover:underline group-hover:text-3xl text-2xl font-bold tracking-wide text-dark">The legacy</h3>
            </a>
            <nav className="    group transition-all p-4 hover:mt-4 block main-card rounded-lg bg-lighter">
                <h3 className="transition-all group-hover:underline group-hover:text-3xl text-2xl font-bold tracking-wide text-dark">Navigation</h3>
            </nav>
            <div className="title p-4">
                <h1 className="text-lighter font-bold text-8xl tracking-wide mb-6">The Lazy Project</h1>
                <h2 className="text-right text-light font-semibold text-3xl tracking-wide mb-2">A Jakub Kuś&apos;s original creation...</h2>
                <h3 className="text-right text-white font-light text-sm tracking-tight">(Scroll to see it)</h3>
            </div>
        </div>
        <div className="p-4 text-white h-[100vh]" id="introduction" >
            hola
        </div>
        <div className="p-4 text-white h-[100vh]" id="midi" >
            hola
        </div>
        <div className="p-4 text-white h-[100vh]" id="music" >
            hola
        </div>
        <div className="p-4 text-white h-[100vh]" id="legacy" >
            hola
        </div>
      </>
  );
}