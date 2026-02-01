import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import FeatureCard from "../components/FeatureCard";

// Icons for feature cards
const CameraIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SparklesIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ChartIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const Home = () => {
  const navigate = useNavigate();
  const { user } = UserAuth();
  const [todayData, setTodayData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [goals, setGoals] = useState({ calories: 2000, protein: 150, carbs: 250, fat: 65 });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Load goals from localStorage
    const savedGoals = localStorage.getItem(`bitebalance_goals_${user?.uid}`);
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, [user]);

  useEffect(() => {
    if (user?.uid) {
      fetchTodayData();
    }
  }, [user]);

  const fetchTodayData = async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}calories/${user.uid}?date=${today}`
      );
      const data = await response.json();
      setTodayData(data);
    } catch (err) {
      console.error('Error fetching today data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const firstName = user?.displayName?.split(" ")[0] || "there";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getProgress = (current, goal) => {
    if (!goal) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-cream pt-[72px]">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-lg blob-coral absolute -top-40 -right-40 opacity-20 animate-float" />
        <div className="blob blob-lg blob-teal absolute top-1/2 -left-60 opacity-15 animate-float" style={{ animationDelay: '3s' }} />
        <div className="blob blob-lg blob-gold absolute -bottom-40 right-1/4 opacity-20 animate-float" style={{ animationDelay: '6s' }} />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 stagger-children">
          <p className="text-warm-gray text-lg mb-2">{getGreeting()}</p>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-charcoal mb-4">
            Welcome back,{" "}
            <span className="text-gradient-coral">{firstName}</span>
          </h1>
          <p className="text-lg sm:text-xl text-warm-gray max-w-2xl mx-auto">
            Track your nutrition, discover new recipes, and reach your health goals.
          </p>
        </div>

        {/* Today's Progress Card */}
        <div className="mb-12 animate-in" style={{ animationDelay: '200ms' }}>
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 overflow-hidden relative">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-coral/10 to-transparent rounded-bl-full" />

            <div className="relative">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="font-display font-bold text-xl text-charcoal mb-1">
                    Today's Progress
                  </h2>
                  <p className="text-sm text-warm-gray">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <Link
                  to="/goals"
                  className="mt-3 sm:mt-0 text-sm text-coral hover:text-coral/80 font-medium flex items-center gap-1 group"
                >
                  Edit Goals
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 bg-sand rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <ProgressStat
                    label="Calories"
                    current={todayData?.totalCalories || 0}
                    goal={goals.calories}
                    unit="kcal"
                    color="coral"
                  />
                  <ProgressStat
                    label="Protein"
                    current={todayData?.totalProtein || 0}
                    goal={goals.protein}
                    unit="g"
                    color="teal"
                  />
                  <ProgressStat
                    label="Carbs"
                    current={todayData?.totalCarbs || 0}
                    goal={goals.carbs}
                    unit="g"
                    color="gold"
                  />
                  <ProgressStat
                    label="Fat"
                    current={todayData?.totalFat || 0}
                    goal={goals.fat}
                    unit="g"
                    color="coral"
                  />
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-sand">
                <QuickAction
                  to="/track"
                  icon={<CameraIcon className="w-4 h-4" />}
                  label="Track Meal"
                  primary
                />
                <QuickAction
                  to="/quick"
                  icon={<BoltIcon className="w-4 h-4" />}
                  label="Quick Log"
                />
                <QuickAction
                  to="/history"
                  icon={<HistoryIcon className="w-4 h-4" />}
                  label="History"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 stagger-children">
          <FeatureCard
            title="Meal Tracking"
            description="Snap a photo of your meal and get instant nutritional insights powered by AI."
            icon={CameraIcon}
            page="track"
            gradient="coral"
          />
          <FeatureCard
            title="Recipe Generator"
            description="Upload your ingredients and get personalized recipe suggestions tailored to your preferences."
            icon={SparklesIcon}
            page="ingredients"
            gradient="teal"
          />
          <FeatureCard
            title="Your Stats"
            description="View your nutrition trends, track your progress, and celebrate your streaks."
            icon={ChartIcon}
            page="stats"
            gradient="gold"
          />
        </div>

        {/* Additional Features */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
          <MiniFeatureCard
            to="/quick"
            icon={<BoltIcon className="w-5 h-5" />}
            title="Quick Log"
            description="Log favorite meals instantly"
            color="coral"
          />
          <MiniFeatureCard
            to="/goals"
            icon={<TargetIcon className="w-5 h-5" />}
            title="Daily Goals"
            description="Set and track your targets"
            color="teal"
          />
          <MiniFeatureCard
            to="/history"
            icon={<HistoryIcon className="w-5 h-5" />}
            title="Meal History"
            description="View your past meals"
            color="gold"
          />
        </div>

        {/* Motivational Footer */}
        <div className="mt-16 text-center animate-in" style={{ animationDelay: '500ms' }}>
          <div className="inline-block bg-gradient-to-r from-coral/10 via-teal/10 to-gold/10 rounded-2xl px-8 py-4">
            <p className="text-charcoal font-medium">
              Small steps lead to big changes.{" "}
              <span className="text-coral">Let's make today count.</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

// Progress Stat Component with circular progress
const ProgressStat = ({ label, current, goal, unit, color }) => {
  const progress = Math.min((current / goal) * 100, 100);

  const colors = {
    coral: { bg: 'bg-coral-light', text: 'text-coral', ring: 'stroke-coral' },
    teal: { bg: 'bg-teal-light', text: 'text-teal', ring: 'stroke-teal' },
    gold: { bg: 'bg-gold-light', text: 'text-gold', ring: 'stroke-gold' },
  };
  const c = colors[color];

  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`${c.bg} rounded-xl p-4 hover:scale-105 transition-transform duration-fast group`}>
      <div className="flex items-center gap-3">
        {/* Mini Progress Ring */}
        <div className="relative w-12 h-12 flex-shrink-0">
          <svg className="w-12 h-12 transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-white/50"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              className={c.ring}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${c.text}`}>
            {Math.round(progress)}%
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-xs text-charcoal/60 mb-0.5">{label}</p>
          <p className={`font-mono font-bold text-lg ${c.text} truncate`}>
            {current}
            <span className="text-xs text-charcoal/50 ml-1">/ {goal}{unit}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Quick Action Button
const QuickAction = ({ to, icon, label, primary }) => (
  <Link
    to={to}
    className={`
      flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
      transition-all duration-fast hover:scale-105 active:scale-95
      ${primary
        ? 'bg-coral text-white shadow-md shadow-coral/30 hover:shadow-lg hover:shadow-coral/40'
        : 'bg-sand text-charcoal hover:bg-coral-light hover:text-coral'
      }
    `}
  >
    {icon}
    {label}
  </Link>
);

// Mini Feature Card
const MiniFeatureCard = ({ to, icon, title, description, color }) => {
  const colors = {
    coral: 'bg-coral-light text-coral hover:bg-coral hover:text-white',
    teal: 'bg-teal-light text-teal hover:bg-teal hover:text-white',
    gold: 'bg-gold-light text-gold hover:bg-gold hover:text-white',
  };

  return (
    <Link
      to={to}
      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-fast group"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors duration-fast ${colors[color]}`}>
        {icon}
      </div>
      <h3 className="font-display font-bold text-charcoal mb-1 group-hover:text-coral transition-colors">{title}</h3>
      <p className="text-sm text-warm-gray">{description}</p>
    </Link>
  );
};

// Icons
const BoltIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const TargetIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const HistoryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default Home;
