import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GoogleButton from "react-google-button";
import { UserAuth } from "../contexts/AuthContext";

const GoogleLoginButton = () => {
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
    return <GoogleButton onClick={handleGoogleSignIn} />;
}

export default GoogleLoginButton;