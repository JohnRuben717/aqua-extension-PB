import React, { useContext, useState } from 'react';
import { ChartsFromXYValuesComponent } from './charts.xyvalues.component';
import { AquaMode, AquaState, AquaStateManager } from './aqua.statemanager';
import { CurrentVerseContext } from './currentverse.context';
import { Canon } from '@sillsdev/scripture';
import { HeatmapAscendingXYValues } from './chart.xyvalues';
import { ChakraProvider, Button, Card, CardHeader, CardBody, CardFooter, Text } from '@chakra-ui/react';

type Visualization = {
  header?: JSX.Element,
  body: JSX.Element,
  footer?: JSX.Element,
};

export function AquaAppComponent() {
  const verseRef = useContext(CurrentVerseContext);

  const [aquaState, setAquaState] = useState(verseRef.length > 0
    ? { mode: AquaMode.VerseResultsForBookChapters, statePosition: { bookNum: AquaStateManager.bookNumFromVerseRef(verseRef) }, verseRef: verseRef } as AquaState
    : { mode: AquaMode.ChapterResultsForBooks, statePosition: {}, verseRef } as AquaState
  );

  const setState = (state: {}) => {
    setAquaState(state as AquaState);
  };
  const aquaStateManager = new AquaStateManager(aquaState, setState, verseRef);

  const chartsVisualization = {
    header: undefined,
    body: (
      <ChartsFromXYValuesComponent
        chartXYValues={new HeatmapAscendingXYValues()}
        initialSliderPositionsStdDeviationMultiple={4}
        tooltipFormatter={({ series, seriesIndex, dataPointIndex, w }) => {
          const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
          return `<div class="arrow_box">
            <div class="verse"><span>${data.originalDatum?.vref}</span></div>
          </div>`;
        }}
      />
    ),
  };
  

  const parallelTextVisualization = {
    header: undefined,
    body: (
      <Text fontSize="2xl">
        {/* Here you would use the DisplayFromTokensTextRowsComponent when necessary */}
      </Text>
    ),
    footer: undefined,
  };

  let visualization: Visualization;
  if (aquaState.mode !== AquaMode.VerseDetails) {
    visualization = chartsVisualization;
  } else {
    visualization = parallelTextVisualization;
  }

  return (
    <ChakraProvider>
      <Card>
        <Text fontSize="3xl">
          {`${aquaState.statePosition.bookNum ? Canon.bookNumberToEnglishName(aquaState.statePosition.bookNum) : ''} 
          ${aquaState.statePosition.chapterNum ? aquaState.statePosition.chapterNum : ''}${aquaState.statePosition.verseNum ? `:${aquaState.statePosition.verseNum}` : ''}`}
          />
      </Card>
      <Card>
        <CardHeader>
          {aquaState.mode !== AquaMode.ChapterResultsForBooks && (
            <Button onClick={() => aquaStateManager.setPriorState()}>Zoom out</Button>
          )}
        </CardHeader>
        <CardBody>
          {visualization.body}
        </CardBody>
        <CardFooter>
          <Text fontSize="sm">(c) Biblica</Text>
        </CardFooter>
      </Card>
    </ChakraProvider>
  );
}