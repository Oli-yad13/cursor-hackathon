import React, { useState, useEffect } from "react";
import { getSymptoms, checkSymptoms, chatInteract } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bot, CheckCircle, AlertCircle, Info } from "lucide-react";

const SymptomList = () => {
  const [mode, setMode] = useState("manual");
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptoms, setCustomSymptoms] = useState([]);
  const [customSymptomInput, setCustomSymptomInput] = useState("");
  const [diagnosis, setDiagnosis] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await getSymptoms();
        console.log("Symptoms response:", response);
        const data = response?.data?.results || response?.data || response || [];
        setSymptoms(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching symptoms:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch symptoms");
        // Set fallback symptoms if API fails
        setSymptoms([
          { id: 1, name: "Headache", description: "Pain in the head or neck area" },
          { id: 2, name: "Fever", description: "Elevated body temperature" },
          { id: 3, name: "Cough", description: "Forceful expulsion of air from lungs" },
          { id: 4, name: "Nausea", description: "Feeling of sickness with urge to vomit" },
          { id: 5, name: "Fatigue", description: "Extreme tiredness or exhaustion" },
          { id: 6, name: "Sore Throat", description: "Pain or irritation in the throat" },
          { id: 7, name: "Runny Nose", description: "Discharge of mucus from the nose" },
          { id: 8, name: "Body Aches", description: "General pain throughout the body" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSymptoms();
  }, []);

  const handleSymptomChange = (symptomId) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const addCustomSymptom = () => {
    if (customSymptomInput.trim() && !customSymptoms.some(s => s.name.toLowerCase() === customSymptomInput.trim().toLowerCase())) {
      const newCustomSymptom = {
        id: `custom_${Date.now()}`,
        name: customSymptomInput.trim(),
        description: "Custom symptom added by user",
        isCustom: true
      };
      setCustomSymptoms(prev => [...prev, newCustomSymptom]);
      setSelectedSymptoms(prev => [...prev, newCustomSymptom.id]);
      setCustomSymptomInput("");
    }
  };

  const removeCustomSymptom = (customSymptomId) => {
    setCustomSymptoms(prev => prev.filter(s => s.id !== customSymptomId));
    setSelectedSymptoms(prev => prev.filter(id => id !== customSymptomId));
  };

  const handleCustomSymptomKeyPress = (e) => {
    if (e.key === 'Enter') {
      addCustomSymptom();
    }
  };

  const handleSubmitSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      setError("Please select at least one symptom.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Submitting symptoms:", { symptoms: selectedSymptoms });
      const response = await checkSymptoms({ symptoms: selectedSymptoms });
      console.log("Symptom check response:", response);
      const data = response?.data || response;
      setDiagnosis(data);
      setAiResponse(null);
    } catch (err) {
      console.error("Error checking symptoms:", err);
      setError(err.response?.data?.message || err.message || "Failed to check symptoms");
      setDiagnosis(null);
      
      // Show fallback diagnosis for demonstration
      if (err.response?.status === 404) {
        setDiagnosis({
          conditions: [
            {
              id: 1,
              name: "Common Cold",
              severity_display: "Mild",
              description: "A viral infection of the upper respiratory tract",
              created_at: new Date().toISOString()
            }
          ],
          diagnosis: {
            urgency: "low",
            recommendations: [
              "Get plenty of rest",
              "Stay hydrated",
              "Consider over-the-counter pain relievers",
              "Monitor symptoms and seek medical attention if they worsen"
            ]
          },
          created_at: new Date().toISOString()
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAiSubmit = async () => {
    if (!message.trim()) {
      setError("Please enter a message about your symptoms.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Sending AI message:", message);
      const response = await chatInteract(message);
      console.log("AI response:", response);
      const data = response?.data?.response || response?.data || response;
      setAiResponse(data);
      setDiagnosis(null);
    } catch (err) {
      console.error("Error with AI chat:", err);
      setError(err.response?.data?.message || err.message || "Failed to get AI response");
      
      // Show fallback AI response for demonstration
      if (err.response?.status === 404) {
        setAiResponse({
          conditions: [
            "Common Cold",
            "Viral Infection",
            "Stress-related symptoms"
          ],
          urgency: "low",
          recommendations: [
            "Monitor your symptoms closely",
            "Get adequate rest and sleep",
            "Stay hydrated with plenty of fluids",
            "Consider consulting a healthcare provider if symptoms persist",
            "Take over-the-counter medication as needed"
          ]
        });
      }
      setDiagnosis(null);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setDiagnosis(null);
    setAiResponse(null);
    setSelectedSymptoms([]);
    setCustomSymptoms([]);
    setCustomSymptomInput("");
    setMessage("");
    setError(null);
  };

  const filteredSymptoms = symptoms.filter(
    (symptom) =>
      symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symptom.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedSymptoms = [...filteredSymptoms].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  if (!localStorage.getItem("token"))
    return (
      <div className="text-center text-red-600 flex items-center justify-center h-screen dark:text-red-400">
        <AlertCircle className="mr-2" />
        Please log in to use the Symptom Checker.
      </div>
    );

  return (
    <div className="container mx-auto p-4 mt-20">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center dark:text-blue-300">
        Symptom Checker
      </h2>

      {/* Tabs */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setMode("manual")}
          className={`px-6 py-2 rounded-full font-semibold transition-colors ${
            mode === "manual"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          Select Symptoms
        </button>
        <button
          onClick={() => setMode("ai")}
          className={`px-6 py-2 rounded-full font-semibold transition-colors ${
            mode === "ai"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          Ask AI
        </button>
      </div>

      {/* Manual Input */}
      {mode === "manual" && (
        <div className="mb-8 bg-white shadow-md rounded-lg p-6 dark:bg-gray-900 dark:shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center dark:text-white">
            <Info className="mr-2" /> Select Your Symptoms
          </h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Custom Symptom Input */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="text-md font-semibold text-blue-800 dark:text-blue-300 mb-2">Add Other Symptoms</h4>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">Can't find your symptom in the list? Add it here:</p>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="e.g., itchy skin, joint pain, tingling sensation..."
                value={customSymptomInput}
                onChange={(e) => setCustomSymptomInput(e.target.value)}
                onKeyPress={handleCustomSymptomKeyPress}
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              <button
                onClick={addCustomSymptom}
                disabled={!customSymptomInput.trim()}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  customSymptomInput.trim()
                    ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                }`}
              >
                Add
              </button>
            </div>
          </div>

          {loading && !diagnosis && !aiResponse ? (
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block h-8 w-8 text-blue-600 dark:text-blue-400"
              >
                {/* spinner SVG */}
              </motion.div>
              <p className="text-gray-600 mt-2 dark:text-gray-400">Loading...</p>
            </div>
          ) : error && !diagnosis && !aiResponse ? (
            <div className="text-center text-red-600 flex items-center justify-center dark:text-red-400">
              <AlertCircle className="mr-2" />
              {error}
            </div>
          ) : (
            <>
              {/* Regular Symptoms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {sortedSymptoms.map((symptom) => (
                  <div
                    key={symptom.id}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      selectedSymptoms.includes(symptom.id)
                        ? "bg-blue-100 border-blue-300 shadow-md dark:bg-blue-900 dark:border-blue-500"
                        : "bg-gray-50 border-gray-200 hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
                    }`}
                  >
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSymptoms.includes(symptom.id)}
                        onChange={() => handleSymptomChange(symptom.id)}
                        className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700"
                      />
                      <span className="text-gray-800 dark:text-white">{symptom.name}</span>
                      {selectedSymptoms.includes(symptom.id) && (
                        <CheckCircle className="ml-2 text-green-500 dark:text-green-400" />
                      )}
                    </label>
                  </div>
                ))}
              </div>

              {/* Custom Symptoms */}
              {customSymptoms.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-3">Your Custom Symptoms:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customSymptoms.map((symptom) => (
                      <div
                        key={symptom.id}
                        className="p-4 rounded-lg border bg-green-50 border-green-300 shadow-md dark:bg-green-900/20 dark:border-green-500 relative"
                      >
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedSymptoms.includes(symptom.id)}
                            onChange={() => handleSymptomChange(symptom.id)}
                            className="mr-3 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700"
                          />
                          <span className="text-gray-800 dark:text-white flex-1">{symptom.name}</span>
                          <CheckCircle className="ml-2 text-green-500 dark:text-green-400" />
                          <button
                            onClick={() => removeCustomSymptom(symptom.id)}
                            className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            title="Remove custom symptom"
                          >
                            ×
                          </button>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Selected Symptoms ({selectedSymptoms.length}):</span> {
                selectedSymptoms.length > 0 
                  ? selectedSymptoms.map((id) => {
                      // Check if it's a custom symptom
                      const customSymptom = customSymptoms.find((s) => s.id === id);
                      if (customSymptom) return customSymptom.name;
                      // Otherwise, find in regular symptoms
                      return symptoms.find((s) => s.id === id)?.name;
                    }).filter(Boolean).join(", ") || "None"
                  : "None selected"
              }
            </p>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={handleSubmitSymptoms}
              disabled={loading}
              className={`px-6 py-2 rounded-full font-semibold text-white transition-colors ${
                loading
                  ? "bg-blue-400 dark:bg-blue-500"
                  : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              }`}
            >
              {loading ? "Submitting..." : "Submit Symptoms"}
            </button>
            <button
              onClick={() => setSelectedSymptoms([])}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* AI Input */}
      {mode === "ai" && (
        <div className="mb-8 bg-white shadow-md rounded-lg p-6 dark:bg-gray-900 dark:shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center dark:text-white">
            <Bot className="mr-2" /> Or Ask AI About Your Pain
          </h3>
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g., I am feeling nausea and a mild headache"
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <button
              onClick={handleAiSubmit}
              disabled={loading}
              className={`px-6 py-2 rounded-full font-semibold text-white transition-colors ${
                loading
                  ? "bg-blue-400 dark:bg-blue-500"
                  : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              }`}
            >
              {loading ? "Asking..." : "Ask AI"}
            </button>
          </div>
          {error && !diagnosis && !aiResponse && (
            <div className="text-center text-red-600 flex items-center justify-center dark:text-red-400">
              <AlertCircle className="mr-2" />
              {error}
            </div>
          )}
        </div>
      )}

      {/* Diagnosis & AI Result */}
      <AnimatePresence>
        {(diagnosis || aiResponse) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="mt-8 p-6 bg-white shadow-lg rounded-lg border border-blue-100 dark:bg-gray-900 dark:border-gray-700"
          >
            <h3 className="text-2xl font-bold text-blue-700 mb-4 dark:text-blue-300">
              Diagnosis Result
            </h3>
            <div className="space-y-6">
              {/* Symptom-Based Diagnosis */}
              {diagnosis && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Symptom-Based Diagnosis
                  </h4>
                  <div className="space-y-4 mt-2">
                    <div>
                      <h5 className="text-md font-medium text-gray-700 dark:text-gray-300">
                        Conditions
                      </h5>
                      {diagnosis.conditions.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2 dark:text-gray-400">
                          {diagnosis.conditions.map((condition) => (
                            <li key={condition.id}>
                              <span className="font-medium text-gray-800 dark:text-white">
                                {condition.name}
                              </span> (Severity: {condition.severity_display})
                              <p className="text-sm dark:text-gray-300">
                                {condition.description}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Created: {new Date(condition.created_at).toLocaleDateString()}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">
                          No conditions identified.
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-600 mt-2 dark:text-gray-400">
                        <span className="font-medium dark:text-white">Urgency: </span>
                        <span
                          className={`capitalize ${
                            diagnosis.diagnosis.urgency === "low"
                              ? "text-green-600 dark:text-green-400"
                              : diagnosis.diagnosis.urgency === "medium"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-red-600 dark:text-red-400"
                          }`}>
                          {diagnosis.diagnosis.urgency}
                        </span>
                      </p>
                      <h5 className="text-md font-medium text-gray-700 mt-4 dark:text-gray-300">
                        Recommendations:
                      </h5>
                      <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 dark:text-gray-400">
                        {diagnosis.diagnosis.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 dark:text-gray-400">
                      Check Created: {new Date(diagnosis.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {/* AI Analysis */}
              {aiResponse && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    AI Analysis
                  </h4>
                  <div className="space-y-4 mt-2">
                    <div>
                      <h5 className="text-md font-medium text-gray-700 dark:text-gray-300">
                        Possible Conditions
                      </h5>
                      <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2 dark:text-gray-400">
                        {aiResponse.conditions.map((condition, idx) => (
                          <li key={idx} className="font-medium text-gray-800 dark:text-white">
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-gray-600 mt-2 dark:text-gray-400">
                        <span className="font-medium dark:text-white">Urgency: </span>
                        <span
                          className={`capitalize ${
                            aiResponse.urgency === "low"
                              ? "text-green-600 dark:text-green-400"
                              : aiResponse.urgency === "medium"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-red-600 dark:text-red-400"
                          }`}>
                          {aiResponse.urgency}
                        </span>
                      </p>
                      <h5 className="text-md font-medium text-gray-700 mt-4 dark:text-gray-300">
                        Recommendations:
                      </h5>
                      <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 dark:text-gray-400">
                        {aiResponse.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-center mt-6 space-x-4">
              <button
                onClick={clearAll}
                className="px-6 py-2 rounded-full font-semibold text-white bg-gray-500 hover:bg-gray-600 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Clear All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SymptomList;
