// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import EnhancedPhotoUpload from "../components/EnhancedPhotoUpload";
import paymentService from "../services/paymentService";
import { format } from "date-fns";

export default function Dashboard() {
  const navigate = useNavigate();

  // --- State ---
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [currentUsage, setCurrentUsage] = useState({});
  const [usageLimits, setUsageLimits] = useState({});
  const [recentUploads, setRecentUploads] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- Helper Functions ---
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return format(new Date(timestamp * 1000), "MMM dd, yyyy");
  };

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Sign-out error:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  const handleSubscribeToTrial = async () => {
    try {
      const priceId = import.meta.env.VITE_STRIPE_PRICE_ID_TRIAL;
      await paymentService.createCheckoutSession(priceId, user?.uid);
    } catch (error) {
      console.error("Trial subscription error:", error);
      alert("Failed to start trial. Please try again.");
    }
  };

  const handleSubscribeToPro = async () => {
    try {
      const priceId = import.meta.env.VITE_STRIPE_PRICE_ID_PRO;
      await paymentService.createCheckoutSession(priceId, user?.uid);
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to upgrade subscription. Please try again.");
    }
  };

  const handleManageBilling = async () => {
    try {
      if (subscriptionStatus?.customerId) {
        await paymentService.createCustomerPortalSession(
          subscriptionStatus.customerId
        );
      }
    } catch (error) {
      console.error("Portal error:", error);
      alert("Failed to open billing portal. Please try again.");
    }
  };

  const handleUploadComplete = (uploads) => {
    setRecentUploads((prev) => [...uploads, ...prev]);
  };

  // --- Auth + Data ---
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        // Optional: Fetch user profile, subscription, etc.
        setSubscriptionStatus({
          status: "trialing",
          plan: "Trial",
          currentPeriodEnd: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
          customerId: "demo_customer_id",
        });
        setCurrentUsage({
          uploads: 3,
          backgroundRemovals: 2,
          aiAnalysis: 4,
          apiCalls: 15,
        });
        setUsageLimits({
          uploadsPerMonth: 20,
          backgroundRemovals: 10,
          aiAnalysis: 50,
          apiCallsPerDay: 100,
        });
        setRecentUploads([]);
      } else {
        navigate("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // --- Loading Spinner ---
  if (loading) {
    return (
      <div className="min-h-screen bg-blush flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose"></div>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-blush">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-rose-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-diamond text-rose-dark">
                PHOTO2PROFIT
              </h1>
              <span
                className={`ml-4 px-3 py-1 text-sm rounded-full ${
                  subscriptionStatus?.status === "active"
                    ? "bg-green-100 text-green-800"
                    : subscriptionStatus?.status === "trialing"
                    ? "bg-gold-soft text-dark"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {subscriptionStatus?.status === "active"
                  ? `${subscriptionStatus.plan?.toUpperCase()} Plan`
                  : subscriptionStatus?.status === "trialing"
                  ? "Trial Active"
                  : "Free Account"}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome,{" "}
                {userProfile?.displayName || user?.displayName || "User"}!
              </span>
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subscription Card */}
        {subscriptionStatus && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Subscription Status
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {subscriptionStatus.status === "active"
                    ? `${subscriptionStatus.plan?.toUpperCase()} plan - Next billing: ${formatDate(
                        subscriptionStatus.currentPeriodEnd
                      )}`
                    : subscriptionStatus.status === "trialing"
                    ? `Trial period - Ends: ${formatDate(
                        subscriptionStatus.currentPeriodEnd
                      )}`
                    : "No active subscription"}
                </p>
              </div>
              <div className="flex space-x-3">
                {subscriptionStatus.status === "none" && (
                  <>
                    <button
                      onClick={handleSubscribeToTrial}
                      className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors"
                    >
                      Start $1 Trial
                    </button>
                    <button
                      onClick={handleSubscribeToPro}
                      className="px-4 py-2 bg-rose text-white rounded-lg hover:bg-rose-dark transition-colors"
                    >
                      Subscribe to Pro
                    </button>
                  </>
                )}
                {subscriptionStatus.status === "trialing" && (
                  <button
                    onClick={handleSubscribeToPro}
                    className="px-4 py-2 bg-rose text-white rounded-lg hover:bg-rose-dark transition-colors"
                  >
                    Upgrade to Pro
                  </button>
                )}
                {(subscriptionStatus.status === "active" ||
                  subscriptionStatus.status === "trialing") &&
                  subscriptionStatus.customerId && (
                    <button
                      onClick={handleManageBilling}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Manage Billing
                    </button>
                  )}
              </div>
            </div>

            {/* Usage Stats */}
            {currentUsage && usageLimits && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Uploads This Month",
                    used: currentUsage.uploads,
                    limit: usageLimits.uploadsPerMonth,
                  },
                  {
                    label: "Background Removals",
                    used: currentUsage.backgroundRemovals,
                    limit: usageLimits.backgroundRemovals,
                  },
                  {
                    label: "AI Analyses",
                    used: currentUsage.aiAnalysis,
                    limit: usageLimits.aiAnalysis,
                  },
                  {
                    label: "API Calls Today",
                    used: currentUsage.apiCalls,
                    limit: usageLimits.apiCallsPerDay,
                  },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-rose">
                      {item.used || 0}
                      {item.limit > 0 && `/${item.limit}`}
                    </div>
                    <div className="text-sm text-gray-600">{item.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-dark">Upload Photos</h2>
                <button
                  onClick={() => setShowUpload(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-0">
                <EnhancedPhotoUpload
                  user={user}
                  onUploadComplete={handleUploadComplete}
                  maxFiles={5}
                />
              </div>
            </div>
          </div>
        )}

        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-dark mb-6">
            Welcome to Photo2Profit!
          </h2>
          <div className="text-center py-12">
            <div className="text-rose mb-4">
              <svg
                className="mx-auto h-16 w-16"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Ready to Start Selling?
            </h3>
            <p className="text-gray-600 mb-6">
              Upload your photos and let AI create professional listings in
              seconds.
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose to-gold text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              🚀 Start Uploading Photos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}