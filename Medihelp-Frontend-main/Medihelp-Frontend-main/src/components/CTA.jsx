import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaClock, FaUsers } from "react-icons/fa";

const CTA = () => {
  const navigate = useNavigate()
  return (
    <div className="relative bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 text-white py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-300/15 rounded-full blur-lg"></div>
      </div>
      
      <div className="container mx-auto text-center px-4 relative z-10">
        {/* Main heading */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            Transform Your Health Journey Today
          </h2>
          <p className="text-xl md:text-2xl text-cyan-100 leading-relaxed mb-8">
            Join over 50,000+ users who trust TenaHub for smarter, faster healthcare decisions
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <FaShieldAlt className="text-4xl text-cyan-300 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
            <p className="text-cyan-100 text-sm">Your health data is protected with enterprise-grade security</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <FaClock className="text-4xl text-cyan-300 mb-4" />
            <h3 className="text-lg font-semibold mb-2">24/7 Available</h3>
            <p className="text-cyan-100 text-sm">Get instant health insights anytime, anywhere you need them</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <FaUsers className="text-4xl text-cyan-300 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Expert Network</h3>
            <p className="text-cyan-100 text-sm">Connect with qualified healthcare professionals instantly</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button 
            onClick={() => navigate('/signup/patient')} 
            className="group relative bg-white text-blue-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-cyan-50 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/25"
          >
            <span className="relative z-10">Start Your Free Assessment</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </button>
          
          <button 
            onClick={() => navigate('/find-doctor')} 
            className="border-2 border-white/80 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
          >
            Find a Doctor
          </button>
        </div>

        {/* Trust indicator */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-cyan-200 text-sm">
            ✨ <strong>Free forever</strong> • No credit card required • Join in under 60 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default CTA;