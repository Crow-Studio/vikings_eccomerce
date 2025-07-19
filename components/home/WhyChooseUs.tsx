import React from 'react';
import { Phone } from 'lucide-react';
import GrainOverlay from '@/components/global/GrainOverlay';
import { mainFeatures, additionalBenefits, stats, contactInfo } from '@/data/WhyChooseUs';

const WhyChooseUs = () => {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      <GrainOverlay />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Why Choose{' '}
            <span className="relative text-primary">
              Vikings 
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
            </span>
          </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Your trusted partner for professional tools and equipment. We&apos;ve been serving Kenya&apos;s professionals since 2005 with quality, reliability, and exceptional service.
            </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <div 
              key={index}
              className="group relative  rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-slate-700 hover:border-primary/30 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative p-4 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {feature.highlight}
                </div>
              </div>
              
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl transform rotate-45 translate-x-10 -translate-y-10 group-hover:from-primary/10 transition-colors"></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className=" rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-200 dark:border-slate-700 mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Everything You Need for Professional Success
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              From individual contractors to large construction companies, we provide the tools, support, and expertise you need to get the job done right.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {additionalBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <benefit.icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 lg:p-12">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary rounded-2xl">
                    <Phone className="w-6 h-6 text-white dark:text-black" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Need Help Choosing?</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Our experts are here to help</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Call us:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{contactInfo.phone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{contactInfo.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Hours:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{contactInfo.hours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;