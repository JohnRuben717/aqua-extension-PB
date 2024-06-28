import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color'; // Importing the color picker
import ReactSlider from 'react-slider'; // Importing the range slider
import assessmentData1 from './assessment.json';
import assessmentData2 from './assessment2.json';

interface Result {
  id: number;
  assessment_id: number;
  vref: string;
  score: number;
  // other fields omitted for brevity
}

interface OrganizedData {
  [chapter: string]: {
    [verse: string]: Result;
  };
}

// Utility function to organize data from JSON files
const organizeData = (results: Result[]): OrganizedData => {
  const organizedData: OrganizedData = {};
  results.forEach((result) => {
    const [chapter, verse] = result.vref.split(':').map((part) => part.replace(/^\D+/g, ''));
    if (!organizedData[chapter]) {
      organizedData[chapter] = {};
    }
    organizedData[chapter][verse] = result;
  });
  return organizedData;
};

const Heatmap: React.FC = () => {
  const [data, setData] = useState<OrganizedData>({});
  const [selectedVref, setSelectedVref] = useState<string | null>(null);
  const [baseColor, setBaseColor] = useState<string>('#0000ff'); // Base color state
  const [colorPickerVisible, setColorPickerVisible] = useState<boolean>(false); // Color picker visibility state
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 1]); // Score range state

  useEffect(() => {
    const data1 = organizeData(assessmentData1.results);
    const data2 = organizeData(assessmentData2.results);

    // Merge data
    const mergedData: OrganizedData = { ...data1, ...data2 };

    setData(mergedData);
  }, []);

  // Function to adjust color based on the score
  const getColor = (score: number): string => {
    if (score < scoreRange[0] || score > scoreRange[1]) {
      return '#d3d3d3'; // Grey color for outliers
    }
    const value = Math.floor(score * 255);
    const color = baseColor.slice(1); // Remove the '#' from the color
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);
    return `rgb(${Math.floor(r * (1 - score))}, ${Math.floor(g * (1 - score))}, ${Math.floor(b * (1 - score))})`;
  };

  const chapters = Object.keys(data).sort((a, b) => +a - +b);
  const maxVerses = Math.max(...Object.values(data).map((verses) => Object.keys(verses).length));

  const handleBlockClick = (vref: string) => {
    setSelectedVref(vref);
  };

  const handleColorChange = (color: any) => {
    setBaseColor(color.hex);
    setColorPickerVisible(false); // Close color picker after selecting a color
  };

  const toggleColorPicker = () => {
    setColorPickerVisible(!colorPickerVisible);
  };

  const handleRangeChange = (values: number[]) => {
    setScoreRange([values[0], values[1]]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {selectedVref && (
        <div style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 'bold' }}>
          Selected Vref: {selectedVref}
        </div>
      )}
      <button
        onClick={toggleColorPicker}
        style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}
      >
        {colorPickerVisible ? '←' : 'Change Heatmap Color'}
      </button>
      {colorPickerVisible && (
        <div style={{ marginBottom: '20px' }}>
          <SketchPicker color={baseColor} onChangeComplete={handleColorChange} />
        </div>
      )}
      <div style={{ width: '80%', marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
          Score Range: {scoreRange[0]} - {scoreRange[1]}
        </div>
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="thumb"
          trackClassName="track"
          defaultValue={[0, 1]}
          min={0}
          max={1}
          step={0.01}
          onChange={handleRangeChange}
          value={scoreRange}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${maxVerses + 1}, 40px)`,
            gridTemplateRows: `repeat(${chapters.length + 1}, 40px)`,
            gap: '2px',
            maxWidth: '90vw',
            overflow: 'auto',
          }}
        >
          <div />
          {Array.from({ length: maxVerses }, (_, i) => (
            <div key={i + 1} style={{ textAlign: 'center', fontWeight: 'bold' }}>
              {i + 1}
            </div>
          ))}
          {chapters.map((chapter) => (
            <React.Fragment key={`chapter-fragment-${chapter}`}>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{chapter}</div>
              {Array.from({ length: maxVerses }, (_, i) => (
                <div
                  key={`chapter-${chapter}-verse-${i + 1}`}
                  title={`${chapter}:${i + 1}`}
                  onClick={() => {
                    const result = data[chapter]?.[i + 1];
                    if (result) {
                      handleBlockClick(result.vref);
                    }
                  }}
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor:
                      data[chapter] && data[chapter][i + 1]
                        ? getColor(data[chapter][i + 1].score)
                        : '#eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  {data[chapter] && data[chapter][i + 1]
                    ? data[chapter][i + 1].score.toFixed(2)
                    : ''}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
