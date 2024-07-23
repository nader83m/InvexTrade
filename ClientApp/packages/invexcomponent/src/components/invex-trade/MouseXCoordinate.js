import React from "react";
import { MouseCoordinateX } from "react-stockcharts/lib/coordinates";
import { timeFormat } from "d3-time-format";

export default function MouseXCoordinate(props) {
  return (
    <MouseCoordinateX
      at="bottom"
      orient="bottom"
      displayFormat={timeFormat("%d %B %H:%M")}
      rectWidth = {100}
    />
  );
}
