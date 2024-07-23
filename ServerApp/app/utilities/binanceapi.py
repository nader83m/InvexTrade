from binance import Client
from datetime import datetime, timedelta


class BinanceApi:
    def __init__(self):
        self.__api_key = "TWb3vZYvyNpclxsf50yFBgavRcGeIMafjGLLC4Qy3hbH0gl5Bdq1LHryt8fyZd8P"
        self.__api_secret = "Q1moeEsZ64RYIMwVtTEGWrh4f2zs5xhTWOblN1u8eLS26XZQhY1PGTnrOxBKluQS"
        self.__client = None
        self.init()

    def init(self):
        self.__client = Client(self.__api_key, self.__api_secret)

    def get_candlestick_data(self, symbol="BTCUSDT", interval=Client.KLINE_INTERVAL_15MINUTE,
                             startTime=str(datetime.now() - timedelta(days=1)), endTime=str(datetime.now()), timestamp=True):

        candlestick_data = self.__client.get_historical_klines(symbol, interval,
                                                      startTime, endTime)
        candlestick_data_list = []
        for item in candlestick_data:
            candle = {}
            if timestamp:
                candle['time'] = item[0]
            else:
                candle['time'] = datetime.fromtimestamp(item[0]/1000).strftime("%d.%m.%Y %H:%M:%S.%f")

            candle['open'] = item[1]
            candle['high'] = item[2]
            candle['low'] = item[3]
            candle['close'] = item[4]
            candle['volume'] = item[5]
            candle['timastamp'] = item[0]

            candlestick_data_list.append(candle)

        return candlestick_data_list

    def get_coins_list(self):
        coin_list = self.__client.get_all_tickers()
        return coin_list
