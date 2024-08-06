import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import Admin from '../components/common/Sidebar'



const Approuter = () => {
  return (<>
  
 
    <Router>
      <Routes>

        {/* Login  */}
        <Route path="/" element={<LoginPage />} />
       {/* Admin  */}
        <Route path="/admin/:rout" element={<Admin />} >
       
        </Route>
      </Routes>
    </Router>
    </> );
};

export default Approuter;
