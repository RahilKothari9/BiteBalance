import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const firstName = user?.displayName?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-cream pt-[72px]">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-lg blob-coral absolute -top-40 -right-40 opacity-20" />
        <div className="blob blob-lg blob-teal absolute top-1/2 -left-60 opacity-15" />
        <div className="blob blob-lg blob-gold absolute -bottom-40 right-1/4 opacity-20" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 stagger-children">
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-charcoal mb-4">
            Welcome back,{" "}
            <span className="text-gradient-coral">{firstName}</span>
          </h1>
          <p className="text-lg sm:text-xl text-warm-gray max-w-2xl mx-auto">
            Track your nutrition, discover new recipes, and reach your health goals.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 stagger-children">
          <FeatureCard
            title="Meal Tracking"
            description="Snap a photo of your meal and get instant nutritional insights powered by AI."
            icon={CameraIcon}
            page="endproduct"
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

        {/* Quick Stats Section */}
        <div className="mt-16 animate-in" style={{ animationDelay: '400ms' }}>
          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
            <h2 className="font-display font-bold text-xl text-charcoal mb-6">
              Today's Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <QuickStat
                label="Calories"
                value="—"
                unit="kcal"
                color="coral"
              />
              <QuickStat
                label="Protein"
                value="—"
                unit="g"
                color="teal"
              />
              <QuickStat
                label="Carbs"
                value="—"
                unit="g"
                color="gold"
              />
              <QuickStat
                label="Fat"
                value="—"
                unit="g"
                color="coral"
              />
            </div>
            <p className="text-sm text-stone mt-4 text-center">
              Start tracking your meals to see your daily progress
            </p>
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="mt-12 text-center animate-in" style={{ animationDelay: '500ms' }}>
          <p className="text-warm-gray">
            Small steps lead to big changes.{" "}
            <span className="text-coral font-medium">Let's make today count.</span>
          </p>
        </div>
      </main>
    </div>
  );
};

// Quick Stat Component
const QuickStat = ({ label, value, unit, color }) => {
  const colors = {
    coral: 'text-coral',
    teal: 'text-teal',
    gold: 'text-gold',
  };

  return (
    <div className="text-center">
      <p className="text-sm text-warm-gray mb-1">{label}</p>
      <p className={`font-mono font-semibold text-2xl sm:text-3xl ${colors[color]}`}>
        {value}
        <span className="text-sm text-stone ml-1">{unit}</span>
      </p>
    </div>
  );
};

export default Home;
