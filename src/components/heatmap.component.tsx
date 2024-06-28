import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const data1 = organizeData(assessmentData1.results);
    const data2 = organizeData(assessmentData2.results);

    // Merge data
    const mergedData: OrganizedData = { ...data1, ...data2 };

    setData(mergedData);
  }, []);

  const getColor = (score: number): string => {
    const value = Math.floor(score * 255);
    return `rgb(${255 - value}, ${255 - value}, ${value})`; // blue-ish color for heatmap
  };

  const chapters = Object.keys(data).sort((a, b) => +a - +b);
  const maxVerses = Math.max(...Object.values(data).map((verses) => Object.keys(verses).length));

  const handleBlockClick = (vref: string) => {
    setSelectedVref(vref);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {selectedVref && (
        <div style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 'bold' }}>
          Selected Vref: {selectedVref}
        </div>
      )}
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
