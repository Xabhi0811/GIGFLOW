import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function MyApplications() {
  const [bids, setBids] = useState([]);
  const [filteredBids, setFilteredBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    hired: 0,
    rejected: 0
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    api.get("/bids/my")
      .then(res => {
        const bidsData = res.data;
        setBids(bidsData);
        setFilteredBids(bidsData);
        setIsLoading(false);
        
        // Calculate stats
        const stats = {
          total: bidsData.length,
          pending: bidsData.filter(bid => bid.status === "pending").length,
          hired: bidsData.filter(bid => bid.status === "hired").length,
          rejected: bidsData.filter(bid => bid.status === "rejected").length
        };
        setStats(stats);
      })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    let result = bids;
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(bid => bid.status === statusFilter);
    }
    
    // Apply sorting
    if (sortBy === "newest") {
      result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      result = [...result].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "budget-high") {
      result = [...result].sort((a, b) => (b.gigId?.budget || 0) - (a.gigId?.budget || 0));
    } else if (sortBy === "budget-low") {
      result = [...result].sort((a, b) => (a.gigId?.budget || 0) - (b.gigId?.budget || 0));
    }
    
    setFilteredBids(result);
  }, [bids, statusFilter, sortBy]);

  const getStatusColor = (status) => {
    switch(status) {
      case "hired":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "withdrawn":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "hired":
        return (
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case "rejected":
        return (
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      case "pending":
        return (
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setSortBy("newest");
  };

  const handleWithdraw = (bidId) => {
    if (window.confirm("Are you sure you want to withdraw this application?")) {
      api.delete(`/bids/${bidId}`)
        .then(() => {
          setBids(bids.filter(bid => bid._id !== bidId));
        })
        .catch(error => {
          console.error("Failed to withdraw application:", error);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate("/freelancer/home")}
              className="mr-4 p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                My Applications
              </h1>
              <p className="text-gray-600 mt-2">
                Track all your job applications in one place
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.total}</h3>
            <p className="text-gray-600">Total Applications</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-yellow-100">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.pending}</h3>
            <p className="text-gray-600">Pending Review</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.hired}</h3>
            <p className="text-gray-600">Hired</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-red-100">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.rejected}</h3>
            <p className="text-gray-600">Not Selected</p>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Applications</h2>
              <p className="text-gray-600 mt-1">
                {filteredBids.length} of {bids.length} applications shown
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              {/* Sort By */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="budget-high">Budget: High to Low</option>
                  <option value="budget-low">Budget: Low to High</option>
                </select>
              </div>
              
              {(statusFilter !== "all" || sortBy !== "newest") && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["all", "pending", "hired", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  statusFilter === status
                    ? status === "pending" 
                      ? 'bg-yellow-600 text-white'
                      : status === "hired"
                      ? 'bg-green-600 text-white'
                      : status === "rejected"
                      ? 'bg-red-600 text-white'
                      : 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === "all" ? "All Applications" : 
                 status === "pending" ? `Pending (${stats.pending})` :
                 status === "hired" ? `Hired (${stats.hired})` :
                 `Rejected (${stats.rejected})`}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBids.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="mx-auto w-24 h-24 mb-6 text-gray-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No applications found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              {statusFilter !== "all" 
                ? `You have no ${statusFilter} applications. Try applying for more gigs!`
                : "You haven't applied to any gigs yet. Start browsing opportunities now!"}
            </p>
            <button 
              onClick={() => navigate("/freelancer/home")}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Browse Available Gigs
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBids.map(bid => (
              <div key={bid._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {bid.gigId?.title || "Untitled Gig"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(bid.status)} flex items-center`}>
                          {getStatusIcon(bid.status)}
                          {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                        </span>
                        <span className="text-gray-500 text-sm">
                          Applied on {formatDate(bid.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(bid.gigId?.budget)}
                      </div>
                      <p className="text-sm text-gray-500">Project Budget</p>
                    </div>
                  </div>

                  {/* Gig Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Your Proposal</p>
                      <p className="text-gray-900 line-clamp-2">
                        {bid.proposal || "No proposal text provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Client Requirements</p>
                      <p className="text-gray-900 line-clamp-2">
                        {bid.gigId?.description || "No description available"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Your Quote</p>
                      <div className="flex items-center">
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(bid.amount || bid.gigId?.budget)}
                        </div>
                        {bid.amount && bid.amount !== bid.gigId?.budget && (
                          <span className="ml-2 text-sm text-gray-500">
                            (Original: {formatCurrency(bid.gigId?.budget)})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Skills & Timeline */}
                  <div className="flex flex-wrap items-center justify-between pt-6 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Required Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {(bid.gigId?.skills || ["General"]).slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {skill}
                          </span>
                        ))}
                        {bid.gigId?.skills && bid.gigId.skills.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                            +{bid.gigId.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      {bid.estimatedTime && (
                        <div className="text-sm text-gray-600">
                          Estimated: {bid.estimatedTime} days
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-100">
                    {bid.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleWithdraw(bid._id)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Withdraw Application
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                          Edit Proposal
                        </button>
                      </>
                    )}
                    {bid.status === "hired" && (
                      <>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          View Contract
                        </button>
                        <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Contact Client
                        </button>
                      </>
                    )}
                    {bid.status === "rejected" && (
                      <button 
                        onClick={() => navigate("/freelancer/home")}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Find Similar Gigs
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips Section */}
        {bids.length > 0 && (
          <div className="mt-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Application Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-white rounded-xl border border-blue-100">
                  <h4 className="font-bold text-gray-900 mb-2">📝 Customize Proposals</h4>
                  <p className="text-gray-600 text-sm">
                    Tailor each proposal to the specific gig requirements for better response rates.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-100">
                  <h4 className="font-bold text-gray-900 mb-2">⏱️ Follow Up</h4>
                  <p className="text-gray-600 text-sm">
                    Follow up on pending applications after 3-4 days to show continued interest.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-100">
                  <h4 className="font-bold text-gray-900 mb-2">💰 Competitive Pricing</h4>
                  <p className="text-gray-600 text-sm">
                    Research market rates and provide fair, competitive quotes for your services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">
                Applications updated in real-time • Last refresh: Just now
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-sm text-gray-500">Awaiting Response</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.hired}</p>
                <p className="text-sm text-gray-500">Successful</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Total Applications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}