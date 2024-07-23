import React from "react";
import { Chart } from "react-stockcharts";
import { format } from "d3-format";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { MouseCoordinateY } from "react-stockcharts/lib/coordinates";
import { CandlestickSeries } from "react-stockcharts/lib/series";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip"; // sol üstteki label alan
import MouseXCoordinate from "./MouseXCoordinate";
import {
    TrendLine,
    FibonacciRetracement,
} from "react-stockcharts/lib/interactive";

export default function CandleStickChart(props) {
    const {
        gridVisibility,
        margin,
        width,
        height,
        trendLines = [],
        updateTrendLines = () => {},
        interactiveTrendLineStates = {},
        interactiveRayLineStates = {},
        interactiveXLineStates = {},
        interactiveFibonacciStates = {},
    } = props;
    const xGrid = gridVisibility
        ? {
              innerTickSize:
                  -1 * (height - margin.top || 0 - margin.bottom || 0),
              tickStrokeDasharray: "Solid",
              tickStrokeOpacity: 0.2,
              tickStrokeWidth: 1,
          }
        : {};

    const yGrid = gridVisibility
        ? {
              innerTickSize:
                  -1 * (width - margin.left || 0 - margin.right || 0),
              tickStrokeDasharray: "Solid",
              tickStrokeOpacity: 0.2,
              tickStrokeWidth: 1,
          }
        : {};

    return (
        <Chart id={1} yExtents={(d) => [d.high, d.low]}>
            <XAxis axisAt="bottom" orient="bottom" ticks={6} {...xGrid} />
            <YAxis axisAt="right" orient="right" ticks={5} {...yGrid} />
            {MouseXCoordinate()}
            <MouseCoordinateY
                at="right"
                orient="right"
                displayFormat={format(",.0f")}
                rectWidth={80}
            />
            <OHLCTooltip forChart={1} origin={[-40, 0]} />
            <CandlestickSeries 
                stroke={d => d.close > d.open ? "#089981" : "#f00"}
                wickStroke={d => d.close > d.open ? "#089981" : "#f00"}
                fill={d => d.close > d.open ? "#089981" : "#f00"}
            />
            {Object.keys(trendLines)?.length > 0
                ? Object.keys(trendLines)?.map((item) => {
                      return (
                          <TrendLine
                              key={item}
                              enabled={false}
                              type="LINE"
                              snap={false}
                              snapTo={(d) => [d.high, d.low]}
                              trends={trendLines[item]}
                              onComplete={(trends) =>
                                  updateTrendLines(item, trends)
                              }
                          />
                      );
                  })
                : null}
            <TrendLine
                enabled={interactiveTrendLineStates.enable}
                type="LINE"
                snap={false}
                snapTo={(d) => [d.high, d.low]}
                trends={interactiveTrendLineStates.trends}
                onComplete={interactiveTrendLineStates.onComplete}
            />

            <TrendLine
                enabled={interactiveRayLineStates.enable}
                type="RAY"
                snap={false}
                snapTo={(d) => [d.high, d.low]}
                trends={interactiveRayLineStates.trends}
                onComplete={interactiveRayLineStates.onComplete}
            />

            <TrendLine
                enabled={interactiveXLineStates.enable}
                type="XLINE"
                snap={false}
                snapTo={(d) => [d.high, d.low]}
                trends={interactiveXLineStates.trends}
                onComplete={interactiveXLineStates.onComplete}
            />
            <FibonacciRetracement
                enabled={interactiveFibonacciStates.enable}
                retracements={interactiveFibonacciStates.retracements}
                onComplete={interactiveFibonacciStates.onComplete}
            />
        </Chart>
    );
}
