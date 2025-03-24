"use client"; 
import { useEffect, useState } from "react";

export default function Home() {

    return (
        <>
        <div className="p-4 text-white main-layout">
            <a href="#" className="p-4 block cursor-pointer main-card rounded-lg bg-dark">
                <h3 className="text-2xl text-lighter">Some section</h3>
            </a>
            <a href="#" className="p-4 block cursor-pointer main-card rounded-lg bg-main">
                <h3 className="text-2xl text-lighter">Some section</h3>
            </a>
            <a href="#" className="p-4 block cursor-pointer main-card rounded-lg bg-accent">
                <h3 className="text-2xl text-dark">Some section</h3>
            </a>
            <a href="#" className="p-4 block cursor-pointer main-card rounded-lg bg-light">
                <h3 className="text-2xl text-dark">Some section</h3>
            </a>
            <a href="#" className="p-4 block cursor-pointer main-card rounded-lg bg-lighter">
                <h3 className="text-2xl text-dark">Some section</h3>
            </a>
            <div className="title p-4">
                <h1 className="text-lighter font-bold text-8xl tracking-wide mb-6">The Lazy Project</h1>
                <h2 className="text-right text-light font-semibold text-3xl tracking-wide mb-2">A Jakub Kuś&apos;s original creation...</h2>
                <h3 className="text-right text-white font-light text-sm tracking-tight">(Scroll to see it)</h3>
            </div>
        </div>
        <div className="p-4 text-white">
            
        </div>
      </>
  );
}