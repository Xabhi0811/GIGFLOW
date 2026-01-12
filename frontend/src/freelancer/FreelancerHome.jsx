import { useEffect, useState } from "react";
import api from "../api/axios";
import GigCard from "../components/GigCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function FreelancerHome() {
  const [gigs, setGigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [stats, setStats] = useState({
    totalGigs: 0,
    avgBudget: 0,
    activeClients: 0,
    responseRate: 95
  });
  
  const navigate = useNavigate();

  useEffect(() => {
  if (!user) return;

  setIsLoading(true);

  api.get("/gigs")
    .then(res => {
      // ✅ FILTER OUT FREELANCER'S OWN GIGS
      const availableGigs = res.data.filter(
        gig => gig.ownerId !== user._id
      );

      setGigs(availableGigs);
      setFilteredGigs(availableGigs);
      setIsLoading(false);

      // Stats based on visible gigs
      if (availableGigs.length > 0) {
        const totalBudget = availableGigs.reduce(
          (sum, gig) => sum + (gig.budget || 0),
          0
        );

        setStats({
          totalGigs: availableGigs.length,
          avgBudget: Math.round(totalBudget / availableGigs.length),
          activeClients: new Set(
            availableGigs.map(gig => gig.ownerId)
          ).size,
          responseRate: 95
        });
      }
    })
    .catch(() => setIsLoading(false));
}, [user]);


  useEffect(() => {
    let result = gigs;
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(gig => 
        gig.title?.toLowerCase().includes(searchLower) ||
        gig.description?.toLowerCase().includes(searchLower) ||
        gig.skills?.some(skill => skill.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply category filter
    if (category !== "all") {
      result = result.filter(gig => 
        gig.category?.toLowerCase() === category.toLowerCase()
      );
    }
    
    setFilteredGigs(result);
  }, [gigs, searchTerm, category]);

  const categories = [
    { id: "all", name: "All Categories", icon: "🌐", count: gigs.length },
    { id: "web", name: "Web Development", icon: "💻", count: gigs.filter(g => g.category === "web").length },
    { id: "mobile", name: "Mobile Apps", icon: "📱", count: gigs.filter(g => g.category === "mobile").length },
    { id: "design", name: "UI/UX Design", icon: "🎨", count: gigs.filter(g => g.category === "design").length },
    { id: "writing", name: "Content Writing", icon: "✍️", count: gigs.filter(g => g.category === "writing").length },
    { id: "marketing", name: "Marketing", icon: "📈", count: gigs.filter(g => g.category === "marketing").length }
  ];

  const popularSkills = [
    "React", "Node.js", "JavaScript", "UI/UX", "Python", "Mobile", "WordPress", "SEO", "Graphic Design", "Copywriting"
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("all");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mt-2">
                Freelance Project
              </span>
            </h1>
            <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
              Browse thousands of opportunities and grow your freelance career with amazing projects
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search gigs by skills, title, or keywords..."
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-lg placeholder-white/70"
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
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-indigo-100 mr-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalGigs}</p>
                <p className="text-sm text-gray-600">Active Gigs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-purple-100 mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.avgBudget)}</p>
                <p className="text-sm text-gray-600">Avg. Budget</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-green-100 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.activeClients}</p>
                <p className="text-sm text-gray-600">Active Clients</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-yellow-100 mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.responseRate}%</p>
                <p className="text-sm text-gray-600">Response Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header & Filters */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Available <span className="text-indigo-600">Gigs</span>
              </h2>
              <p className="text-gray-600 mt-2">
                Discover projects that match your skills and expertise
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {(searchTerm || category !== "all") && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              )}
              <div className="text-sm text-gray-600">
                Showing {filteredGigs.length} of {gigs.length} gigs
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Browse by Category</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    category === cat.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <div className="font-medium mb-1">{cat.name}</div>
                  <div className="text-xs text-gray-500">{cat.count} gigs</div>
                </button>
              ))}
            </div>
          </div>

          {/* Popular Skills */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Popular Skills</h3>
            <div className="flex flex-wrap gap-2">
              {popularSkills.map((skill, index) => (
                <button
                  key={index}
                  onClick={() => setSearchTerm(skill)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    searchTerm === skill
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
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
              {searchTerm || category !== "all"
                ? `No gigs match your current filters. Try adjusting your search or browse all categories.`
                : "No gigs are currently available. Check back soon for new opportunities!"}
            </p>
            {(searchTerm || category !== "all") && (
              <button 
                onClick={clearFilters}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                View All Gigs
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredGigs.map(gig => (
              <div key={gig._id} className="group transform transition-transform duration-300 hover:-translate-y-1">
                <GigCard gig={gig} />
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12 md:px-12 md:py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Land Your Dream Project?
            </h2>
            <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
              Create a standout profile and increase your chances of getting hired by top clients
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate("/profile")}
                className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition duration-200 transform hover:-translate-y-0.5"
              >
                Optimize Your Profile
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition duration-200">
                View Success Tips
              </button>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Freelancers Like You Are Succeeding</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Priya Sharma", role: "React Developer", earnings: "₹12.5L", story: "Started with small gigs, now earns ₹1L+ monthly" },
              { name: "Rahul Verma", role: "UI/UX Designer", earnings: "₹8.2L", story: "Built portfolio with 5-star reviews from clients" },
              { name: "Anjali Patel", role: "Content Writer", earnings: "₹6.8L", story: "Consistently gets hired for long-term projects" }
            ].map((story, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{story.name}</h4>
                    <p className="text-sm text-gray-600">{story.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{story.story}</p>
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

        {/* Newsletter */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200 p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Never Miss an Opportunity</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get notified when new gigs matching your skills are posted
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-r-lg hover:bg-indigo-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}