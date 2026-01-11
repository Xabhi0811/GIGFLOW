import { useEffect, useState } from "react";
import api from "../../api/axios";
import GigCard from "../../components/GigCard";
import { useNavigate } from "react-router-dom";

export default function FreelancerHome() {
  const [gigs, setGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [skills, setSkills] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    api.get("/gigs")
      .then(res => {
        setGigs(res.data);
        setFilteredGigs(res.data);
        setIsLoading(false);
        
        // Extract unique skills from gigs for filter
        const allSkills = res.data.flatMap(gig => gig.skills || []);
        const uniqueSkills = [...new Set(allSkills)].slice(0, 10);
        setSkills(uniqueSkills);
      })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    let result = gigs;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(gig => 
        gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gig.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(gig => 
        gig.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    // Apply budget filter
    if (budgetFilter === "low") {
      result = result.filter(gig => gig.budget < 5000);
    } else if (budgetFilter === "medium") {
      result = result.filter(gig => gig.budget >= 5000 && gig.budget <= 20000);
    } else if (budgetFilter === "high") {
      result = result.filter(gig => gig.budget > 20000);
    }
    
    // Apply sorting
    if (sortBy === "newest") {
      result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "budget-high") {
      result = [...result].sort((a, b) => b.budget - a.budget);
    } else if (sortBy === "budget-low") {
      result = [...result].sort((a, b) => a.budget - b.budget);
    }
    
    setFilteredGigs(result);
  }, [gigs, searchTerm, categoryFilter, budgetFilter, sortBy]);

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "web", name: "Web Development" },
    { id: "mobile", name: "Mobile App" },
    { id: "design", name: "UI/UX Design" },
    { id: "writing", name: "Content Writing" },
    { id: "marketing", name: "Digital Marketing" },
    { id: "video", name: "Video Editing" }
  ];

  const handleSkillClick = (skill) => {
    setSearchTerm(skill);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setBudgetFilter("all");
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Your Next
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                Freelance Project
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-10 max-w-3xl mx-auto">
              Browse thousands of opportunities and grow your freelance career
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search gigs by title, skills, or keywords..."
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-lg placeholder-white/70 text-white"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-2 bottom-2 px-4 text-white/70 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{gigs.length}+</div>
                <div className="text-purple-200">Active Gigs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">24h</div>
                <div className="text-purple-200">Avg. Response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">₹2.5Cr+</div>
                <div className="text-purple-200">Paid to Freelancers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">4.8★</div>
                <div className="text-purple-200">Client Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header & Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Available <span className="text-purple-600">Gigs</span>
              </h2>
              <p className="text-gray-600 mt-2">
                Discover projects that match your skills and expertise
              </p>
            </div>
            
            {/* Sort & Filter Controls */}
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Newest First</option>
                <option value="budget-high">Budget: High to Low</option>
                <option value="budget-low">Budget: Low to High</option>
              </select>
              
              <select
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Budgets</option>
                <option value="low">Under ₹5,000</option>
                <option value="medium">₹5,000 - ₹20,000</option>
                <option value="high">Over ₹20,000</option>
              </select>
              
              {(searchTerm || categoryFilter !== "all" || budgetFilter !== "all") && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setCategoryFilter(category.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    categoryFilter === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Skills Filter */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Skills:</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <button
                    key={index}
                    onClick={() => handleSkillClick(skill)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      searchTerm === skill
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="font-bold text-gray-900">{filteredGigs.length}</span> of <span className="font-bold text-gray-900">{gigs.length}</span> gigs
              {searchTerm && ` for "${searchTerm}"`}
              {categoryFilter !== "all" && ` in ${categories.find(c => c.id === categoryFilter)?.name}`}
            </p>
            
            {filteredGigs.length > 0 && (
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Real-time gigs updated
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredGigs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="mx-auto w-24 h-24 mb-6 text-gray-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No gigs found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              {searchTerm 
                ? `We couldn't find any gigs matching "${searchTerm}". Try different keywords or clear filters.`
                : "No gigs are currently available. Check back soon!"}
            </p>
            {(searchTerm || categoryFilter !== "all" || budgetFilter !== "all") && (
              <button 
                onClick={clearFilters}
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition duration-200"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Gig Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredGigs.map(gig => (
                <div key={gig._id} className="group">
                  <GigCard gig={gig} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">1</button>
                <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200">2</button>
                <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200">3</button>
                <span className="px-2 text-gray-400">...</span>
                <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200">10</button>
                <button className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          </>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12 md:px-12 md:py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Land Your Dream Gig?
            </h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Create a standout profile and increase your chances of getting hired
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate("/profile")}
                className="px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition duration-200 transform hover:-translate-y-0.5"
              >
                Update Your Profile
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition duration-200">
                View Bidding Tips
              </button>
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Top Earning Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Web Dev", icon: "💻", avgPay: "₹45K", gigs: 156 },
              { name: "Mobile Apps", icon: "📱", avgPay: "₹52K", gigs: 98 },
              { name: "UI/UX Design", icon: "🎨", avgPay: "₹38K", gigs: 124 },
              { name: "Content Writing", icon: "✍️", avgPay: "₹28K", gigs: 203 },
              { name: "Digital Marketing", icon: "📈", avgPay: "₹41K", gigs: 87 },
              { name: "Video Editing", icon: "🎥", avgPay: "₹35K", gigs: 76 }
            ].map((cat, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center hover:shadow-lg hover:border-purple-300 transition-all duration-200 cursor-pointer">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-bold text-gray-900 mb-1">{cat.name}</div>
                <div className="text-sm text-purple-600 font-semibold mb-1">{cat.avgPay}/project</div>
                <div className="text-xs text-gray-500">{cat.gigs} active gigs</div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Freelancer Success Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Priya Sharma", role: "React Developer", earnings: "₹12.5L", quote: "Found consistent work through this platform" },
              { name: "Rahul Verma", role: "UI/UX Designer", earnings: "₹8.2L", quote: "My freelance career took off here" },
              { name: "Anjali Patel", role: "Content Writer", earnings: "₹6.8L", quote: "Best platform for serious freelancers" }
            ].map((story, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{story.name}</h4>
                    <p className="text-sm text-gray-600">{story.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-4">"{story.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Earnings</p>
                    <p className="text-lg font-bold text-green-600">{story.earnings}</p>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}