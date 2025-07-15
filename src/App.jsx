import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

import Welcome from "./pages/Welcome";
import BuildYourNight from "./pages/BuildYourNight";
import Events from "./pages/Events";
import Topics from "./pages/Topics";
import TalkTips from "./pages/TonightsTalkTips";
import News from "./pages/News";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/build-your-night" element={<BuildYourNight />} />
          <Route path="/events" element={<Events />} />
          <Route path="/topics" element={<Topics />} />
        <Route path="/tonightstalktips" element={<TalkTips />} />
       <Route path="/news" element={<News />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
