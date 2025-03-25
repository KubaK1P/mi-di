"use client"; 
import { useEffect, useState } from "react";
import Back from "./components/Back";
export default function Home() {
    const handleScroll = (section) => {
        document.getElementById(section)?.scrollIntoView({ behavior: "smooth", alignToTop: true });
      };
    return (
        <div className="h-screen overflow-y-scroll snap-mandatory snap-y snapper">
            <div className="p-4 text-white main-layout snap-start" id="lobby">
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
                <nav className="group transition-all p-4 hover:mt-4 block main-card rounded-lg bg-lighter">
                    <h3 className="transition-all group-hover:underline group-hover:text-3xl text-2xl font-bold tracking-wide text-dark">Navigation</h3>
                </nav>
                <div className="title p-4">
                    <h1 className="text-accent font-bold text-8xl tracking-wide mb-6">The Lazy Project</h1>
                    <h2 className="text-right text-main font-semibold text-3xl tracking-wide mb-2">A Jakub Kuś&apos;s original creation...</h2>
                    <h3 className="text-right text-lighter font-light text-sm tracking-tight">(Scroll to see it)</h3>
                </div>
            </div>
            <div className="p-4 text-white about-layout snap-start" id="introduction" >
                <Back handleScroll={handleScroll} row="1" column="1" color="dark" scrollTo="lobby">Go back</Back>
                <div className="transition-all relative bottom-0 hover:bottom-4 p-4 about-card title rounded-lg bg-accent flex justify-center items-center">
                        <h3 className="text-dark font-bold text-9xl tracking-wide underline underline-offset-12 mb-6">Hi, I&apos;m Kuba!</h3>
                    </div>
                <div className="transition-all relative left-0 hover:left-4 p-6 about-card rounded-lg bg-main">
                    <p className="text-lighter text-xl/7 font-semibold tracking-wide">A human that has some abilities in programming and music. <br />I&apos;m an undecided person who tries every hobby that exists. Here are some things that I have tried:  </p>
                    <ul className="mt-4 mb-4 pl-2 text-lg text-lighter font-normal tracking-wide">
                        <li>&gt; Piano playing</li>
                        <li>&gt; Rubik&apos;s cubes</li>
                        <li>&gt; Centering a div</li>
                        <li>&gt; Eating a brick</li>
                        <li>&gt; Music production</li>
                        <li>&gt; Speaking german</li>
                    </ul>
                    <p className="text-lighter text-xl/7 font-semibold tracking-wide">I have failed miserably many times (and probably will a few more), but I always stand up and try again :)</p>
                </div>
                <div className="transition-all relative top-0 hover:top-4 p-6 about-card rounded-lg bg-dark">
                    <p className="mb-6 text-lighter text-xl font-semibold tracking-wide">Here are some useful links:</p>
                    <a className="mt-6 pt-4 pb-4 text-lg font-semibold tracking-wide text-accent hover:underline" href="https://github.com/KubaK1P" target="_blank">My Github account</a><br></br>
                    <a className="mt-6 pt-4 pb-4 text-lg font-semibold tracking-wide text-accent hover:underline" href="https://soundcloud.com/kuba-ku-821428382" target="_blank">My Soundcloud account</a>
                </div>
                <div className="transition-all relative top-0 hover:top-4 p-6 about-card rounded-lg bg-light flex items-center">
                        <p className="text-dark text-xl font-semibold tracking-wide">Literally too lazy to think of something here</p>
                </div>
                <div className="transition-all relative top-0 hover:top-4 p-6 about-card rounded-lg bg-lighter flex items-end">
                        <p className="text-dark text-xl font-semibold tracking-wide">Same thing (now it&apos;s on the bottom)</p>
                </div>
                    
            </div>
            <div className="p-4 text-white h-[100vh] main-layout snap-start" id="midi" >
            <Back handleScroll={handleScroll} row="1" column="2" color="main" scrollTo="lobby">Go back</Back>
            </div>
            <div className="p-4 text-white h-[100vh] main-layout snap-start" id="music" >
            <Back handleScroll={handleScroll} row="1" column="3" color="accent" scrollTo="lobby">Go back</Back>
            </div>
            <div className="p-4 text-white h-[100vh] main-layout snap-start" id="legacy" >
            <Back handleScroll={handleScroll} row="1" column="4" color="light" scrollTo="lobby">Go back</Back>
            </div>
        </div>
    );
}