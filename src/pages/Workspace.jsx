import { useState } from "react";
import { Link } from "react-router-dom";

export default function Workspace() {
  const [projects] = useState([
    {
      id: 1,
      name: "Vintage Camera",
      status: "processed",
      thumbnail: "https://via.placeholder.com/200x200/E6A4A4/FFFFFF?text=Camera",
      uploadDate: "2025-10-28",
    },
    {
      id: 2,
      name: "Designer Handbag",
      status: "pending",
      thumbnail: "https://via.placeholder.com/200x200/F5C26B/FFFFFF?text=Handbag",
      uploadDate: "2025-10-29",
    },
  ]);

  const getStatusBadge = (status) => {
    const badges = {
      processed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      draft: "bg-gray-100 text-gray-800",
    };
    return badges[status] || badges.draft;
  };

  return (
    <div className="min-h-screen bg-blush">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/">
            <h1 className="text-2xl font-diamond text-rose-dark">
              PHOTO<span className="text-rose">2</span>PROFIT
            </h1>
          </Link>
          <nav className="flex gap-4">
            <Link
              to="/upload"
              className="px-4 py-2 bg-rose text-white rounded-full hover:bg-rose-dark transition-all"
            >
              + New Upload
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-diamond text-rose-dark mb-2">
            My Workspace
          </h2>
          <p className="text-dark opacity-75">
            Manage your photos and listings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-2">📸</div>
            <h3 className="text-2xl font-bold text-rose-dark">
              {projects.length}
            </h3>
            <p className="text-dark opacity-75">Total Photos</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-2">✅</div>
            <h3 className="text-2xl font-bold text-rose-dark">
              {projects.filter((p) => p.status === "processed").length}
            </h3>
            <p className="text-dark opacity-75">Processed</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-2">⏳</div>
            <h3 className="text-2xl font-bold text-rose-dark">
              {projects.filter((p) => p.status === "pending").length}
            </h3>
            <p className="text-dark opacity-75">Pending</p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-xl font-semibold text-rose-dark mb-4">
            Recent Projects
          </h3>
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark opacity-50 mb-4">
                No projects yet. Upload your first photo to get started!
              </p>
              <Link to="/upload">
                <button className="cta">Upload Photo</button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-rose-dark/20 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                >
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-dark">
                        {project.name}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-dark opacity-50">
                      {project.uploadDate}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 text-sm px-3 py-2 border border-rose text-rose rounded-full hover:bg-rose hover:text-white transition-all">
                        Edit
                      </button>
                      <button className="flex-1 text-sm px-3 py-2 bg-rose text-white rounded-full hover:bg-rose-dark transition-all">
                        Export
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
