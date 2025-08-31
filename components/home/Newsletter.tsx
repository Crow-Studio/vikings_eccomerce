'use client'
import React, { useState } from 'react';
import { MessageCircle, ArrowRight, CheckCircle, Gift, Zap, Bell, X } from 'lucide-react';
import GrainOverlay from "@/components/global/GrainOverlay"
const Newsletter = () => {
  const [, setPhoneNumber] = useState('');
  const [, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const handleJoinWhatsApp = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsJoined(true);
      setShowSuccess(true);
      setIsLoading(false);
      setPhoneNumber('');
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }, 1000);
  };
  const benefits = [
    {
      icon: Gift,
      title: "Exclusive Deals",
      description: "Get instant notifications about special discounts and flash sales"
    },
    {
      icon: Zap,
      title: "New Product Alerts",
      description: "Be the first to see new tools with photos and specifications"
    },
    {
      icon: Bell,
      title: "Expert Tips & Support",
      description: "Get quick answers and professional advice from our team"
    }
  ];
  const stats = [
    { number: "2500+", label: "Members" },
    { number: "Daily", label: "Updates" },
    { number: "Instant", label: "Support" }
  ];
  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
      {}
      <GrainOverlay/>
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
      </div>
      {}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Successfully joined our WhatsApp community!</span>
          <button 
            onClick={() => setShowSuccess(false)}
            className="ml-2 hover:bg-primary/80 rounded-full p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <MessageCircle className="w-4 h-4" />
                <span>Join Our WhatsApp Community</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Get Instant Updates on{' '}
                <span className="relative text-primary">
                  WhatsApp
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
                </span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join over 2,500+ professionals in our WhatsApp community for instant deals, new arrivals, and expert advice from Vikings Kenya Power Traders.
              </p>
            </div>
            {}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Join Our WhatsApp Community
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Get instant updates, exclusive deals, and direct support
                  </p>
                </div>
                <button
                  onClick={handleJoinWhatsApp}
                  disabled={isLoading}
                  className="group relative overflow-hidden bg-primary hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-primary-foreground px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center space-x-2 w-full"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      <span>Join WhatsApp Community</span>
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Free to join</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>No spam</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Leave anytime</span>
                  </div>
                </div>
              </div>
            </div>
            {}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Why Join Our WhatsApp Community?
              </h3>
              <p className="text-muted-foreground">
                Connect with thousands of professionals and get instant updates on your phone.
              </p>
            </div>
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="group bg-card/30 backdrop-blur-sm rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {benefit.title}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {}
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-6 border border-primary/30">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary rounded-xl">
                  <MessageCircle className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">
                    2500+ Members & Growing
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Join contractors, engineers, and professionals across Kenya
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Newsletter;