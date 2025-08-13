"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroVideo = () => {
  const { t } = useTranslation("common");
  const { theme } = useTheme();
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Intersection Observer to detect when video comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Only load video when it's visible or user has interacted
            setShouldLoadVideo(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Handle user interaction to trigger video loading
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
      setShouldLoadVideo(true);
    };

    // Listen for any user interaction
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('scroll', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video && shouldLoadVideo) {
      video.muted = isMuted;

      // Ensure video plays automatically only after loading
      const playVideo = async () => {
        try {
          console.log("Attempting to play video...");
          await video.play();
          console.log("Video playing successfully");
        } catch (error) {
          console.log("Video autoplay failed:", error);
        }
      };

      if (video.readyState >= 3) {
        playVideo();
      } else {
        video.addEventListener("canplaythrough", playVideo);
      }

      return () => {
        video.removeEventListener("canplaythrough", playVideo);
      };
    }
  }, [isMuted, shouldLoadVideo]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleVideoLoad = () => {
    console.log("Video loaded successfully");
    setIsVideoLoaded(true);
  };

  const handleVideoError = (e) => {
    console.error("Video loading error:", e);
    setIsVideoLoaded(true); // Hide loading spinner
  };

  const handleVideoCanPlay = () => {
    console.log("Video can play");
    setIsVideoLoaded(true);
  };

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden">
      {/* Video Background - Only load when necessary */}
      <div className="absolute inset-0 w-full h-full">
        {shouldLoadVideo ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-10"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="metadata"
            onLoadedData={handleVideoLoad}
            onCanPlay={handleVideoCanPlay}
            onError={handleVideoError}
            poster="/images/banner.webp"
          >
            <source src="/videos/hero-video.mp4" type="video/mp4" />
            <source src="/videos/hero-video.webm" type="video/webm" />
            {/* Fallback image */}
            Your browser does not support the video tag.
          </video>
        ) : (
          // Show poster image with play button until video loads
          <div className="absolute inset-0 w-full h-full">
            <img
              src="/images/banner.webp"
              alt="East at West Restaurant"
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
            {/* Play button overlay to trigger video loading */}
            <button
              onClick={() => setShouldLoadVideo(true)}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors duration-300 group"
              aria-label="Play video"
            >
              <div className="bg-white/90 rounded-full p-4 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                <svg
                  className="w-12 h-12 text-gray-900 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          </div>
        )}

        {/* Lighter Video Overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-0.1 z-8"></div>
      </div>

      {/* Mute/Unmute Toggle - Only show when video is loaded */}
      {shouldLoadVideo && (
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 z-30 p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all duration-300"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
        {isMuted ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        )}
        </button>
      )}

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.h1
            className="font-zcool text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mt-40  sm:mb-0 text-white bg-black/80 p-2 rounded-lg sm:mb-0 mb-0"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span className="text-white bg-clip-text text-transparent">
              {t("hero.headline")}
            </span>
          </motion.h1>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <Link
              href="/reservations"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t("hero.cta")}
            </Link>
            <Link
              href="/pdfs/allmenus.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              {t("hero.viewMenu")}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <div className="flex flex-col items-center text-white">
          <span className="text-sm mb-2">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* Loading Overlay - Only show when video is loading */}
      {shouldLoadVideo && !isVideoLoaded && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p>Loading video...</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroVideo;
