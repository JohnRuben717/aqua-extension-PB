import React, { useEffect, useState } from 'react';

interface Result {
  id: number;
  assessment_id: number;
  vref: string;
  score: number;
  // other fields omitted for brevity
}

function HeatmapComponent() {
  const [data, setData] = useState<{ [chapter: string]: { [verse: string]: Result } }>({});

  useEffect(() => {
    const storedData = localStorage.getItem('assessmentData');
    if (storedData) {
      const parsedData: { results: Result[] } = JSON.parse(storedData);
      const organizedData: { [chapter: string]: { [verse: string]: Result } } = {};

      parsedData.results.forEach(result => {
        const [chapter, verse] = result.vref.split(':').map(part => part.replace(/^\D+/g, ''));
        if (!organizedData[chapter]) {
          organizedData[chapter] = {};
        }
        organizedData[chapter][verse] = result;
      });

      setData(organizedData);
    }
  }, []);

  const getColor = (score: number) => {
    const value = Math.floor(score * 255);
    return `rgb(${255 - value}, ${255 - value}, ${value})`; // blue-ish color for heatmap
  };

  const chapters = Object.keys(data).sort((a, b) => parseInt(a) - parseInt(b));
  const maxVerses = Math.max(
    ...Object.values(data).map(verses => Object.keys(verses).length)
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${maxVerses + 1}, 40px)`, gap: '2px', maxWidth: '90vw', overflow: 'auto' }}>
        {Array.from({ length: maxVerses }, (_, i) => (
          <div key={i} style={{ textAlign: 'center', fontWeight: 'bold' }}>{i + 1}</div>
        ))}
        {chapters.map(chapter => (
          <React.Fragment key={`chapter-fragment-${chapter}`}>
            <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{chapter}</div>
            {Array.from({ length: maxVerses }, (_, i) => (
              <div
                key={`chapter-${chapter}-verse-${i + 1}`}
                title={`${chapter}:${i + 1}`}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: data[chapter][i + 1] !== undefined ? getColor(data[chapter][i + 1].score) : '#eee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '12px',
                }}
              >
                {data[chapter][i + 1] !== undefined ? data[chapter][i + 1].score.toFixed(2) : ''}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default HeatmapComponent;
