import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../components/auth/LoginPage";
import Admin from "../components/admin/Admin";
import Advisor from "../components/advisor/Advisore";
import Reviewer from "../components/reviewer/Reviewer";
// import Reviewer from "../components/reviewer/Reviewer";

const Approuter = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Login  */}
          <Route path="/" element={<LoginPage />} />
          {/* Admin  */}
          <Route path="/admin/:rout" element={<Admin />} />
          {/* Advisors  */}
          <Route path="/advisor/:rout" element={<Advisor />} />
          {/* Reviewer       */}
          <Route path="/Reviewer/:rout" element={<Reviewer />} />
        </Routes>
      </Router>
    </>
  );
};

export default Approuter;
