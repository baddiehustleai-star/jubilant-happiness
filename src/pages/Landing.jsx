import { Link } from "react-router-dom";
import logo from "../assets/photo2profit-logo.svg";

export default function Landing() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-blush text-dark text-center px-6">
      <img
        src={logo}
        alt="Photo2Profit Logo"
        className="w-48 mb-6 drop-shadow-xl"
      />
      <h1 className="text-5xl font-diamond mb-2 tracking-wide">
        PHOTO<span className="text-rose-dark">2</span>PROFIT
      </h1>
      <p className="text-lg mb-8 max-w-md">
        Turn your photos into profit — AI-powered listings, background removal,
        and instant cross-posting 💎
      </p>
      <div className="flex gap-4">
        <Link to="/upload">
          <button className="cta">Start Now</button>
        </Link>
        <Link to="/workspace">
          <button className="px-6 py-3 border-2 border-rose text-rose rounded-full hover:bg-rose hover:text-white transition-all font-semibold">
            View Workspace
          </button>
        </Link>
      </div>
    </main>
  );
}
