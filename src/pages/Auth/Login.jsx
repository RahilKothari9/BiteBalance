import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";


const Login = () => {
  const { googleSignIn, user } = UserAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async() => {
      try {
          await googleSignIn();
      } catch(error) {
          console.log(error);
      }
      navigate('/')
  };

  useEffect(() => {
      if (user != null) {
          navigate('/login')
      }
  }, [user, navigate]);


  return (
    <div className="min-h-screen flex items-center justify-center">
    <div className="relative w-full max-w-md">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 bg-repeat opacity-10" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 0c16.569 0 30 13.431 30 30 0 16.569-13.431 30-30 30C13.431 60 0 46.569 0 30 0 13.431 13.431 0 30 0zm-7 15a8 8 0 100 16 8 8 0 000-16zm21 0a8 8 0 100 16 8 8 0 000-16zM15 37a8 8 0 100 16 8 8 0 000-16zm30 0a8 8 0 100 16 8 8 0 000-16z' fill='%2322c55e' fill-opacity='0.2'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      ></div>

      {/* Login container */}
      <div className="relative bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <img 
            src="/Logo.svg" 
            alt="BiteBalance Logo" 
            width={40} 
            height={40} 
            className="mr-2" 
          />
          <h1 className="text-3xl font-bold text-center text-green-700">BiteBalance</h1>
        </div>
        <h2 className="text-xl text-center text-green-600 mb-8">Sign in to your account</h2>
        
        <Button 
          variant="outlined" 
          className="w-full py-3 text-lg border-green-500 text-green-700 hover:bg-green-50"
          onClick={handleGoogleSignIn}
          startIcon={<GoogleIcon />}
          sx={{
            textTransform: 'none',
            borderColor: '#22c55e',
            color: '#15803d',
            '&:hover': {
              borderColor: '#16a34a',
              backgroundColor: '#f0fdf4',
            },
          }}
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  </div>
  );
};

export default Login;
