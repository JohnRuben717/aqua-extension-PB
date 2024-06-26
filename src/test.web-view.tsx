import { useState } from 'react';
// import { Button } from 'paranext-core/lib/platform-bible-react/dist';

import HeatmapComponent from './heatmap';
import Login from './logincomponent';
import { ChartsFromXYValuesComponent } from './charts.xyvalues.component';

global.webViewComponent = function FirstWebView() {
  const [activeMenu, setActiveMenu] = useState('login'); // Default page set to Login

  return (
    <div>
      <div
        className="hamburger-menu"
        style={{
          position: 'fixed',
          top: 0,
          left: '25%',
          backgroundColor: '#333',
          color: 'white',
          padding: '10px',
          width: '50%',
          zIndex: 1000, // Ensures the menu stays on top
        }}
      >
        <button onClick={() => setActiveMenu('heatmap')}>Heatmap</button>
        <button onClick={() => setActiveMenu('login')}>Login</button>
      </div>
      <div
        className="content"
        style={{
          paddingTop: '50px', // Ensures content does not overlap menu
        }}
      >
        {activeMenu === 'heatmap' && <ChartsFromXYValuesComponent chartXYValues={undefined} />}
        {activeMenu === 'login' && <Login />}
      </div>
    </div>
  );
};
