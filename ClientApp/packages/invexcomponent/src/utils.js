/* eslint-disable no-unused-expressions */

import moment from "moment";
import {
    sendPostRequest,
    signInRequest,
    signUpRequest,
    updateUserProfileRequest,
} from "./apiRequest";
import { getMissingDays } from "./constants";
import Timer from "./Timer";
import { timeFormat } from "d3-time-format";

const timer = new Timer(60000);

/* Binance verilerini objeye dönüştürür */
function convertData(obj) {
    const newObj = { ...obj };
    return {
        time: new Date(newObj.t),
        open: newObj.o,
        high: newObj.h,
        low: newObj.l,
        close: newObj.c,
        volume: newObj.v,
    };
}

let lastData = null; // Son kaydedilen veri
const listenerObj = {}; // realtime verileri topluyoruz.
let listener = null; // RealTime data dinleyen listener
/* Realtime verileri dinler, değişiklik olması halinde callback gönderir */
async function setRealTimeListener(
    type = "btcusdt@kline_15m",
    callback = () => {}
) {
    if (listener) listener.close();
    listener = new WebSocket(`wss://stream.binance.com:9443/ws/${type}`);
    listener.onmessage = function (event) {
        const message = JSON.parse(event.data);
        const candlestick = message.k;
        const receivedVal = convertData(candlestick);
        listenerObj[receivedVal.time.getTime()] = receivedVal;
        // Timera göre render ediliyor. (60sn)
        // receivedVal.time.getTime() !== lastData.time.getTime()
        //callback(receivedVal);
        if (lastData) {
            if (receivedVal.time.getTime() !== lastData.time.getTime()) {
                callback(listenerObj[lastData.time.getTime()]);
                lastData = receivedVal;
                callback(lastData);
                timer.resetTimer();
            }
            if (timer.getLeftSeconds() === 0) {
                lastData = receivedVal;
                callback(lastData);
                timer.resetTimer();
            }
        } else {
            timer.startTimer();
            lastData = convertData(candlestick);
            callback(lastData);
        }
    };
}

function cleanListener() {
    if (listener && lastData) {
        listener.close();
        lastData = null;
    }
}

// Verilen tarih aralığındaki verileri getirir
async function getDataFromApi(
    from_date = "2022-04-08T19:47:36.259Z",
    to_date = "2022-04-09T19:10:36.259Z",
    interval = "KLINE_INTERVAL_15MINUTE",
    symbol = "BTCUSDT"
) {
    const body = {
        from_date,
        to_date,
        interval,
        symbol,
    };
    const response = await sendPostRequest("/v1/getcandlestickdata", body);
    response["data"] = response.data?.map((element) => {
        const time = new Date(element["time"]);
        element["time"] = time;
        element["date"] = time;
        element["high"] = +element.high;
        element["low"] = +element.low;
        element["close"] = +element.close;
        element["open"] = +element.open;
        return element;
    });
    return response;
}

async function getPriceChannelFromApi(
    from_date = "2022-04-01T19:07:54.478Z",
    to_date = "2022-04-23T19:07:54.478Z",
    interval = "KLINE_INTERVAL_15MINUTE",
    symbol = "BTCUSDT"
) {
    const body = {
        from_date,
        to_date,
        interval,
        symbol,
    };

    return await sendPostRequest("/v1/pricechannel", body);
}

async function getRisingFallingTrendFromApi(
    from_date = "2022-04-01T19:07:54.478Z",
    to_date = "2022-04-23T19:07:54.478Z",
    interval = "KLINE_INTERVAL_15MINUTE",
    symbol = "BTCUSDT"
) {
    const body = {
        from_date,
        to_date,
        interval,
        symbol,
    };
    return await sendPostRequest("/v1/risingfallingtrend", body);
}

async function getSupportResistanceFromApi(
    from_date = "2022-04-01T19:07:54.478Z",
    to_date = "2022-04-23T19:07:54.478Z",
    interval = "KLINE_INTERVAL_15MINUTE",
    symbol = "BTCUSDT"
) {
    const body = {
        from_date,
        to_date,
        interval,
        symbol,
    };
    return await sendPostRequest("/v1/supportresistance", body);
}

async function getTriangleTrendLineFromApi(
    from_date = "2022-04-01T19:07:54.478Z",
    to_date = "2022-04-23T19:07:54.478Z",
    interval = "KLINE_INTERVAL_15MINUTE",
    symbol = "BTCUSDT"
) {
    const body = {
        from_date,
        to_date,
        interval,
        symbol,
    };
    return await sendPostRequest("/v1/triangletrendline", body);
}

async function getExchanceCoinsList() {
    // Excahange list localstorage'a yazılır
    const saved = localStorage?.getItem("coinsList") || null;
    if (!saved) {
        const apiRes = await sendPostRequest("/v1/getexchancecoinslist", {
            exchange: "string",
        });
        if (apiRes.ok) {
            localStorage?.setItem("coinsList", JSON.stringify(apiRes.data));
        }
        return apiRes;
    } else {
        const _data = JSON.parse(saved);
        return { data: _data };
    }
}

function setValueToLocalStorage(key, val) {
    localStorage?.setItem(key, val);
}

function getValueFromLocalStorage(key) {
    return localStorage?.getItem(key) || null;
}

function removeValueFromLocalStorage(key) {
    localStorage?.removeItem(key);
}

async function signIn(username, password) {
    return await signInRequest(username, password);
}

async function signUp(username, email, password) {
    return await signUpRequest(username, email, password);
}

function calculateDates(interval, dates = {}) {
    let { toDate = null, fromDate = null } = dates;
    if (!toDate) toDate = new Date();
    let momentDate = moment(toDate);
    const missingDays = getMissingDays(interval);
    fromDate = momentDate.subtract(missingDays, "days").toDate();
    return { fromDate, toDate };
}

async function updateUserProfile(profile) {
    const newProfile = Object.keys(profile).reduce((prev, current) => {
        const newValue = { ...prev };
        const currentVal = profile[current];
        if (currentVal) newValue[current] = profile[current];
        return newValue;
    }, {});

    const res = await sendPostRequest("/v1/update", newProfile);
    return res;
}

// Olması gerekenden daha az veri varsa tarih ayarlanır.
function calculateTrueDates(dates, selectedInterval) {
    let toDate = moment(dates.toDate);
    let fromDate = moment(dates.fromDate);
    const delta = toDate.diff(fromDate, "days") + 1;
    const interval = Object.keys(selectedInterval)[0];
    const missingDays = getMissingDays(interval);
    if (delta < missingDays) {
        const resDates = calculateDates(interval, { toDate: dates.toDate });
        fromDate = resDates.fromDate;
        toDate = resDates.toDate;
    } else {
        fromDate = fromDate.toDate();
        toDate = toDate.toDate();
    }
    return { toDate, fromDate };
}

function basicCheck(val1, val2){
    return JSON.stringify(val1) === JSON.stringify(val2)
}

function convertIsoDate(_date){
    function pad(number) {
        if (number < 10) {
          return '0' + number;
        }
        return number;
      }
    return _date.getFullYear() +
    '-' + pad(_date.getMonth() + 1) +
    '-' + pad(_date.getDate()) +
    'T' + pad(_date.getHours()) +
    ':' + pad(_date.getMinutes()) +
    ':' + pad(_date.getSeconds()) +
    '.' + (_date.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
    'Z';;
}

function formatDate(date){
    const format = timeFormat("%d %b %Y %H:%M");
    return format(date);
}

// TO DO logout

export {
    getDataFromApi,
    setRealTimeListener,
    getPriceChannelFromApi,
    getSupportResistanceFromApi,
    getRisingFallingTrendFromApi,
    cleanListener,
    getExchanceCoinsList,
    setValueToLocalStorage,
    getValueFromLocalStorage,
    signIn,
    signUp,
    calculateDates,
    removeValueFromLocalStorage,
    updateUserProfile,
    calculateTrueDates,
    basicCheck,
    convertIsoDate,
    formatDate,
    getTriangleTrendLineFromApi
};
