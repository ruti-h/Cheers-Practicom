
"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import Header from "./ficherofPageHome/header"
import HeroSection from "./ficherofPageHome/hero-section"
import ProfilesSection from "./ficherofPageHome/profiles-section"
import ProcessSection from "./ficherofPageHome/process-section"
import StatsSection from "./ficherofPageHome/stats-section"
import TestimonialsSection from "./ficherofPageHome/testimonials-section"
import MeetingSection from "./ficherofPageHome/meeting-section"
import CtaSection from "./ficherofPageHome/cta-section"
import Footer from "./ficherofPageHome/footer"
import { Box } from "@mui/material"


const Home: React.FC = () => {
  // Animation states - מתחיל עם true כדי שהתוכן יופיע מיד
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({
    hero: true,
    profiles: true,
    process: true,
    stats: true,
    testimonials: true,
    meeting: true,
    cta: true,
  })

  // Counter states
  const [counters, setCounters] = useState({
    couples: 0,
    proposals: 0,
    registrations: 0,
  })

  const targetCounters = {
    couples: 2048,
    proposals: 1561,
    registrations: 10293,
  }

  const statsRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const profilesRef = useRef<HTMLDivElement>(null)
  const processRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const meetingRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for animations - מופעל רק אחרי שהתוכן כבר נטען
  useEffect(() => {
    const timer = setTimeout(() => {
      const observerOptions = {
        root: null,
        rootMargin: "-50px",
        threshold: 0.1,
      }

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            setIsVisible((prev) => ({ ...prev, [id]: true }))
          }
        })
      }

      const observer = new IntersectionObserver(observerCallback, observerOptions)

      const elements = [heroRef, profilesRef, processRef, statsRef, testimonialsRef, meetingRef, ctaRef]
      elements.forEach((ref) => {
        if (ref.current) {
          observer.observe(ref.current)
        }
      })

      return () => {
        observer.disconnect()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Counter animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 2000 // 2 seconds
      const steps = 60
      const interval = duration / steps

      let currentStep = 0

      const counterTimer = setInterval(() => {
        currentStep++
        const progress = currentStep / steps

        setCounters({
          couples: Math.floor(targetCounters.couples * progress),
          proposals: Math.floor(targetCounters.proposals * progress),
          registrations: Math.floor(targetCounters.registrations * progress),
        })

        if (currentStep >= steps) {
          clearInterval(counterTimer)
          setCounters(targetCounters)
        }
      }, interval)

      return () => clearInterval(counterTimer)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const scrollToFeatures = (): void => {
    const profilesElement = document.getElementById("profiles")
    if (profilesElement) {
      profilesElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#111111",
        position: "relative",
        overflow: "hidden",
        color: "#ffffff",
      }}
      dir="rtl"
    >
      {/* Clean background gradient */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, #000000 0%, #111111 100%)",
          zIndex: -1,
        }}
      />

      <Header />

      <Box id="hero" ref={heroRef}>
        <HeroSection isVisible={isVisible.hero} scrollToFeatures={scrollToFeatures} />
      </Box>

      <Box id="profiles" ref={profilesRef}>
        <ProfilesSection isVisible={isVisible.profiles} />
      </Box>

      <Box id="process" ref={processRef}>
        <ProcessSection isVisible={isVisible.process} />
      </Box>

      <Box id="stats" ref={statsRef}>
        <StatsSection isVisible={isVisible.stats} counters={counters} />
      </Box>

      <Box id="testimonials" ref={testimonialsRef}>
        <TestimonialsSection isVisible={isVisible.testimonials} />
      </Box>

      <Box id="meeting" ref={meetingRef}>
        <MeetingSection isVisible={isVisible.meeting} />
      </Box>

      <Box id="cta" ref={ctaRef}>
        <CtaSection isVisible={isVisible.cta} />
      </Box>

      <Footer />

      {/* Global animations */}
      <Box
        sx={{
          "@keyframes fadeInUp": {
            "0%": { opacity: 0, transform: "translateY(20px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
          "@keyframes fadeInDown": {
            "0%": { opacity: 0, transform: "translateY(-20px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
        }}
      />
    </Box>
  )
}

export default Home

