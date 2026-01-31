import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";
import Logo from "../../assets/Logo.svg";

const Login = () => {
  const { googleSignIn, user } = UserAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user != null) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-coral-light to-teal-light flex items-center justify-center p-4">
      {/* Login Card */}
      <div className="w-full max-w-sm animate-in">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* Logo & Title */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-coral to-orange-400 rounded-xl flex items-center justify-center shadow-md">
              <img src={Logo} alt="BiteBalance" className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-charcoal">
                BiteBalance
              </h1>
              <p className="text-xs text-warm-gray">
                AI-Powered Nutrition
              </p>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="
              w-full flex items-center justify-center gap-3
              py-3 px-4
              bg-white border-2 border-sand
              rounded-xl font-semibold text-charcoal text-sm
              transition-all duration-fast ease-out-expo
              hover:border-coral hover:shadow-md hover:-translate-y-0.5
              active:translate-y-0 active:scale-[0.98]
            "
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-sand" />
            <span className="text-xs text-stone">Features</span>
            <div className="flex-1 h-px bg-sand" />
          </div>

          {/* Features - Compact Grid */}
          <div className="grid grid-cols-3 gap-2">
            <FeatureIcon icon={CameraIcon} label="Meal Scan" color="coral" />
            <FeatureIcon icon={ChefIcon} label="Recipes" color="teal" />
            <FeatureIcon icon={ChartIcon} label="Tracking" color="gold" />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-warm-gray mt-4">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};

// Feature Icon Component
const FeatureIcon = ({ icon: Icon, label, color }) => {
  const colors = {
    coral: 'bg-coral-light text-coral',
    teal: 'bg-teal-light text-teal',
    gold: 'bg-gold-light text-gold',
  };

  return (
    <div className="flex flex-col items-center gap-1.5 p-2">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-xs text-charcoal font-medium">{label}</span>
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

const ChefIcon = ({ className }) => (
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
