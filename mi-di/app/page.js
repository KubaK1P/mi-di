"use client"; 
// import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Back from "./components/Back/Back";
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
                    <ul className="transition-all mt-8 group-hover:mt-4 mb-4 pl-2 text-lg text-dark font-normal tracking-wide">
                        <li>
                            <Link href="/main" className="block rounded-lg link cursor-pointer p-2 transition-all  text-3xl font-bold tracking-wide text-dark">Mi-di project</Link>
                            <ul>
                                <li className=""><Link href="/main/debug" className="w-[100%] block cursor-pointer link rounded-lg p-2 transition-all text-2xl font-normal tracking-wide text-dark">&gt; Mi-di info</Link></li>
                                <li className=""><Link href="/main/visualiser" className="w-[100%] block cursor-pointer link rounded-lg p-2 transition-all text-2xl font-normal tracking-wide text-dark">&gt; Mi-di visualiser</Link></li>
                                <li className=""><Link href="/main/chords" className="w-[100%] block cursor-pointer link rounded-lg p-2 transition-all text-2xl font-normal tracking-wide text-dark">&gt; Mi-di chords</Link></li>
                            </ul>
                        </li>
                        <li>
                            <a onClick={() => handleScroll("music")} className="block rounded-lg link cursor-pointer p-2 transition-all  text-3xl font-bold tracking-wide text-dark">My music</a>
                        </li>
                        <li>
                            <a onClick={() => handleScroll("legacy")} className="block rounded-lg link cursor-pointer p-2 transition-all  text-3xl font-bold tracking-wide text-dark">Other projects</a>
                            <ul>
                                <li className=""><a href="https://kubak1p.github.io/Zegar/" target="_blank" className="w-[100%] block cursor-pointer link rounded-lg p-2 transition-all text-2xl font-normal tracking-wide text-dark">&gt; Zegar</a></li>
                                <li className=""><a href="https://github.com/KubaK1P/BCS-python/" target="_blank" className="w-[100%] block cursor-pointer link rounded-lg p-2 transition-all text-2xl font-normal tracking-wide text-dark">&gt; BCS Python</a></li>
                                <li className=""><a href="https://github.com/KubaK1P/semiquaver" target="_blank" className="w-[100%] block cursor-pointer link rounded-lg p-2 transition-all text-2xl font-normal tracking-wide text-dark">&gt; Semiquaver</a></li>
                            </ul>
                        </li>
                    </ul>
                    <h3 className="transition-all group-hover:underline group-hover:text-3xl text-2xl font-bold tracking-wide text-dark">Navigation</h3>
                </nav>
                <div className="title p-4">
                    <h1 className="text-accent font-bold text-8xl tracking-wide mb-6 underline underline-offset-8">The Lazy Project</h1>
                    <h2 className="text-light font-semibold text-3xl tracking-wide mb-2">Jakub Kuś&apos;s work in a nutshell</h2>
                </div>
            </div>
            <div className="p-4 text-white about-layout snap-start" id="introduction" >
                <Back handleScroll={handleScroll} direction="top" row="1" column="1" color="dark" scrollTo="lobby">Go to lobby</Back>
                <div className="transition-all relative bottom-0 hover:bottom-4 p-4 about-card title rounded-lg bg-accent flex justify-center items-center">
                        <h3 className="text-dark font-bold text-9xl tracking-wide underline underline-offset-12 mb-6">Hi, I&apos;m Kuba!</h3>
                    </div>
                <div className="transition-all relative left-0 hover:left-4 p-6 about-card about-card-responsive rounded-lg bg-main">
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
                    <div className="flex gap-6">
                    <Image className="invert" src="/github.svg" alt="Github Logo" width={45} height={45} />
                        <a className=" pt-4 pb-4 text-lg font-semibold tracking-wide text-accent hover:underline" href="https://github.com/KubaK1P" target="_blank">My Github account</a></div><br></br>
                    <div className="flex gap-6">
                    <Image className="invert" src="/soundcloud.svg" alt="Github Logo" width={45} height={45} />
                        <a className=" pt-4 pb-4 text-lg font-semibold tracking-wide text-accent hover:underline" href="https://soundcloud.com/kuba-ku-821428382" target="_blank">My Soundcloud account</a></div>
                </div>
                <div className="transition-all relative top-0 hover:top-4 p-6 about-card rounded-lg bg-light flex items-center">
                        <p className="text-dark text-xl font-semibold tracking-wide">Literally too lazy to think of something here</p>
                </div>
                <div className="transition-all relative top-0 hover:top-4 p-6 about-card rounded-lg bg-lighter flex items-end">
                        <p className="text-dark text-xl font-semibold tracking-wide">Same thing (now it&apos;s on the bottom)</p>
                </div>
                <Back handleScroll={handleScroll} direction="bottom" row="5" column="5" color="accent" scrollTo="midi">Next section</Back>
                    
            </div>
            <div className="p-4 text-white h-[100vh] midi-layout snap-start" id="midi" >
                <Back handleScroll={handleScroll} direction="left" row="1" column="1" color="main" scrollTo="lobby">Go to lobby</Back>
                <div className="transition-all relative left-0 hover:left-4 p-6 midi-card rounded-lg bg-lighter flex items-end">
                        <p className="text-dark text-5xl font-bold tracking-wide">Mi-di Project</p>
                </div>
                <div className="transition-all relative left-0 hover:left-4 p-6 midi-card rounded-lg bg-light flex items-end">
                        <p className="text-dark text-xl font-bold tracking-wide">An idea that is coming to life, terminating my time as a usless being, forcing me to do something</p>
                </div>
                <div className="transition-all relative left-0 hover:left-4 p-6 midi-card rounded-lg bg-accent flex items-end">
                        <p className="text-dark text-xl font-bold tracking-wide">An attempt to link two of my hobbies and learn something out of it (doubt so). Hopefully recognizing chords played in real time isn&apos;t too hard (subtle foreshadowing)</p>
                </div>
                <div className="transition-all relative left-0 hover:left-4 p-6 midi-card rounded-lg bg-main flex items-end">
                        <p className="text-lighter text-xl/8 font-bold tracking-wide">It&apos;s being made using JavaScript (Get rid of TS please), React and Next.js. I&apos;m sensing three modules that each will do something. Info, Chords and Visualiser. They all require a working midi keyboard (for now?). On all of the sites aplies the same thing. NO AUDIO WILL PLAY UNLESS YOU CLICK SMTH FIRST</p>
                </div>
                <Back handleScroll={handleScroll} direction="bottom" row="5" column="5" color="light" scrollTo="music">Next section</Back>
            </div>
            <div className="p-4 text-white h-[100vh] main-layout snap-start" id="music" >
                <Back handleScroll={handleScroll} direction="top" row="1" column="1" color="accent" scrollTo="lobby">Go to lobby</Back>
                <Back handleScroll={handleScroll} direction="bottom" row="5" column="5" color="main" scrollTo="legacy">Next section</Back>
            </div>
            <div className="p-4 text-white h-[100vh] main-layout snap-start" id="legacy" >
                <Back handleScroll={handleScroll} direction="top" row="1" column="1" color="light" scrollTo="lobby">Go to lobby</Back>
            </div>
        </div>
    );
}