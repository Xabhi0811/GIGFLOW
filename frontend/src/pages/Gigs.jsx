import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Gigs() {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.get(`/gigs?search=${search}`)
      .then(res => {
        setGigs(res.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [search]);

  // Format budget to include commas for thousands
  const formatBudget = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Find Your Perfect Gig</h1>
          <p className="text-gray-600">Browse through hundreds of opportunities that match your skills</p>
        </div>

        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search gigs by title, skills, or keywords..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition duration-200"
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          <p className="text-center text-gray-500 text-sm mt-3">
            {search ? `Searching for "${search}"` : "Type to search for gigs..."}
          </p>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {isLoading ? "Loading gigs..." : `${gigs.length} ${gigs.length === 1 ? 'gig' : 'gigs'} found`}
          </h2>
          <div className="text-sm text-gray-500">
            Sorted by: <span className="font-medium text-gray-700">Relevance</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Gigs Grid */}
        {!isLoading && gigs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="mx-auto w-24 h-24 mb-6 text-gray-300">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map(gig => (
              <div 
                key={gig._id} 
                className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 group"
              >
                {/* Gig Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-2">
                        {gig.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>Posted 2 days ago</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Active
                    </span>
                  </div>
                  
                  {/* Skills/Tags */}
                  <div className="flex flex-wrap gap-2">
                    {["React", "Node.js", "Frontend"].map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Gig Description */}
                <div className="p-6">
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {gig.description}
                  </p>
                  
                  {/* Budget Section */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Budget</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{formatBudget(gig.budget)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Fixed price</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <button className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm hover:shadow-md">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination (Placeholder) */}
        {!isLoading && gigs.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200">
                Previous
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200">2</button>
              <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200">3</button>
              <span className="px-2 text-gray-400">...</span>
              <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200">10</button>
              <button className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}