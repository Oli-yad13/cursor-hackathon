import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import herovideo from "../assets/hero-video.mp4";
import NavBar from "./NavBar";

const Hero = () => {
  return (
    <div className="text-white dark:text-white relative min-h-screen overflow-hidden transition-all duration-1000">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={herovideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black dark:bg-black opacity-40"></div>

      <div className="container mx-auto relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <motion.div
          className="space-y-8 max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white dark:text-white leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Empower Your Health with{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              AI Technology
            </span>
          </motion.h1>

          <motion.p
            className="text-2xl md:text-3xl text-gray-200 dark:text-gray-200 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            TenaHub provides personalized health insights, emergency guidance,
            and daily wellness coaching—all in one comprehensive platform.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.4 }}
          >
            <Link to="/signup/patient">
              <button className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Get Started for Free
              </button>
            </Link>
            <Link to="/about">
              <button className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                Learn More
              </button>
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-2xl font-semibold mb-2">AI-Powered Diagnosis</h3>
              <p className="text-lg text-gray-200">Advanced symptom checking and health analysis</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-2xl font-semibold mb-2">24/7 Health Support</h3>
              <p className="text-lg text-gray-200">Round-the-clock medical assistance and guidance</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-2xl font-semibold mb-2">Personalized Care</h3>
              <p className="text-lg text-gray-200">Tailored health recommendations for your needs</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
