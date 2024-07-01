import { useState } from 'react';
import { Button } from 'platform-bible-react';

import HeatmapComponent from './components/heatmap.component';
import Login from './components/login.component';


global.webViewComponent = function FirstWebView() {
  const [activeMenu, setActiveMenu] = useState('login'); // Default page set to Login

  return (
<div>
  <div
    className="hamburger-menu"
    style={{
      position: 'static',
      top: 5,
      left: '10%',
      backgroundColor: '#333',
      color: 'white',
      padding: '10px',
      width: '60%',
      zIndex: 100, // Ensures the menu stays on top
      display: 'flex',
      justifyContent: 'space-between', // Adjusts spacing between buttons
      gap: '10px', // Adds space between buttons if needed
    }}
  >
    <Button className="menu-button" onClick={() => setActiveMenu('heatmap')}>Heatmap</Button>
    <Button className="menu-button" onClick={() => setActiveMenu('login')}>Login</Button>
  </div>
  <div
    className="content"
    style={{
      paddingTop: '50px', // Ensures content does not overlap menu
    }}
  >
        {activeMenu === 'heatmap' && <HeatmapComponent />}
        {activeMenu === 'login' && <Login />}
      </div>
    </div>
  );
};
