import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    userType: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async () => {
    if (!form.userType) {
      alert("Please select Client or Freelancer");
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await api.post("/auth/register", form);
      
      if (form.userType === "client") {
        navigate("/client/dashboard");
      } else {
        navigate("/freelancer/home");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">FreelanceHub</span>
          </h1>
          <p className="text-gray-600 text-lg">Create your account and start your journey</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            {/* Name Field */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-3">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-3">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-semibold mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Use at least 8 characters with a mix of letters, numbers & symbols
              </p>
            </div>

            {/* Role Selection */}
            <div className="mb-10">
              <label className="block text-gray-700 text-sm font-semibold mb-4">
                I want to join as:
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Client Option */}
                <div
                  onClick={() => setForm({ ...form, userType: "client" })}
                  className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                    form.userType === "client"
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start mb-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                      form.userType === "client"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}>
                      {form.userType === "client" && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">👑 Client</h3>
                      <p className="text-gray-600">Post gigs and hire talent</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 ml-10">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Post projects & manage freelancers
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Set budgets & track progress
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Review proposals & make payments
                    </div>
                  </div>
                </div>

                {/* Freelancer Option */}
                <div
                  onClick={() => setForm({ ...form, userType: "freelancer" })}
                  className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                    form.userType === "freelancer"
                      ? "border-purple-500 bg-purple-50 ring-2 ring-purple-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start mb-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                      form.userType === "freelancer"
                        ? "border-purple-500 bg-purple-500"
                        : "border-gray-300"
                    }`}>
                      {form.userType === "freelancer" && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">💼 Freelancer</h3>
                      <p className="text-gray-600">Find gigs and earn money</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 ml-10">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Browse & apply for gigs
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Build portfolio & get reviews
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Secure payments & grow earnings
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              onClick={submit}
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed ${
                form.userType === "client"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  : form.userType === "freelancer"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  : "bg-gray-400"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                <>
                  {form.userType === "client"
                    ? "Join as Client"
                    : form.userType === "freelancer"
                    ? "Join as Freelancer"
                    : "Create Account"}
                </>
              )}
            </button>

            {/* Terms & Login Link */}
            <div className="mt-8 text-center space-y-4">
              <p className="text-sm text-gray-500">
                By registering, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                  Privacy Policy
                </a>
              </p>
              
              <p className="text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200">
            <div className="text-2xl font-bold text-blue-600 mb-1">500+</div>
            <div className="text-sm text-gray-600">Active Gigs</div>
          </div>
          <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-200">
            <div className="text-2xl font-bold text-purple-600 mb-1">2K+</div>
            <div className="text-sm text-gray-600">Freelancers</div>
          </div>
          <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-green-200">
            <div className="text-2xl font-bold text-green-600 mb-1">₹50L+</div>
            <div className="text-sm text-gray-600">Earned</div>
          </div>
        </div>
      </div>
    </div>
  );
}