export default function Cancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blush text-dark px-6">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <span className="text-6xl">🤔</span>
        </div>
        
        <h2 className="text-3xl font-diamond mb-4 tracking-wide">
          Payment Canceled
        </h2>
        
        <p className="text-lg mb-6 text-gray-700">
          No worries, you can upgrade anytime from your dashboard.
        </p>
        
        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          <p className="text-sm text-gray-800">
            Your payment was not processed. If you have any questions or concerns,
            please contact our support team.
          </p>
        </div>
        
        <a 
          href="/" 
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
