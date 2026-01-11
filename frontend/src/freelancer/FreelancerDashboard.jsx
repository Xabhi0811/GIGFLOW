import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const [notification, setNotification] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    activeProposals: 0,
    completedProjects: 0,
    totalEarnings: 0,
    responseRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    socket.emit("register", user._id);

    socket.on("hired", data => {
      const newNotification = {
        id: Date.now(),
        type: 'hired',
        title: '🎉 Congratulations! You\'ve Been Hired!',
        message: data.message,
        time: 'Just now',
        gigTitle: data.gigTitle || 'New Project'
      };
      setNotification(data.message);
      setNotifications(prev => [newNotification, ...prev]);
    });

    // Simulate loading freelancer data
    setTimeout(() => {
      setStats({
        activeProposals: 8,
        completedProjects: 15,
        totalEarnings: 42500,
        responseRate: 85
      });
      setIsLoading(false);
      
      // Sample notifications for demo
      setNotifications([
        {
          id: 1,
          type: 'message',
          title: '💬 New Message',
          message: 'Client wants to discuss project details',
          time: '2 hours ago',
          clientName: 'Sarah Johnson'
        },
        {
          id: 2,
          type: 'proposal',
          title: '📋 Proposal Viewed',
          message: 'Your proposal for "E-commerce Website" was viewed',
          time: '1 day ago',
          gigTitle: 'E-commerce Website'
        },
        {
          id: 3,
          type: 'payment',
          title: '💰 Payment Received',
          message: '₹12,500 received for "Mobile App Development"',
          time: '2 days ago',
          amount: '₹12,500'
        }
      ]);
    }, 1000);

    return () => socket.off("hired");
  }, []);

  const clearNotification = () => {
    setNotification("");
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Welcome back, <span className="text-purple-600">{user?.name || 'Freelancer'}!</span> 💼
              </h1>
              <p className="text-gray-600">
                Here's your freelancer dashboard with all your opportunities
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold text-lg">
                  {user?.name?.charAt(0) || 'F'}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
          </div>

          {/* Real-time Hired Notification Banner */}
          {notification && (
            <div className="mb-6 animate-fade-in">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">You've Been Hired! 🎉</h3>
                      <p className="text-green-100">{notification}</p>
                      <p className="text-green-200 text-sm mt-1">Check your notifications for details</p>
                    </div>
                  </div>
                  <button 
                    onClick={clearNotification}
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
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-100">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                +3 new
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.activeProposals}</h3>
            <p className="text-gray-600">Active Proposals</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                100% on-time
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.completedProjects}</h3>
            <p className="text-gray-600">Completed Projects</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-yellow-100">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                +18%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{formatCurrency(stats.totalEarnings)}</h3>
            <p className="text-gray-600">Total Earnings</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {stats.responseRate}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.responseRate}%</h3>
            <p className="text-gray-600">Response Rate</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notifications Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {notifications.length} unread
                    </span>
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearAllNotifications}
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${
                        notif.type === 'hired' ? 'bg-green-50/50' : 
                        notif.type === 'payment' ? 'bg-yellow-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg ${
                            notif.type === 'hired' ? 'bg-green-100 text-green-600' :
                            notif.type === 'payment' ? 'bg-yellow-100 text-yellow-600' :
                            notif.type === 'message' ? 'bg-blue-100 text-blue-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            {notif.type === 'hired' ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : notif.type === 'payment' ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                            ) : notif.type === 'message' ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{notif.title}</h4>
                            <p className="text-gray-600 mb-2">{notif.message}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{notif.time}</span>
                              {notif.gigTitle && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span className="text-purple-600">{notif.gigTitle}</span>
                                </>
                              )}
                              {notif.amount && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span className="font-semibold text-green-600">{notif.amount}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeNotification(notif.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">All caught up!</h3>
                    <p className="text-gray-500">No new notifications</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Profile */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <Link to="/gigs">
                  <button className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200 group">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg mr-4 group-hover:bg-purple-200">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-900">Browse Gigs</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </Link>

                <button className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200 group">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-4 group-hover:bg-green-200">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900">My Proposals</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200 group">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4 group-hover:bg-blue-200">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900">Withdraw Earnings</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <span className="text-2xl font-bold">{user?.name?.charAt(0) || 'F'}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user?.name || 'Freelancer'}</h3>
                  <p className="text-purple-100">⭐ 4.8 Rating (42 reviews)</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-100">Member since</span>
                  <span className="font-semibold">2023</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-100">Response time</span>
                  <span className="font-semibold">2 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-100">Job success</span>
                  <span className="font-semibold">96%</span>
                </div>
              </div>
              
              <button className="w-full mt-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                View Full Profile
              </button>
            </div>
          </div>
        </div>

        {/* Available Gigs Preview */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recommended Gigs For You</h2>
            <Link to="/gigs" className="text-purple-600 hover:text-purple-800 font-medium">
              View all gigs →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((gig) => (
              <div key={gig} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">React Native App Development</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded">Mobile</span>
                      <span className="mx-2">•</span>
                      <span>2 days ago</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    ₹25,000
                  </span>
                </div>
                <p className="text-gray-600 mb-6 line-clamp-2">
                  Need a React Native developer to build a food delivery app with real-time tracking
                </p>
                <button className="w-full py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            <p className="text-gray-600 font-medium">Real-time notifications active</p>
          </div>
          <p className="text-gray-500 text-sm">
            Dashboard updated in real-time • Last refreshed: Just now
          </p>
        </div>
      </div>
    </div>
  );
}