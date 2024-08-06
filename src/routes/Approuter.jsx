import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import Admin from '../pages/Admin';
import Advisor from '../pages/Advisore';
import Reviewer from '../pages/Reviewer';
// import Admin from '../components/common/Sidebar'



const Approuter = () => {


  return (<>
  
 
    <Router>
      <Routes>

        {/* Login  */}
        <Route path="/" element={<LoginPage />} />
       {/* Admin  */}
        <Route path="/admin/:rout" element={<Admin />}/ >
        {/* Advisors  */}
        <Route path="/advisor/:rout" element={<Advisor/>}/> 
        {/* Reviewer       */}
        <Route path='/Reviewer/:rout' element={<Reviewer/>}/>
      
      </Routes>
    </Router>
    </> );
};

export default Approuter;
