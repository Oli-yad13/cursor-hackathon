import React, { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import { uploadSkinDiagnosis } from "../services/api";
import { FiUpload, FiRefreshCw, FiInfo, FiCamera, FiShield, FiUsers, FiBook, FiHeart, FiCheck, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SkinDiagnosis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [credits, setCredits] = useState(() => {
    const savedCredits = localStorage.getItem("skinDiagnosisCredits");
    return savedCredits ? parseInt(savedCredits, 10) : 20;
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const fileInputRef = useRef(null);
const navigate = useNavigate()
  useEffect(() => {
    localStorage.setItem("skinDiagnosisCredits", credits);
  }, [credits]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, etc.).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Please upload an image smaller than 5MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setDiagnosis(null);
    setError(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, etc.).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Please upload an image smaller than 5MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setDiagnosis(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image to upload.");
      return;
    }

    if (credits < 10) {
      setError("Insufficient credits. Please upgrade your package.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setLoading(true);
      setError(null);
      const response = await uploadSkinDiagnosis(formData);
      setDiagnosis(response.data);
      setCredits((prevCredits) => prevCredits - 10);
    } catch (err) {
      setError(err.message || "Failed to upload image or get diagnosis");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setShowPaymentModal(false);
      setCredits(20);
      localStorage.setItem("skinDiagnosisCredits", 20);
      setError(null);
      alert("Payment successful! Credits have been reset to 20.");
    }, 2000);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDiagnosis(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!localStorage.getItem("token")) {
    return (
      <div className="text-center text-red-600 py-10">
        Please log in to use Skin Diagnosis.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100 dark:from-black dark:via-gray-900 dark:to-gray-800">
      <NavBar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-6 shadow-lg">
              <FiCamera className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-800 bg-clip-text text-transparent mb-6">
              AI Skin Diagnosis
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Get instant AI-powered analysis of your skin condition with personalized recommendations from our advanced diagnostic system.
            </p>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <motion.div 
                className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FiShield className="w-5 h-5 text-cyan-600" />
                <span>HIPAA Compliant</span>
              </motion.div>
              <motion.div 
                className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FiUsers className="w-5 h-5 text-cyan-600" />
                <span>50K+ Users Trust Us</span>
              </motion.div>
              <motion.div 
                className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <FiHeart className="w-5 h-5 text-cyan-600" />
                <span>Dermatologist Reviewed</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Important Disclaimer */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-amber-50/80 dark:bg-amber-900/20 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/50 p-6 rounded-2xl max-w-4xl mx-auto">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center">
                    <FiInfo className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">Important Medical Disclaimer</h4>
                  <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                    This AI tool provides preliminary analysis only and is not a substitute for professional medical diagnosis. 
                    Always consult with a qualified healthcare professional for proper evaluation, diagnosis, and treatment of any skin condition.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Upload Section */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {/* Upload Card */}
            <div className="bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-gray-800/20 shadow-xl">
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                    <FiUpload className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Your Image</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Upload a clear, well-lit image of your skin condition. For best results, ensure good lighting and sharp focus.
                </p>
              </div>

              <div 
                className="relative border-2 border-dashed border-cyan-300 dark:border-cyan-600 rounded-2xl p-12 text-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/20 transition-all duration-300 group"
                onDragOver={handleDragOver} 
                onDrop={handleDrop} 
                onClick={() => fileInputRef.current?.click()}
              >
                <AnimatePresence mode="wait">
                  {!previewUrl ? (
                    <motion.div 
                      key="upload"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center space-y-4"
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <FiCamera className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Drop your image here</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">or click to browse files</p>
                      <button 
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      >
                        Choose Image
                      </button>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                        Supported: JPEG, PNG, WebP • Max 5MB
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="preview"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="space-y-6"
                    >
                      <div className="relative max-w-sm mx-auto">
                        <img 
                          src={previewUrl} 
                          alt="Selected skin image" 
                          className="w-full h-64 object-cover rounded-2xl shadow-lg" 
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button 
                          onClick={(e) => { e.stopPropagation(); resetForm(); }}
                          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                        >
                          <FiRefreshCw className="w-4 h-4" />
                          <span>Change Image</span>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleSubmit(e); }}
                          disabled={loading || credits < 10}
                          className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                            loading || credits < 10 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg'
                          }`}
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z"></path>
                              </svg>
                              <span>Analyzing...</span>
                            </>
                          ) : (
                            <>
                              <FiCamera className="w-4 h-4" />
                              <span>Analyze Image</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg"
                  >
                    <p className="text-red-600 dark:text-red-400 text-sm flex items-center">
                      <FiX className="w-4 h-4 mr-2" />
                      {error}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Credits & Tips Card */}
            <div className="space-y-6">
              {/* Credits Display */}
              <div className="bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-gray-800/20 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <FiCheck className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Free Credits</h3>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-300">Remaining Credits</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                      {credits}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(credits / 20) * 100}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Each analysis uses 10 credits
                  </p>
                </div>

                {credits < 10 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl"
                  >
                    <p className="text-amber-800 dark:text-amber-200 text-sm mb-3">
                      Insufficient credits for analysis
                    </p>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
                    >
                      Upgrade Package
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Tips Card */}
              <div className="bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-gray-800/20 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <FiInfo className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tips for Best Results</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-cyan-100 dark:bg-cyan-900/50 rounded-full flex items-center justify-center mt-0.5">
                      <FiCheck className="w-3 h-3 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Good Lighting</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Use natural light or bright indoor lighting</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-cyan-100 dark:bg-cyan-900/50 rounded-full flex items-center justify-center mt-0.5">
                      <FiCheck className="w-3 h-3 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Sharp Focus</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Ensure the affected area is in clear focus</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-cyan-100 dark:bg-cyan-900/50 rounded-full flex items-center justify-center mt-0.5">
                      <FiCheck className="w-3 h-3 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Close Distance</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Take the photo close enough to see details</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Diagnosis Results */}
          <AnimatePresence>
            {diagnosis && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="mt-12"
              >
                <div className="bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-gray-800/20 shadow-xl">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <FiCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Analysis Complete</h2>
                      <p className="text-gray-600 dark:text-gray-300">AI-powered analysis results for your skin condition</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Main Results */}
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-2xl p-6 border border-cyan-200/50 dark:border-cyan-800/50">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Potential Condition</h3>
                        <p className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
                          {diagnosis.diagnosis.conditions[0] || "Unknown condition"}
                        </p>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Confidence Level</span>
                              <span className="text-sm font-bold text-gray-900 dark:text-white">
                                {Math.round(diagnosis.diagnosis.confidence * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                              <motion.div 
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${diagnosis.diagnosis.confidence * 100}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Severity Level</span>
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                              diagnosis.diagnosis.urgency === "low" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                              diagnosis.diagnosis.urgency === "medium" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" :
                              "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                              {diagnosis.diagnosis.urgency.charAt(0).toUpperCase() + diagnosis.diagnosis.urgency.slice(1)} Priority
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50/80 dark:bg-purple-900/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-800/50">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Clinical Description</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          Based on our AI analysis of the uploaded image, this appears to be a skin condition that requires attention. 
                          The analysis considers various visual factors including color, texture, size, and pattern distribution.
                        </p>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-6">
                      <div className="bg-blue-50/80 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                          <FiBook className="w-5 h-5 mr-2 text-blue-600" />
                          Recommended Actions
                        </h3>
                        <div className="space-y-3">
                          {diagnosis.diagnosis.recommendations.map((rec, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              className="flex items-start space-x-3"
                            >
                              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                <FiCheck className="w-3 h-3 text-blue-600" />
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{rec}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-amber-50/80 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/50">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                            <FiShield className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Medical Disclaimer</h4>
                            <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                              This AI analysis is for informational purposes only and should not replace professional medical consultation. 
                              Please consult a dermatologist for accurate diagnosis and treatment.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom CTA Section */}
          <motion.div 
            className="mt-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-gray-800/20 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <FiHeart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Need Professional Help?</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Connect with certified dermatologists for comprehensive evaluation, accurate diagnosis, and personalized treatment plans.
                </p>
                <button 
                  onClick={() => navigate('/find-doctor')} 
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                >
                  Find a Dermatologist
                </button>
              </div>

              <div className="bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-gray-800/20 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                    <FiBook className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Learn More</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Explore our comprehensive library of dermatology articles, treatment guides, and skin health resources.
                </p>
                <button 
                  onClick={() => navigate('/education')} 
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 rounded-2xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                >
                  Skin Health Articles
                </button>
              </div>
            </div>
          </motion.div>

          {/* Payment Modal */}
          <AnimatePresence>
            {showPaymentModal && (
              <motion.div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-white/20 dark:border-gray-800/20 shadow-2xl"
                  initial={{ scale: 0.9, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 50 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiCheck className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Upgrade Your Package
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Get 20 additional credits to continue your skin analysis journey
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <label className="flex items-center space-x-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer hover:border-cyan-300 dark:hover:border-cyan-600 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit-card"
                        checked={selectedPaymentMethod === "credit-card"}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-cyan-600"
                        disabled={paymentProcessing}
                      />
                      <div className="flex-1">
                        <span className="text-gray-900 dark:text-white font-medium">Credit Card</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Visa, MasterCard, American Express</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl cursor-pointer hover:border-cyan-300 dark:hover:border-cyan-600 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={selectedPaymentMethod === "paypal"}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-cyan-600"
                        disabled={paymentProcessing}
                      />
                      <div className="flex-1">
                        <span className="text-gray-900 dark:text-white font-medium">PayPal</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Fast & secure payment</p>
                      </div>
                    </label>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                      disabled={paymentProcessing}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePayment}
                      className={`flex-1 px-6 py-3 rounded-2xl text-white font-semibold flex items-center justify-center space-x-2 transition-all duration-300 ${
                        paymentProcessing
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 shadow-lg"
                      }`}
                      disabled={paymentProcessing}
                    >
                      {paymentProcessing ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z"></path>
                          </svg>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>Pay $9.99</span>
                      )}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SkinDiagnosis;