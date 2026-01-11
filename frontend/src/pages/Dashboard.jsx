import { useEffect, useState } from "react";
import api from "../api/axios";
import { socket } from "../socket";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [myGigs, setMyGigs] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [notif, setNotif] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoadingGigs, setIsLoadingGigs] = useState(true);
  const [isLoadingBids, setIsLoadingBids] = useState(true);

  useEffect(() => {
    setIsLoadingGigs(true);
    setIsLoadingBids(true);
    
    api.get("/gigs/my").then(res => {
      setMyGigs(res.data);
      setIsLoadingGigs(false);
    });
    
    api.get("/bids/my").then(res => {
      setMyBids(res.data);
      setIsLoadingBids(false);
    });

    socket.emit("register", user._id);
    socket.on("hired", data => setNotif(data.message));

    return () => socket.off("hired");
  }, []);

  const hire = async (bidId) => {
    if (window.confirm("Are you sure you want to hire this freelancer?")) {
      await api.patch(`/bids/${bidId}/hire`);
      alert("Freelancer hired successfully!");
      // Refresh bids data
      api.get("/bids/my").then(res => setMyBids(res.data));
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate stats
  const stats = {
    totalGigs: myGigs.length,
    totalBids: myBids.length,
    activeBids: myBids.filter(bid => bid.status === 'pending').length,
    hiredCount: myBids.filter(bid => bid.status === 'hired').length,
    earnings: myBids.filter(bid => bid.status === 'hired').reduce((sum, bid) => sum + (bid.gigId?.budget || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your gigs and bids in one place
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>
              <div className="px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
                <span className="font-medium text-gray-800">{user?.name || 'User'}</span>
              </div>
            </div>
          </div>

          {/* Notification Banner */}
          {notif && (
            <div className="mb-6 animate-fade-in">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-4 text-white">
                <div className="flex items-center">
                  <div className="mr-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{notif}</p>
                  </div>
                  <button 
                    onClick={() => setNotif("")}
                    className="text-white/80 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Gigs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalGigs}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Bids</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBids}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Bids</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeBids}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.earnings)}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-sm border border-gray-200 max-w-md">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 py-3 px-4 rounded-lg text-center font-medium transition-colors ${activeTab === "overview" ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("mygigs")}
              className={`flex-1 py-3 px-4 rounded-lg text-center font-medium transition-colors ${activeTab === "mygigs" ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              My Gigs ({myGigs.length})
            </button>
            <button
              onClick={() => setActiveTab("mybids")}
              className={`flex-1 py-3 px-4 rounded-lg text-center font-medium transition-colors ${activeTab === "mybids" ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              My Bids ({myBids.length})
            </button>
          </div>
        </div>

        {/* My Gigs Section (Client View) */}
        {(activeTab === "overview" || activeTab === "mygigs") && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                My Gigs
              </h2>
              <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Post New Gig
              </button>
            </div>

            {isLoadingGigs ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-6"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : myGigs.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 text-gray-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No gigs posted yet</h3>
                <p className="text-gray-500 mb-8">Start by posting your first gig to find freelancers</p>
                <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Post Your First Gig
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myGigs.map(gig => (
                  <div key={gig._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{gig.title}</h3>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          {gig.bids?.length || 0} bids
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">{gig.description}</p>
                      
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xl font-bold text-blue-600">{formatCurrency(gig.budget)}</span>
                        <span className="text-sm text-gray-500">Fixed Price</span>
                      </div>

                      {/* Bids Section */}
                      <div className="border-t border-gray-100 pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Bids ({gig.bids?.length || 0})</h4>
                        {gig.bids && gig.bids.length > 0 ? (
                          <div className="space-y-3">
                            {gig.bids.map(bid => (
                              <div key={bid._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                    <span className="text-sm font-medium text-blue-600">
                                      {bid.freelancerId?.name?.charAt(0) || 'F'}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{bid.freelancerId?.name || 'Freelancer'}</p>
                                    <p className="text-xs text-gray-500">Proposal submitted</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => hire(bid._id)}
                                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  Hire
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm text-center py-4">No bids yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Bids Section (Freelancer View) */}
        {(activeTab === "overview" || activeTab === "mybids") && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                My Bids
              </h2>
            </div>

            {isLoadingBids ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : myBids.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 text-gray-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No bids placed yet</h3>
                <p className="text-gray-500 mb-8">Browse available gigs and place your first bid</p>
                <button className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                  Browse Gigs
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {myBids.map(bid => (
                  <div key={bid._id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="mb-4 md:mb-0">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{bid.gigId?.title || 'Untitled Gig'}</h3>
                          <p className="text-gray-600 line-clamp-2">{bid.gigId?.description || 'No description'}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                          bid.status === 'hired' ? 'bg-green-100 text-green-800' :
                          bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">Budget</p>
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(bid.gigId?.budget || 0)}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">Your Proposal</p>
                          <p className="text-gray-900 line-clamp-2">{bid.proposal || 'No proposal text'}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">Submitted</p>
                          <p className="text-gray-900">2 days ago</p>
                        </div>
                      </div>

                      {/* Action Buttons based on status */}
                      <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-100">
                        {bid.status === 'pending' && (
                          <>
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                              Withdraw Bid
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                              Edit Proposal
                            </button>
                          </>
                        )}
                        {bid.status === 'hired' && (
                          <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Contact Client
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">
                Dashboard updated in real-time • Last refresh: Just now
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{myGigs.length}</p>
                <p className="text-sm text-gray-500">Total Gigs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{myBids.length}</p>
                <p className="text-sm text-gray-500">Total Bids</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.hiredCount}</p>
                <p className="text-sm text-gray-500">Hired</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}