// import { Spinner, Container, Row, Col } from "@doar/components";
// import React, { useEffect, useRef, useState } from "react";
// import {
//     getDataFromApi,
//     setRealTimeListener,
//     cleanListener,
//     calculateDates,
// } from "../../utils";
// import { getMissingDays, binanceSocketEquality } from "../../constants";
// import MainChart from "./MainChart";
// import { StyledSpinner } from "./style";
// import ErrorOccuredPage from "./error-occured/index";
// import moment from "moment";
//
// function Chart(props) {
//     const { selectedTools, indicator, selectedCoin, selectedInterval, dates } = props;
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     // const tempMin = useRef(0);
//     const dataRef = useRef([]); // Ekrandaki data bilgisinin kesin olarak bilinmesi için ref üzerinde saklıyoruz
//
//     // Get chart data
//     useEffect(() => {
//         const interval = Object.keys(selectedInterval)[0];
//         const { fromDate, toDate } = calculateTrueDates(
//             dates,
//             selectedInterval
//         );
//         getData(fromDate, toDate, interval, selectedCoin);
//         // Real time listener set edilir
//         cleanListener()
//         setRealTimeListener(`${selectedCoin.toLowerCase()}@kline_${binanceSocketEquality(selectedInterval)}`, addRealTimeData);
//         return cleanListener;
//     }, [selectedCoin, selectedInterval, dates]);
//
//     function getData(
//         fromDate = null,
//         toDate = null,
//         interval = null,
//         symbol = null
//     ) {
//         if (!fromDate && !toDate) return;
//         setLoading(true);
//         getDataFromApi(fromDate, toDate, interval, symbol).then((result) => {
//             if (result.ok) {
//                 dataRef.current = result.data;
//                 //console.log("result.data.length:", result.data.length)
//                 setData(result.data);
//                 setLoading(false);
//             } else {
//                 dataRef.current = [];
//                 setData([]);
//                 setLoading(false);
//             }
//         });
//     }
//
//     // Olması gerekenden daha az veri varsa tarih ayarlanır.
//     function calculateTrueDates(dates, selectedInterval) {
//         let toDate = moment(dates.toDate);
//         let fromDate = moment(dates.fromDate);
//         const delta = toDate.diff(fromDate, "days") + 1;
//         const interval = Object.keys(selectedInterval)[0];
//         const missingDays = getMissingDays(interval);
//         if (delta < missingDays) {
//             const resDates = calculateDates(interval, { toDate: dates.toDate });
//             fromDate = resDates.fromDate;
//             toDate = resDates.toDate;
//         } else {
//             fromDate = fromDate.toDate();
//             toDate = toDate.toDate();
//         }
//         return { toDate, fromDate };
//     }
//
//     // Real time gelen datayı set eder
//     function addRealTimeData(realTimeData) {
//         try {
//             //tempMin.current += 15;
//             let jsDate = new Date(realTimeData.time);
//             //let newDateObj = new Date(
//             //   oldDateObj.getTime() + tempMin.current * 60000
//             //);
//             realTimeData.time = jsDate;
//             realTimeData.date = jsDate;
//             if (
//                 realTimeData.time.getTime() ===
//                 dataRef.current[dataRef.current.length - 1]["time"].getTime()
//             ) {
//                 dataRef.current.pop();
//             }
//
//             const newArr = [...dataRef.current, realTimeData];
//             dataRef.current = newArr;
//             setData(newArr);
//         } catch (e) {
//             console.log("ADD REAL TIME DATA ERROR:", e);
//         }
//     }
//
//     function renderErrorPage() {
//         return <ErrorOccuredPage />;
//     }
//
//     function renderLoading() {
//         return (
//             <StyledSpinner>
//                 <Spinner color="info" />
//             </StyledSpinner>
//         );
//     }
//     function renderBody() {
//         return data?.length > 0 ? (
//             <MainChart
//                 data={data}
//                 selectedTools={selectedTools}
//                 indicator={indicator}
//                 selectedCoin = {selectedCoin}
//                 selectedInterval = {selectedInterval}
//             />
//         ) : (
//             renderErrorPage()
//         );
//     }
//
//     return loading ? renderLoading() : renderBody();
// }
//
// export default Chart;
