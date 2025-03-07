import React from "react";

const Tabs = ({activeTab, setActiveTab}) => {

  return (
    <div className="container mt-5">
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <a 
          className={`nav-link ${activeTab === 'login' ? 'active' : ''}`} 
          href="#login" 
          onClick={() => setActiveTab('login')}
        >
          Login
        </a>
      </li>
      <li className="nav-item">
        <a 
          className={`nav-link ${activeTab === 'signup' ? 'active' : ''}`} 
          href="#signup" 
          onClick={() => setActiveTab('signup')}
        >
          Sign Up
        </a>
      </li>
    </ul>
    {/* <div className="tab-content bg-white p-4 mt-2">
      {activeTab === 'login' && <Login />}
      {activeTab === 'signup' && <SignUp />}
    </div> */}
  </div>
   ) ;
};

export default Tabs;
