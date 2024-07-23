import React from "react";
import { Chart } from "react-stockcharts";
import { format } from "d3-format";
import { YAxis } from "react-stockcharts/lib/axes";
import { MouseCoordinateY } from "react-stockcharts/lib/coordinates";
import { BarSeries } from "react-stockcharts/lib/series";
import MouseXCoordinate from "./MouseXCoordinate";
// İşlem hacmi grafiği
export default function VolumeChart(props) {
  return (
    <Chart
      id={2}
      height={150}
      yExtents={(d) => d.volume - 150}
      origin={(w, h) => [0, h - 150]}
    >
      <YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".0s")} />
      {MouseXCoordinate()}
      <MouseCoordinateY at="left" orient="left" displayFormat={format(".4s")} />
      <BarSeries
        yAccessor={(d) => d.volume}
        fill={(d) =>
          d.close > d.open ? "rgba(107, 165, 131, 0.3)" : "rgba(255, 0, 0, 0.3)"
        }
      />
    </Chart>
  );
}
