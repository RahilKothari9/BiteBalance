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
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-lg blob-coral absolute -top-40 -left-40 opacity-20" />
        <div className="blob blob-lg blob-teal absolute top-1/4 -right-40 opacity-15" />
        <div className="blob blob-lg blob-gold absolute -bottom-40 left-1/4 opacity-20" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md animate-in">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-coral to-orange-400 rounded-2xl flex items-center justify-center shadow-glow-coral">
              <img
                src={Logo}
                alt="BiteBalance"
                className="w-12 h-12"
              />
            </div>
            <h1 className="font-display font-extrabold text-3xl text-charcoal mb-2">
              BiteBalance
            </h1>
            <p className="text-warm-gray">
              Track your nutrition journey
            </p>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="
              w-full
              flex items-center justify-center gap-3
              py-4 px-6
              bg-white
              border-2 border-sand
              rounded-xl
              font-semibold text-charcoal
              transition-all duration-fast ease-out-expo
              hover:border-coral hover:shadow-lg hover:-translate-y-0.5
              active:translate-y-0 active:scale-[0.98]
              group
            "
          >
            {/* Google Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-sand" />
            <span className="text-sm text-stone">or</span>
            <div className="flex-1 h-px bg-sand" />
          </div>

          {/* Features Preview */}
          <div className="space-y-3">
            <Feature
              icon="📷"
              title="AI Meal Tracking"
              description="Snap a photo for instant nutrition info"
            />
            <Feature
              icon="👨‍🍳"
              title="Recipe Generator"
              description="Get recipes from your ingredients"
            />
            <Feature
              icon="📊"
              title="Track Progress"
              description="Monitor your nutrition journey"
            />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-stone mt-6">
          By signing in, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

// Feature Item Component
const Feature = ({ icon, title, description }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-sand/30">
    <span className="text-xl">{icon}</span>
    <div>
      <p className="font-medium text-sm text-charcoal">{title}</p>
      <p className="text-xs text-warm-gray">{description}</p>
    </div>
  </div>
);

export default Login;
