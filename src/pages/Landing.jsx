import logo from '../assets/photo2profit-logo.svg';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-blush text-dark text-center px-6">
      <img src={logo} alt="Photo2Profit Logo" className="w-48 mb-6 drop-shadow-xl" />
      <h1 className="text-5xl font-diamond mb-2 tracking-wide">
        PHOTO<span className="text-rose-dark">2</span>PROFIT
      </h1>
      <p className="text-lg mb-8 max-w-md">
        Turn your photos into profit — AI-powered listings, background removal, and instant
        cross-posting 💎
      </p>
      <div className="flex gap-4">
        <button className="cta" onClick={() => navigate('/demo')}>Start Now</button>
        <button className="cta bg-rose-dark" onClick={() => navigate('/dashboard-demo')}>Dashboard Demo</button>
      </div>
    </main>
  );
}
