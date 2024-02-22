import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/common/Login';
import RegisterForm from './pages/common/Register';
import Home from './pages/Home';

// Import HomePage component if you have one

const App = () => {
  return (
    <Router>
      
      <Routes>
        {/* Uncomment and use this if you have a HomePage component */}
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/home" element={<Home />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
