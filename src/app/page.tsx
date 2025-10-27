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

  // Track scroll of the Parallax internal container
  useScroll({
    // Parallax exposes the scrollable element as `container`
    container: () => parallaxRef.current?.container,
    onChange: ({ value: { scrollYProgress } }) => {
      // Animate much earlier - start at 20% scroll
      const t = clamp((scrollYProgress - 0.1) / 0.7); // much wider window
      api.start({
        y: lerp(300, 0, t),
        o: 1  // always fully visible
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
            <Link href="/board" className="hover:text-gray-900 transition-colors">
              BOARD
            </Link>
            <span className="text-gray-400">,</span>
            <Link href="/members" className="hover:text-gray-900 transition-colors">
              MEMBERS
            </Link>
            <span className="text-gray-400">,</span>
            <Link href="/projects" className="hover:text-gray-900 transition-colors">
              PROJECTS
            </Link>
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
              <h2 className="text-6xl font-black mb-8">Partners</h2>
              <p className="text-xl text-gray-600">Scroll to see our amazing partners</p>
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

        {/* Page 3 - About Section */}
        <ParallaxLayer 
          offset={2} 
          speed={0.2} 
          style={{ 
            background: "white",
            scrollSnapAlign: "start"
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center max-w-4xl px-8">
              <h2 className="text-6xl font-black text-gray-900 mb-8">About AZTECHACKS</h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                AZTECHACKS is a premier technology conference bringing together innovators, 
                developers, and tech enthusiasts from around the world.
              </p>
              <p className="text-lg text-gray-500 leading-relaxed">
                Join us for cutting-edge presentations, hands-on workshops, and networking 
                opportunities that will shape the future of technology.
              </p>
            </div>
          </div>
        </ParallaxLayer>

        {/* Page 4 - Schedule Section */}
        <ParallaxLayer 
          offset={3} 
          speed={0.2} 
          style={{ 
            background: "white",
            scrollSnapAlign: "start"
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center max-w-4xl px-8">
              <h2 className="text-6xl font-black text-gray-900 mb-8">Event Schedule</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Day 1 - Opening</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>9:00 AM - Registration & Welcome</li>
                    <li>10:00 AM - Keynote Address</li>
                    <li>11:30 AM - Panel Discussion</li>
                    <li>1:00 PM - Lunch Break</li>
                    <li>2:30 PM - Workshop Sessions</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Day 2 - Main Event</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>9:00 AM - Technical Talks</li>
                    <li>11:00 AM - Hands-on Labs</li>
                    <li>1:00 PM - Networking Lunch</li>
                    <li>2:30 PM - Innovation Showcase</li>
                    <li>4:00 PM - Closing Ceremony</li>
                  </ul>
                </div>
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
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center max-w-4xl px-8">
              <h2 className="text-6xl font-black text-gray-900 mb-8">Get In Touch</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Email</h3>
                  <p className="text-xl text-gray-600">info@aztechacks.com</p>
                  <p className="text-sm text-gray-500 mt-2">General inquiries</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Location</h3>
                  <p className="text-xl text-gray-600">San Diego, California</p>
                  <p className="text-sm text-gray-500 mt-2">Convention Center</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Date</h3>
                  <p className="text-xl text-gray-600">2026 - Coming Soon</p>
                  <p className="text-sm text-gray-500 mt-2">Save the date!</p>
                </div>
              </div>
              <div className="mt-12">
                <button className="bg-red-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-red-700 transition-colors">
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </ParallaxLayer>
      </Parallax>
      </div>
  );
}