export default function Success() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blush text-dark px-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <span className="text-6xl">🎉</span>
        </div>
        
        <h2 className="text-3xl font-diamond mb-4 tracking-wide">
          Payment Successful!
        </h2>
        
        <p className="text-lg mb-6 text-gray-700">
          Thanks for upgrading! You now have full access to Photo2Profit Pro.
        </p>
        
        <div className="bg-gradient-to-r from-rose-100 to-gold-light p-6 rounded-lg mb-6">
          <p className="text-sm text-gray-800">
            Your account has been upgraded and you can now enjoy all premium features.
            Check your email for a confirmation receipt.
          </p>
        </div>
        
        <a 
          href="/" 
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
