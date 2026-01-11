import { useEffect, useState } from "react";
import api from "../api/axios";
import GigCard from "../components/GigCard";

export default function Home() {
  const [gigs, setGigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setIsLoading(true);
    api.get("/gigs")
      .then(res => {
        setGigs(res.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // Filter gigs based on search and filter
  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = search === "" || 
      gig.title.toLowerCase().includes(search.toLowerCase()) ||
      gig.description.toLowerCase().includes(search.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "featured") return matchesSearch && gig.featured;
    if (filter === "budget") return matchesSearch && gig.budget < 5000;
    if (filter === "urgent") return matchesSearch && gig.urgent;
    return matchesSearch;
  });

  // Get featured gigs for hero section
  const featuredGigs = gigs.filter(gig => gig.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                Freelance Opportunity
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Join thousands of freelancers finding amazing projects and clients worldwide
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search gigs by skills, title, or keywords..."
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-lg placeholder-white/70"
                />
                <button className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200">
                  Search
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{gigs.length}+</div>
                <div className="text-blue-200">Active Gigs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">24h</div>
                <div className="text-blue-200">Avg. Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">₹2.5Cr+</div>
                <div className="text-blue-200">Paid to Freelancers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">4.9★</div>
                <div className="text-blue-200">Client Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Gigs Section */}
      {featuredGigs.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Featured Gigs
              </span>
            </h2>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-600">Premium Opportunities</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {featuredGigs.map(gig => (
              <div key={gig._id} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 text-xs font-bold rounded-full mb-2">
                        FEATURED
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {gig.title}
                      </h3>
                    </div>
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp-3">{gig.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{gig.budget.toLocaleString()}
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Browse <span className="text-blue-600">Gigs</span>
              </h2>
              <p className="text-gray-600 mt-2">
                Discover amazing opportunities that match your skills
              </p>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "all" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All Gigs
              </button>
              <button
                onClick={() => setFilter("featured")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "featured" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Featured
              </button>
              <button
                onClick={() => setFilter("budget")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "budget" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Budget Friendly
              </button>
              <button
                onClick={() => setFilter("urgent")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "urgent" ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Urgent
              </button>
            </div>
          </div>
          
          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="font-bold text-gray-900">{filteredGigs.length}</span> of <span className="font-bold text-gray-900">{gigs.length}</span> gigs
              {search && ` for "${search}"`}
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Newest First</option>
                <option>Budget: High to Low</option>
                <option>Budget: Low to High</option>
                <option>Deadline</option>
              </select>
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
              {search 
                ? `We couldn't find any gigs matching "${search}". Try different keywords.`
                : "No gigs are currently available. Check back soon!"}
            </p>
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Clear Search
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
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
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
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12 md:px-12 md:py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Freelance Journey?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of successful freelancers earning with their skills
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition duration-200 transform hover:-translate-y-0.5">
                Post a Gig
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition duration-200">
                Become a Freelancer
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Popular Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Web Dev", icon: "💻", count: 45 },
              { name: "Mobile Apps", icon: "📱", count: 32 },
              { name: "Design", icon: "🎨", count: 78 },
              { name: "Writing", icon: "✍️", count: 56 },
              { name: "Marketing", icon: "📈", count: 41 },
              { name: "Video", icon: "🎥", count: 23 }
            ].map((cat, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-medium text-gray-900">{cat.name}</div>
                <div className="text-sm text-gray-500">{cat.count} gigs</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}