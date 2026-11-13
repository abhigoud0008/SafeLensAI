import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Link2,
  Lock,
  Menu,
  MessageSquareWarning,
  Moon,
  QrCode,
  Shield,
  ShieldCheck,
  Smartphone,
  Sun,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import heroSafelensImg from '../assets/images/hero_safelens_calm_1794583382376.jpg';
import aboutWorkshopImg from '../assets/images/about_safety_workshop_1794583381059.jpg';
import priyaAvatarImg from '../assets/images/testimonial_priya_1794583382741.jpg';
import marcusAvatarImg from '../assets/images/testimonial_marcus_1794583382344.jpg';
import elenaAvatarImg from '../assets/images/testimonial_elena_1794583382878.jpg';
import type { AppSection } from '../types/safety';
import { Button, Card } from './ui/Primitives';

interface LandingPageProps {
  onNavigate: (section: AppSection) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const TESTIMONIALS = [
  {
    name: 'Priya Nair',
    role: 'Product Manager · Austin, TX',
    avatar: priyaAvatarImg,
    quote:
      'I received a WhatsApp message offering a remote contract with an upfront equipment deposit. SafeLens AI broke down the urgency and fee-first warning signs in ten seconds, so I verified with the company’s real HR directory and avoided a $180 loss.',
  },
  {
    name: 'Marcus Vance',
    role: 'High School Educator · Chicago, IL',
    avatar: marcusAvatarImg,
    quote:
      'Using "Explain Like I’m 10" mode during digital literacy class turned scary phishing warnings into clear, memorable lessons. My students now check root domains before tapping any QR code or shortened link.',
  },
  {
    name: 'Elena Rostova',
    role: 'Community Volunteer · Seattle, WA',
    avatar: elenaAvatarImg,
    quote:
      'Most security tools feel overwhelming or alarmist. SafeLens AI calmly translates app permissions and daily safety checklists into plain English our neighborhood senior group actually enjoys reading.',
  },
];

export function LandingPage({
  onNavigate,
  theme,
  onToggleTheme,
}: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#top"
            className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <Shield className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <span>SafeLens AI</span>
          </a>

          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <a
              href="#features"
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Features
            </a>
            <a
              href="#use-cases"
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Use Cases
            </a>
            <button
              type="button"
              onClick={() => onNavigate('advisor')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Safety Hub
            </button>
            <button
              type="button"
              onClick={() => onNavigate('trust')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Trust & AI
            </button>
            <a
              href="#about"
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              About
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('dashboard')}
              className="hidden sm:inline-flex"
            >
              <span>Analyze Risk</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-4 space-y-3">
            <div className="flex flex-col gap-2 text-sm font-medium">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2">
                Features
              </a>
              <a href="#use-cases" onClick={() => setMobileMenuOpen(false)} className="py-2">
                Use Cases
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('advisor');
                }}
                className="py-2 text-left"
              >
                Safety Hub
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('trust');
                }}
                className="py-2 text-left"
              >
                Trust & AI
              </button>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2">
                About
              </a>
            </div>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('dashboard');
              }}
            >
              Analyze Risk
            </Button>
          </div>
        )}
      </header>

      <main id="top">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-6 pt-14 pb-20 lg:pt-20 lg:pb-24">
          <div className="grid gap-10 lg:grid-cols-12 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="lg:col-span-6 flex flex-col justify-center"
            >
              <p className="text-xs font-medium tracking-wide text-blue-600 dark:text-blue-400">
                Personal Digital & Everyday Safety Companion
              </p>
              <h1
                className="mt-3 font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]"
                style={{
                  fontSize: 'clamp(2.25rem, 4vw, 3.65rem)',
                  textWrap: 'balance',
                }}
              >
                Understand Risk Before You Trust.
              </h1>
              <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                SafeLens AI helps people make safer decisions online and in everyday life by explaining risks in simple language before they take action.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => onNavigate('message')}
                >
                  <span>Analyze Risk</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onNavigate('advisor')}
                >
                  <span>Explore Safety Hub</span>
                </Button>
                <button
                  type="button"
                  onClick={onToggleTheme}
                  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors cursor-pointer"
                >
                  {theme === 'light' ? (
                    <Moon className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Sun className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                <span>No account required</span>
                <span aria-hidden="true">·</span>
                <span>Local browser storage only</span>
                <span aria-hidden="true">·</span>
                <span>Calm, transparent explanations</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="lg:col-span-6 flex"
            >
              <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-900 min-h-[300px]">
                <img
                  src={heroSafelensImg}
                  alt="Person calmly reviewing a smartphone message beside a laptop in natural morning light"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover lg:h-full"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent p-6 text-white">
                  <p className="text-xs font-semibold text-blue-200">
                    Before You Click Education
                  </p>
                  <p className="mt-1 text-sm sm:text-base font-medium leading-snug text-white">
                    Learn why a message, link, QR code, or app permission may be risky—and what safer step to take next.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 py-20"
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Seven practical tools built for clarity, not fear
              </h2>
              <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Every tool explains the reasoning behind a warning, highlights uncertainty honestly, and lets you switch to plain-language guidance in one click.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  num: '01',
                  title: 'Message Analyzer',
                  desc: 'Paste SMS, WhatsApp messages, or emails to spot urgency, fear tactics, OTP harvesting, and suspicious links—with "Explain Like I’m 10" mode.',
                  icon: MessageSquareWarning,
                  route: 'message' as AppSection,
                },
                {
                  num: '02',
                  title: 'QR Code Safety Scanner',
                  desc: 'Upload any QR image to decode its hidden destination locally and inspect a Safe Preview before ever opening a link or payment intent.',
                  icon: QrCode,
                  route: 'qr' as AppSection,
                },
                {
                  num: '03',
                  title: 'URL Safety Checker',
                  desc: 'Inspect HTTPS status, misleading subdomains, and typosquatting lookalikes like amaz0n-login.com with an instant Trust Score.',
                  icon: Link2,
                  route: 'url' as AppSection,
                },
                {
                  num: '04',
                  title: 'Permission Translator',
                  desc: 'Upload an app permission prompt screenshot and see Plain English, Child Friendly descriptions, and risk levels for Camera, Contacts, or Location.',
                  icon: Smartphone,
                  route: 'permissions' as AppSection,
                },
                {
                  num: '05',
                  title: 'Daily Life Safety Advisor',
                  desc: '22 structured guides across Digital, Physical, Family, and Emergency Preparedness—covering warning signs and what to do if it happens.',
                  icon: Compass,
                  route: 'advisor' as AppSection,
                },
                {
                  num: '06',
                  title: 'Safety Academy & Score',
                  desc: 'Interactive lessons with quick quizzes that build your personal 0–100 Safety Score across Digital Awareness, Privacy, Scam Resistance, and Preparedness.',
                  icon: BookOpen,
                  route: 'academy' as AppSection,
                },
              ].map((item) => (
                <Card key={item.num} className="p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono">{item.num}</span>
                      <item.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => onNavigate(item.route)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
                    >
                      <span>Open {item.title}</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Daily Life Use Cases */}
        <section id="use-cases" className="py-20 mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Designed for real moments before you click
              </h2>
              <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
                See how SafeLens AI turns confusing situations into calm, informed decisions.
              </p>
            </div>
            <Button variant="outline" onClick={() => onNavigate('dashboard')}>
              Open Full Workspace
            </Button>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                context: 'WhatsApp · Job Search',
                title: 'Fake Job Offer Screening',
                before: '"Pay a $25 refundable registration fee within 2 hours to confirm your remote role."',
                outcome:
                  'Flags upfront fee demands and unverified lookalike links, then walks through official HR verification.',
                route: 'message' as AppSection,
              },
              {
                context: 'Mobile · New App Install',
                title: 'Over-Privileged Utility Apps',
                before: 'A simple flashlight app asks for Contacts, Precise Background Location, and Camera.',
                outcome:
                  'Translates each permission into plain language and shows which ones can be safely denied.',
                route: 'permissions' as AppSection,
              },
              {
                context: 'Café & Transit · Everyday Life',
                title: 'Unfamiliar QR Stickers & Public Wi-Fi',
                before: 'A parking meter or table QR sticker redirects to an unfamiliar payment page.',
                outcome:
                  'Decodes the URL or UPI intent in Safe Preview without auto-opening, preventing silent redirects.',
                route: 'qr' as AppSection,
              },
            ].map((uc) => (
              <Card key={uc.title} className="p-6 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {uc.context}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
                    {uc.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 italic">
                    {uc.before}
                  </p>
                  <p className="mt-3 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {uc.outcome}
                  </p>
                </div>
                <div className="mt-5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate(uc.route)}
                  >
                    Try this scenario
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Trusted by families, educators, and everyday teams
              </h2>
              <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
                Built to support safer habits across generations without technical jargon.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <Card key={t.name} className="p-6 flex flex-col justify-between">
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    “{t.quote}”
                  </p>
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3.5">
                    <img
                      src={t.avatar}
                      alt={`Portrait of ${t.name}`}
                      referrerPolicy="no-referrer"
                      className="h-11 w-11 rounded-full object-cover bg-slate-200 dark:bg-slate-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {t.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Education & About */}
        <section id="about" className="py-20 mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-5 flex">
              <div className="w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-900 min-h-[280px]">
                <img
                  src={aboutWorkshopImg}
                  alt="Family members reviewing digital safety guidance together on a tablet"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover lg:h-full"
                />
              </div>
            </div>
            <div className="lg:col-span-7 flex flex-col justify-center">
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Safety Education & Responsible Design
              </p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Prevention through understanding, never fear
              </h2>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Binary "SAFE / DANGER" banners teach users to rely on blind labels. SafeLens AI is built for SafeSpace Hacks around four principles: clear safety benefit, practical tools, transparent AI limitations, and human-friendly education.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    <span>Zero Database Storage</span>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                    Your temporary history, quiz progress, and Safety Score stay locally inside your browser’s localStorage.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <span>Honest Uncertainty</span>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                    SafeLens AI uses calibrated phrases like "Potential Risk" and "Cannot Verify" and openly explains what AI cannot see.
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button variant="primary" onClick={() => onNavigate('academy')}>
                  Start Safety Academy
                </Button>
                <Button variant="outline" onClick={() => onNavigate('trust')}>
                  Read Trust & Responsible AI
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" aria-hidden="true" />
            <span className="font-medium text-slate-900 dark:text-slate-100">
              SafeLens AI
            </span>
            <span aria-hidden="true">·</span>
            <span>Understand Risk Before You Trust.</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => onNavigate('advisor')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Safety Advisor
            </button>
            <button
              type="button"
              onClick={() => onNavigate('trust')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Responsible AI
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
