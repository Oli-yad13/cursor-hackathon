import React from 'react';
import illustrationImage from '../assets/about.png';
import teamIllustration from '../assets/about3.png';
import phoneGraphic from '../assets/about.png';
import { Link } from "react-router-dom";
import { FaHeartbeat, FaCamera, FaExclamationTriangle, FaBook, FaStethoscope, FaMapPin, FaComments } from "react-icons/fa";
import {
  FeatureSection,
  FeatureSectionContent,
  FeatureSectionHeader,
  FeatureSectionTitle,
  FeatureSectionDescription,
  FeatureSectionGrid,
  FeatureCard,
  FeatureCardIcon,
  FeatureCardTitle,
  FeatureCardDescription,
} from './ui/feature-section';

const Home = () => {
  // Content data for easy updates
  const content = {
    about: {
      hero: {
        title: 'Your Health, Our Priority:',
        subtitle: 'Expert Medical Care at Your Fingertips',
        description: 'TenaHub provides personalized healthcare solutions, connecting you with professionals for teleconsultations and first aid guidance.',
        ctaButtonText: 'Book a Consultation',
        ctaLink: '/find-doctor',
      },
      whoWeAre: {
        title: 'Connect With Top Doctors',
        description: ' We are a dedicated group of healthcare professionals committed to providing exceptional medical services.    Our team includes specialists across various fields, ensuring comprehensive care tailored to your needs.  With expertise in cardiology, dermatology, neurology, and general practice, we are here to support your health journey every step of the way.',
        buttonText: 'Find Doctors Now',
        buttonLink: '/find-doctor',
      },
    },
    howWeHelp: {
      title: 'Complete Healthcare Solutions',
      sections: [
        {
          buttonText: 'Check Symptoms',
          buttonLink: '/symptom-checker',
          title: 'Symptom Checker',
          icon: <FaHeartbeat className="h-6 w-6" />,
          description: 'Check your symptoms and get preliminary insights about possible conditions.',
        },
        {
          title: 'Skin Diagnosis',
          icon: <FaCamera className="h-6 w-6" />,
          description: 'Upload a photo of your skin condition for AI-powered analysis and recommendations.',
          buttonText: 'Check Skin Condition',
          buttonLink: '/skin-diagnosis',
        },
        {
          title: 'First Aid Guides',
          icon: <FaExclamationTriangle className="h-6 w-6" />,
          description: 'Access comprehensive first aid guides and home remedies for common issues.',
          buttonText: 'View Guides',
          buttonLink: '/first-aid',
        },
        {
          title: 'Health Education',
          icon: <FaBook className="h-6 w-6" />,
          description: 'Learn about various health conditions through articles and educational videos.',
          buttonText: 'Learn More',
          buttonLink: '/education',
        },
        {
          title: 'Find Doctors',
          icon: <FaStethoscope className="h-6 w-6" />,
          description: 'Connect with qualified healthcare professionals for teleconsultations.',
          buttonText: 'Find Doctors',
          buttonLink: '/find-doctor',
        },
        {
          title: 'Nearby Clinics',
          icon: <FaMapPin className="h-6 w-6" />,
          description: 'Locate healthcare facilities near you when you need in-person care.',
          buttonText: 'Find Clinics',
          buttonLink: '/find-clinic',
        },
        {
          title: 'Health Chat',
          icon: <FaComments className="h-6 w-6" />,
          description: 'Ask health-related questions anytime with SmartChat.',
          buttonText: 'Start Chatting',
          buttonLink: '/symptom-checker',
        },
      ],
    },
  };

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-gray-900 font-sans">
      {/* About Section */}
      <section className="flex-1 flex items-center justify-center text-left px-4 py-16 md:py-24 bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Text Content */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-2">
              {content.about.hero.title}
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
              {content.about.hero.subtitle}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mb-6">
              {content.about.hero.description}
            </p>
            <Link
              to={content.about.hero.ctaLink}
              className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition"
              aria-label="Request a free consultation"
            >
              {content.about.hero.ctaButtonText}
            </Link>
          </div>
          {/* Hero Illustration */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src={illustrationImage}
              alt="Illustration of professionals collaborating on product development"
              className="w-64 h-64 md:w-96 md:h-96 object-contain"
            />
          </div>
        </div>
      </section>

      {/* How We Help Section - Using shadcn Feature Section */}
      <FeatureSection className="bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100 dark:from-black dark:via-gray-900 dark:to-gray-800">
        <FeatureSectionContent className="mx-auto max-w-7xl">
          <FeatureSectionHeader className="mb-16">
            <FeatureSectionTitle className="bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-800 bg-clip-text text-transparent mb-6">
              {content.howWeHelp.title}
            </FeatureSectionTitle>
            <FeatureSectionDescription className="text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive healthcare at your fingertips - from AI-powered diagnostics to personalized care
            </FeatureSectionDescription>
          </FeatureSectionHeader>
          
          <FeatureSectionGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-auto max-w-7xl justify-items-center">
            {content.howWeHelp.sections.map((section, index) => (
              <FeatureCard 
                key={index}
                className="group relative bg-white/70 dark:bg-black/70 backdrop-blur-sm border-white/20 dark:border-gray-800/20 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2 transition-all duration-500"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                
                {/* Icon container */}
                <FeatureCardIcon className="relative z-10 mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {section.icon}
                </FeatureCardIcon>
                
                {/* Content */}
                <div className="relative z-10">
                  <FeatureCardTitle className="text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                    {section.title}
                  </FeatureCardTitle>
                  <FeatureCardDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
                    {section.description}
                  </FeatureCardDescription>
                  
                  {/* CTA Button */}
                  <Link to={section.buttonLink} className="block">
                    <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg group-hover:shadow-cyan-500/25">
                      {section.buttonText}
                      <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </button>
                  </Link>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-400/10 to-cyan-400/10 rounded-full translate-y-10 -translate-x-10 group-hover:scale-125 transition-transform duration-700"></div>
              </FeatureCard>
            ))}
          </FeatureSectionGrid>
          
          {/* Bottom CTA Section */}
          <div className="mt-20 text-center w-full flex justify-center">
            <div className="bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-gray-800/20 max-w-4xl mx-auto w-full">
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Start Your Health Journey?
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                Join thousands of users who trust TenaHub for their healthcare needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup/patient">
                  <button className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold px-8 py-4 rounded-full hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Get Started Today
                  </button>
                </Link>
                <Link to="/find-doctor">
                  <button className="bg-white/80 dark:bg-black/80 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-semibold px-8 py-4 rounded-full hover:bg-white dark:hover:bg-gray-900 transition-all duration-300 transform hover:scale-105">
                    Find a Doctor
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </FeatureSectionContent>
      </FeatureSection>

      {/* Who We Are Section */}
      <section className="flex items-center justify-center text-left px-4 py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Team Illustration */}
          <div className="md:w-1/2 flex justify-center mb-8 md:mb-0">
            <img
              src={teamIllustration}
              alt="Illustration of the Pomegranate Studio team"
              className="w-64 h-64 md:w-96 md:h-96 object-contain"
            />
          </div>
          {/* Text Content */}
          <div className="md:w-1/2 relative">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {content.about.whoWeAre.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mb-6">
              {content.about.whoWeAre.description}
            </p>
            <Link to={content.about.whoWeAre.buttonLink}
          className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition"
          aria-label="Learn more about us"
        >
          {content.about.whoWeAre.buttonText}
        </Link>

            {/* Phone Graphic */}
            <img
              src={phoneGraphic}
              alt="Telegram Mini App on phone"
              className="absolute hidden md:block top-0 right-0 w-32 h-48 object-contain transform translate-x-12 -translate-y-12"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;