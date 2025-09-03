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
    
    // WhatsApp group link
    const whatsappGroupUrl = "https://chat.whatsapp.com/KnRkGuspustFJoVP9dG8s7";
    
    // Open WhatsApp group
    window.open(whatsappGroupUrl, "_blank");
    
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
    { number: "29+", label: "Members" },
    { number: "Daily", label: "Updates" },
    { number: "Instant", label: "Support" }
  ];

  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      {/* Grain overlay */}
      <GrainOverlay/>
      
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-transparent"></div>
      </div>

      {/* Success notification - Blue theme */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Successfully joined our WhatsApp group!</span>
          <button 
            onClick={() => setShowSuccess(false)}
            className="ml-2 hover:bg-blue-700 rounded-full p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column */}
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Badge - Yellow for attention */}
              <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
                <MessageCircle className="w-4 h-4" />
                <span>Join Our WhatsApp Group</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Get Instant Updates on{' '}
                <span className="relative text-blue-600">
                  WhatsApp
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-blue-200 rounded-full"></span>
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Join our growing WhatsApp group for instant deals, new arrivals, and expert advice from Vikings Kenya Power Traders.
              </p>
            </div>

            {/* Main CTA Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                    <MessageCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Join Our WhatsApp Group
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Get instant updates, exclusive deals, and direct support
                  </p>
                </div>
                
                {/* Primary CTA Button - Blue */}
                <button
                  onClick={handleJoinWhatsApp}
                  disabled={isLoading}
                  className="group relative overflow-hidden bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center space-x-2 w-full"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      <span>Join WhatsApp Group</span>
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
                
                {/* Trust indicators */}
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Free to join</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>No spam</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Leave anytime</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Why Join Our WhatsApp Group?
              </h3>
              <p className="text-gray-600">
                Connect with professionals and get instant updates on your phone.
              </p>
            </div>
            
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="group bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                      <benefit.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {benefit.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof card - Yellow accent */}
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-400 rounded-xl">
                  <MessageCircle className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    29+ Members & Growing
                  </h4>
                  <p className="text-gray-700 text-sm">
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