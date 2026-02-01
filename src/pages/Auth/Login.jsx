import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";
import Logo from "../../assets/Logo.svg";

const Login = () => {
  const { googleSignIn, user } = UserAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await googleSignIn();
      navigate("/");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user != null) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="blob blob-lg blob-coral absolute -top-32 -left-32 opacity-30" />
        <div className="blob blob-lg blob-teal absolute top-1/4 -right-48 opacity-25" />
        <div className="blob blob-lg blob-gold absolute bottom-0 left-1/4 opacity-20" />
        <div className="blob blob-coral absolute top-1/2 left-1/3 opacity-15 w-64 h-64" />
      </div>

      {/* Main Content - Split Layout */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-center px-12 xl:px-20">
          <div className="max-w-xl">
            {/* Logo */}
            <div className="flex items-center gap-4 mb-8 animate-in">
              <div className="w-16 h-16 bg-gradient-to-br from-coral to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-coral/30">
                <img src={Logo} alt="BiteBalance" className="w-10 h-10" />
              </div>
              <div>
                <h1 className="font-display font-extrabold text-3xl text-charcoal">
                  BiteBalance
                </h1>
                <p className="text-warm-gray">
                  AI-Powered Nutrition Tracking
                </p>
              </div>
            </div>

            {/* Hero Text */}
            <h2 className="font-display font-extrabold text-4xl xl:text-5xl text-charcoal leading-tight mb-6 animate-in" style={{ animationDelay: '100ms' }}>
              Track your meals.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral to-teal">
                Transform your health.
              </span>
            </h2>

            <p className="text-lg text-warm-gray mb-10 animate-in" style={{ animationDelay: '150ms' }}>
              Simply snap a photo of your food and let AI do the rest.
              Get instant nutritional insights and personalized recipes.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
              <FeatureCard
                icon={<CameraIcon className="w-6 h-6" />}
                title="Instant Scan"
                description="Photo to nutrition in seconds"
                color="coral"
              />
              <FeatureCard
                icon={<SparkleIcon className="w-6 h-6" />}
                title="AI Recipes"
                description="Generate recipes from ingredients"
                color="teal"
              />
              <FeatureCard
                icon={<ChartIcon className="w-6 h-6" />}
                title="Smart Stats"
                description="Track your progress over time"
                color="gold"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8 animate-in">
              <div className="w-14 h-14 bg-gradient-to-br from-coral to-orange-400 rounded-xl flex items-center justify-center shadow-lg shadow-coral/30">
                <img src={Logo} alt="BiteBalance" className="w-9 h-9" />
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl text-charcoal">
                  BiteBalance
                </h1>
                <p className="text-sm text-warm-gray">
                  AI-Powered Nutrition
                </p>
              </div>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-charcoal/10 p-8 lg:p-10 animate-in" style={{ animationDelay: '200ms' }}>
              <div className="text-center mb-8">
                <h3 className="font-display font-bold text-2xl text-charcoal mb-2">
                  Welcome Back
                </h3>
                <p className="text-warm-gray">
                  Sign in to continue your journey
                </p>
              </div>

              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="
                  w-full flex items-center justify-center gap-3
                  py-4 px-6
                  bg-white border-2 border-sand
                  rounded-2xl font-semibold text-charcoal
                  transition-all duration-fast ease-out-expo
                  hover:border-coral hover:shadow-lg hover:shadow-coral/20 hover:-translate-y-1
                  active:translate-y-0 active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                "
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-charcoal/30 border-t-coral rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-sand" />
                <span className="text-sm text-stone font-medium">Features</span>
                <div className="flex-1 h-px bg-sand" />
              </div>

              {/* Mobile Feature Icons */}
              <div className="grid grid-cols-3 gap-3">
                <MobileFeature icon={<CameraIcon className="w-5 h-5" />} label="Scan" color="coral" />
                <MobileFeature icon={<SparkleIcon className="w-5 h-5" />} label="Recipes" color="teal" />
                <MobileFeature icon={<ChartIcon className="w-5 h-5" />} label="Stats" color="gold" />
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-warm-gray mt-6 animate-in" style={{ animationDelay: '300ms' }}>
              By signing in, you agree to our{' '}
              <a href="#" className="text-coral hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-coral hover:underline">Privacy Policy</a>
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mt-8 animate-in" style={{ animationDelay: '400ms' }}>
              <div className="text-center">
                <p className="font-display font-bold text-2xl text-charcoal">10K+</p>
                <p className="text-sm text-warm-gray">Meals Tracked</p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-2xl text-charcoal">5K+</p>
                <p className="text-sm text-warm-gray">Recipes Made</p>
              </div>
              <div className="text-center">
                <p className="font-display font-bold text-2xl text-charcoal">99%</p>
                <p className="text-sm text-warm-gray">Accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Feature Card Component (Desktop)
const FeatureCard = ({ icon, title, description, color }) => {
  const colors = {
    coral: 'bg-coral-light text-coral border-coral/20',
    teal: 'bg-teal-light text-teal border-teal/20',
    gold: 'bg-gold-light text-gold border-gold/20',
  };

  const glowColors = {
    coral: 'group-hover:shadow-coral/20',
    teal: 'group-hover:shadow-teal/20',
    gold: 'group-hover:shadow-gold/20',
  };

  return (
    <div className={`group bg-white rounded-2xl p-5 border border-sand hover:border-transparent transition-all duration-normal hover:shadow-xl ${glowColors[color]} cursor-default`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
        {icon}
      </div>
      <h4 className="font-display font-bold text-charcoal mb-1">{title}</h4>
      <p className="text-sm text-warm-gray">{description}</p>
    </div>
  );
};

// Mobile Feature Component
const MobileFeature = ({ icon, label, color }) => {
  const colors = {
    coral: 'bg-coral-light text-coral',
    teal: 'bg-teal-light text-teal',
    gold: 'bg-gold-light text-gold',
  };

  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-cream/50">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
        {icon}
      </div>
      <span className="text-xs font-medium text-charcoal">{label}</span>
    </div>
  );
};

// Icons
const CameraIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SparkleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ChartIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export default Login;
