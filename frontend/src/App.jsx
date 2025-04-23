import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/SignUp';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import Whiteboard from './components/Whiteboard';

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/welcome" element={<Welcome user={user} />} />
        <Route path="/whiteboard" element={<Whiteboard />} />
        <Route path="/whiteboard/:docId" element={<Whiteboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;