// data manupilasyon ve trend olayları olacak

import { Spinner, Container, Row, Col } from "@doar/components";
import React, { useEffect, useRef, useState } from "react";
import {
    getDataFromApi,
    setRealTimeListener,
    cleanListener,
    calculateDates,
} from "../../utils";
import { getMissingDays, binanceSocketEquality } from "../../constants";
import { StyledSpinner } from "./style";
import ErrorOccuredPage from "./error-occured/index";
import moment from "moment";
import FinancialCanvas from "./FinancialCanvas";
import {
    discontinuousTimeScaleProviderBuilder,
    discontinuousTimeScaleProvider,
} from "react-financial-charts";

// function Chart(props) {



//     const {
//         selectedTools,
//         indicator,
//         selectedCoin,
//         selectedInterval,
//         dates,
//     } = props;
//     const [canvasStates, setCanvasStates] = useState(getInitials);
//     const [loading, setLoading] = useState(false);

//     function getInitials(){
//         const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
//             (d) => d.time
//         );
//         const { xScale, xAccessor, displayXAccessor } = xScaleProvider([]);
//         return {
//             data: [],
//             xScale,
//             xAccessor,
//             displayXAccessor,
//         }
//     }

//     /*
    
//          const indexCalculator = discontinuousTimeScaleProviderBuilder()
//             .initialIndex(startRef.current)
//             .indexCalculator();

//         const { index } = indexCalculator(newArr);

//         const xScaleProvider = discontinuousTimeScaleProviderBuilder()
//             .initialIndex(startRef.current)
//             .withIndex(index);
//     */

//     //   const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
//     //     initialData
//     //   );

//     function calculateChartStates(newArr, start = 0 ) {
       

//         /*
        
//         const indexCalculator = discontinuousTimeScaleProviderBuilder()
//             .initialIndex(startRef.current)
//             .indexCalculator();

//         const { index } = indexCalculator(newArr);

//         const xScaleProvider = discontinuousTimeScaleProviderBuilder()
//             .initialIndex(startRef.current)
//             .withIndex(index);

//         const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
//             newArr
//         );
//         */

//         console.log("newArr, start:",newArr,'-', start)
//             const indexCalculator = discontinuousTimeScaleProviderBuilder()
//             .initialIndex(start)
//             .indexCalculator();


//         const { index } = indexCalculator(newArr);
   
//         console.log("index:", index)

//         const xScaleProvider = discontinuousTimeScaleProviderBuilder()
//             .initialIndex(start)
//             .withIndex(index);
//         const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
//             newArr
//         );
  
//             console.log("xdata:", data)

//         return {
//             data,
//             xScale,
//             xAccessor,
//             displayXAccessor,
//         }

  
        

//     }

//     // Get chart data
//     useEffect(() => {
//         const interval = Object.keys(selectedInterval)[0];
//         const { fromDate, toDate } = calculateTrueDates(
//             dates,
//             selectedInterval
//         );
//         getData(fromDate, toDate, interval, selectedCoin);
//         // Real time listener set edilir
//         cleanListener();
//         setRealTimeListener(
//             `${selectedCoin.toLowerCase()}@kline_${binanceSocketEquality(
//                 selectedInterval
//             )}`,
//             addRealTimeData
//         );
//         return cleanListener;
//     }, [selectedCoin, selectedInterval, dates]);

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
//                 //console.log("result.data.length:", result.data.length)
//                 // setData(result.data);
//                 const newStates = calculateChartStates(result.data)

//                 setCanvasStates(newStates);
//               setTimeout(()=>{setLoading(false)}, 500)
//             } else {
//                 setCanvasStates((prevState) => ({
//                     ...prevState,
//                     data: [],
//                 }));
//                 setLoading(false);
//             }
//         });
//     }

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

//             return;
//             setCanvasStates((prevStates) => {
//                 const _data = prevStates?.data || [];
//                 return {
//                     ...prevStates,
//                     data: [..._data],
//                 };
//             });
//         } catch (e) {
//             console.log("ADD REAL TIME DATA ERROR:", e);
//         }
//     }

//     async function onLoadBefore(start, end) {
//         return
//         const startDate = canvasStates.data[0]["time"]; // Başlangıç tarihi (en sol)
//         const rowsToDownload = end - Math.ceil(start); // kaç adet veri getirileceği
//         // En son getirilecek tarih hesaplanıyor
//         let date = new Date(startDate);
//         let minutes = date.getMinutes();
//         let dataToCalculate;
//         date.setMinutes(minutes - rowsToDownload * 30);
//         const getDataResponse = await getDataFromApi(
//             date.toISOString(),
//             startDate.toISOString(),
//             Object.keys(selectedInterval)[0],
//             selectedCoin
//         );

//         if (getDataResponse.ok) dataToCalculate = getDataResponse.data;
//         else return;
//         if (dataToCalculate.length <= 0) return;

//         // remove the same values
//         const array = dataToCalculate.concat(canvasStates.data);
//         const ids = array.map((o) => o.timastamp);
//         const filtered = array.filter(
//             ({ timastamp }, index) => !ids.includes(timastamp, index + 1)
//         );
        
//         const newStates = calculateChartStates(filtered, rowsToDownload)
//       console.log("filtered:",filtered)
//         setCanvasStates((prevState) => ({
//             ...prevState,
//             ...newStates
//         }));

//         // setTimeout(()=>{setIndexCalculator(start)}, 0)
//     }

//     function renderErrorPage() {
//         return <ErrorOccuredPage />;
//     }

//     function renderLoading() {
//         return (
//             <StyledSpinner>
//                 <Spinner color="info" />
//             </StyledSpinner>
//         );
//     }
//     /*
//      const indexCalculator = discontinuousTimeScaleProviderBuilder()
//             .initialIndex(startRef.current)
//             .indexCalculator();

//         const { index } = indexCalculator(newArr);

//         const xScaleProvider = discontinuousTimeScaleProviderBuilder()
//             .initialIndex(startRef.current)
//             .withIndex(index);
//     */
//     function renderBody() {
//         return canvasStates?.data?.length > 0 ? (
//             // <MainChart
//             //     data={data}
//             //     selectedTools={selectedTools}
//             //     indicator={indicator}
//             //     selectedCoin = {selectedCoin}
//             //     selectedInterval = {selectedInterval}
//             // />
//             <FinancialCanvas
//                 canvasStates={canvasStates}
//                 onLoadBefore={onLoadBefore}
//             />
//         ) : (
//             renderErrorPage()
//         );
//     }

//     return loading ? renderLoading() : renderBody();
// }


// function Chart(WrappedComponent) {
//     return class extends React.Component {
//       componentDidUpdate(prevProps) {
//         console.log('Current props: ', this.props);
//         console.log('Previous props: ', prevProps);
//       }
//       render() {
//         // Wraps the input component in a container, without mutating it. Good!
//         return <WrappedComponent {...this.props} />;
//       }
//     }
//   }

// const withData = Component => ({props}) => {
//     console.log("YEAH HOCS")
//     return (<Component {...props} />)
// }

export default ()=>{};
