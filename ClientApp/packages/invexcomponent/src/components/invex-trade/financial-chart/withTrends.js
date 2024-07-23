// Indicator and drawing line logic
import React from "react";
import { connect } from "react-redux";
import { TrendLine, FibonacciRetracement } from "react-financial-charts";
import Modal from "../modal-chart";
import {indicatorDefaults, strategiesDefaults} from "../../../../src/constants";
import {
    getPriceChannelFromApi,
    getRisingFallingTrendFromApi,
    convertIsoDate,
    getSupportResistanceFromApi,
    basicCheck, getTriangleTrendLineFromApi,
} from "../../../utils";

export function withTrends() {
    return (OriginalComponent) => {
        const myClass = class WithTrends extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    modalStates: { show: false, msg: "", isLoadingIco: false },
                    drawedTrendLines: { lines: [], enabled: false },
                    drawedRayLines: { lines: [], enabled: false },
                    drawedXLines: { lines: [], enabled: false },
                    drawedFibos: { lines: [], enabled: false },
                    indicators: {},
                    showingStrategies: []
                };
                this.lastSelected = null;
                this.onKeyPress = this.onKeyPress.bind(this);
                this.modalClickHandler = this.modalClickHandler.bind(this);
                this.recalculateTrends = this.recalculateTrends.bind(this);
                this.calculateTrendFormationPosition = this.calculateTrendFormationPosition.bind(
                    this
                );
                this.childRef = React.createRef(null);
            }
            componentDidMount() {
                document.addEventListener("keyup", this.onKeyPress);
            }

            componentDidUpdate(prevProps, prevState, snapshot) {
                //console.log("componentDidUpdateWithTrends");
                const {
                    selectedTools,
                    indicator,
                    enfSettings,
                    data,
                    strategie
                } = this.props;
                const {
                    selectedTools: oldSelectedTools,
                    indicator: oldIndicator,
                    enfSettings: oldEnfSettings,
                    data: oldData,
                    strategie: oldStrategie
                } = prevProps;
                const {
                    drawedTrendLines,
                    drawedRayLines,
                    drawedXLines,
                    drawedFibos,
                } = this.state;
                // Tools selected
                if (oldSelectedTools !== selectedTools) {
                    switch (selectedTools) {
                        case "LINE":
                            this.setState(
                                {
                                    drawedTrendLines: {
                                        ...drawedTrendLines,
                                        enabled: true,
                                    },
                                },
                                this.lostFocusAllLines
                            );
                            break;
                        case "XLINE":
                            this.setState(
                                {
                                    drawedXLines: {
                                        ...drawedXLines,
                                        enabled: true,
                                    },
                                },
                                this.lostFocusAllLines
                            );

                            break;
                        case "FIBO":
                            this.setState(
                                {
                                    drawedFibos: {
                                        ...drawedFibos,
                                        enabled: true,
                                    },
                                },
                                this.lostFocusAllLines
                            );

                            break;
                        case "RAY":
                            this.setState(
                                {
                                    drawedRayLines: {
                                        ...drawedRayLines,
                                        enabled: true,
                                    },
                                },
                                this.lostFocusAllLines
                            );
                            break;
                        case "REMOVELAST":
                            this.deleteLastTrend({
                                drawedTrendLines,
                                drawedRayLines,
                                drawedXLines,
                                drawedFibos,
                            })
                            break;
                        case "CLEAN":
                            this.setState({
                                drawedTrendLines: { lines: [], enabled: false },
                                drawedRayLines: { lines: [], enabled: false },
                                drawedXLines: { lines: [], enabled: false },
                                drawedFibos: { lines: [], enabled: false },
                            });
                            break;
                        default:
                            break;
                    }
                }
                // Indicator Selected
                if (oldIndicator !== indicator) {
                    switch (indicator) {
                        case indicatorDefaults.PRICE.name:
                            this.indicatorFunction(
                                getPriceChannelFromApi,
                                indicatorDefaults.PRICE.name
                            );
                            break;
                        case indicatorDefaults.RISINGFALLING.name:
                            this.indicatorFunction(
                                getRisingFallingTrendFromApi,
                                indicatorDefaults.RISINGFALLING.name
                            );
                            break;
                        case indicatorDefaults.SUPPORT.name:
                            this.getSupportResistance();
                            break;
                        case indicatorDefaults.TRIANGLE.name:
                            this.getTriangleTrendLine();
                            break;
                        case "CLEAN":
                            this.setState({ indicators: {} });
                            break;
                        default:
                            break;
                    }
                }
                // Strategie Selected
                if(oldStrategie !== strategie){
                    const {showingStrategies} = this.state;
                    switch (strategie){
                        case strategiesDefaults.ELDER.name:
                        case strategiesDefaults.EMA26.name:
                        case strategiesDefaults.EMA12.name:
                            const newArr = this.strategiesStateHelper(strategie, showingStrategies);
                            this.setState({showingStrategies : newArr})
                            break;
                    }
                }
                // Enf settings changed
                if (!basicCheck(oldEnfSettings, enfSettings)) {
                    this.changeEnfSettings();
                }
                // Data changed recalculate all trends.. :)
                // if(oldData && data && oldData.length !== data.length){
                //     // Child data not updated yet so we are waiting a little bit
                //     const prevDat = this.childRef.current.state.data
                //     setTimeout(()=>{
                //         const currData =  this.childRef.current.state.data
                //         this.reCalculateAllTrendsAndFormations(prevDat, currData)
                //     }, 50)
                // }
            }

            componentWillUnmount() {
                document.removeEventListener("keyup", this.onKeyPress);
            }

            strategiesStateHelper(selectedStrategie, strategiesArray){
                const clone = [...strategiesArray]
                if(!clone.includes(selectedStrategie)){
                    clone.push(selectedStrategie)
                }else {
                    const index = clone.indexOf(selectedStrategie);
                    if (index > -1) {
                        clone.splice(index, 1);
                    }
                }
                return clone
            }

            async indicatorFunction(apiRequest, indicatorName) {
                const { data, selectedInterval, selectedCoin } = this.props;
                const firstDate = new Date(data[0]["time"]);
                const lastDate = new Date(data[data.length - 1]["time"]);
                this.setState({
                    modalStates: { isLoadingIco: true, show: true },
                });
                const channelRequest = await apiRequest(
                    convertIsoDate(firstDate),
                    convertIsoDate(lastDate),
                    Object.keys(selectedInterval)[0],
                    selectedCoin
                );
                this.setState({
                    modalStates: { isLoadingIco: false, show: false },
                });

                if (!channelRequest.ok) return;
                const channels = channelRequest.data;
                if (channels.success === true) {
                    if (channels) {
                        this.calculateTrendFormationPosition(
                            channels,
                            indicatorName
                        );
                    }
                } else {
                    this.setState({
                        modalStates: {
                            show: true,
                            msg: channels.msg,
                            isLoadingIco: false,
                        },
                    });
                }
            }
            calculateTrendFormationPosition(channels, formation = "") {
                if (!channels) return;
                const { xAccessor, data } = this.childRef?.current?.state;
                const { indicators } = this.state;
                const { enfSettings } = this.props;
                const x1Min = data.filter((a) => {
                    const arrayDate = new Date(a.time);
                    const x1Min_date = new Date(+channels.x1_min);
                    return arrayDate.getTime() === x1Min_date.getTime();
                })[0];
                const x2Min = data.filter((a) => {
                    const arrayDate = new Date(a.time);
                    const x1Min_date = new Date(+channels.x2_min);
                    return arrayDate.getTime() === x1Min_date.getTime();
                })[0];
                const x1Max = data.filter((a) => {
                    const arrayDate = new Date(a.time);
                    const x1Min_date = new Date(+channels.x1_max);
                    return arrayDate.getTime() === x1Min_date.getTime();
                })[0];
                const x2Max = data.filter((a) => {
                    const arrayDate = new Date(a.time);
                    const x1Min_date = new Date(+channels.x2_max);
                    return arrayDate.getTime() === x1Min_date.getTime();
                })[0];
                this.setState({
                    indicators: {
                        ...indicators,
                        [formation]: [
                            {
                                start: [xAccessor(x1Min), channels.y1_min],
                                end: [xAccessor(x2Min), channels.y2_min],
                                type: "LINE",
                                channels,
                                colorType: "color2",
                                appearance: {
                                    strokeStyle:
                                        enfSettings[formation]?.color2 || "red",
                                    strokeWidth:
                                        enfSettings[formation]?.stroke || 5,
                                },
                            },
                            {
                                start: [xAccessor(x1Max), channels.y1_max],
                                end: [xAccessor(x2Max), channels.y2_max],
                                type: "LINE",
                                channels,
                                colorType: "color1",
                                appearance: {
                                    strokeStyle:
                                        enfSettings[formation]?.color1 ||
                                        "green",
                                    strokeWidth:
                                        enfSettings[formation]?.stroke || 5,
                                },
                            },
                        ],
                    },
                });
            }

            async getSupportResistance() {
                const { data, selectedInterval, selectedCoin } = this.props;
                this.setState({
                    modalStates: { isLoadingIco: true, show: true },
                });
                const firstDate = new Date(data[0]["time"]);
                const lastDate = new Date(data[data.length - 1]["time"]);

                const supportRequest = await getSupportResistanceFromApi(
                    convertIsoDate(firstDate),
                    convertIsoDate(lastDate),
                    Object.keys(selectedInterval)[0],
                    selectedCoin
                );
                this.setState({
                    modalStates: { isLoadingIco: false, show: false },
                });
                if (!supportRequest.ok) return;
                const supportPoints = supportRequest.data;
                this.calculateSupportResistance(supportPoints);
            }

            calculateSupportResistance(points) {
                const reCalculateArr = [];
                if (!points) return;
                const { xAccessor, data } = this.childRef?.current?.state;
                const { enfSettings } = this.props;
                const { indicators } = this.state;

                const lines = points.map((item) => {
                    const _date = new Date(+item.timastamp);
                    const y = item.price;
                    const x1 = data.filter((a) => {
                        const arrayDate = new Date(a.time);
                        return _date.getTime() === arrayDate.getTime();
                    })[0];
                    const x2 = data[data.length - 1];
                    reCalculateArr.push({
                        price: item.price,
                        timastamp: item.timastamp,
                        type: item.type,
                    });
                    return { x1, x2, y, type: item.type };
                });

                const getColor = (item) => {
                    if (item.type === "resistance")
                        return (
                            enfSettings[indicatorDefaults.SUPPORT.name]
                                ?.color1 || "blue"
                        );
                    else
                        return (
                            enfSettings[indicatorDefaults.SUPPORT.name]
                                ?.color2 || "purple"
                        );
                };
                this.setState({
                    indicators: {
                        ...indicators,
                        [indicatorDefaults.SUPPORT.name]: lines.map((el) => ({
                            start: [xAccessor(el.x1), el.y],
                            end: [xAccessor(el.x2), el.y],
                            appearance: {
                                strokeStyle: getColor(el),
                                strokeWidth:
                                    enfSettings[indicatorDefaults.SUPPORT.name]
                                        ?.stroke || 5,
                            },
                            type: "LINE",
                            lines: reCalculateArr,
                            colorType:
                                el.type === "resistance" ? "color1" : "color2",
                        })),
                    },
                });
            }

            calculateTriangleTrendLines(response){
                const reCalculateArr = [];
                const points = response?.lines;
                if (!points) return;
                const { xAccessor, data } = this.childRef?.current?.state;
                const { enfSettings } = this.props;
                const { indicators } = this.state;

                const lines = points.map((item) => {
                    const _date1 = new Date(+item.x1);
                    const _date2 = new Date(+item.x2);
                    const y1 = item.y1;
                    const y2 = item.y2;
                    const x1 = data.filter((a) => {
                        const arrayDate = new Date(a.time);
                        return _date1.getTime() === arrayDate.getTime();
                    })[0];
                    const x2 = data.filter((a) => {
                        const arrayDate = new Date(a.time);
                        return _date2.getTime() === arrayDate.getTime();
                    })[0];
                    reCalculateArr.push({ x1, x2, y1, y2, type: item.type });
                    return { x1, x2, y1, y2, type: item.type };
                });

                const getColor = (item) => {
                    if (item.type === "max")
                        return (
                            enfSettings[indicatorDefaults.TRIANGLE.name]
                                ?.color1 || "blue"
                        );
                    else
                        return (
                            enfSettings[indicatorDefaults.TRIANGLE.name]
                                ?.color2 || "purple"
                        );
                };

                this.setState({
                    indicators: {
                        ...indicators,
                        [indicatorDefaults.TRIANGLE.name]: lines.map((el) => ({
                            start: [xAccessor(el.x1), el.y1],
                            end: [xAccessor(el.x2), el.y2],
                            appearance: {
                                strokeStyle: getColor(el),
                                strokeWidth:
                                    enfSettings[indicatorDefaults.TRIANGLE.name]
                                        ?.stroke || 5,
                            },
                            type: "LINE",
                            lines: reCalculateArr,
                            colorType:
                                el.type === "max" ? "color1" : "color2",
                        })),
                    },
                });
            }

            async getTriangleTrendLine() {
                const { data, selectedInterval, selectedCoin } = this.props;
                this.setState({
                    modalStates: { isLoadingIco: true, show: true },
                });
                const firstDate = new Date(data[0]["time"]);
                const lastDate = new Date(data[data.length - 1]["time"]);

                const triangleReq = await getTriangleTrendLineFromApi(
                    convertIsoDate(firstDate),
                    convertIsoDate(lastDate),
                    Object.keys(selectedInterval)[0],
                    selectedCoin
                );
                this.setState({
                    modalStates: { isLoadingIco: false, show: false },
                });
                if (!triangleReq.ok) return;
                const points = triangleReq.data;
                console.log("===== points:", points )
                if (points.success === true) {
                    if (points) {
                        this.calculateTriangleTrendLines(points)
                    }
                } else {
                    this.setState({
                        modalStates: {
                            show: true,
                            msg: points.msg,
                            isLoadingIco: false,
                        },
                    });
                }
                // this.calculateSupportResistance(points);
            }

            changeEnfSettings() {
                const newTrendLines = {};
                const { enfSettings } = this.props;
                const { indicators } = this.state;
                Object.keys(enfSettings).forEach((type) => {
                    const enfInfo = enfSettings[type];
                    const _trendLines =
                        indicators?.[type]?.map((item) => {
                            if (item.colorType === "color1") {
                                item.appearance = {
                                    ...item.appearance,
                                    strokeStyle: enfInfo.color1,
                                    strokeWidth: enfInfo.stroke,
                                };
                            } else {
                                item.appearance = {
                                    ...item.appearance,
                                    strokeStyle: enfInfo.color2,
                                    strokeWidth: enfInfo.stroke,
                                };
                            }
                            return item;
                        }) || [];
                    newTrendLines[type] = _trendLines;
                });
                this.setState({ indicators: newTrendLines });
            }

            reCalculateAllTrendsAndFormations(prev, curr) {
                // console.log("prev:", prev);
                // console.log("curr:", curr);
                // const {indicators} = this.state
                // this.calculateTrendFormationPosition(
                //     indicators?.[indicatorDefaults.PRICE.name]?.[0]?.['channels'], indicatorDefaults.PRICE.name
                // );
                // this.calculateTrendFormationPosition(
                //     indicators?.[indicatorDefaults.RISINGFALLING.name]?.[0]?.['channels'], indicatorDefaults.RISINGFALLING.name
                // );
                // this.calculateDrawedTrends()
            }

            calculateDrawedTrends() {}

            deleteLastTrend({
                                drawedTrendLines,
                                drawedRayLines,
                                drawedXLines,
                                drawedFibos,
                            }) {
                const trends_1 = drawedTrendLines.lines.filter(
                    (each) => !each.selected
                );
                const trends_2 = drawedRayLines.lines.filter(
                    (each) => !each.selected
                );
                const trends_3 = drawedXLines.lines.filter(
                    (each) => !each.selected
                );
                const trends_4 = drawedFibos.lines.filter(
                    (each) => !each.selected
                );
                this.setState({
                    drawedTrendLines: {
                        lines: trends_1,
                        enabled: false,
                    },
                    drawedRayLines: { lines: trends_2, enabled: false },
                    drawedXLines: { lines: trends_3, enabled: false },
                    drawedFibos: { lines: trends_4, enabled: false },
                });
            }

            onKeyPress(e) {
                const keyCode = e.which;
                const {
                    drawedTrendLines,
                    drawedRayLines,
                    drawedXLines,
                    drawedFibos,
                } = this.state;
                switch (keyCode) {
                    case 46: {
                        // DEL
                        this.deleteLastTrend({
                            drawedTrendLines,
                            drawedRayLines,
                            drawedXLines,
                            drawedFibos,
                        })
                        break;
                    }
                    case 27: {
                        // ESC
                        this.lostFocusAllLines();
                        break;
                    }
                    case 68: // D - Draw trendline
                    case 69: {
                        // E - Enable trendline
                        const selected = this.state[this.lastSelected];
                        this.setState({
                            [this.lastSelected]: { ...selected, enabled: true },
                        });
                        break;
                    }
                    default:
                        break;
                }
            }

            lostFocusAllLines() {
                const {
                    drawedTrendLines,
                    drawedRayLines,
                    drawedXLines,
                    drawedFibos,
                } = this.state;

                const newDrawedLines = drawedTrendLines.lines.map((line) => {
                    line["selected"] = false;
                    return line;
                });
                if (newDrawedLines.length > 0)
                    this.setState({
                        drawedTrendLines: {
                            ...drawedTrendLines,
                            lines: newDrawedLines,
                        },
                    });

                const newdrawedRayLines = drawedRayLines.lines.map((line) => {
                    line["selected"] = false;
                    return line;
                });
                if (newdrawedRayLines.length > 0)
                    this.setState({
                        drawedRayLines: {
                            ...drawedRayLines,
                            lines: newdrawedRayLines,
                        },
                    });

                const newdrawedXLines = drawedXLines.lines.map((line) => {
                    line["selected"] = false;
                    return line;
                });
                if (newdrawedXLines.length > 0)
                    this.setState({
                        drawedXLines: {
                            ...drawedXLines,
                            lines: newdrawedXLines,
                        },
                    });

                const newdrawedFibos = drawedFibos.lines.map((line) => {
                    line["selected"] = false;
                    return line;
                });
                if (newdrawedFibos.length > 0)
                    this.setState({
                        drawedFibos: { ...drawedFibos, lines: newdrawedFibos },
                    });
            }

            trendLineComponents() {
                const {
                    drawedTrendLines,
                    drawedRayLines,
                    drawedXLines,
                    drawedFibos,
                } = this.state;

                return [
                    <TrendLine
                        enabled={drawedTrendLines.enabled}
                        type="LINE"
                        snap={false}
                        snapTo={(d) => [d.high, d.low]}
                        trends={drawedTrendLines.lines}
                        onComplete={(e, newLines) => {
                            this.setState({
                                drawedTrendLines: {
                                    lines: newLines,
                                    enabled: false,
                                },
                            });
                            this.lastSelected = "drawedTrendLines";
                        }}
                    />,
                    <TrendLine
                        enabled={drawedRayLines.enabled}
                        type="RAY"
                        snap={false}
                        snapTo={(d) => [d.high, d.low]}
                        trends={drawedRayLines.lines}
                        onComplete={(e, newLines) => {
                            this.setState({
                                drawedRayLines: {
                                    lines: newLines,
                                    enabled: false,
                                },
                            });
                            this.lastSelected = "drawedRayLines";
                        }}
                    />,
                    <TrendLine
                        enabled={drawedXLines.enabled}
                        type="XLINE"
                        snap={false}
                        snapTo={(d) => [d.high, d.low]}
                        trends={drawedXLines.lines}
                        onComplete={(e, newLines) => {
                            this.setState({
                                drawedXLines: {
                                    lines: newLines,
                                    enabled: false,
                                },
                            });
                            this.lastSelected = "drawedXLines";
                        }}
                    />,
                    <FibonacciRetracement
                        enabled={drawedFibos.enabled}
                        retracements={drawedFibos.lines}
                        onComplete={(e, newLines) => {
                            this.setState({
                                drawedFibos: {
                                    lines: newLines,
                                    enabled: false,
                                },
                            });
                            this.lastSelected = "drawedFibos";
                        }}
                    />,
                    ...Object.keys(this.state.indicators).map((item) => {
                        return (
                            <TrendLine
                                key={item}
                                enabled={false}
                                type="LINE"
                                snap={false}
                                snapTo={(d) => [d.high, d.low]}
                                trends={this.state.indicators[item]}
                                onComplete={(e, trends) => {
                                    const { indicators } = this.state;
                                    this.setState({
                                        indicators: {
                                            ...indicators,
                                            [item]: trends,
                                        },
                                    });
                                }}
                            />
                        );
                    }),
                ];
            }

            modalClickHandler() {
                const { modalStates } = this.state;
                this.setState({
                    modalStates: { ...modalStates, show: !modalStates.show },
                });
            }

            async recalculateTrends(indexDiff) {
                // Recalculate all fucking trends
                return new Promise((resolve) => {
                    const {
                        drawedTrendLines,
                        drawedRayLines,
                        drawedXLines,
                        drawedFibos,
                        indicators,
                    } = this.state;
                    const newTL = drawedTrendLines?.lines.map((el) =>
                        this.startEndHelper(el, indexDiff)
                    );
                    const newRL = drawedRayLines?.lines.map((el) =>
                        this.startEndHelper(el, indexDiff)
                    );
                    const newXL = drawedXLines?.lines.map((el) =>
                        this.startEndHelper(el, indexDiff)
                    );
                    const newFL = drawedFibos?.lines.map((el) =>
                        this.fiboHelper(el, indexDiff)
                    );
                    const newIL = Object.keys(indicators).reduce(
                        (prev, curr) => {
                            const nL = indicators[curr].map((el) =>
                                this.startEndHelper(el, indexDiff)
                            );
                            return { ...prev, [curr]: nL };
                        },
                        {}
                    );
                    //console.log("newIL:", newIL)
                    this.setState(
                        {
                            drawedTrendLines: { lines: newTL },
                            drawedRayLines: { lines: newRL },
                            drawedXLines: { lines: newXL },
                            drawedFibos: { lines: newFL, enabled: false },
                        },
                        () => {
                            resolve();
                        }
                    );
                });
            }

            startEndHelper(el, indexDiff) {
                const [start1, start2] = el.start;
                const [end1, end2] = el.end;
                el.start = [start1 + indexDiff, start2];
                el.end = [end1 + indexDiff, end2];
                return el;
            }

            fiboHelper(el, indexDiff) {
                const x1 = indexDiff + el.x1;
                const x2 = indexDiff + el.x2;
                el.x1 = x1;
                el.x2 = x2;
                return el;
            }

            render() {
                const { modalStates, showingStrategies } = this.state;
                return (
                    <>
                        <Modal
                            {...modalStates}
                            clickHandler={this.modalClickHandler}
                        />
                        <OriginalComponent
                            {...this.props}
                            showingStrategies = {showingStrategies}
                            trendLineComponent={this.trendLineComponents.bind(
                                this
                            )}
                            ref={this.childRef}
                            recalculateTrends={this.recalculateTrends}
                        />
                    </>
                );
            }
        };
        // enfSettings includes color, storke apperances
        const mapStateToProps = (state) => {
            return {
                enfSettings: state.enfSettings,
            };
        };
        return connect(mapStateToProps, null)(myClass);
    };
}
