import React from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components";
import Home from "./pages/Home";
import LocationIconsPage from "./components/ProfessionalWeatherBackground";

function App() {
  return (
    <div className="scroll-smooth">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
    // <>
    //   <LocationIconsPage />
    // </>
  );
}

export default App;
