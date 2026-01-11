'use client';

import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import logoPath from '@/assets/icons/android-chrome-512x512.png'

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    // Scroll progress handler
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShowScrollTop(window.scrollY > 400);

      // Active section detection
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'education', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' }
  ];

  const stats = [
    { value: 2, suffix: '+', label: 'Years Experience', duration: 2 },
    { value: 15, suffix: '+', label: 'Projects Completed', duration: 2.5 },
    { value: 1000, suffix: '+', label: 'Coffee', duration: 3 },
    { value: 99.9, suffix: '%', label: 'Uptime', duration: 2.2 }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Animated Counter Component
  const AnimatedCounter = ({ value, suffix, duration }: { value: number; suffix: string; duration: number }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            const increment = value / (duration * 60);
            let current = 0;
            const timer = setInterval(() => {
              current += increment;
              if (current >= value) {
                setCount(value);
                clearInterval(timer);
              } else {
                setCount(Math.floor(current * 10) / 10);
              }
            }, 1000 / 60);
            return () => clearInterval(timer);
          }
        },
        { threshold: 0.5 }
      );

      if (countRef.current) {
        observer.observe(countRef.current);
      }

      return () => observer.disconnect();
    }, [value, duration, hasAnimated]);

    return <div ref={countRef}>{count}{suffix}</div>;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Professional Navigation Bar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              <Image src={logoPath} alt="Logo" width={36} height={36} />
            </motion.div>
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors relative ${activeSection === item.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                      layoutId="activeSection"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
            <motion.button
              onClick={toggleDarkMode}
              className="rounded-full bg-zinc-100 p-2 dark:bg-zinc-800"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.svg
                    key="moon"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="sun"
                    className="h-5 w-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-3 shadow-lg text-white"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="mx-auto max-w-5xl px-6 pt-32 pb-20 md:pt-40 md:pb-32">
        <motion.div
          className="space-y-6"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1
            className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-6xl"
            variants={fadeInUp}
          >
            Rayan Reynaldo
          </motion.h1>
          <motion.h2
            className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300 md:text-3xl"
            variants={fadeInUp}
          >
            Mid Level Full-Stack Engineer
          </motion.h2>
          <motion.p
            className="max-w-3xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400"
            variants={fadeInUp}
          >
            Full-stack engineer with 2+ years building scalable web applications across fintech, e-commerce, and SaaS.
            Expert in system architecture, API design, and performance optimization. Delivered solutions that reduced
            operational costs by 40% and improved throughput by 300%.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-3 pt-4"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.08
                }
              }
            }}
          >
            {['React/Next.js', 'TypeScript', 'Node.js/Express', 'PHP/Laravel', 'Python/FastAPI', 'PostgreSQL', 'Docker'].map((skill, index) => (
              <motion.span
                key={index}
                className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 cursor-default"
                variants={{ initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 } }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgb(59 130 246)', color: 'white' }}
                whileTap={{ scale: 0.95 }}
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Animated Statistics */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-zinc-200 dark:border-zinc-800"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={stat.duration} />
              </div>
              <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* About Me */}
      <motion.section
        id="about"
        className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="mx-auto max-w-5xl px-6 py-16">
          <motion.h3
            className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            About Me
          </motion.h3>
          <motion.p
            className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            I build enterprise applications that drive revenue and operational efficiency. Core competencies include
            RESTful API design, database optimization, and CI/CD implementation. I lead technical teams, mentor engineers,
            and translate business requirements into production-ready solutions.
          </motion.p>
        </div>
      </motion.section>

      {/* Skills Overview */}
      <motion.section
        id="skills"
        className="mx-auto max-w-5xl px-6 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <motion.h3
          className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          Skills Overview
        </motion.h3>
        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="initial"
          whileInView="animate"
          viewport={{ once: false }}
        >
          {/* Frontend */}
          <motion.div
            variants={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900 transition-shadow hover:shadow-lg"
          >
            <h4 className="mb-4 text-xl font-semibold text-zinc-800 dark:text-zinc-200">Frontend</h4>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>• React.js, Next.js</li>
              <li>• TypeScript, JavaScript (ES6+)</li>
              <li>• Tailwind CSS, CSS3</li>
              <li>• State Management (Zustand, Context)</li>
              <li>• Responsive Design, SPA/SSR</li>
            </ul>
          </motion.div>

          {/* Backend */}
          <motion.div
            variants={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900 transition-shadow hover:shadow-lg"
          >
            <h4 className="mb-4 text-xl font-semibold text-zinc-800 dark:text-zinc-200">Backend</h4>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>• Node.js, Express.js</li>
              <li>• PHP, Laravel, CodeIgniter</li>
              <li>• Python, FastAPI</li>
              <li>• RESTful API Design</li>
              <li>• Microservices Architecture</li>
            </ul>
          </motion.div>

          {/* Databases */}
          <motion.div
            variants={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900 transition-shadow hover:shadow-lg"
          >
            <h4 className="mb-4 text-xl font-semibold text-zinc-800 dark:text-zinc-200">Databases</h4>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>• PostgreSQL, MySQL/MariaDB</li>
              <li>• Redis (Caching)</li>
              <li>• Database Optimization</li>
              <li>• Query Performance Tuning</li>
              <li>• Schema Design</li>
            </ul>
          </motion.div>

          {/* DevOps / Cloud */}
          <motion.div
            variants={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900 transition-shadow hover:shadow-lg"
          >
            <h4 className="mb-4 text-xl font-semibold text-zinc-800 dark:text-zinc-200">DevOps / Cloud</h4>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>• Docker, Containerization</li>
              <li>• CI/CD (GitHub Actions, Jenkins)</li>
              <li>• VPS Deployment (Hostinger)</li>
              <li>• Git Version Control</li>
              <li>• Linux Server Administration</li>
            </ul>
          </motion.div>

          {/* Tools / Platforms */}
          <motion.div
            variants={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900 transition-shadow hover:shadow-lg"
          >
            <h4 className="mb-4 text-xl font-semibold text-zinc-800 dark:text-zinc-200">Tools / Platforms</h4>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>• Git, GitHub</li>
              <li>• VS Code, PhpStorm</li>
              <li>• Postman, Insomnia</li>
              <li>• Jira, Confluence</li>
              <li>• Figma, Adobe XD</li>
            </ul>
          </motion.div>

          {/* Soft Skills */}
          <motion.div
            variants={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900 transition-shadow hover:shadow-lg"
          >
            <h4 className="mb-4 text-xl font-semibold text-zinc-800 dark:text-zinc-200">Soft Skills</h4>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>• Technical Leadership</li>
              <li>• System Architecture</li>
              <li>• Code Review & Mentoring</li>
              <li>• Agile/Scrum Methodologies</li>
              <li>• Cross-functional Collaboration</li>
            </ul>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Featured Projects */}
      <motion.section
        id="projects"
        className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="mx-auto max-w-5xl px-6 py-16">
          <motion.h3
            className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            Featured Projects
          </motion.h3>
          <motion.div
            className="space-y-12"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
            initial="initial"
            whileInView="animate"
            viewport={{ once: false }}
          >

            {/* Project 1 */}
            <motion.div
              className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900 overflow-hidden"
              variants={{ initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } }}
              whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", transition: { duration: 0.3 } }}
            >
              <h4 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Enterprise Payment Gateway Platform
              </h4>
              <p className="mb-4 text-zinc-600 dark:text-zinc-400">
                High-throughput payment processing system handling $50M+ in annual transactions.
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Next.js
                </span>
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Node.js
                </span>
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  PostgreSQL
                </span>
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Redis
                </span>
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Docker
                </span>
              </div>
              <div className="mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
                <p className="font-medium">Role & Responsibilities:</p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Led backend architecture design and implementation for microservices-based payment system</li>
                  <li>Designed RESTful APIs serving 10,000+ requests/minute with 99.95% uptime</li>
                  <li>Implemented real-time fraud detection using Redis caching and event-driven architecture</li>
                </ul>
              </div>
              <div className="mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
                <p className="font-medium">Architecture Overview:</p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Microservices architecture with event-driven communication via message queues</li>
                  <li>PostgreSQL for transactional data with read replicas for reporting</li>
                  <li>Redis cluster for session management and high-speed caching layer</li>
                  <li>Docker containerization with CI/CD pipeline reducing deployment time by 70%</li>
                </ul>
              </div>
              <div className="mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
                <p className="font-medium">Impact & Results:</p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Reduced payment processing latency from 3.2s to 450ms (86% improvement)</li>
                  <li>Achieved PCI DSS compliance through security best practices implementation</li>
                  <li>Decreased infrastructure costs by 40% through database query optimization</li>
                </ul>
              </div>
              <div className="space-y-2 text-zinc-700 dark:text-zinc-300">
                <p className="font-medium">Key Challenges Solved:</p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Implemented idempotency keys to prevent duplicate payment processing</li>
                  <li>Built retry mechanism with exponential backoff for third-party API failures</li>
                  <li>Designed database sharding strategy to handle 100M+ transaction records</li>
                </ul>
              </div>
              <div className="mt-4 flex gap-4">
                <motion.a
                  href="#"
                  className="text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center gap-1"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  View Code →
                </motion.a>
                <motion.a
                  href="#"
                  className="text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center gap-1"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  Live Demo →
                </motion.a>
              </div>
            </motion.div>

            {/* Project 2 */}
            <motion.div
              className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900 overflow-hidden"
              variants={{ initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } }}
              whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", transition: { duration: 0.3 } }}
            >
              <h4 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Real-Time Analytics Dashboard (SaaS)
              </h4>
              <p className="mb-4 text-zinc-600 dark:text-zinc-400">
                Multi-tenant analytics platform serving 500+ enterprise clients with real-time data visualization.
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  React
                </span>
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  TypeScript
                </span>
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  FastAPI
                </span>
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  PostgreSQL
                </span>
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  WebSockets
                </span>
              </div>
              <div className="mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
                <p className="font-medium">Role & Responsibilities:</p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Architected full-stack solution with React frontend and Python FastAPI backend</li>
                  <li>Built WebSocket infrastructure for real-time data streaming to 1,000+ concurrent users</li>
                  <li>Mentored team of 5 developers on TypeScript best practices and code review standards</li>
                </ul>
              </div>
              <div className="mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
                <p className="font-medium">Architecture Overview:</p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Multi-tenant architecture with row-level security in PostgreSQL</li>
                  <li>WebSocket server for real-time updates with fallback to HTTP polling</li>
                  <li>React with custom hooks for data fetching and state management</li>
                  <li>FastAPI backend with async/await for high-concurrency operations</li>
                </ul>
              </div>
              <div className="mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
                <p className="font-medium">Impact & Results:</p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Improved dashboard load time from 8s to 1.2s through code-splitting and lazy loading</li>
                  <li>Increased user engagement by 65% with real-time data updates</li>
                  <li>Reduced server costs by 35% through efficient database indexing and query optimization</li>
                </ul>
              </div>
              <div className="space-y-2 text-zinc-700 dark:text-zinc-300">
                <p className="font-medium">Key Challenges Solved:</p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Implemented data aggregation pipeline processing 50M+ events daily</li>
                  <li>Built custom caching layer reducing database queries by 80%</li>
                  <li>Designed tenant isolation strategy ensuring data security and compliance</li>
                </ul>
              </div>
              <div className="mt-4 flex gap-4">
                <motion.a
                  href="#"
                  className="text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center gap-1"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  View Code →
                </motion.a>
                <motion.a
                  href="#"
                  className="text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center gap-1"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  Case Study →
                </motion.a>
              </div>
            </motion.div>

            {/* Project 3 */}
            <motion.div
              className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900 overflow-hidden"
              variants={{ initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } }}
              whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", transition: { duration: 0.3 } }}
            >
              <h4 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                E-Commerce Marketplace Platform
              </h4>
              <p className="mb-4 text-zinc-600 dark:text-zinc-400">
                Multi-vendor marketplace with 20,000+ products and integrated inventory management.
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Laravel
                </span>
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Next.js
                </span>
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  MySQL
                </span>
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Redis
                </span>
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Stripe API
                </span>
              </div>
              <div className="mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
                <p className="font-medium">Role & Responsibilities:</p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Developed RESTful API backend with Laravel serving mobile and web clients</li>
                  <li>Built vendor management system with role-based access control (RBAC)</li>
                  <li>Integrated Stripe payment processing with automated commission splitting</li>
                </ul>
              </div>
              <div className="mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
                <p className="font-medium">Architecture Overview:</p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Laravel backend with repository pattern for data access abstraction</li>
                  <li>Next.js SSR frontend for SEO optimization and fast initial page loads</li>
                  <li>MySQL with proper indexing for product catalog and order management</li>
                  <li>Redis for cart sessions and product recommendation caching</li>
                </ul>
              </div>
              <div className="mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
                <p className="font-medium">Impact & Results:</p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Achieved 300% increase in transaction volume within first 6 months</li>
                  <li>Reduced checkout abandonment rate from 45% to 18% through UX optimization</li>
                  <li>Improved SEO ranking by 200% with Next.js server-side rendering</li>
                </ul>
              </div>
              <div className="space-y-2 text-zinc-700 dark:text-zinc-300">
                <p className="font-medium">Key Challenges Solved:</p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Implemented inventory synchronization across multiple vendors in real-time</li>
                  <li>Built automated commission calculation and payout system</li>
                  <li>Designed scalable search functionality with full-text indexing</li>
                </ul>
              </div>
              <div className="mt-4 flex gap-4">
                <motion.a
                  href="#"
                  className="text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center gap-1"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  View Code →
                </motion.a>
                <motion.a
                  href="#"
                  className="text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center gap-1"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  Live Demo →
                </motion.a>
              </div>
            </motion.div>

            {/* Project 4 */}
            <motion.div
              className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900 overflow-hidden"
              variants={{ initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } }}
              whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", transition: { duration: 0.3 } }}
            >
              <h4 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Content Management System (Headless CMS)
              </h4>
              <p className="mb-4 text-zinc-600 dark:text-zinc-400">
                Headless CMS powering 50+ websites with flexible content modeling and API-first approach.
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Node.js
                </span>
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Express
                </span>
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  PostgreSQL
                </span>
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  GraphQL
                </span>
                <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Docker
                </span>
              </div>
              <div className="mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
                <p className="font-medium">Role & Responsibilities:</p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Designed GraphQL API schema supporting flexible content types and relationships</li>
                  <li>Built content versioning system with rollback capabilities</li>
                  <li>Implemented webhook system for real-time content synchronization</li>
                </ul>
              </div>
              <div className="mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
                <p className="font-medium">Architecture Overview:</p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Node.js/Express backend with GraphQL for flexible data querying</li>
                  <li>PostgreSQL with JSONB for dynamic content schema storage</li>
                  <li>Docker containers for isolated development and production environments</li>
                  <li>CI/CD pipeline with automated testing and deployment</li>
                </ul>
              </div>
              <div className="mb-4 space-y-2 text-zinc-700 dark:text-zinc-300">
                <p className="font-medium">Impact & Results:</p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Reduced content publishing time from 30 minutes to 2 minutes</li>
                  <li>Enabled non-technical users to manage content without developer support</li>
                  <li>API response time under 100ms for 95% of requests</li>
                </ul>
              </div>
              <div className="space-y-2 text-zinc-700 dark:text-zinc-300">
                <p className="font-medium">Key Challenges Solved:</p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Built flexible content model supporting custom fields without migrations</li>
                  <li>Implemented content preview system with draft/published states</li>
                  <li>Designed multi-language support with translation workflow</li>
                </ul>
              </div>
              <div className="mt-4 flex gap-4">
                <motion.a
                  href="#"
                  className="text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center gap-1"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  Documentation →
                </motion.a>
                <motion.a
                  href="#"
                  className="text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center gap-1"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  API Playground →
                </motion.a>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </motion.section>

      {/* Experience Timeline */}
      <motion.section
        id="experience"
        className="mx-auto max-w-5xl px-6 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <motion.h3
          className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          Experience Timeline
        </motion.h3>
        <motion.div
          className="space-y-8"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          initial="initial"
          whileInView="animate"
          viewport={{ once: false }}
        >

          {/* Experience 1 */}
          <motion.div
            className="border-l-4 border-blue-600 pl-6 relative"
            variants={{ initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 } }}
            whileHover={{ x: 10, borderColor: 'rgb(37 99 235)', transition: { duration: 0.3 } }}
          >
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h4 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Mid Level Full-Stack Engineer
              </h4>
              <span className="text-zinc-500 dark:text-zinc-400">•</span>
              <span className="text-zinc-600 dark:text-zinc-400">TechCorp Solutions</span>
            </div>
            <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-500">2023 – Present</p>
            <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
              <li>
                • Developed microservices handling 5M+ API requests daily with 99.8% uptime
              </li>
              <li>
                • Contributed to migration from monolithic PHP to Node.js microservices, reducing deployment
                time by 50%
              </li>
              <li>
                • Optimized database queries through indexing and schema improvements, reducing execution
                time by 45%
              </li>
              <li>
                • Participated in code reviews and pair programming with team of 5 developers
              </li>
              <li>
                • Implemented CI/CD pipeline using GitHub Actions and Docker for automated testing and deployment
              </li>
              <li>
                • Built real-time analytics features using WebSockets and Redis, processing 500K+ events per hour
              </li>
            </ul>
          </motion.div>

          {/* Experience 2 */}
          <motion.div
            className="border-l-4 border-blue-600 pl-6 relative"
            variants={{ initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 } }}
            whileHover={{ x: 10, borderColor: 'rgb(37 99 235)', transition: { duration: 0.3 } }}
          >
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h4 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Full-Stack Developer
              </h4>
              <span className="text-zinc-500 dark:text-zinc-400">•</span>
              <span className="text-zinc-600 dark:text-zinc-400">Digital Innovations Ltd</span>
            </div>
            <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-500">2022 – 2023</p>
            <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
              <li>
                • Developed full-stack features for SaaS platform using Laravel and React, supporting
                20+ enterprise clients
              </li>
              <li>
                • Implemented RESTful APIs serving web and mobile applications with 99.5% uptime
              </li>
              <li>
                • Reduced page load times by 45% through code-splitting and lazy loading optimization
              </li>
              <li>
                • Collaborated with product team to deliver 8 major features on schedule
              </li>
              <li>
                • Built automated testing suite with 75% code coverage, reducing production bugs by 35%
              </li>
              <li>
                • Integrated Stripe payment processing, handling $200K+ monthly transactions
              </li>
            </ul>
          </motion.div>

        </motion.div>
      </motion.section>

      {/* Education & Certifications */}
      <motion.section
        id="education"
        className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="mx-auto max-w-5xl px-6 py-16">
          <motion.h3
            className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            Education & Certifications
          </motion.h3>
          <motion.div
            className="space-y-6"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            initial="initial"
            whileInView="animate"
            viewport={{ once: false }}
          >

            <motion.div
              variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
            >
              <h4 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Bachelor of Science in Information Technology
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400">University Name • 2012 – 2016</p>
              <p className="mt-2 text-zinc-700 dark:text-zinc-300">
                Relevant Coursework: Data Structures & Algorithms, Database Systems, Software Engineering,
                Web Development, Computer Networks
              </p>
            </motion.div>

            <motion.div
              className="pt-4"
              variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
            >
              <h4 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Professional Certifications
              </h4>
              <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>• AWS Certified Solutions Architect – Associate</li>
                <li>• Docker Certified Associate</li>
                <li>• Professional Scrum Master (PSM I)</li>
              </ul>
            </motion.div>

          </motion.div>
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section
        id="contact"
        className="mx-auto max-w-5xl px-6 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <motion.h3
          className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          Let&apos;s Connect
        </motion.h3>
        <motion.p
          className="mb-8 text-lg text-zinc-700 dark:text-zinc-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Available for consulting and full-time opportunities.
        </motion.p>

        <motion.div
          className="max-w-2xl mx-auto space-y-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          <h4 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">Connect with me</h4>
          <motion.a
            href="https://github.com/rvrdev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 dark:hover:border-blue-600 transition-colors group"
            whileHover={{ scale: 1.02, x: 5 }}
          >
            <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-blue-600 transition-colors">
              <svg className="h-6 w-6 text-zinc-700 dark:text-zinc-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-zinc-900 dark:text-zinc-100">GitHub</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">github.com/rvrdev</div>
            </div>
          </motion.a>

          <motion.a
            href="https://linkedin.com/in/rayan-reynaldo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 dark:hover:border-blue-600 transition-colors group"
            whileHover={{ scale: 1.02, x: 5 }}
          >
            <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-blue-600 transition-colors">
              <svg className="h-6 w-6 text-zinc-700 dark:text-zinc-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-zinc-900 dark:text-zinc-100">LinkedIn</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">linkedin.com/in/rayanreynaldo</div>
            </div>
          </motion.a>

          <motion.a
            href="mailto:rayan.reynaldo@example.com"
            className="flex items-center gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 dark:hover:border-blue-600 transition-colors group"
            whileHover={{ scale: 1.02, x: 5 }}
          >
            <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-blue-600 transition-colors">
              <svg className="h-6 w-6 text-zinc-700 dark:text-zinc-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-zinc-900 dark:text-zinc-100">Email</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">rayanvegareynaldo@gmail.com</div>
            </div>
          </motion.a>

          <motion.a
            href="https://rvrdev.github.io"
            className="flex items-center gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 dark:hover:border-blue-600 transition-colors group"
            whileHover={{ scale: 1.02, x: 5 }}
          >
            <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-blue-600 transition-colors">
              <svg className="h-6 w-6 text-zinc-700 dark:text-zinc-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-zinc-900 dark:text-zinc-100">Website</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">rvrdev.github.io</div>
            </div>
          </motion.a>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="text-center text-zinc-600 dark:text-zinc-400">
            © {new Date().getFullYear()} Rayan Reynaldo. Designed and Built by Me.
          </p>
        </div>
      </footer>
    </div>
  );
}
