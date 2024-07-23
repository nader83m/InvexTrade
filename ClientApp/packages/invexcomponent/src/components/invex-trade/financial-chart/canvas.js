import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import * as React from "react";
import {
    elderRay,
    ema,
    discontinuousTimeScaleProviderBuilder,
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
    withSize,
} from "react-financial-charts";
import { withUpdatingData } from "./withData";
import { withTrends } from "./withTrends";
import { basicCheck } from "../../../utils";
import {strategiesDefaults} from "../../../constants";
import {isMobileCheck, windowHeight} from "../../../mobileContext";

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

class StockChart extends React.Component {
    constructor(props) {
        super(props);
        const { data } = props;
        this.margin = { left: 0, right: !isMobileCheck ? 100: 75, top: 0, bottom: 24 };
        this.pricesDisplayFormat = format(".2f");
        this.xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
            (d) => d.time
        );
        const {
            data: linearData,
            xScale,
            xAccessor,
            displayXAccessor,
        } = this.indexCalculator(data);
        this.state = {
            ema26,
            ema12,
            linearData,
            data: linearData,
            xScale,
            xAccessor,
            displayXAccessor,
        };
    }

    // Still worthy
    indexCalculator(data, start = null) {
        let indexCalculator;
        let xScaleProvider;
        const calculatedData = elder(ema26(ema12(data)));
        if (!start) {
            indexCalculator = discontinuousTimeScaleProviderBuilder().indexCalculator();
        } else {
            indexCalculator = discontinuousTimeScaleProviderBuilder()
                .initialIndex(Math.ceil(start))
                .indexCalculator();
        }
        const { index } = indexCalculator(calculatedData);
        if (!start) {
            xScaleProvider = discontinuousTimeScaleProviderBuilder().withIndex(
                index
            );
        } else {
            xScaleProvider = discontinuousTimeScaleProviderBuilder()
                .initialIndex(Math.ceil(start))
                .withIndex(index);
        }
        return xScaleProvider(calculatedData);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
       // console.log("componentDidUpdateWithCanvas")
        const { data: currentData, start } = this.props;
        // Recalculate callback
        // Algorithm:
        // select 1 field from prev state
        // select the same field from current state
        // get diffrence of indexes then callback to HOC
        const cb = () => {
            const timeStamp = prevState.data?.[0].timastamp;
            const filtered1 =
                prevState.data?.filter((item) => {
                    return item.timastamp === timeStamp;
                }) || null;
            const filtered2 =
                this.state.data?.filter((item) => {
                    return item.timastamp === timeStamp;
                }) || null;
            if (filtered1 && filtered2) {
                const diff = filtered2[0].idx.index - filtered1[0].idx.index;
                if (this.props.recalculateTrends && diff !== 0) {
                    this.props.recalculateTrends(diff);
                }
            }
        };
        if (!basicCheck(prevProps.data, currentData)) {
            const {
                data: linearData,
                xScale,
                xAccessor,
                displayXAccessor,
            } = this.indexCalculator(currentData, start);
            this.setState(
                {
                    ema26,
                    ema12,
                    linearData,
                    data: linearData,
                    xScale,
                    xAccessor,
                    displayXAccessor,
                },
                cb
            );
        }
    }

    movingAverageOptionHelper({showEma12, showEma26}){
        const arr = []
        if(showEma26){
            arr.push(
                    {
                        yAccessor: ema26.accessor(),
                        type: "EMA",
                        stroke: ema26.stroke(),
                        windowSize: ema26.options().windowSize,
                    }
            )
        }
        if(showEma12){
            arr.push(
                    {
                        yAccessor: ema12.accessor(),
                        type: "EMA",
                        stroke: ema12.stroke(),
                        windowSize: ema12.options().windowSize,
                    }
            )
        }
        return arr
    }
    render() {
        const {
            dateTimeFormat = "%d %b %Y %H:%M",
            height,
            ratio,
            width,
            showingStrategies
        } = this.props;
        const { data, xScale, xAccessor, displayXAccessor } = this.state;
        // Disabled extend future
        // const max = xAccessor(data[data.length - 1]);
        // const min = xAccessor(data[Math.max(0, data.length - 100)]);
        // const xExtents = [min, max + 5];
        const showElder = showingStrategies.includes(strategiesDefaults.ELDER.name)
        const showEma12 = showingStrategies.includes(strategiesDefaults.EMA12.name)
        const showEma26 = showingStrategies.includes(strategiesDefaults.EMA26.name)
        const gridHeight = height - this.margin.top - this.margin.bottom;

        const elderRayHeight = showElder ? 100 : 0;
        const elderRayOrigin = (_, h) => [0, h - elderRayHeight];
        const barChartHeight = gridHeight / 4;
        const barChartOrigin = (_, h) => [
            0,
            h - barChartHeight - elderRayHeight,
        ];
        const chartHeight = gridHeight - elderRayHeight;

        const timeDisplayFormat = timeFormat(dateTimeFormat);

        return (
            <ChartCanvas
                height={height}
                ratio={ratio}
                width={width}
                margin={this.margin}
                data={data}
                displayXAccessor={displayXAccessor}
                seriesName="Data"
                xScale={xScale}
                xAccessor={xAccessor}
                // xExtents={xExtents}
                zoomAnchor={lastVisibleItemBasedZoomAnchor}
                onLoadBefore={this.props.onLoadMore}
            >
                <Chart
                    id={2}
                    height={barChartHeight}
                    origin={barChartOrigin}
                    yExtents={this.barChartExtents}
                >
                    <BarSeries
                        fillStyle={this.volumeColor}
                        yAccessor={this.volumeSeries}
                    />

                    { !showElder &&
                        <>
                            <XAxis showGridLines gridLinesStrokeStyle="#e0e3eb" />
                            <MouseCoordinateX displayFormat={timeDisplayFormat} />
                        </>
                    }

                </Chart>
                <Chart
                    id={3}
                    height={chartHeight}
                    yExtents={this.candleChartExtents}
                >
                    <XAxis
                        showGridLines
                        showTicks={false}
                        showTickLabel={false}
                    />
                    <YAxis
                        showGridLines
                        tickFormat={this.pricesDisplayFormat}
                    />
                    <CandlestickSeries />
                    {/* TrendLine logic*/}
                    {this.props.trendLineComponent?.()}
                    {showEma26 && <LineSeries
                        yAccessor={ema26.accessor()}
                        strokeStyle={ema26.stroke()}
                    />}
                    {showEma26 && <CurrentCoordinate
                        yAccessor={ema26.accessor()}
                        fillStyle={ema26.stroke()}
                    />}
                    {showEma12 && <LineSeries
                        yAccessor={ema12.accessor()}
                        strokeStyle={ema12.stroke()}
                    />}
                    {showEma12 && <CurrentCoordinate
                        yAccessor={ema12.accessor()}
                        fillStyle={ema12.stroke()}
                    />}
                    <MouseCoordinateY
                        rectWidth={this.margin.right}
                        displayFormat={this.pricesDisplayFormat}
                    />
                    <EdgeIndicator
                        itemType="last"
                        rectWidth={this.margin.right}
                        fill={this.openCloseColor}
                        lineStroke={this.openCloseColor}
                        displayFormat={this.pricesDisplayFormat}
                        yAccessor={this.yEdgeIndicator}
                    />
                    {/*EMA*/}
                    <MovingAverageTooltip
                        origin={[8, 24]}
                        options={this.movingAverageOptionHelper({showEma12, showEma26})}
                    />

                    <ZoomButtons />
                    <OHLCTooltip origin={[8, 16]} />
                </Chart>
                {showElder && <Chart
                    id={4}
                    height={elderRayHeight}
                    yExtents={[0, elder.accessor()]}
                    origin={elderRayOrigin}
                    padding={{ top: 8, bottom: 8 }}
                >
                    <XAxis showGridLines gridLinesStrokeStyle="#e0e3eb" />
                    <YAxis ticks={4} tickFormat={this.pricesDisplayFormat} />

                    <MouseCoordinateX displayFormat={timeDisplayFormat} />
                    <MouseCoordinateY
                        rectWidth={this.margin.right}
                        displayFormat={this.pricesDisplayFormat}
                    />

                    <ElderRaySeries yAccessor={elder.accessor()} />

                    <SingleValueTooltip
                        yAccessor={elder.accessor()}
                        yLabel="Elder Ray"
                        yDisplayFormat={(d) =>
                            `${this.pricesDisplayFormat(
                                d.bullPower
                            )}, ${this.pricesDisplayFormat(d.bearPower)}`
                        }
                        origin={[8, 16]}
                    />
                </Chart>}
                <CrossHairCursor />
            </ChartCanvas>
        );
    }

    barChartExtents(data) {
        return data.volume;
    }

    candleChartExtents(data) {
        return [data.high, data.low];
    }

    yEdgeIndicator(data) {
        return data.close;
    }

    volumeColor(data) {
        return data.close > data.open
            ? "rgba(38, 166, 154, 0.3)"
            : "rgba(239, 83, 80, 0.3)";
    }

    volumeSeries(data) {
        return data.volume;
    }

    openCloseColor(data) {
        return data.close > data.open ? "#26a69a" : "#ef5350";
    }
}

export default withUpdatingData()(
    withSize({ style: { minHeight: !isMobileCheck ? 520 : windowHeight - 270 } })(
        withDeviceRatio()(withTrends()(StockChart))
    )
);
