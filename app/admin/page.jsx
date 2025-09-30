"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Database, 
  Activity,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  BarChart3,
  Settings,
  Lock,
  Server,
  CreditCard,
  UserPlus,
  TrendingDown
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    users: {
      total: 0,
      students: 0,
      clients: 0,
      activeToday: 0,
      newThisMonth: 0,
      totalFirebaseUsers: 0
    },
    projects: {
      total: 0,
      active: 0,
      completed: 0,
      pending: 0
    },
    payments: {
      totalRevenue: 0,
      platformFees: 0,
      studentEarnings: 0,
      pendingPayouts: 0,
      thisMonth: 0,
      razorpayStatus: 'unknown'
    },
    system: {
      uptime: '99.9%',
      mongoStatus: 'unknown',
      firebaseStatus: 'unknown',
      dbConnections: 0,
      apiCalls: 0,
      errors: 0
    }
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);

  // API Functions
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;
      
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data.dashboard);
      } else {
        console.error('Failed to fetch dashboard data:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const fetchRecentUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;
      
      const response = await fetch('/api/admin/users/recent', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecentUsers(data.users || []);
      } else {
        console.error('Failed to fetch recent users:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch recent users:', error);
    }
  };

  const fetchRecentPayments = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;
      
      const response = await fetch('/api/admin/payments/recent', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecentPayments(data.payments || []);
      } else {
        console.error('Failed to fetch recent payments:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch recent payments:', error);
    }
  };

  const fetchSystemLogs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;
      
      const response = await fetch('/api/admin/system/logs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSystemLogs(data.logs || []);
      } else {
        console.error('Failed to fetch system logs:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch system logs:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        await loadAllData();
      } else {
        alert(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDashboardData(),
        fetchRecentUsers(),
        fetchRecentPayments(),
        fetchSystemLogs()
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    setLoading(false);
  };

  const refreshData = async () => {
    await loadAllData();
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(refreshData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Initial data load
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Super Admin Access</h1>
            <p className="text-gray-300">Campus Freelance Platform</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-300 text-center">
              Demo Credentials: snehaop@gmail.com / password
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Super Admin</h1>
                <p className="text-xs text-gray-500">Campus Freelance Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${dashboardData.system.mongoStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-600">MongoDB</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${dashboardData.system.firebaseStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-600">Firebase</span>
              </div>
              <button
                onClick={refreshData}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <div className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  setIsAuthenticated(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'users', name: 'Users', icon: Users },
              { id: 'payments', name: 'Payments', icon: DollarSign },
              { id: 'system', name: 'System', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Real-time Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData.users.total.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="text-xs text-gray-500">MongoDB: {dashboardData.users.total}</div>
                  <div className="text-xs text-blue-600">Firebase: {dashboardData.users.totalFirebaseUsers}</div>
                </div>
                <p className="text-sm text-green-600 mt-1">+{dashboardData.users.newThisMonth} this month</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Projects</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData.projects.active.toLocaleString()}</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  <span>Completed: {dashboardData.projects.completed}</span>
                  <span>Pending: {dashboardData.projects.pending}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{dashboardData.projects.total} total projects</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">₹{dashboardData.payments.totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-500" />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${dashboardData.payments.razorpayStatus === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-gray-600">Razorpay: {dashboardData.payments.razorpayStatus}</span>
                </div>
                <p className="text-sm text-green-600 mt-1">₹{dashboardData.payments.thisMonth.toLocaleString()} this month</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Health</p>
                    <p className="text-3xl font-bold text-green-600">{dashboardData.system.uptime}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  DB Connections: {dashboardData.system.dbConnections}
                </div>
                <p className="text-sm text-red-600 mt-1">{dashboardData.system.errors} errors today</p>
              </div>
            </div>

            {/* User Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Students</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${dashboardData.users.total > 0 ? (dashboardData.users.students / dashboardData.users.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{dashboardData.users.students}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Clients</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${dashboardData.users.total > 0 ? (dashboardData.users.clients / dashboardData.users.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{dashboardData.users.clients}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <UserPlus className="w-4 h-4" />
                      {dashboardData.users.activeToday} active today
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Platform Fees (10%)</span>
                    <span className="font-medium text-blue-600">₹{dashboardData.payments.platformFees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Student Earnings</span>
                    <span className="font-medium text-green-600">₹{dashboardData.payments.studentEarnings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pending Payouts</span>
                    <span className="font-medium text-yellow-600">₹{dashboardData.payments.pendingPayouts.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">MongoDB</span>
                    <span className={`flex items-center gap-2 text-sm ${
                      dashboardData.system.mongoStatus === 'connected' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        dashboardData.system.mongoStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      {dashboardData.system.mongoStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Firebase</span>
                    <span className={`flex items-center gap-2 text-sm ${
                      dashboardData.system.firebaseStatus === 'connected' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        dashboardData.system.firebaseStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      {dashboardData.system.firebaseStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">API Calls Today</span>
                    <span className="text-sm font-medium">{dashboardData.system.apiCalls.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
                <div className="space-y-4">
                  {recentUsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Loading recent users...</p>
                    </div>
                  ) : (
                    recentUsers.slice(0, 5).map(user => (
                      <div key={user.id || user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">
                              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name || 'Unknown User'}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            user.userType === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {user.userType || user.role || 'user'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>
                <div className="space-y-4">
                  {recentPayments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Loading recent payments...</p>
                    </div>
                  ) : (
                    recentPayments.slice(0, 5).map(payment => (
                      <div key={payment.id || payment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">₹{payment.amount}</p>
                          <p className="text-sm text-gray-600">
                            {payment.studentName || 'Student'} → {payment.clientName || 'Client'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {payment.status || 'unknown'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'Today'}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <div className="flex gap-4 text-sm">
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  Students: {dashboardData.users.students}
                </div>
                <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                  Clients: {dashboardData.users.clients}
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                  Active Today: {dashboardData.users.activeToday}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Firebase UID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No users found</p>
                      </td>
                    </tr>
                  ) : (
                    recentUsers.map(user => (
                      <tr key={user.id || user._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name || 'Unknown User'}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            user.userType === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {user.userType || user.role || 'user'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                            {user.firebaseUid ? user.firebaseUid.substring(0, 8) + '...' : 'N/A'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Payment Management</h2>
              <div className="flex gap-4 text-sm">
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                  Total Revenue: ₹{dashboardData.payments.totalRevenue.toLocaleString()}
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  Platform Fees: ₹{dashboardData.payments.platformFees.toLocaleString()}
                </div>
                <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                  Pending: ₹{dashboardData.payments.pendingPayouts.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Project</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No payments found</p>
                      </td>
                    </tr>
                  ) : (
                    recentPayments.map(payment => (
                      <tr key={payment.id || payment._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">₹{payment.amount}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{payment.studentName || 'Unknown'}</p>
                            <p className="text-sm text-gray-600">{payment.studentEmail || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{payment.clientName || 'Unknown'}</p>
                            <p className="text-sm text-gray-600">{payment.clientEmail || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{payment.projectTitle || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {payment.status || 'unknown'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'Unknown'}
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Uptime</p>
                    <p className="text-3xl font-bold text-green-600">{dashboardData.system.uptime}</p>
                  </div>
                  <Server className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">API Calls Today</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData.system.apiCalls.toLocaleString()}</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-sm text-gray-500 mt-1">+12% from yesterday</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">DB Connections</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData.system.dbConnections}</p>
                  </div>
                  <Database className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-sm text-gray-500 mt-1">Active connections</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Errors Today</p>
                    <p className="text-3xl font-bold text-red-600">{dashboardData.system.errors}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-sm text-gray-500 mt-1">System errors</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Logs</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {systemLogs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Loading system logs...</p>
                    </div>
                  ) : (
                    systemLogs.slice(0, 20).map((log, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                        <div className="flex justify-between items-start">
                          <span className={`font-medium ${
                            log.level === 'error' ? 'text-red-600' : 
                            log.level === 'warn' ? 'text-yellow-600' :
                            'text-gray-600'
                          }`}>
                            {log.level?.toUpperCase() || 'INFO'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Unknown'}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-1">{log.message || 'No message'}</p>
                        {log.source && (
                          <p className="text-xs text-gray-500 mt-1">Source: {log.source}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        dashboardData.system.mongoStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">MongoDB</p>
                        <p className="text-sm text-gray-600">Primary Database</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      dashboardData.system.mongoStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {dashboardData.system.mongoStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        dashboardData.system.firebaseStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">Firebase</p>
                        <p className="text-sm text-gray-600">Authentication & Storage</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      dashboardData.system.firebaseStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {dashboardData.system.firebaseStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        dashboardData.payments.razorpayStatus === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">Razorpay</p>
                        <p className="text-sm text-gray-600">Payment Gateway</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      dashboardData.payments.razorpayStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {dashboardData.payments.razorpayStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;