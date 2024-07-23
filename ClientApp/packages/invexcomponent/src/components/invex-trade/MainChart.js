// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import PropTypes, { element } from "prop-types";
// import { ChartCanvas } from "react-stockcharts";
// import { fitWidth } from "react-stockcharts/lib/helper";
// import {
//     discontinuousTimeScaleProvider,
//     discontinuousTimeScaleProviderBuilder,
// } from "react-stockcharts/lib/scale";
//
// import { last } from "react-stockcharts/lib/utils";
// import { CrossHairCursor } from "react-stockcharts/lib/coordinates";
//
// import CandleStickChart from "./CandleStickChart";
// import VolumeChart from "./VolumeChart";
//
// import { indicatorDefaults } from "../../../src/constants";
// import {useAppSelector} from "../../redux/hooks"
//
// import {Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter, Button, Spinner} from '@doar/components'
//
// import { getDataFromApi, getPriceChannelFromApi, getSupportResistanceFromApi, getRisingFallingTrendFromApi } from "../../utils";
//
// let lastStart = 0;
// let lastEnd = 0;
// let fetching = false;
//
// function MainChart(props) {
//     const {
//         data: initialData,
//         ratio,
//         width,
//         type = "hybrid",
//         selectedTools,
//         indicator,
//         selectedInterval,
//         selectedCoin
//     } = props;
//     const height = window.innerHeight - 170;
//     const margin = { left: 60, right: 70, top: 10, bottom: 30 };
//     const dataRef = useRef(initialData);
//     const startRef = useRef(0);
//     const prevStateRef = useRef(0);
//     const calculatedDataRef = useRef([]);
//     const canvasRef = useRef(null);
//
//     // Redux
//     const enfStates = useAppSelector((state) => state.enfSettings);
//
//     // States
//     const [volumeVisibility, setVolumeVisibility] = useState(true); // Volume grafiği show/hide state'i
//     const [gridVisibility, setGridVisibility] = useState(true); // Grid show/hide state'i
//     const [chartStates, setChartStates] = useState(getInitialChartStates); // Chart state'leri
//     const [trendLines, setTrendLines] = useState({});
//     const [
//         interactiveTrendLineStates,
//         setInteractiveTrendLineStates,
//     ] = useState({
//         enable: false,
//         trends: [],
//         onComplete: interactiveTrendLineOnComplate,
//     });
//
//     const [interactiveRayLineStates, setInteractiveRayLineStates] = useState({
//         enable: false,
//         trends: [],
//         onComplete: interactiveRayLineOnComplate,
//     })
//
//     const [interactiveXLineStates, setInteractiveXLineStates] = useState({
//         enable: false,
//         trends: [],
//         onComplete: interactiveXLineOnComplate,
//     })
//
//     const [interactiveFibonacciStates, setInteractiveFibonacciStates] = useState({
//         enable : false,
//         retracements : [],
//         onComplete : interactiveFiboComplate
//     })
//
//     const interactiveStateFunctions = [
//         {
//             'state' : interactiveTrendLineStates,
//             'setState' : setInteractiveTrendLineStates
//         },
//         {
//             'state' : interactiveRayLineStates,
//             'setState' : setInteractiveRayLineStates
//         },
//         {
//             'state' : interactiveXLineStates,
//             'setState' : setInteractiveXLineStates
//         },
//         {
//             'state' : interactiveFibonacciStates,
//             'setState' : setInteractiveFibonacciStates
//         },
//     ]
//
//     const [modal, setModal] = useState({show: false, msg: '', isLoadingIco : false})
//     const clickHandler = () => {
//         setModal((prev) => ({...prev, show: !prev.show}));
//     };
//
//     const lastSelectedTrend = useRef(null)
//
//     // Başlangıç stateleri set edilir (constructor gibi çalışır)
//     function getInitialChartStates() {
//         const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
//             (d) => d.time
//         );
//         const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
//             initialData
//         );
//         dataRef.current = data;
//         return {
//             data,
//             xScale,
//             xAccessor,
//             displayXAccessor,
//         };
//     }
//
//     function interactiveTrendLineOnComplate(trends) {
//         setInteractiveTrendLineStates((prevState) => ({
//             ...prevState,
//             trends,
//             enable: false,
//         }));
//     }
//
//     function interactiveRayLineOnComplate(trends) {
//         setInteractiveRayLineStates((prevState) => ({
//             ...prevState,
//             trends,
//             enable: false,
//         }));
//     }
//
//     function interactiveXLineOnComplate(trends) {
//         setInteractiveXLineStates((prevState) => ({
//             ...prevState,
//             trends,
//             enable: false,
//         }));
//     }
//
//     function interactiveFiboComplate(retracements){
//         setInteractiveFibonacciStates(prevState => ({...prevState, retracements, enable: false}))
//     }
//
//     useEffect(() => {
//         const currentData = [...dataRef.current];
//         const recievedData = [...props.data];
//
//         if (JSON.stringify(currentData) === JSON.stringify(recievedData))
//             return;
//
//         const tempData = [...recievedData, ...currentData];
//         const newArr = tempData
//             .reduce((previousValue, currentValue) => {
//                 if (previousValue.length === 0) return [currentValue];
//                 const currentArr = [...previousValue];
//
//                 const times = currentArr.map((el) => JSON.stringify(el.time));
//
//                 if (!times.includes(JSON.stringify(currentValue.time)))
//                     currentArr.push(currentValue);
//
//                 return currentArr;
//             }, [])
//             .sort((a, b) => new Date(a.time) - new Date(b.time));
//
//         const indexCalculator = discontinuousTimeScaleProviderBuilder()
//             .initialIndex(startRef.current)
//             .indexCalculator();
//
//         const { index } = indexCalculator(newArr);
//
//         const xScaleProvider = discontinuousTimeScaleProviderBuilder()
//             .initialIndex(startRef.current)
//             .withIndex(index);
//
//         const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
//             newArr
//         );
//         dataRef.current = [...data];
//         setChartStates((prevState) => ({
//             ...prevState,
//             ...{
//                 data,
//                 xScale,
//                 xAccessor,
//                 displayXAccessor,
//             },
//         }));
//     }, [props.data]);
//
//     useEffect(()=>{
//         lostFocusInteractives();
//         switch(selectedTools){
//             case 'CLEAN':
//                 setInteractiveTrendLineStates(prevState => ({...prevState, trends : []}))
//                 setInteractiveRayLineStates(prevState => ({...prevState, trends : []}))
//                 setInteractiveXLineStates(prevState => ({...prevState, trends : []}))
//                 setInteractiveFibonacciStates(prevState => ({...prevState,  retracements : []}))
//                 lastSelectedTrend.current = null
//             break;
//             case 'LINE':
//                 setInteractiveTrendLineStates(prevState => ({...prevState, enable : true}))
//                 setInteractiveRayLineStates(prevState => ({...prevState, enable : false}))
//                 setInteractiveXLineStates(prevState => ({...prevState,  enable : false}))
//                 setInteractiveFibonacciStates(prevState => ({...prevState,  enable : false}))
//                 lastSelectedTrend.current = setInteractiveTrendLineStates
//             break;
//             case 'XLINE':
//                 setInteractiveTrendLineStates(prevState => ({...prevState, enable : false}))
//                 setInteractiveRayLineStates(prevState => ({...prevState, enable : false}))
//                 setInteractiveXLineStates(prevState => ({...prevState,  enable : true}))
//                 setInteractiveFibonacciStates(prevState => ({...prevState,  enable : false}))
//                 lastSelectedTrend.current = setInteractiveXLineStates
//             break;
//             case 'RAY':
//                 setInteractiveTrendLineStates(prevState => ({...prevState, enable : false}))
//                 setInteractiveRayLineStates(prevState => ({...prevState, enable : true}))
//                 setInteractiveXLineStates(prevState => ({...prevState,  enable : false}))
//                 setInteractiveFibonacciStates(prevState => ({...prevState,  enable : false}))
//                 lastSelectedTrend.current = setInteractiveRayLineStates
//             break;
//             case 'FIBO':
//                 setInteractiveTrendLineStates(prevState => ({...prevState, enable : false}))
//                 setInteractiveRayLineStates(prevState => ({...prevState, enable : false}))
//                 setInteractiveXLineStates(prevState => ({...prevState,  enable : false}))
//                 setInteractiveFibonacciStates(prevState => ({...prevState,  enable : true}))
//                 lastSelectedTrend.current = setInteractiveFibonacciStates
//                 break
//             default :
//                 break;
//         }
//     }, [selectedTools])
//
//     // Positionların state değiştikçe hesaplanmasını sağlar.
//     useEffect(()=>{
//         calculateTrendFormationPosition(trendLines?.[indicatorDefaults.PRICE.name]?.[0]?.['channels'], indicatorDefaults.PRICE.name)
//         calculateTrendFormationPosition(trendLines?.[indicatorDefaults.RISINGFALLING.name]?.[0]?.['channels'], indicatorDefaults.RISINGFALLING.name)
//         calculateSupportResistance(trendLines?.[indicatorDefaults.SUPPORT.name]?.[0]?.['lines'])
//         // calculateInteractiveTrendLineStates()
//     }, [chartStates.data])
//
//     useEffect(()=>{
//         switch(indicator){
//             case indicatorDefaults.PRICE.name:
//                 getPriceChannel()
//                 break;
//             case indicatorDefaults.RISINGFALLING.name:
//                 getRisingFallingChannel()
//                 break;
//             case indicatorDefaults.SUPPORT.name:
//                 getSupportResistance()
//                 break;
//             case "CLEAN":
//                 setTrendLines({})
//                 break;
//             default:
//                 break;
//         }
//     }, [indicator])
//
//     // Redux settings değiştiğinde çalışır
//     useEffect(()=>{
//         const newTrendLines = {}
//         Object.keys(enfStates).forEach(type => {
//             const enfInfo = enfStates[type];
//             const _trendLines = trendLines?.[type]?.map(item => {
//                 if(item.colorType === 'color1'){
//                     item.appearance = {...item.appearance, stroke : enfInfo.color1, strokeWidth : enfInfo.stroke}
//                 }else{
//                     item.appearance = {...item.appearance, stroke : enfInfo.color2, strokeWidth : enfInfo.stroke}
//                 }
//                 return item
//             }) || []
//             newTrendLines[type] = _trendLines
//         })
//         setTrendLines(newTrendLines)
//     }, [enfStates])
//
//     function calculateInteractiveTrendLineStates(currentStates){
//         // Ekran kaydırıldığında aradaki index farklılığını algılayıp trendlineları düzenler
//         const timeStamp = prevStateRef.current.data?.[0].timastamp
//         const filtered1 = prevStateRef.current.data?.filter(item => {
//             return item.timastamp === timeStamp
//         }) || null
//         const filtered2 = currentStates.data?.filter(item => {
//             return item.timastamp === timeStamp
//         }) || null
//         if(filtered1 && filtered1){
//             const indexFark = filtered2[0].idx.index - filtered1[0].idx.index
//             // Farkı bütün interactive elemanlara yansıt
//             interactiveStateFunctions.forEach(element => {
//                 element.setState((prevState) => {
//                     let selector = null;
//                     selector = prevState.trends || prevState.retracements
//                     if(prevState.trends){
//                         const newTrends = selector.map(item => {
//                             const start = item.start?.[0]
//                             const end = item.end?.[0]
//                             item.start[0] = indexFark + start
//                             item.end[0] = indexFark + end
//                             return item
//                         })
//                         prevState[selector] = newTrends
//                         return prevState
//                     }else{
//                         const newTrends = selector.map(item => {
//                             const x1 = indexFark + item.x1
//                             const x2 = indexFark + item.x2
//                             item.x1 = x1
//                             item.x2 = x2
//                             return item
//                         })
//                         prevState[selector] = newTrends
//                         return prevState
//                     }
//                 })
//             });
//         }
//     }
//
//     function lostFocusInteractives(){
//         canvasRef.current.cancelDrag();
//         interactiveStateFunctions.forEach(element => {
//             let selectItem = "trends"
//             if(!element.state?.hasOwnProperty("trends")){
//                 selectItem = "retracements"
//             }
//             const interactives = element.state?.[selectItem].map(
//                 (item) => {
//                     item["selected"] = false;
//                     return item;
//                 }
//             );
//             element.setState((prevState) => ({
//                 ...prevState,
//                 [selectItem] : interactives,
//                 enable: false,
//             }));
//         })
//     }
//
//     const onKeyPress = useCallback(
//         (e) => {
//             const keyCode = e.which;
//             switch (keyCode) {
//                 case 46: {
//                     // DEL
//                     interactiveStateFunctions.forEach(element => {
//                         let selectItem = "trends"
//                         if(!element.state.hasOwnProperty("trends")){
//                             selectItem = "retracements"
//                         }
//                         const newTrends = element.state[selectItem].filter(
//                             (item) => !item.selected
//                         );
//                         canvasRef.current.cancelDrag();
//                         element.setState((prevState) => ({
//                             ...prevState,
//                             [selectItem]: newTrends,
//                         }));
//                     })
//                     break;
//                 }
//                 case 27: {
//                     // ESC
//                     lostFocusInteractives()
//                     break;
//                 }
//                 case 68: // D - Draw trendline
//                 case 69: {
//                     // E - Enable trendline
//                     lostFocusInteractives()
//                     lastSelectedTrend.current?.((prevState) => ({
//                         ...prevState,
//                         enable: true,
//                     }));
//                     break;
//                 }
//                 default:
//                     break;
//             }
//         },
//         [interactiveTrendLineStates, interactiveXLineStates, interactiveRayLineStates, interactiveFibonacciStates]
//     );
//
//     useEffect(() => {
//         document.addEventListener("keyup", onKeyPress);
//         return () => {
//             document.removeEventListener("keyup", onKeyPress);
//         };
//     }, [onKeyPress]);
//
//     function downloadData(start, end) {
//         return new Promise(async (resolve, reject) => {
//             try {
//                 const startDate = dataRef.current[0]["time"]; // Başlangıç tarihi (en sol)
//                 const prevData = dataRef.current; // Önceki state verisi
//
//                 const rowsToDownload = end - Math.ceil(start); // kaç adet veri getirileceği
//                 // En son getirilecek tarih hesaplanıyor
//                 let date = new Date(startDate);
//                 let minutes = date.getMinutes();
//                 let dataToCalculate;
//                 date.setMinutes(minutes - rowsToDownload * 30);
//                 const getDataResponse = await getDataFromApi(
//                     date.toISOString(),
//                     startDate.toISOString(),
//                     Object.keys(selectedInterval)[0],
//                     selectedCoin
//                 )
//                 if(getDataResponse.ok) dataToCalculate = getDataResponse.data
//                 else return
//                 if (dataToCalculate.length <= 0) return;
//                 calculatedDataRef.current = [
//                     ...calculatedDataRef.current,
//                     ...dataToCalculate,
//                 ];
//                 startRef.current = Math.ceil(start);
//
//                 // remove the same values
//                 const array = dataToCalculate.concat(prevData)
//                 const ids = array.map(o => o.timastamp)
//                 const filtered = array.filter(({timastamp}, index) => !ids.includes(timastamp, index + 1))
//
//                 const indexCalculator = discontinuousTimeScaleProviderBuilder()
//                     .initialIndex(Math.ceil(start))
//                     .indexCalculator();
//                 const { index } = indexCalculator(
//                     filtered
//                 );
//
//                 const xScaleProvider = discontinuousTimeScaleProviderBuilder()
//                     .initialIndex(Math.ceil(start))
//                     .withIndex(index);
//                 const {
//                     data: linearData,
//                     xScale,
//                     xAccessor,
//                     displayXAccessor,
//                 } = xScaleProvider(filtered);
//
//                 dataRef.current = linearData;
//                 setChartStates((prevState) => {
//                     prevStateRef.current = prevState
//                     const returnObj = {
//                         ...prevState,
//                         ...{
//                             data: linearData,
//                             xScale,
//                             xAccessor,
//                             displayXAccessor,
//                         },
//                     }
//                     calculateInteractiveTrendLineStates(returnObj)
//                     return returnObj
//                 });
//                 resolve({
//                     start: start,
//                     end: end,
//                 });
//             } catch (e) {
//                 console.log("DOWNLOAD DATA ERROR :", e);
//                 reject();
//             }
//         });
//     }
//
//     // Ekran kaydırıldığında veri yoksa çalışır
//     async function handleDownloadMore(start, end) {
//         if (Math.ceil(start) === end) return;
//         lastStart = start;
//         lastEnd = end;
//         if (!fetching) {
//             fetching = true;
//             try {
//                 const {
//                     start: downloadStart,
//                     end: downloadEnd,
//                 } = await downloadData(lastStart, lastEnd);
//                 fetching = false;
//                 if (downloadStart != lastStart || downloadEnd != lastEnd) {
//                     handleDownloadMore(lastStart, lastEnd);
//                 }
//             } catch (e) {
//                 fetching = false;
//                 console.log("handleDownloadMore ERROR:", e);
//             }
//         }
//     }
//
//
//     function convertIsoDate(_date){
//         function pad(number) {
//             if (number < 10) {
//               return '0' + number;
//             }
//             return number;
//           }
//         return _date.getFullYear() +
//         '-' + pad(_date.getMonth() + 1) +
//         '-' + pad(_date.getDate()) +
//         'T' + pad(_date.getHours()) +
//         ':' + pad(_date.getMinutes()) +
//         ':' + pad(_date.getSeconds()) +
//         '.' + (_date.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
//         'Z';;
//     }
//
//
//     function calculateTrendFormationPosition(channels = null, formation = ""){
//         if(!channels) return
//         const { xAccessor } = chartStates;
//
//         const x1Min = dataRef.current.filter((a) => {
//             const arrayDate = new Date(a.time);
//             const x1Min_date = new Date(+channels.x1_min);
//             return arrayDate.getTime() === x1Min_date.getTime();
//         })[0];
//
//         const x2Min = dataRef.current.filter((a) => {
//             const arrayDate = new Date(a.time);
//             const x1Min_date = new Date(+channels.x2_min);
//             return arrayDate.getTime() === x1Min_date.getTime();
//         })[0];
//
//         ////
//         const x1Max = dataRef.current.filter((a) => {
//             const arrayDate = new Date(a.time);
//             const x1Min_date = new Date(+channels.x1_max);
//             return arrayDate.getTime() === x1Min_date.getTime();
//         })[0];
//
//         const x2Max = dataRef.current.filter((a) => {
//             const arrayDate = new Date(a.time);
//             const x1Min_date = new Date(+channels.x2_max);
//             return arrayDate.getTime() === x1Min_date.getTime();
//         })[0];
//
//         console.log("x1Min:", x1Min)
//         console.log("....xAccessor(x1Min):", xAccessor(x1Min))
//
//         setTrendLines(prevState => ({...prevState, ...{
//             [formation] : [
//                 {
//                     start: [xAccessor(x1Min), channels.y1_min],
//                     end: [xAccessor(x2Min), channels.y2_min],
//                     type: "LINE",
//                     channels,
//                     colorType : "color2",
//                     appearance : {stroke : enfStates[formation]?.color2 || 'red', strokeWidth : enfStates[formation]?.stroke || 5}
//                 },
//                 {
//                     start: [xAccessor(x1Max), channels.y1_max],
//                     end: [xAccessor(x2Max), channels.y2_max],
//                     type: "LINE",
//                     channels,
//                     colorType : "color1",
//                     appearance : {stroke : enfStates[formation]?.color1 || 'green' , strokeWidth : enfStates[formation]?.stroke || 5}
//                 },
//             ]
//         }}));
//     }
//
//     async function getPriceChannel() {
//
//         const firstDate = new Date(dataRef.current[0]["time"]);
//         const lastDate = new Date(
//             dataRef.current[dataRef.current.length - 1]["time"]
//         );
//
//         setModal({isLoadingIco : true, show : true})
//
//         const priceChannelRequest = await getPriceChannelFromApi(
//             convertIsoDate(firstDate),
//             convertIsoDate(lastDate),
//             Object.keys(selectedInterval)[0],
//             selectedCoin
//         )
//
//         setModal({isLoadingIco : false, show : false})
//
//         if(!priceChannelRequest.ok) return
//         const priceChannels = priceChannelRequest.data;
//
//         if(priceChannels.success === true){
//             if (priceChannels) {
//                 // console.log("x1_min:", new Date(+priceChannels.x1_min));
//                 // console.log("x2_min:", new Date(+priceChannels.x2_min));
//                 // console.log("x1_max:", new Date(+priceChannels.x1_max));
//                 // console.log("x2_max:", new Date(+priceChannels.x2_max));
//                 calculateTrendFormationPosition(priceChannels, 'PRICE')
//             }
//         }else {
//             setModal({show:true, msg : priceChannels.msg, isLoadingIco : false});
//         }
//     }
//
//     async function getRisingFallingChannel(){
//         const firstDate = new Date(dataRef.current[0]["time"]);
//         const lastDate = new Date(
//             dataRef.current[dataRef.current.length - 1]["time"]
//         );
//
//         setModal({isLoadingIco : true, show : true})
//
//         const channelRequest = await getRisingFallingTrendFromApi(
//             convertIsoDate(firstDate),
//             convertIsoDate(lastDate),
//             Object.keys(selectedInterval)[0],
//             selectedCoin
//         )
//
//         setModal({isLoadingIco : false, show : false})
//
//         if(!channelRequest.ok) return
//         const channels = channelRequest.data;
//
//         if(channels.success === true){
//             if (channels) {
//                 // console.log("x1_min:", new Date(+priceChannels.x1_min));
//                 // console.log("x2_min:", new Date(+priceChannels.x2_min));
//                 // console.log("x1_max:", new Date(+priceChannels.x1_max));
//                 // console.log("x2_max:", new Date(+priceChannels.x2_max));
//                 calculateTrendFormationPosition(channels, indicatorDefaults.RISINGFALLING.name)
//             }
//         }else {
//             setModal({show:true, msg : channels.msg, isLoadingIco : false});
//         }
//     }
//
//     function calculateSupportResistance(points){
//         //console.log("calculate poinst:", points)
//         const reCalculateArr = []
//         if(!points) return
//         const { xAccessor } = chartStates;
//
//         const lines = points.map(item => {
//             const _date = new Date(+item.timastamp);
//             const y = item.price;
//             const x1 = dataRef.current.filter((a) =>{
//                 const arrayDate = new Date(a.time)
//                 return _date.getTime() === arrayDate.getTime()
//             })[0]
//             const x2 = dataRef.current[dataRef.current.length -1]
//             reCalculateArr.push(
//                 {
//                     price : item.price,
//                     timastamp : item.timastamp,
//                     type : item.type,
//                 }
//             )
//             return {x1,x2,y, type : item.type}
//         })
//
//         const getColor = (item) => {
//             // enfStates[indicatorDefaults.SUPPORT.name]?.stroke
//             if(item.type === "resistance")
//             return enfStates[indicatorDefaults.SUPPORT.name]?.color1 || "blue"
//             else return enfStates[indicatorDefaults.SUPPORT.name]?.color2 || "purple"
//         }
//
//         setTrendLines(prevState => ({...prevState, ...{
//             [indicatorDefaults.SUPPORT.name] : lines.map(el => ({
//                 start: [xAccessor(el.x1), el.y],
//                 end: [xAccessor(el.x2),  el.y],
//                 appearance: { stroke: getColor(el), strokeWidth: enfStates[indicatorDefaults.SUPPORT.name]?.stroke || 5 },
//                 type: "LINE",
//                 lines : reCalculateArr,
//                 colorType : el.type === "resistance" ? 'color1' : 'color2'
//             }))
//         }}))
//
//     }
//
//     async function getSupportResistance(){
//         setModal({isLoadingIco : true, show : true})
//         const firstDate = new Date(dataRef.current[0]["time"]);
//         const lastDate = new Date(
//             dataRef.current[dataRef.current.length - 1]["time"]
//         );
//
//         const supportRequest = await getSupportResistanceFromApi(
//             convertIsoDate(firstDate),
//             convertIsoDate(lastDate),
//             Object.keys(selectedInterval)[0],
//             selectedCoin
//         )
//         setModal({isLoadingIco : false, show : false})
//         if(!supportRequest.ok) return
//         const supportPoints = supportRequest.data;
//         calculateSupportResistance(supportPoints)
//     }
//
//     function renderVolumeBtn() {
//         return (
//             <button
//                 style={{ margin: 20 }}
//                 onClick={() => setVolumeVisibility((prevState) => !prevState)}
//             >
//                 {volumeVisibility ? "Hide volume" : "Show volume"}
//             </button>
//         );
//     }
//
//     function renderGridBtn() {
//         return (
//             <button
//                 style={{ margin: 10 }}
//                 onClick={() => setGridVisibility((prevState) => !prevState)}
//             >
//                 {gridVisibility ? "Hide grid" : "Show grid"}
//             </button>
//         );
//     }
//
//     function renderPriceChannelBtn() {
//         return (
//             <button style={{ margin: 10 }} onClick={getPriceChannel}>
//                 {"Price Trend Line"}
//             </button>
//         );
//     }
//
//     function updateTrendLines(item, trends) {
//         setTrendLines(prevState => ({
//             ...prevState,
//             [item] : trends
//         }));
//     }
//
//     return (
//         <div>
//             <ChartCanvas
//                 ref={canvasRef}
//                 height={height}
//                 ratio={ratio}
//                 width={width}
//                 margin={margin}
//                 type={type}
//                 seriesName="MSFT"
//                 data={chartStates.data}
//                 xScale={chartStates.xScale}
//                 xAccessor={chartStates.xAccessor}
//                 displayXAccessor={chartStates.displayXAccessor}
//                 xExtents={chartStates.xExtents}
//                 mouseMoveEvent={true}
//                 panEvent={true}
//                 zoomEvent={true}
//                 clamp={false}
//                 onLoadMore={handleDownloadMore}
//             >
//                 {CandleStickChart({
//                     gridVisibility,
//                     margin,
//                     width,
//                     height,
//                     trendLines,
//                     updateTrendLines,
//                     interactiveTrendLineStates,
//                     interactiveRayLineStates,
//                     interactiveXLineStates,
//                     interactiveFibonacciStates
//                 })}
//                 {volumeVisibility && VolumeChart()}
//                 <CrossHairCursor />
//             </ChartCanvas>
//             <Modal show={modal.show} size="sm">
//                 {
//                     modal.isLoadingIco !== true ?
//                     <>
//                     <ModalHeader>
//                     <ModalTitle>Warning !</ModalTitle>
//                     <ModalClose onClick = {clickHandler}>x</ModalClose>
//                 </ModalHeader>
//                 <ModalBody>
//                     <p>
//                         {modal.msg}
//                     </p>
//                 </ModalBody>
//                 <ModalFooter>
//                     <Button onClick = {clickHandler} color="secondary">Close</Button>
//                 </ModalFooter>
//                     </>
//                     :
//                     <div style={{alignItems : "center", justifyContent : "center", display : "flex", margin : "20px"}}>
//                 <Spinner variant="grow" color="info" />
//                     <p>Loading...</p>
//                 </div>
//                 }
//             </Modal>
//             {/* <Button onClick={clickHandler}>Open Modal</Button> */}
//             {/* {renderVolumeBtn()}
//             {renderGridBtn()}
//             {renderPriceChannelBtn()} */}
//         </div>
//     );
// }
//
// MainChart.propTypes = {
//     data: PropTypes.array.isRequired,
//     width: PropTypes.number.isRequired,
//     ratio: PropTypes.number.isRequired,
//     type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
// };
//
// MainChart.defaultProps = {
//     type: "svg",
// };
//
// export default fitWidth(MainChart);
