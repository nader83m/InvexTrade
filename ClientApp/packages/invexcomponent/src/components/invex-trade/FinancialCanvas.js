import React from "react";
import ReactDOM from "react-dom";
import { format } from "d3-format";
import { scaleTime } from "d3-scale";
import { timeFormat } from "d3-time-format";
import {
  elderRay,
  ema,
  discontinuousTimeScaleProvider,
  Chart,
  ChartCanvas,
  CurrentCoordinate,
  BarSeries,
  CandlestickSeries,
  ElderRaySeries,
  LineSeries,
  MovingAverageTooltip,
  OHLCTooltip,
  SingleValueTooltip,
  lastVisibleItemBasedZoomAnchor,
  XAxis,
  YAxis,
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY,
  ZoomButtons,
  withDeviceRatio,
  withSize
} from "react-financial-charts";
import FinancialChart from './FinancialChart';


const FinancialCanvas = (props) => {
  const { onLoadBefore = () => {}, width, height, data = []} = props

  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
          (d) => d.time
      );
  const { xScale, xAccessor, displayXAccessor } = xScaleProvider(data);

  const margin = { left: 0, right: 70, top: 10, bottom: 0 };

  const ema12 = ema()
    .id(1)
    .options({ windowSize: 12 })
    .merge((d, c) => {
      d.ema12 = c;
    })
    .accessor((d) => d.ema12);

  const ema26 = ema()
    .id(2)
    .options({ windowSize: 26 })
    .merge((d, c) => {
      d.ema26 = c;
    })
    .accessor((d) => d.ema26);

  const elder = elderRay();

  //const calculatedData = elder(ema26(ema12(initialData)));


    /*
      const indexCalculator = discontinuousTimeScaleProviderBuilder()
            .initialIndex(startRef.current)
            .indexCalculator();

        const { index } = indexCalculator(newArr);

        const xScaleProvider = discontinuousTimeScaleProviderBuilder()
            .initialIndex(startRef.current)
            .withIndex(index);
    */

//   const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
//     initialData
//   );

  
  const pricesDisplayFormat = format(".2f");
  const max = xAccessor(data[data.length - 1]);
  const min = xAccessor(data[Math.max(0, data.length - 100)]);
  const xExtents = [min, max + 5];

  const gridHeight = height - margin.top - margin.bottom;

  // TODO calculate elder
  const elderRayHeight = 20;
  const elderRayOrigin = (_, h) => [0, h - elderRayHeight];
  const barChartHeight = gridHeight / 4;
  const barChartOrigin = (_, h) => [0, h - barChartHeight - elderRayHeight];
  const chartHeight = gridHeight - elderRayHeight;
  const yExtents = (data) => {
    return [data.high, data.low];
  };
  const dateTimeFormat = "%d %b %H:%M %p";
  const timeDisplayFormat = timeFormat(dateTimeFormat);

  const barChartExtents = (data) => {
    return data.volume;
  };

  const candleChartExtents = (data) => {
    return [data.high, data.low];
  };

  const yEdgeIndicator = (data) => {
    return data.close;
  };

  const volumeColor = (data) => {
    return data.close > data.open
      ? "rgba(38, 166, 154, 0.3)"
      : "rgba(239, 83, 80, 0.3)";
  };

  const volumeSeries = (data) => {
    return data.volume;
  };

  const openCloseColor = (data) => {
    return data.close > data.open ? "#26a69a" : "#ef5350";
  };

  return (
    <ChartCanvas
      height={height}
      ratio={2}
      width={width}
      margin={margin}
      data={data}
      displayXAccessor={displayXAccessor}
      seriesName="Data"
      xScale={xScale}
      xAccessor={xAccessor}
      xExtents={xExtents}
      zoomAnchor={lastVisibleItemBasedZoomAnchor}
      onLoadBefore = {onLoadBefore}
    >
      <Chart
        id={1}
        height={barChartHeight}
        origin={barChartOrigin}
        yExtents={barChartExtents}
      >
        <BarSeries fillStyle={volumeColor} yAccessor={volumeSeries} />
      </Chart>
      <Chart id={2} height={chartHeight} yExtents={candleChartExtents}>
        <CandlestickSeries />
        <XAxis displayFormat={timeDisplayFormat} showGridLines gridLinesStrokeStyle="#e0e3eb" />
        <YAxis showGridLines tickFormat={pricesDisplayFormat} />
        <LineSeries yAccessor={ema26.accessor()} strokeStyle={ema26.stroke()} /> */
         <CurrentCoordinate
          yAccessor={ema26.accessor()}
          fillStyle={ema26.stroke()}
        />
        <LineSeries yAccessor={ema12.accessor()} strokeStyle={ema12.stroke()} />
        <CurrentCoordinate
          yAccessor={ema12.accessor()}
          fillStyle={ema12.stroke()}
        />
        <MouseCoordinateY
          rectWidth={margin.right}
          displayFormat={pricesDisplayFormat}
        />
         <EdgeIndicator
          itemType="last"
          rectWidth={margin.right}
          fill={openCloseColor}
          lineStroke={openCloseColor}
          displayFormat={pricesDisplayFormat}
          yAccessor={yEdgeIndicator}
        />
        <MouseCoordinateX displayFormat={timeDisplayFormat} />
        {/* <MovingAverageTooltip
          origin={[8, 24]}
           options={[
             {
               yAccessor: ema26.accessor(),
               type: "EMA",
               stroke: ema26.stroke(),
               windowSize: ema26.options().windowSize
             },
             {
               yAccessor: ema12.accessor(),
               type: "EMA",
               stroke: ema12.stroke(),
               windowSize: ema12.options().windowSize
             }
           ]}
       /> */}

        <ZoomButtons />
        <OHLCTooltip origin={[8, 16]} />
      </Chart>
      {/* <Chart
        id={4}
        height={elderRayHeight}
        yExtents={[0, elder.accessor()]}
        origin={elderRayOrigin}
        padding={{ top: 8, bottom: 8 }}
      >
        <XAxis showGridLines gridLinesStrokeStyle="#e0e3eb" />
        <YAxis ticks={4} tickFormat={pricesDisplayFormat} />

        
        <MouseCoordinateY
          rectWidth={margin.right}
          displayFormat={pricesDisplayFormat}
        />

        <ElderRaySeries yAccessor={elder.accessor()} />

        <SingleValueTooltip
          yAccessor={elder.accessor()}
          yLabel="Elder Ray"
          yDisplayFormat={(d) =>
            `${pricesDisplayFormat(d.bullPower)}, ${pricesDisplayFormat(
              d.bearPower
            )}`
          }
          origin={[8, 16]}
        />
      </Chart> */}
      <CrossHairCursor />
    </ChartCanvas>
  );
};


//export default FinancialChart(withSize({ style: { minHeight: 500 } })(withDeviceRatio()(FinancialCanvas)))
export default function(){}