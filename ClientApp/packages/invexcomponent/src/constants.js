export function getIntervalsList() {
    return [
        { KLINE_INTERVAL_15MINUTE: "15 minutes" },
        { KLINE_INTERVAL_30MINUTE: "30 minutes" },
        { KLINE_INTERVAL_1HOUR: "1 hour" },
        { KLINE_INTERVAL_2HOUR: "2 hours" },
        { KLINE_INTERVAL_4HOUR: "4 hours" },
        { KLINE_INTERVAL_6HOUR: "6 hours" },
        { KLINE_INTERVAL_8HOUR: "8 hours" },
        { KLINE_INTERVAL_12HOUR: "12 hours" },
        { KLINE_INTERVAL_1DAY: "1 day" },
        { KLINE_INTERVAL_3DAY: "3 days" },
        { KLINE_INTERVAL_1WEEK: "1 week" },
        { KLINE_INTERVAL_1MONTH: "1 month" },
    ];
}

export function getIntervalMinutes() {
    return {
        KLINE_INTERVAL_15MINUTE: 15,
        KLINE_INTERVAL_30MINUTE: 30,
        KLINE_INTERVAL_1HOUR: 60,
        KLINE_INTERVAL_2HOUR: 120,
        KLINE_INTERVAL_4HOUR: 240,
        KLINE_INTERVAL_6HOUR: 260,
        KLINE_INTERVAL_8HOUR: 480,
        KLINE_INTERVAL_12HOUR: 720,
        KLINE_INTERVAL_1DAY: 1440,
        KLINE_INTERVAL_3DAY: 4320,
        KLINE_INTERVAL_1WEEK: 10080,
        KLINE_INTERVAL_1MONTH: 43200
    };
}

// Seçilen interval'e göre eksilmesi gereken gün sayısını verir
export function getMissingDays(key) {
    const obj = {
        KLINE_INTERVAL_15MINUTE: 1,
        KLINE_INTERVAL_30MINUTE: 2,
        KLINE_INTERVAL_1HOUR: 4,
        KLINE_INTERVAL_2HOUR: 8,
        KLINE_INTERVAL_4HOUR: 16,
        KLINE_INTERVAL_6HOUR: 24,
        KLINE_INTERVAL_8HOUR: 32,
        KLINE_INTERVAL_12HOUR: 48,
        KLINE_INTERVAL_1DAY: 96,
        KLINE_INTERVAL_3DAY: 288,
        KLINE_INTERVAL_1WEEK: 672,
        KLINE_INTERVAL_1MONTH: 2880,
    };
    return obj[key];
}

export function binanceSocketEquality(obj) {
    const key = Object.keys(obj)[0];
    const equalityObj = {
        KLINE_INTERVAL_15MINUTE: "15m",
        KLINE_INTERVAL_30MINUTE: "30m",
        KLINE_INTERVAL_1HOUR: "1h",
        KLINE_INTERVAL_2HOUR: "2h",
        KLINE_INTERVAL_4HOUR: "4h",
        KLINE_INTERVAL_6HOUR: "6h",
        KLINE_INTERVAL_8HOUR: "8h",
        KLINE_INTERVAL_12HOUR: "12h",
        KLINE_INTERVAL_1DAY: "1d",
        KLINE_INTERVAL_3DAY: "3d",
        KLINE_INTERVAL_1WEEK: "1w",
        KLINE_INTERVAL_1MONTH: "1M",
    };
    return equalityObj[key];
}

export const indicatorDefaults = {
    PRICE: {
        name : "PRICE",
        text: "Price Channel",
        stroke: 3,
        color1: "#FF0000",
        color2: "#00FF00"
    },
    RISINGFALLING: {
        name : "RISINGFALLING",
        text: "Rising Falling Trend",
        stroke: 3,
        color1: "#F5A442",
        color2: "#42F5B6"
    },
    SUPPORT: {
        name : "SUPPORT",
        text: "Support Resistance",
        stroke: 3,
        color1: "#0000FF",
        color2: "#800080"
    },
    TRIANGLE: {
        name : "TRIANGLE",
        text: "Triangle Trend Line",
        stroke: 3,
        color1: "#22f2eb",
        color2: "#e4f222",
    }
}

export const strategiesDefaults = {
    ELDER: {
        name : "ELDER",
        text: "Elder Ray"
    },
    EMA26: {
        name : "EMA26",
        text: "Ema(26)"
    },
    EMA12: {
        name : "EMA12",
        text: "Ema(12)"
    }
}
