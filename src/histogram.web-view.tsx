import React from 'react';
import './histogram.web-view.scss';
import Heatmap from './components/heatmap.component';

const HistogramWebView: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Heatmap />
      </header>
    </div>
  );
};

export default HistogramWebView;