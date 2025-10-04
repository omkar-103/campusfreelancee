"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Shield,
  Database,
  Activity,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle,
  Lock,
  Server,
  CreditCard,
  UserPlus,
  BarChart3,
  Settings,
} from "lucide-react";

const AnimatedBackground = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -top-1/4 -left-1/4 h-[42rem] w-[42rem] rounded-full bg-blue-700/25 blur-[170px] animate-pulse" />
    <div className="absolute top-1/3 -right-1/4 h-[38rem] w-[38rem] rounded-full bg-purple-600/25 blur-[170px] animate-pulse [animation-delay:1.8s]" />
    <div className="absolute bottom-[-30%] right-1/4 h-[30rem] w-[30rem] rounded-full bg-pink-500/20 blur-[140px] animate-pulse [animation-delay:3.2s]" />
    <div className="absolute bottom-[-25%] left-1/4 h-[34rem] w-[34rem] rounded-full bg-cyan-500/20 blur-[170px] animate-pulse [animation-delay:2.4s]" />
  </div>
);

const FloatingParticles = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: `particle-${i}`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 10 + 6}px`,
        delay: `${Math.random() * 6}s`,
        duration: `${Math.random() * 10 + 12}s`,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <span
          key={particle.id}
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
          className="absolute rounded-full bg-white/12 blur-[2px] animate-[floaty_15s_linear_infinite]"
        />
      ))}
      <style jsx>{`
        @keyframes floaty {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0;
          }
          20% {
            opacity: 0.45;
          }
          100% {
            transform: translate3d(-30px, -120px, 0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

const LoadingOverlay = () => (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur">
    <div className="relative flex h-24 w-24 items-center justify-center">
      <div className="h-20 w-20 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-400" />
      <div className="absolute h-14 w-14 animate-ping rounded-full bg-fuchsia-400/30" />
      <div className="absolute h-10 w-10 animate-pulse rounded-full bg-cyan-500/25" />
    </div>
  </div>
);

const SkeletonStatCard = () => (
  <div className="group animate-pulse rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_25px_60px_-25px_rgba(56,189,248,0.35)] backdrop-blur-xl">
    <div className="h-4 w-24 rounded bg-white/15" />
    <div className="mt-4 h-9 w-32 rounded bg-white/20" />
    <div className="mt-8 h-2 w-full rounded-full bg-white/10" />
  </div>
);

const SkeletonListItem = () => (
  <div className="group animate-pulse rounded-xl border border-white/5 bg-white/[0.06] p-4">
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 rounded-full bg-white/15" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/5 rounded bg-white/12" />
        <div className="h-3 w-2/5 rounded bg-white/8" />
      </div>
    </div>
  </div>
);

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.045] p-6 shadow-[0_40px_90px_-45px_rgba(59,130,246,0.75)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_60px_140px_-65px_rgba(129,140,248,0.85)] ${className}`}
  >
    <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-br from-blue-500/15 via-transparent to-purple-500/15 opacity-0 transition duration-500 group-hover:opacity-100" />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-white/8 opacity-0 transition-all duration-500 group-hover:opacity-100" />
    <div className="relative z-10">{children}</div>
  </div>
);

const SectionHeading = ({ title, description, icon: Icon }) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      {description && (
        <p className="mt-2 text-sm text-slate-300">{description}</p>
      )}
    </div>
    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>
);

const GradientDivider = () => (
  <div className="relative my-10 h-px overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
    <div className="absolute left-1/2 h-[6px] w-24 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 blur-sm" />
  </div>
);

const formatCurrency = (amount = 0) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const SuperAdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [hoveredInput, setHoveredInput] = useState("");

  const [cardTilt, setCardTilt] = useState({ rotateX: 0, rotateY: 0 });

  const [dashboardData, setDashboardData] = useState({
    users: {
      total: 0,
      students: 0,
      clients: 0,
      activeToday: 0,
      newThisMonth: 0,
      totalFirebaseUsers: 0,
    },
    projects: {
      total: 0,
      active: 0,
      completed: 0,
      pending: 0,
    },
    payments: {
      totalRevenue: 0,
      platformFees: 0,
      studentEarnings: 0,
      pendingPayouts: 0,
      thisMonth: 0,
      razorpayStatus: "unknown",
    },
    system: {
      uptime: "99.9%",
      mongoStatus: "unknown",
      firebaseStatus: "unknown",
      dbConnections: 0,
      apiCalls: 0,
      errors: 0,
    },
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data.dashboard);
      } else {
        console.error("Failed to fetch dashboard data:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  const fetchRecentUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch("/api/admin/users/recent", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecentUsers(data.users || []);
      } else {
        console.error("Failed to fetch recent users:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch recent users:", error);
    }
  };

  const fetchRecentPayments = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch("/api/admin/payments/recent", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecentPayments(data.payments || []);
      } else {
        console.error("Failed to fetch recent payments:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch recent payments:", error);
    }
  };

  const fetchSystemLogs = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch("/api/admin/system/logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSystemLogs(data.logs || []);
      } else {
        console.error("Failed to fetch system logs:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch system logs:", error);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDashboardData(),
        fetchRecentUsers(),
        fetchRecentPayments(),
        fetchSystemLogs(),
      ]);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
      setHasLoadedOnce(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("adminToken", data.token);
        setIsAuthenticated(true);
        await loadAllData();
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadAllData();
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(refreshData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const isDataFetching = loading && isAuthenticated;
  const showSkeleton = isDataFetching && !hasLoadedOnce;
  const showOverlay = isDataFetching && hasLoadedOnce;

  const totalUsers = dashboardData.users.total || 0;
  const studentPct =
    totalUsers > 0
      ? Math.round((dashboardData.users.students / totalUsers) * 100)
      : 0;
  const clientPct =
    totalUsers > 0
      ? Math.round((dashboardData.users.clients / totalUsers) * 100)
      : 0;
  const monthlyUserGrowth = totalUsers
    ? Math.round(
        (dashboardData.users.newThisMonth /
          Math.max(totalUsers - dashboardData.users.newThisMonth, 1)) *
          100
      )
    : 0;

  const totalRevenue = dashboardData.payments.totalRevenue || 0;
  const platformPct =
    totalRevenue > 0
      ? Math.round((dashboardData.payments.platformFees / totalRevenue) * 100)
      : 0;
  const studentPctShare =
    totalRevenue > 0
      ? Math.round((dashboardData.payments.studentEarnings / totalRevenue) * 100)
      : 0;

  const handleCardMouseMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const rotateX = ((event.clientY - centerY) / bounds.height) * -12;
    const rotateY = ((event.clientX - centerX) / bounds.width) * 12;
    setCardTilt({ rotateX, rotateY });
  };

  const resetCardTilt = () => {
    setCardTilt({ rotateX: 0, rotateY: 0 });
  };

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#020014] text-slate-100">
        <AnimatedBackground />
        <FloatingParticles />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
          <div
            onMouseMove={handleCardMouseMove}
            onMouseLeave={resetCardTilt}
            style={{
              transform: `perspective(1200px) rotateX(${cardTilt.rotateX}deg) rotateY(${cardTilt.rotateY}deg)`,
              transition: "transform 200ms ease",
            }}
            className="relative w-full max-w-xl"
          >
            <div className="absolute -inset-[2px] rounded-[26px] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-90 blur-lg" />
            <div className="relative space-y-10 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] p-10 shadow-[0_60px_120px_-50px_rgba(59,130,246,0.95)] backdrop-blur-[28px]">
              <div className="absolute right-10 top-10 h-12 w-12 animate-spin-slow rounded-full border border-white/10 bg-white/[0.08]" />
              <div className="absolute bottom-[-120px] right-[-80px] h-64 w-64 rounded-full bg-blue-500/20 blur-[120px]" />
              <div className="absolute top-[-140px] left-[-120px] h-64 w-64 rounded-full bg-purple-500/15 blur-[120px]" />
              <div className="relative">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/40 to-purple-500/40 text-blue-100 shadow-lg shadow-blue-500/30">
                  <Shield className="h-9 w-9" />
                </div>
                <h1 className="text-center text-4xl font-bold text-white">
                  Admin Control Room
                </h1>
                <p className="mt-3 text-center text-sm text-slate-300">
                  Authenticate with your credentials to enter the command deck.
                </p>
              </div>

              <form onSubmit={handleLogin} className="relative space-y-6">
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-inner shadow-blue-500/10">
                  <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Admin Email
                  </label>
                  <div
                    className={`relative mt-3 rounded-xl border bg-slate-950/70 ${
                      hoveredInput === "email"
                        ? "border-blue-400/80 shadow-[0_0_35px_-10px_rgba(59,130,246,0.7)]"
                        : "border-white/12"
                    }`}
                  >
                    <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 opacity-0 transition duration-300 group-hover:opacity-100" />
                    <input
                      type="email"
                      value={credentials.email}
                      onChange={(e) =>
                        setCredentials((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      onFocus={() => setHoveredInput("email")}
                      onBlur={() => setHoveredInput("")}
                      className="relative z-10 w-full rounded-xl bg-transparent px-4 py-4 text-base text-white placeholder:text-slate-400 focus:outline-none focus:ring-0 caret-blue-400"
                      placeholder="admin@campusfreelance.io"
                      required
                    />
                    <div className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/70 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-inner shadow-blue-500/10">
                  <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Secure Passcode
                  </label>
                  <div
                    className={`group relative mt-3 rounded-xl border bg-slate-950/70 ${
                      hoveredInput === "password"
                        ? "border-purple-400/80 shadow-[0_0_35px_-10px_rgba(139,92,246,0.7)]"
                        : "border-white/12"
                    }`}
                  >
                    <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/15 via-transparent to-purple-500/15 opacity-0 transition duration-300 group-hover:opacity-100" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      onFocus={() => setHoveredInput("password")}
                      onBlur={() => setHoveredInput("")}
                      className="relative z-10 w-full rounded-xl bg-transparent px-4 py-4 text-base text-white placeholder:text-slate-400 focus:outline-none focus:ring-0 caret-purple-400"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-slate-200 transition hover:bg-white/20"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <div className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-400/70 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/40 transition focus:outline-none focus:ring-4 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="absolute inset-0 translate-y-full bg-white/20 transition duration-300 group-hover:translate-y-0" />
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-400/40 via-transparent to-purple-400/40 opacity-0 transition duration-500 group-hover:opacity-100" />
                  <span className="relative flex items-center gap-2">
                    {loading ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                    {loading ? "Authenticating..." : "Open Command Deck"}
                  </span>
                </button>
              </form>

              <div className="relative rounded-2xl border border-blue-500/15 bg-blue-500/8 p-4 text-center text-xs text-blue-200">
                <div className="absolute inset-x-12 -top-[1px] h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-60" />
                <p>Demo credentials: snehaop@gmail.com / password</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020014] text-slate-100">
      <AnimatedBackground />
      <FloatingParticles />
      {showOverlay && <LoadingOverlay />}

      <div className="relative z-10">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#020014]/75 shadow-[0_10px_60px_-30px_rgba(77,91,255,0.65)] backdrop-blur-xl">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-400/25 via-indigo-500/25 to-purple-500/25 text-blue-100 shadow-lg shadow-blue-500/30">
                <Shield className="h-7 w-7" />
                <span className="absolute h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  Super Admin Command HQ
                </h1>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-300">
                  Campus Freelance Platform
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="hidden items-center gap-3 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-[11px] text-slate-300 shadow-[0_10px_40px_-30px_rgba(59,130,246,0.75)] md:flex">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      dashboardData.system.mongoStatus === "connected"
                        ? "bg-emerald-400"
                        : "bg-rose-500"
                    }`}
                  />
                  MongoDB
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      dashboardData.system.firebaseStatus === "connected"
                        ? "bg-emerald-400"
                        : "bg-rose-500"
                    }`}
                  />
                  Firebase
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      dashboardData.payments.razorpayStatus === "active"
                        ? "bg-emerald-400"
                        : "bg-rose-500"
                    }`}
                  />
                  Razorpay
                </div>
              </div>

              <button
                onClick={refreshData}
                disabled={loading}
                className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-white/10 text-slate-200 transition hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-blue-300/20 opacity-0 transition duration-300 hover:opacity-100" />
                <RefreshCw
                  className={`relative h-5 w-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>

              <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300 sm:flex">
                Last sync: {new Date().toLocaleTimeString()}
              </div>

              <button
                onClick={() => {
                  localStorage.removeItem("adminToken");
                  setIsAuthenticated(false);
                  setHasLoadedOnce(false);
                }}
                className="rounded-xl border border-rose-500/30 bg-rose-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200 transition hover:border-rose-400/60 hover:bg-rose-500/25"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="border-b border-white/10 bg-white/5 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl space-x-4 overflow-x-auto px-4 text-sm font-medium text-slate-300 sm:px-6 lg:px-8">
            {[
              { id: "overview", name: "Overview", icon: BarChart3 },
              { id: "users", name: "Users", icon: Users },
              { id: "payments", name: "Payments", icon: DollarSign },
              { id: "system", name: "System", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-3 transition ${
                    active
                      ? "bg-gradient-to-r from-blue-500/25 via-indigo-500/25 to-purple-500/25 text-white shadow-[0_25px_60px_-40px_rgba(99,102,241,0.95)] border border-white/15"
                      : "border border-transparent text-slate-300 hover:border-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                  {active && (
                    <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-blue-500/20 via-cyan-500/15 to-purple-500/20 blur-lg opacity-70" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <main className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
          <GradientDivider />

          {activeTab === "overview" && (
            <div className="space-y-10">
              {showSkeleton ? (
                <>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <SkeletonStatCard key={`stat-skeleton-${idx}`} />
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <GlassCard className="bg-white/[0.06]">
                      <SkeletonListItem />
                      <SkeletonListItem />
                    </GlassCard>
                    <GlassCard className="bg-white/[0.06]">
                      <SkeletonListItem />
                      <SkeletonListItem />
                    </GlassCard>
                    <GlassCard className="bg-white/[0.06]">
                      <SkeletonListItem />
                      <SkeletonListItem />
                    </GlassCard>
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <GlassCard>
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <div
                          key={`users-skeleton-${idx}`}
                          className="mb-3 last:mb-0"
                        >
                          <SkeletonListItem />
                        </div>
                      ))}
                    </GlassCard>
                    <GlassCard>
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <div
                          key={`payments-skeleton-${idx}`}
                          className="mb-3 last:mb-0"
                        >
                          <SkeletonListItem />
                        </div>
                      ))}
                    </GlassCard>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <GlassCard>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                            Total Users
                          </p>
                          <p className="mt-3 text-4xl font-semibold text-white">
                            {dashboardData.users.total.toLocaleString()}
                          </p>
                          <div className="mt-4 flex items-center gap-3 text-xs">
                            <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-emerald-200">
                              +{dashboardData.users.newThisMonth.toLocaleString()} new
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white">
                              {Number.isFinite(monthlyUserGrowth)
                                ? monthlyUserGrowth
                                : 0}
                              % growth
                            </span>
                          </div>
                        </div>
                        <div className="relative rounded-2xl bg-blue-500/20 p-3 text-blue-200">
                          <Users className="h-6 w-6" />
                          <span className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-blue-500/30 blur" />
                        </div>
                      </div>
                      <div className="mt-6 space-y-3 text-xs text-slate-300">
                        <div className="flex items-center justify-between">
                          <span>MongoDB</span>
                          <span className="font-semibold text-white">
                            {dashboardData.users.total.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Firebase</span>
                          <span className="font-semibold text-white">
                            {dashboardData.users.totalFirebaseUsers.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"
                            style={{
                              width: `${Math.min(
                                (dashboardData.users.newThisMonth /
                                  Math.max(totalUsers, 1)) *
                                  100,
                                100
                              ).toFixed(1)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </GlassCard>

                    <GlassCard>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                            Active Projects
                          </p>
                          <p className="mt-3 text-4xl font-semibold text-white">
                            {dashboardData.projects.active.toLocaleString()}
                          </p>
                          <div className="mt-4 flex items-center gap-3 text-xs">
                            <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-emerald-200">
                              {dashboardData.projects.completed.toLocaleString()} completed
                            </span>
                            <span className="rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-1 text-amber-200">
                              {dashboardData.projects.pending.toLocaleString()} pending
                            </span>
                          </div>
                        </div>
                        <div className="relative rounded-2xl bg-emerald-500/20 p-3 text-emerald-200">
                          <Activity className="h-6 w-6" />
                          <span className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-emerald-500/30 blur" />
                        </div>
                      </div>
                      <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
                        <div className="rounded-xl border border-white/12 bg-white/6 px-3 py-2 text-center">
                          <p className="text-slate-300">Completed</p>
                          <p className="mt-1 text-sm font-semibold text-emerald-200">
                            {dashboardData.projects.completed.toLocaleString()}
                          </p>
                        </div>
                        <div className="rounded-xl border border-white/12 bg-white/6 px-3 py-2 text-center">
                          <p className="text-slate-300">Pending</p>
                          <p className="mt-1 text-sm font-semibold text-amber-200">
                            {dashboardData.projects.pending.toLocaleString()}
                          </p>
                        </div>
                        <div className="rounded-xl border border-white/12 bg-white/6 px-3 py-2 text-center">
                          <p className="text-slate-300">Total</p>
                          <p className="mt-1 text-sm font-semibold text-blue-200">
                            {dashboardData.projects.total.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </GlassCard>

                    <GlassCard>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                            Revenue Streams
                          </p>
                          <p className="mt-3 text-4xl font-semibold text-white">
                            {formatCurrency(dashboardData.payments.totalRevenue)}
                          </p>
                          <div className="mt-4 flex items-center gap-3 text-xs">
                            <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-emerald-200">
                              {formatCurrency(dashboardData.payments.thisMonth)} this month
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white">
                              {dashboardData.payments.pendingPayouts
                                ? formatCurrency(dashboardData.payments.pendingPayouts)
                                : "₹0"}{" "}
                              pending
                            </span>
                          </div>
                        </div>
                        <div className="relative rounded-2xl bg-purple-500/20 p-3 text-purple-200">
                          <DollarSign className="h-6 w-6" />
                          <span className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-purple-500/30 blur" />
                        </div>
                      </div>
                      <div className="mt-6 space-y-3 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              dashboardData.payments.razorpayStatus === "active"
                                ? "bg-emerald-400"
                                : "bg-rose-500"
                            }`}
                          />
                          Razorpay status: {dashboardData.payments.razorpayStatus}
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
                            style={{ width: `${Math.min(studentPctShare, 100)}%` }}
                          />
                        </div>
                      </div>
                    </GlassCard>

                    <GlassCard>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                            System Pulse
                          </p>
                          <p className="mt-3 text-4xl font-semibold text-emerald-300">
                            {dashboardData.system.uptime}
                          </p>
                          <div className="mt-4 flex items-center gap-3 text-xs text-slate-300">
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white">
                              {dashboardData.system.apiCalls.toLocaleString()} API calls
                            </span>
                            <span className="rounded-full border border-rose-400/40 bg-rose-500/15 px-3 py-1 text-rose-200">
                              {dashboardData.system.errors} errors
                            </span>
                          </div>
                        </div>
                        <div className="relative rounded-2xl bg-emerald-500/20 p-3 text-emerald-200">
                          <TrendingUp className="h-6 w-6" />
                          <span className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-emerald-500/30 blur" />
                        </div>
                      </div>
                      <div className="mt-6 space-y-2 text-xs text-slate-300">
                        <div className="flex items-center justify-between">
                          <span>DB Connections</span>
                          <span className="font-semibold text-white">
                            {dashboardData.system.dbConnections.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>API Calls</span>
                          <span className="font-semibold text-white">
                            {dashboardData.system.apiCalls.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-emerald-200">
                          <span>Status</span>
                          <span className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Operational
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <GlassCard>
                      <SectionHeading
                        title="User Distribution"
                        description="Live breakdown of student vs client population"
                        icon={Users}
                      />
                      <div className="space-y-5 text-sm">
                        <div>
                          <div className="flex items-center justify-between text-slate-300">
                            <span>Students</span>
                            <span className="font-semibold text-white">
                              {dashboardData.users.students.toLocaleString()} ({studentPct}%)
                            </span>
                          </div>
                          <div className="mt-2 h-2.5 rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 transition-all"
                              style={{ width: `${studentPct}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-slate-300">
                            <span>Clients</span>
                            <span className="font-semibold text-white">
                              {dashboardData.users.clients.toLocaleString()} ({clientPct}%)
                            </span>
                          </div>
                          <div className="mt-2 h-2.5 rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 transition-all"
                              style={{ width: `${clientPct}%` }}
                            />
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="flex items-center gap-2 text-blue-200">
                              <UserPlus className="h-4 w-4" />
                              Active Today
                            </span>
                            <span className="text-white">
                              {dashboardData.users.activeToday.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>

                    <GlassCard>
                      <SectionHeading
                        title="Payment Breakdown"
                        description="Where the rupees are arriving and resting"
                        icon={DollarSign}
                      />
                      <div className="space-y-4 text-sm">
                        <div className="rounded-2xl border border-white/15 bg-white/8 px-4 py-4">
                          <div className="flex items-center justify-between text-slate-300">
                            <span>Platform Fees (10%)</span>
                            <span className="font-semibold text-white">
                              {formatCurrency(dashboardData.payments.platformFees)}
                            </span>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400"
                              style={{ width: `${Math.min(platformPct, 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/15 bg-white/8 px-4 py-4">
                          <div className="flex items-center justify-between text-slate-300">
                            <span>Student Earnings</span>
                            <span className="font-semibold text-white">
                              {formatCurrency(dashboardData.payments.studentEarnings)}
                            </span>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
                              style={{ width: `${Math.min(studentPctShare, 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/15 bg-white/8 px-4 py-4">
                          <div className="flex items-center justify-between text-slate-300">
                            <span>Pending Payouts</span>
                            <span className="font-semibold text-white">
                              {formatCurrency(dashboardData.payments.pendingPayouts)}
                            </span>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400"
                              style={{
                                width: `${Math.min(
                                  (dashboardData.payments.pendingPayouts /
                                    Math.max(totalRevenue, 1)) *
                                    100,
                                  100
                                ).toFixed(1)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </GlassCard>

                    <GlassCard>
                      <SectionHeading
                        title="Service Status"
                        description="Instant snapshot of key services"
                        icon={Server}
                      />
                      <div className="space-y-4 text-sm">
                        {[
                          {
                            label: "MongoDB",
                            status: dashboardData.system.mongoStatus,
                            description: "Primary datastore",
                          },
                          {
                            label: "Firebase",
                            status: dashboardData.system.firebaseStatus,
                            description: "Auth + Storage",
                          },
                          {
                            label: "Razorpay",
                            status: dashboardData.payments.razorpayStatus,
                            description: "Payment Gateway",
                          },
                        ].map((service) => (
                          <div
                            key={service.label}
                            className="flex items-center justify-between rounded-2xl border border-white/12 bg-white/6 px-4 py-4"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`h-3 w-3 rounded-full ${
                                  service.status === "connected" ||
                                  service.status === "active"
                                    ? "bg-emerald-400"
                                    : "bg-rose-400"
                                }`}
                              />
                              <div>
                                <p className="font-semibold text-white">
                                  {service.label}
                                </p>
                                <p className="text-xs text-slate-300">
                                  {service.description}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                                service.status === "connected" ||
                                service.status === "active"
                                  ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-200"
                                  : "border-rose-400/40 bg-rose-500/20 text-rose-200"
                              }`}
                            >
                              {service.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <GlassCard>
                      <SectionHeading
                        title="Recent Users"
                        description="Fresh faces joining the ecosystem"
                        icon={Users}
                      />
                      <div className="space-y-3">
                        {recentUsers.length === 0 ? (
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
                            <Users className="mx-auto h-12 w-12 text-white/30" />
                            <p className="mt-3 text-sm">
                              No recent users were fetched.
                            </p>
                          </div>
                        ) : (
                          recentUsers.slice(0, 6).map((user) => (
                            <div
                              key={user.id || user._id}
                              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/6 p-4 transition hover:border-white/20 hover:bg-white/8"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/30 text-white">
                                  <span className="text-sm font-semibold">
                                    {user.name
                                      ? user.name.charAt(0).toUpperCase()
                                      : "U"}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-semibold text-white">
                                    {user.name || "Unknown User"}
                                  </p>
                                  <p className="text-xs text-slate-300">
                                    {user.email || "No email"}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right">
                                <span
                                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                                    user.userType === "student"
                                      ? "border-blue-400/40 bg-blue-500/15 text-blue-200"
                                      : "border-purple-400/40 bg-purple-500/15 text-purple-200"
                                  }`}
                                >
                                  {user.userType || user.role || "user"}
                                </span>
                                <p className="mt-1 text-xs text-slate-400">
                                  {user.createdAt
                                    ? new Date(
                                        user.createdAt
                                      ).toLocaleDateString()
                                    : "Today"}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </GlassCard>

                    <GlassCard>
                      <SectionHeading
                        title="Recent Payments"
                        description="Latest cash flow arrivals"
                        icon={CreditCard}
                      />
                      <div className="space-y-3">
                        {recentPayments.length === 0 ? (
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
                            <CreditCard className="mx-auto h-12 w-12 text-white/30" />
                            <p className="mt-3 text-sm">
                              No recent payments were fetched.
                            </p>
                          </div>
                        ) : (
                          recentPayments.slice(0, 6).map((payment) => (
                            <div
                              key={payment.id || payment._id}
                              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/6 p-4 transition hover:border-white/20 hover:bg-white/8"
                            >
                              <div>
                                <p className="text-xl font-semibold text-white">
                                  {formatCurrency(payment.amount)}
                                </p>
                                <p className="text-xs text-slate-300">
                                  {payment.studentName || "Student"} →{" "}
                                  {payment.clientName || "Client"}
                                </p>
                              </div>
                              <div className="text-right">
                                <span
                                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                                    payment.status === "completed"
                                      ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
                                      : payment.status === "pending"
                                      ? "border-amber-400/40 bg-amber-500/15 text-amber-200"
                                      : "border-rose-400/40 bg-rose-500/15 text-rose-200"
                                  }`}
                                >
                                  {payment.status || "unknown"}
                                </span>
                                <p className="mt-1 text-xs text-slate-400">
                                  {payment.createdAt
                                    ? new Date(
                                        payment.createdAt
                                      ).toLocaleDateString()
                                    : "Today"}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </GlassCard>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <GlassCard className="p-0">
              <div className="border-b border-white/10 px-6 py-8">
                <SectionHeading
                  title="User Management"
                  description="Inspect and manage the full user base"
                  icon={Users}
                />
                <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-slate-300">
                  <span className="rounded-full border border-blue-400/40 bg-blue-500/15 px-4 py-2 text-blue-200">
                    Students: {dashboardData.users.students.toLocaleString()}
                  </span>
                  <span className="rounded-full border border-purple-400/40 bg-purple-500/15 px-4 py-2 text-purple-200">
                    Clients: {dashboardData.users.clients.toLocaleString()}
                  </span>
                  <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-4 py-2 text-emerald-200">
                    Active today: {dashboardData.users.activeToday.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/6 text-sm">
                  <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.35em] text-slate-300">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Firebase UID</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {recentUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center text-slate-400"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <Users className="h-10 w-10 text-white/30" />
                            <p>No users found.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      recentUsers.map((user) => (
                        <tr
                          key={user.id || user._id}
                          className="transition hover:bg-white/6"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                                {user.name
                                  ? user.name.charAt(0).toUpperCase()
                                  : "U"}
                              </div>
                              <div>
                                <p className="font-semibold text-white">
                                  {user.name || "Unknown User"}
                                </p>
                                <p className="text-xs text-slate-300">
                                  {user.email || "No email"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                                user.userType === "student"
                                  ? "border-blue-400/40 bg-blue-500/15 text-blue-200"
                                  : "border-purple-400/40 bg-purple-500/15 text-purple-200"
                              }`}
                            >
                              {user.userType || user.role || "user"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="rounded-lg border border-white/12 bg-white/6 px-2 py-1 font-mono text-xs text-slate-200">
                              {user.firebaseUid
                                ? `${user.firebaseUid.substring(0, 8)}…`
                                : "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-300">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "Unknown"}
                          </td>
                          <td className="px-6 py-4">
                            <button className="rounded-lg border border-blue-400/40 bg-blue-500/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200 transition hover:border-blue-300/60 hover:bg-blue-500/25">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}

          {activeTab === "payments" && (
            <GlassCard className="p-0">
              <div className="border-b border-white/10 px-6 py-8">
                <SectionHeading
                  title="Payment Management"
                  description="Monitor revenue, fees, and payout timelines"
                  icon={DollarSign}
                />
                <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-slate-300">
                  <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-4 py-2 text-emerald-200">
                    Total Revenue: {formatCurrency(dashboardData.payments.totalRevenue)}
                  </span>
                  <span className="rounded-full border border-blue-400/40 bg-blue-500/15 px-4 py-2 text-blue-200">
                    Platform Fees: {formatCurrency(dashboardData.payments.platformFees)}
                  </span>
                  <span className="rounded-full border border-amber-400/40 bg-amber-500/15 px-4 py-2 text-amber-200">
                    Pending: {formatCurrency(dashboardData.payments.pendingPayouts)}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/6 text-sm">
                  <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.35em] text-slate-300">
                    <tr>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Project</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {recentPayments.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-12 text-center text-slate-400"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <CreditCard className="h-10 w-10 text-white/30" />
                            <p>No payments found.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      recentPayments.map((payment) => (
                        <tr
                          key={payment.id || payment._id}
                          className="transition hover:bg-white/6"
                        >
                          <td className="px-6 py-4 text-lg font-semibold text-white">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-white">
                              {payment.studentName || "Unknown"}
                            </p>
                            <p className="text-xs text-slate-300">
                              {payment.studentEmail || "N/A"}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-white">
                              {payment.clientName || "Unknown"}
                            </p>
                            <p className="text-xs text-slate-300">
                              {payment.clientEmail || "N/A"}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-300">
                            {payment.projectTitle || "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                                payment.status === "completed"
                                  ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
                                  : payment.status === "pending"
                                  ? "border-amber-400/40 bg-amber-500/15 text-amber-200"
                                  : "border-rose-400/40 bg-rose-500/15 text-rose-200"
                              }`}
                            >
                              {payment.status || "unknown"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-300">
                            {payment.createdAt
                              ? new Date(payment.createdAt).toLocaleDateString()
                              : "Unknown"}
                          </td>
                          <td className="px-6 py-4">
                            <button className="rounded-lg border border-blue-400/40 bg-blue-500/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200 transition hover:border-blue-300/60 hover:bg-blue-500/25">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}

          {activeTab === "system" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <GlassCard>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-300">
                        Uptime
                      </p>
                      <p className="mt-3 text-4xl font-semibold text-emerald-300">
                        {dashboardData.system.uptime}
                      </p>
                      <p className="mt-2 text-xs text-slate-300">
                        Rolling 30-day availability
                      </p>
                    </div>
                    <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-200">
                      <Server className="h-6 w-6" />
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-300">
                        API Calls
                      </p>
                      <p className="mt-3 text-4xl font-semibold text-white">
                        {dashboardData.system.apiCalls.toLocaleString()}
                      </p>
                      <p className="mt-2 text-xs text-emerald-200">
                        +12% vs yesterday
                      </p>
                    </div>
                    <div className="rounded-2xl bg-blue-500/20 p-3 text-blue-200">
                      <Activity className="h-6 w-6" />
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-300">
                        DB Connections
                      </p>
                      <p className="mt-3 text-4xl font-semibold text-white">
                        {dashboardData.system.dbConnections.toLocaleString()}
                      </p>
                      <p className="mt-2 text-xs text-slate-300">
                        Concurrent connections
                      </p>
                    </div>
                    <div className="rounded-2xl bg-purple-500/20 p-3 text-purple-200">
                      <Database className="h-6 w-6" />
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-rose-200">
                        Error Count
                      </p>
                      <p className="mt-3 text-4xl font-semibold text-rose-200">
                        {dashboardData.system.errors.toLocaleString()}
                      </p>
                      <p className="mt-2 text-xs text-slate-300">
                        Logged exceptions today
                      </p>
                    </div>
                    <div className="rounded-2xl bg-rose-500/20 p-3 text-rose-200">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                  </div>
                </GlassCard>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <GlassCard className="max-h-[30rem] overflow-hidden">
                  <SectionHeading
                    title="System Logs"
                    description="Event timeline from the last 24 hours"
                    icon={Activity}
                  />
                  <div className="space-y-3 overflow-y-auto pr-1 text-sm scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
                    {systemLogs.length === 0 ? (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
                        <Activity className="mx-auto h-12 w-12 text-white/30" />
                        <p className="mt-3 text-sm">
                          No logs available right now.
                        </p>
                      </div>
                    ) : (
                      systemLogs.slice(0, 20).map((log, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-white/10 bg-white/6 px-4 py-3"
                        >
                          <div className="flex items-start justify-between">
                            <span
                              className={`text-xs font-bold ${
                                log.level === "error"
                                  ? "text-rose-300"
                                  : log.level === "warn"
                                  ? "text-amber-200"
                                  : "text-blue-200"
                              }`}
                            >
                              {(log.level || "info").toUpperCase()}
                            </span>
                            <span className="text-xs text-slate-400">
                              {log.timestamp
                                ? new Date(log.timestamp).toLocaleTimeString()
                                : "Unknown"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-slate-100">
                            {log.message || "No message"}
                          </p>
                          {log.source && (
                            <p className="mt-1 text-xs text-slate-400">
                              Source: {log.source}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </GlassCard>

                <GlassCard>
                  <SectionHeading
                    title="Service Status"
                    description="Current state of core infrastructure"
                    icon={Server}
                  />
                  <div className="space-y-5 text-sm">
                    {[
                      {
                        label: "MongoDB",
                        status: dashboardData.system.mongoStatus,
                        description: "Primary transactional datastore",
                      },
                      {
                        label: "Firebase",
                        status: dashboardData.system.firebaseStatus,
                        description: "User auth and RT services",
                      },
                      {
                        label: "Razorpay",
                        status: dashboardData.payments.razorpayStatus,
                        description: "Payment processing",
                      },
                    ].map((service) => (
                      <div
                        key={service.label}
                        className="flex items-center justify-between rounded-2xl border border-white/12 bg-white/6 px-4 py-4"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-3 w-3 rounded-full ${
                              service.status === "connected" ||
                              service.status === "active"
                                ? "bg-emerald-400"
                                : "bg-rose-400"
                            }`}
                          />
                          <div>
                            <p className="font-semibold text-white">
                              {service.label}
                            </p>
                            <p className="text-xs text-slate-300">
                              {service.description}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                            service.status === "connected" ||
                            service.status === "active"
                              ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-200"
                              : "border-rose-400/40 bg-rose-500/20 text-rose-200"
                          }`}
                        >
                          {service.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;