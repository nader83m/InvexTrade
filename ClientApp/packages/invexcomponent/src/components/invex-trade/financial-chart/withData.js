// HOC data state logic is here
// @ts-nocheck
import * as React from "react";
import {
    getDataFromApi,
    calculateTrueDates,
    basicCheck,
    cleanListener,
    setRealTimeListener,
} from "../../../utils";
import {binanceSocketEquality, getIntervalMinutes} from '../../../constants';
import { StyledSpinner } from "../style";
import ErrorOccuredPage from "../error-occured/index";
import { Spinner } from "@doar/components";

let lastStart = 0;
let lastEnd = 0;
let fetching = false;

export function withUpdatingData() {
    return (OriginalComponent) => {
        return class WithData extends React.Component {
            constructor(props) {
                super(props);
                this.interval = null;
                this.state = {
                    data: props.data || [],
                    loading: false,
                    start: null
                };
            }
            componentDidMount() {
                this.getData();
            }

            componentDidUpdate(prevProps, prevState, snapshot) {
                //console.log("componentDidUpdateWithData")
                const {
                    dates: oldDate,
                    selectedCoin: oldCoin,
                    selectedInterval: oldInterval,
                } = prevProps;
                const { dates, selectedCoin, selectedInterval } = this.props;
                // If date, coin, interval changed we must update the state
                if (
                    !basicCheck(oldDate, dates) ||
                    !basicCheck(oldCoin, selectedCoin) ||
                    !basicCheck(oldInterval, selectedInterval)
                ) {
                    this.getData();
                }
            }

            componentWillUnmount() {
                cleanListener();
            }

            downloadData(start, end){
                return new Promise(async (resolve, reject) => {
                    try {
                        const {data} = this.state
                        const {selectedInterval, selectedCoin} = this.props;
                        const cloneData = [...data]
                        const startDate = cloneData[0]["time"]; // Başlangıç tarihi (en sol)
                        const prevData = cloneData; // Önceki state verisi
        
                        const rowsToDownload = end - Math.ceil(start); // kaç adet veri getirileceği
                        // En son getirilecek tarih hesaplanıyor
                        let date = new Date(startDate);
                        let minutes = date.getMinutes();
                        let dataToCalculate;
                        date.setMinutes(minutes - rowsToDownload * getIntervalMinutes()[Object.keys(selectedInterval)[0]]);
                        const getDataResponse = await getDataFromApi(
                            date.toISOString(),
                            startDate.toISOString(),
                            Object.keys(selectedInterval)[0],
                            selectedCoin
                        )
                        if(getDataResponse.ok) dataToCalculate = getDataResponse.data
                        else return
                        if (dataToCalculate.length <= 0) return;
                        // remove the same values
                        const array = dataToCalculate.concat(prevData)
                        const ids = array.map(o => o.timastamp)
                        const filtered = array.filter(({timastamp}, index) => !ids.includes(timastamp, index + 1))
                        this.setState({data: filtered, start});
                        resolve({
                            start: start,
                            end: end,
                        });
                    } catch (e) {
                       // console.log("DOWNLOAD DATA ERROR :", e);
                        reject();
                    }
                });
            }

            async onLoadMore(start, end) {
                if (Math.ceil(start) === end) return;
                lastStart = start;
                lastEnd = end;
                if (!fetching) {
                    fetching = true;
                    try {
                        const {
                            start: downloadStart,
                            end: downloadEnd,
                        } = await this.downloadData(lastStart, lastEnd);
                        fetching = false;
                        if (downloadStart != lastStart || downloadEnd != lastEnd) {
                            this.onLoadMore(lastStart, lastEnd);
                        }
                    } catch (e) {
                        fetching = false;
                       // console.log("handleDownloadMore ERROR:", e);
                    }
                }
            }

            getData() {
                const { selectedCoin, selectedInterval, dates } = this.props;
                const { fromDate, toDate } = dates;
                if (!fromDate && !toDate) return;
                this.setState({ loading: true });
                const {
                    fromDate: _fromDate,
                    toDate: _toDate,
                } = calculateTrueDates(dates, selectedInterval);
                getDataFromApi(
                    _fromDate,
                    _toDate,
                    Object.keys(selectedInterval)[0],
                    selectedCoin
                ).then((result) => {
                    let _data = [];
                    if (result.ok) {
                        _data = result.data;
                    }
                    this.setState({ loading: false, data: _data });
                    cleanListener();
                    setRealTimeListener(
                        `${selectedCoin.toLowerCase()}@kline_${binanceSocketEquality(
                            selectedInterval
                        )}`,
                        this.addRealTimeData.bind(this)
                    );
                });
            }

            addRealTimeData(realTimeData) {
                try {
                    let jsDate = new Date(realTimeData.time);
                    const { data } = this.state;
                    const cloneData = [...data];
                    realTimeData.time = jsDate;
                    realTimeData.date = jsDate;
                    if (
                        realTimeData.time.getTime() ===
                        cloneData[cloneData.length - 1]["time"].getTime()
                    ) {
                        cloneData.pop();
                    }
                    const newArr = [...cloneData, realTimeData];
                    this.setState({ data: newArr });
                } catch (e) {
                    //console.log("ADD REAL TIME DATA ERROR:", e);
                }
            }

            render() {
                const { data, loading, start } = this.state;
                if (loading) {
                    return (
                        <StyledSpinner>
                            <Spinner color="info" />
                        </StyledSpinner>
                    );
                }
                if (data?.length > 0) {
                    return (
                        <OriginalComponent
                            {...this.props}
                            onLoadMore={this.onLoadMore.bind(this)}
                            data={data}
                            start={start}
                        />
                    );
                } else {
                    return <ErrorOccuredPage />;
                }
            }
        };
    };
}
