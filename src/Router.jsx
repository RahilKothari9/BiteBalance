import { Route, Routes, useLocation } from "react-router-dom";
import CopyUpload from "./components/CopyUpload";
import Navbar from "./components/Navbar";
import Parameters from "./components/Parameters";
import Recipe from "./components/Recipe";
import Meal from "./pages/Meal";
import Heatmap from "./components/Heatmap";
import Ingredients from "./pages/Ingredients";
import DrawerComponent from "./components/TemporaryDrawer";
import Upload from "./components/Upload";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

import Profile from "./pages/Profile";
import Recs from "./pages/Recs";
import Stats from "./pages/Stats";
import Tracker from "./pages/Tracker";
import Endproduct from "./pages/Endproduct";

export const Router = () => {
    const location = useLocation();
    const showNavbar = location.pathname !== '/login';

    return (
        <>
            {showNavbar && (
                <div>
                    <Navbar/>
                </div>
            )}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path='/upload' element={<Upload/>}/>
                <Route path='copyupload' element={<CopyUpload/>}/>
                <Route path="/signup" element={<Signup />} />
                <Route path="/parameters" element={<Parameters ingredients="flour sugar butter eggs milk baking powder vanilla"/>}/>
                <Route path="/recipe" element={<Recipe />} />
                <Route path="/stats" element={<Stats />} />
                {/* <Route path="/dashboard" element={<Barchart />} />   */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />  
                <Route path="/ingredients" element={<Ingredients />} />  
                <Route path='/meal' element={<Meal/>}/>
                <Route path="/drawer" element={<DrawerComponent/>}/>
                <Route path="/tracker" element={<Tracker />} /> 
                <Route path="/rec" element={<Recs/>}/>
                <Route path="/endproduct" element={<Endproduct />} />
            </Routes>
        </>
    );
};