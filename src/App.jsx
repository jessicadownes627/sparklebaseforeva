import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext";

import SplashScreen from "./components/SplashScreen";
import Welcome from "./pages/Welcome";
import BuildYourNight from "./pages/BuildYourNight";
import Events from "./pages/Events";
import Topics from "./pages/Topics";
import TalkTips from "./pages/TonightsTalkTips";
import News from "./pages/News";

// 🧠 Wrapper component to handle route memory
const RouteMemory = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("lastVisitedPath", location.pathname);
  }, [location]);

  useEffect(() => {
    const lastPath = localStorage.getItem("lastVisitedPath");
    if (
      lastPath &&
      lastPath !== "/" &&
      lastPath !== location.pathname &&
      location.pathname === "/"
    ) {
      navigate(lastPath);
    }
  }, []); // only on first load

  return children;
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <UserProvider>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <Router>
          <RouteMemory>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/build-your-night" element={<BuildYourNight />} />
              <Route path="/events" element={<Events />} />
              <Route path="/topics" element={<Topics />} />
              <Route path="/tonightstalktips" element={<TalkTips />} />
              <Route path="/news" element={<News />} />
            </Routes>
          </RouteMemory>
        </Router>
      )}
    </UserProvider>
  );
};

export default App;

