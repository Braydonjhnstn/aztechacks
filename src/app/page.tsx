"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import { useSpring, animated, useScroll } from "@react-spring/web";
import Link from "next/link";
import Header from '@/components/Header'

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const parallaxRef = useRef(null);

  // One spring we'll drive from scroll progress
  const [logo, api] = useSpring(() => ({
    y: 300,        // start further off-screen (below)
    o: 1,          // always fully visible
    config: { tension: 120, friction: 20 } // smoother animation
  }));

  // Spring for about page logo animation
  const [aboutLogo, aboutApi] = useSpring(() => ({
    y: 300,        // start below visible area
    o: 0,          // start invisible
    config: { tension: 120, friction: 20 } // smoother animation
  }));

  // Spring for about page text animation
  const [aboutText, aboutTextApi] = useSpring(() => ({
    y: 100,        // start below visible area
    o: 0,          // start invisible
    config: { tension: 120, friction: 20 } // smoother animation
  }));

  // Track scroll of the Parallax internal container
  useScroll({
    // Parallax exposes the scrollable element as `container`
    container: (() => (parallaxRef.current as any)?.container) as any,
    onChange: ({ value: { scrollYProgress } }) => {
      // Animate much earlier - start at 20% scroll (for partner logos)
      const t = clamp((scrollYProgress - 0.1) / 0.7); // much wider window
      api.start({
        y: lerp(300, 0, t),
        o: 1  // always fully visible
      });

      // Animate about logo first when scrolling into about section (offset 2, which is ~0.4 progress)
      // Logo animation completes early: 0.3 to 0.45 scroll progress
      const aboutLogoT = clamp((scrollYProgress - 0.3) / 0.15);
      aboutApi.start({
        y: lerp(300, -50, aboutLogoT), // slide up from 300px below to -50px (above top position)
        o: aboutLogoT // fade in as it slides up
      });

      // Animate about text after logo completes (starts after logo finishes)
      // Text animation starts later: 0.45 to 0.65 scroll progress
      const aboutTextT = clamp((scrollYProgress - 0.45) / 0.2);
      aboutTextApi.start({
        y: lerp(150, 0, aboutTextT), // slide up from 150px below to 0
        o: aboutTextT // fade in as it slides up
      });
    }
  });

  useEffect(() => {
    setMounted(true);

    // Enhanced sticky scroll behavior
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrolling) return;
      
      const container = document.querySelector('.parallax-container');
      if (container) {
        isScrolling = true;
        
        const currentScroll = container.scrollTop;
        const sectionHeight = window.innerHeight;
        const currentSection = Math.round(currentScroll / sectionHeight);
        
        // Only scroll if we're close to a section boundary (within 100px)
        const scrollOffset = currentScroll % sectionHeight;
        if (scrollOffset < 100 || scrollOffset > sectionHeight - 100) {
          const targetSection = e.deltaY > 0 ? currentSection + 1 : currentSection - 1;
          const targetScroll = Math.max(0, Math.min(targetSection * sectionHeight, container.scrollHeight - sectionHeight));
          
          container.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          });
        }
        
        // Clear any existing timeout
        if (scrollTimeout) clearTimeout(scrollTimeout);
        
        // Longer cooldown for more stickiness
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
        }, 1200);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  const words = ["AZTECHACKS"];
  
  return (
    <div 
      className="h-screen overflow-y-auto snap-y snap-mandatory"
      style={{
        scrollBehavior: 'smooth',
        scrollSnapType: 'y mandatory',
        scrollSnapStop: 'always'
      }}
    >
      <Parallax 
        ref={parallaxRef} 
        pages={5} 
        className="parallax-container"
        style={{ background: 'white' }}
        config={{ 
          mass: 2, 
          tension: 120, 
          friction: 40,
          clamp: true 
        }}
      >
        {/* Page 1: your existing hero/front page */}
        <ParallaxLayer
          offset={0}
          speed={0.3}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            scrollSnapAlign: "start"
          }}
        >
          <div className="relative w-full h-full bg-white overflow-hidden flex items-center">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        >
          <source src="/wcovid.mov" type="video/quicktime" />
          Your browser does not support the video tag.
        </video>
      </div>


      {/* Navigation */}
      <nav className="fixed left-3/4 top-0 p-8 flex gap-2 text-gray-500 z-20">
        {mounted && (
          <motion.div
            className="flex gap-2"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.8,
            }}
          >
            <button 
              onClick={() => {
                const parallax = parallaxRef.current as any;
                if (parallax) parallax.scrollTo(1);
              }}
              className="hover:text-gray-900 transition-colors cursor-pointer"
            >
              PARTNERS
            </button>
            <span className="text-gray-400">,</span>
            <button 
              onClick={() => {
                const parallax = parallaxRef.current as any;
                if (parallax) parallax.scrollTo(2);
              }}
              className="hover:text-gray-900 transition-colors cursor-pointer"
            >
              ABOUT
            </button>
            <span className="text-gray-400">,</span>
            <button 
              onClick={() => {
                const parallax = parallaxRef.current as any;
                if (parallax) parallax.scrollTo(3);
              }}
              className="hover:text-gray-900 transition-colors cursor-pointer"
            >
              SCHEDULE
            </button>
          </motion.div>
        )}
      </nav>

      {/* Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <div className="text-[50vw] font-black text-gray-100">AZTECHACKS</div>
      </div>
      
      {/* Main Content */}
      <div className="z-10 pl-8 md:pl-16">
        <div className="flex flex-col items-start">
          {mounted && words.map((word, index) => (
            <motion.div
              key={word}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
                    className="relative flex items-baseline"
            >
              <h1 className="text-[12vw] font-black leading-[0.85] tracking-tighter text-gray-900">
                {word}
              </h1>
                    <motion.span
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="text-[6vw] font-black leading-[0.85] tracking-tighter text-red-600 ml-4"
                    >
                      2026
                    </motion.span>
            </motion.div>
          ))}
        </div>
        
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
                className="mt-8"
              >
                <div className="text-2xl text-gray-600 font-medium">by</div>
                <div className="flex flex-col">
                  {["WORLD", "COMPUTING", "ORGANIZATION"].map((word, index) => (
                    <motion.div
                      key={word}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        duration: 0.6,
                        delay: 1.4 + (index * 0.1),
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="text-[4vw] font-black leading-[0.85] tracking-tighter text-gray-900"
                    >
                      {word.split('').map((letter, letterIndex) => {
                        // Highlight W, C, and first O letters in bright red
                        const isHighlighted = (word === "WORLD" && letter === "W") ||
                                            (word === "COMPUTING" && letter === "C") ||
                                            (word === "ORGANIZATION" && letter === "O" && letterIndex === 0);
                        
                        return (
                          <span
                            key={letterIndex}
                            className={isHighlighted ? "text-red-600" : "text-gray-900"}
                          >
                            {letter}
                          </span>
                        );
                      })}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </ParallaxLayer>

        {/* Page 2 background/content */}
        <ParallaxLayer 
          offset={1} 
          speed={0.2} 
          style={{ 
            background: "white",
            scrollSnapAlign: "start"
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-900">
              <h2 className="text-6xl font-black mb-8">PARTNERS</h2>
              <p className="text-.95xl text-black-500">WANT YOUR LOGO HERE? </p>
              <p className="text-.95xl text-black-500">EMAIL INFO@AZTECHACKS.COM FOR SPONSORSHIP INQUIRIES</p>
            </div>
          </div>
        </ParallaxLayer>

        {/* Spinning logos (sit on page 2; animate in as you scroll toward it) */}
        <ParallaxLayer
          offset={1}
          speed={10}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div style={{ position: "relative", width: "100%", height: "100vh" }}>
            {/* Desktop Layout - Side by Side */}
            <div className="hidden md:block w-full h-full">
              {/* Logo A: SDSU at 20% from left */}
              <animated.img
                src="/SDSU.svg.png"
                alt="SDSU Logo"
                style={{
                  position: "absolute",
                  width: 325,
                  height: 325,
                  left: "20%",
                  top: "50%",
                  transform: logo.y
                    .to((y) => `translateX(-50%) translateY(calc(-50% + ${y}px))`)
                    .to((trY) => trY),
                  opacity: logo.o,
                  objectFit: "contain"
                }}
              />

              {/* Logo B: WCO at 80% from left */}
              <animated.img
                src="/WCO1.png"
                alt="WCO Logo"
                style={{
                  position: "absolute",
                  width: 325,
                  height: 325,
                  left: "80%",
                  top: "50%",
                  transform: logo.y
                    .to((y) => `translateX(-50%) translateY(calc(-50% + ${y}px))`)
                    .to((trY) => trY),
                  opacity: logo.o,
                  objectFit: "contain"
                }}
              />
            </div>

            {/* Mobile Layout - Stacked Vertically */}
            <div className="block md:hidden w-full h-full flex flex-col items-center justify-center space-y-16 px-8">
              {/* Logo A: SDSU on top */}
              <animated.img
                src="/SDSU.svg.png"
                alt="SDSU Logo"
                style={{
                  width: 200,
                  height: 200,
                  transform: logo.y
                    .to((y) => `translateY(calc(${y}px))`)
                    .to((trY) => trY),
                  opacity: logo.o,
                  objectFit: "contain"
                }}
              />

              {/* Logo B: WCO on bottom */}
              <animated.img
                src="/WCO1.png"
                alt="WCO Logo"
                style={{
                  width: 200,
                  height: 200,
                  transform: logo.y
                    .to((y) => `translateY(calc(${y}px))`)
                    .to((trY) => trY),
                  opacity: logo.o,
                  objectFit: "contain"
                }}
              />
            </div>
          </div>
        </ParallaxLayer>

        {/* Page 3 - About Section Background/Text */}
        <ParallaxLayer 
          offset={2} 
          speed={10} 
          style={{ 
            background: "white",
            scrollSnapAlign: "start"
          }}
        >
          <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Content - moved down 20% */}
            <animated.div 
              className="w-full flex flex-col items-center justify-center pt-[40vh]"
              style={{
                transform: aboutText.y.to((y) => `translateY(${y}px)`),
                opacity: aboutText.o
              }}
            >
              {/* ABOUT Heading */}
              <h2 className="text-6xl font-black text-gray-900 mb-8">ABOUT</h2>
              
              {/* All Caps Explanation */}
              <div className="text-center max-w-4xl px-8">
                <p className="text-xl text-gray-900 mb-6 leading-relaxed uppercase font-medium">
                AZTECHACKS IS AN ANNUAL 24-HOUR HACKATHON HOSTED BY THE WORLD COMPUTING ORGANIZATION AT SAN DIEGO STATE UNIVERSITY.
                OUR MISSION IS TO EMPOWER WEST COAST STUDENTS TO INNOVATE, LEARN, AND COMPETE IN THE EVER-EVOLVING WORLD OF TECHNOLOGY. AZTECHACKS WILL HOST HUNDREDS OF 
                STUDENTS THAT WILL TEAM UP TO CREATE INNOVATIVE SOLUTIONS TO REAL-WORLD PROBLEMS. THE WINNING TEAMS WILL RECEIVE AWESOME PRIZES AS WELL AS THE OPPORTUNITY TO INTERVIEW FOR AN INTERNSHIP FOR THE WORLD COMPUTING ORGANIZATION NATIONAL OFFICE.
                </p>
              </div>
            </animated.div>
          </div>
        </ParallaxLayer>

        {/* About Logo - separate parallax layer with faster speed */}
        <ParallaxLayer
          offset={2}
          speed={5}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div style={{ position: "relative", width: "100%", height: "100vh" }}>
            {/* Animated Logo at Top Middle */}
            <animated.img
              src="/AZTECHACKS.png"
              alt="AZTECHACKS Logo"
              style={{
                position: "absolute",
                width: 400,
                height: 'auto',
                top: "10%",
                left: "50%",
                transform: aboutLogo.y
                  .to((y) => `translateX(-50%) translateY(calc(${y}px))`)
                  .to((trY) => trY),
                opacity: aboutLogo.o,
                objectFit: "contain",
                zIndex: 10
              }}
            />
          </div>
        </ParallaxLayer>

        {/* Page 4 - Schedule Section Background/Title */}
        <ParallaxLayer 
          offset={3} 
          speed={5} 
          style={{ 
            background: "white",
            scrollSnapAlign: "start"
          }}
        >
          <div className="w-full h-full flex items-start justify-center pt-6">
            <div className="text-center max-w-6xl px-8 w-full">
              <h2 className="text-5xl font-black text-gray-900">2026 SCHEDULE</h2>
            </div>
          </div>
        </ParallaxLayer>

        {/* Schedule Table - separate parallax layer with different speed */}
        <ParallaxLayer
          offset={3}
          speed={10}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div className="w-full h-full flex items-start justify-center pt-24">
            <div className="text-center max-w-6xl px-8 w-full">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b-2 border-gray-900">
                      <th className="py-3 px-5 font-black text-gray-900 text-lg">TIME</th>
                      <th className="py-3 px-5 font-black text-gray-900 text-lg">DAY</th>
                      <th className="py-3 px-5 font-black text-gray-900 text-lg">EVENT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-5 text-gray-700 text-base">9:00AM - 11:00AM</td>
                      <td className="py-3 px-5 text-gray-700 text-base">APRIL 4</td>
                      <td className="py-3 px-5 text-gray-700 text-base">CHECK-IN, TEAM MATCHING BEGINS</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-5 text-gray-700 text-base">10:30AM - 11:00AM</td>
                      <td className="py-3 px-5 text-gray-700 text-base"></td>
                      <td className="py-3 px-5 text-gray-700 text-base">WORD FROM SPONSORS</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-5 text-gray-700 text-base">11:00AM - 12:00PM</td>
                      <td className="py-3 px-5 text-gray-700 text-base"></td>
                      <td className="py-3 px-5 text-gray-700 text-base">OPENING CEREMONY, KICKOFF</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-5 text-gray-700 text-base">12:00PM - 1:00PM</td>
                      <td className="py-3 px-5 text-gray-700 text-base"></td>
                      <td className="py-3 px-5 text-gray-700 text-base">HACKING BEGINS</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-5 text-gray-700 text-base">12:30PM - 1:15PM</td>
                      <td className="py-3 px-5 text-gray-700 text-base"></td>
                      <td className="py-3 px-5 text-gray-700 text-base">WELCOMING WORKSHOP</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-5 text-gray-700 text-base">1:30PM - 2:00PM</td>
                      <td className="py-3 px-5 text-gray-700 text-base"></td>
                      <td className="py-3 px-5 text-gray-700 text-base">LUNCH BREAK</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-5 text-gray-700 text-base">2:00PM - 2:30PM</td>
                      <td className="py-3 px-5 text-gray-700 text-base"></td>
                      <td className="py-3 px-5 text-gray-700 text-base">HACKING CONTINUES</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-5 text-gray-700 text-base">3:00PM - 3:45PM</td>
                      <td className="py-3 px-5 text-gray-700 text-base"></td>
                      <td className="py-3 px-5 text-gray-700 text-base">DEVELOPMENT AND CODE SHARING</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-5 text-gray-700 text-base">6:00PM - 6:30PM</td>
                      <td className="py-3 px-5 text-gray-700 text-base"></td>
                      <td className="py-3 px-5 text-gray-700 text-base">DINNER</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-5 text-gray-700 text-base">7:00PM - 7:00AM</td>
                      <td className="py-3 px-5 text-gray-700 text-base"></td>
                      <td className="py-3 px-5 text-gray-700 text-base">OVERNIGHT HACKING</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-5 text-gray-700 text-base">7:30AM - 8:30AM</td>
                      <td className="py-3 px-5 text-gray-700 text-base">APRIL 5</td>
                      <td className="py-3 px-5 text-gray-700 text-base">PROJECT PRESENTATIONS</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-5 text-gray-700 text-base">8:30AM - 9:00AM</td>
                      <td className="py-3 px-5 text-gray-700 text-base"></td>
                      <td className="py-3 px-5 text-gray-700 text-base">JUDGING AND AWARDS CEREMONY</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ParallaxLayer>

        {/* Page 5 - Contact Section */}
        <ParallaxLayer 
          offset={4} 
          speed={0.2} 
          style={{ 
            background: "white",
            scrollSnapAlign: "start"
          }}
        >
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            {/* Logo with Navigation Links on sides */}
            <div className="flex items-center justify-center gap-12 mb-12">
              <Link href="https://sdsu.worldcomputing.org/" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-gray-600 transition-colors text-lg uppercase">
                ABOUT US
              </Link>
              <img 
                src="/WCO_LOGO.png" 
                alt="WCO Logo" 
                className="w-64 h-auto"
              />
              <a href="mailto:info@aztechacks.com" className="text-gray-900 hover:text-gray-600 transition-colors text-lg uppercase">
                CONTACT US
              </a>
            </div>

            {/* Footer Text */}
            <div className="text-center text-gray-900 mb-8">
              <p className="text-lg">MADE BY THE WORLD COMPUTING ORGANIZATION AT SAN DIEGO STATE UNIVERSITY</p>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-6 items-center">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/wcosdsu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Discord */}
              <a 
                href="https://discord.gg/XfJU5XWVU6" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/company/wcosdsu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </ParallaxLayer>
      </Parallax>
      </div>
  );
}