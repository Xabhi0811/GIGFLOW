import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function PostGig() {
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    budget: "" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [gigType, setGigType] = useState("fixed");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [deadline, setDeadline] = useState("");
  
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.length < 10) {
      newErrors.title = "Title should be at least 10 characters";
    }
    
    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    } else if (form.description.length < 50) {
      newErrors.description = "Description should be at least 50 characters";
    }
    
    if (!form.budget) {
      newErrors.budget = "Budget is required";
    } else if (isNaN(form.budget) || Number(form.budget) <= 0) {
      newErrors.budget = "Please enter a valid budget amount";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await api.post("/gigs", {
        ...form,
        budget: Number(form.budget),
        skills,
        deadline,
        type: gigType
      });
      navigate("/dashboard");
    } catch (error) {
      setErrors({ 
        submit: error.response?.data?.message || "Failed to post gig. Please try again." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.target.type !== "textarea") {
      if (e.target.name === "skill") {
        addSkill();
      } else {
        submit();
      }
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    const number = value.replace(/\D/g, "");
    return new Intl.NumberFormat('en-IN').format(number);
  };

  const handleBudgetChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setForm({ ...form, budget: value });
  };

  const budgetSuggestion = [
    { label: "Small Project", value: "5000" },
    { label: "Medium Project", value: "25000" },
    { label: "Large Project", value: "100000" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate("/dashboard")}
              className="mr-4 p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Post a New Gig
            </h1>
          </div>
          <p className="text-gray-600 ml-12">
            Fill in the details below to find the perfect freelancer for your project
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12 ml-12">
          <div className="flex items-center">
            {["Details", "Requirements", "Budget", "Review"].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index === 0 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {index === 0 ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Step {index + 1}</p>
                  <p className="font-medium text-gray-900">{step}</p>
                </div>
                {index < 3 && (
                  <div className="w-16 h-1 bg-gray-200 mx-6"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-8 ml-12 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700 font-medium">{errors.submit}</span>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            {/* Gig Type Selection */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-gray-900 mb-4">What type of gig is this?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setGigType("fixed")}
                  className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                    gigType === "fixed" 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                      gigType === "fixed" ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {gigType === "fixed" && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <h4 className="font-bold text-gray-900">Fixed Price</h4>
                  </div>
                  <p className="text-gray-600 text-sm">Pay a fixed amount for the entire project</p>
                </button>
                <button
                  type="button"
                  onClick={() => setGigType("hourly")}
                  className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                    gigType === "hourly" 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                      gigType === "hourly" ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {gigType === "hourly" && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <h4 className="font-bold text-gray-900">Hourly Rate</h4>
                  </div>
                  <p className="text-gray-600 text-sm">Pay by the hour for ongoing work</p>
                </button>
              </div>
            </div>

            {/* Title Field */}
            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-bold mb-3">
                Gig Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                onKeyPress={handleKeyPress}
                className={`w-full px-4 py-4 border ${errors.title ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition duration-200`}
                placeholder="e.g., Build a responsive e-commerce website"
                disabled={isLoading}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.title}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Be specific about what you need. Good titles get more responses.
              </p>
            </div>

            {/* Description Field */}
            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-bold mb-3">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={8}
                  className={`w-full px-4 py-4 border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none`}
                  placeholder="Describe your project in detail. Include requirements, goals, and any specific technologies or skills needed."
                  disabled={isLoading}
                />
                <div className="absolute bottom-3 right-3 text-sm text-gray-500">
                  {form.description.length}/2000 characters
                </div>
              </div>
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.description}
                </p>
              )}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">💡 Tip</p>
                  <p className="text-sm text-blue-600">Be clear about deliverables and timeline</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-1">✅ Best Practice</p>
                  <p className="text-sm text-green-600">Include examples or references if possible</p>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-bold mb-3">
                Required Skills
              </label>
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    name="skill"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Add skills like 'React', 'UI/UX Design', 'Node.js'"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="button"
                  onClick={addSkill}
                  className="ml-3 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !skillInput.trim()}
                >
                  Add
                </button>
              </div>
              
              {/* Skills Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map(skill => (
                  <div 
                    key={skill} 
                    className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full"
                  >
                    <span className="mr-2">{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Suggested Skills */}
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Popular skills:</p>
                <div className="flex flex-wrap gap-2">
                  {["React", "Node.js", "UI/UX", "Python", "Mobile App", "WordPress"].map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => {
                        if (!skills.includes(skill)) {
                          setSkills([...skills, skill]);
                        }
                      }}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget and Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Budget Field */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-3">
                  Budget <span className="text-red-500">*</span>
                  <span className="text-sm font-normal text-gray-500 ml-2">(in INR)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <input
                    type="text"
                    value={form.budget ? formatCurrency(form.budget) : ""}
                    onChange={handleBudgetChange}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-10 pr-4 py-4 border ${errors.budget ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition duration-200`}
                    placeholder="5,000"
                    disabled={isLoading}
                  />
                </div>
                {errors.budget && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.budget}
                  </p>
                )}
                
                {/* Budget Suggestions */}
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Budget suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {budgetSuggestion.map(suggestion => (
                      <button
                        key={suggestion.label}
                        type="button"
                        onClick={() => setForm({ ...form, budget: suggestion.value })}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        {suggestion.label}: ₹{formatCurrency(suggestion.value)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Deadline Field */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-3">
                  Project Deadline (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    disabled={isLoading}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Setting a deadline helps freelancers plan their work
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={isLoading}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting Gig...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Post Gig & Find Talent
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-blue-200">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Clear Requirements</h4>
            <p className="text-gray-600 text-sm">Detailed gigs receive 3x more quality proposals</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-purple-200">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Realistic Budget</h4>
            <p className="text-gray-600 text-sm">Competitive budgets attract top freelancers</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-green-200">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Quick Response</h4>
            <p className="text-gray-600 text-sm">Average response time is under 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}