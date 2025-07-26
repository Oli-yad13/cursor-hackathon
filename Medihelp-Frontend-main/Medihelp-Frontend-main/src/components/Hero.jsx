import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import herovideo from "../assets/hero-video.mp4";
import NavBar from "./NavBar";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="text-white dark:text-white relative min-h-screen overflow-hidden transition-all duration-1000 mt-20">
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

      <div className="container mx-auto relative z-10 flex flex-col items-center justify-center min-h-screen px-1 sm:px-4 text-center">
        <motion.div
          className="space-y-4 sm:space-y-8 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-2xl sm:text-4xl md:text-6xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Health, Our Priority
          </motion.h1>
          <motion.p
            className="text-sm sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Connect with healthcare professionals instantly. Get the care you need,
            when you need it, from the comfort of your home.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button
              onClick={() => navigate("/find-doctor")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Find a Doctor
            </button>
            <button
              onClick={() => navigate("/teleconsultation")}
              className="bg-transparent border-2 border-white text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-black"
            >
              Start Consultation
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
