export default function Dashboard() {
  return (
    <div className="min-h-screen bg-blush p-6">
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-diamond text-rose-dark mb-2">Dashboard</h1>
        <p className="text-dark">Welcome to Photo2Profit 💎</p>
      </header>

      <main className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Photo Upload Section */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-rose-dark mb-4">Upload Photos</h2>
          <p className="text-dark mb-4">
            Upload your product photos to get started with AI-powered listings.
          </p>
          <button className="cta w-full">Upload Photos</button>
        </section>

        {/* AI Listings Section */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-rose-dark mb-4">AI Listings</h2>
          <p className="text-dark mb-4">
            Generate professional product descriptions with AI assistance.
          </p>
          <button className="cta w-full">Create Listing</button>
        </section>

        {/* Cross-Posting Section */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-rose-dark mb-4">Cross-Post</h2>
          <p className="text-dark mb-4">Share your listings across multiple platforms instantly.</p>
          <button className="cta w-full">Cross-Post</button>
        </section>

        {/* Analytics Section */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-rose-dark mb-4">Analytics</h2>
          <p className="text-dark mb-4">Track your sales and performance metrics.</p>
          <button className="cta w-full">View Analytics</button>
        </section>

        {/* Settings Section */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-rose-dark mb-4">Settings</h2>
          <p className="text-dark mb-4">Configure your integrations and account preferences.</p>
          <button className="cta w-full">Manage Settings</button>
        </section>

        {/* Subscription Section */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-rose-dark mb-4">Subscription</h2>
          <p className="text-dark mb-4">Manage your Photo2Profit subscription plan.</p>
          <button className="cta w-full">View Plans</button>
        </section>
      </main>
    </div>
  );
}
