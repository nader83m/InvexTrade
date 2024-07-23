import pandas as pd
import numpy as np
from scipy.stats import linregress
import json
from pprint import pprint

class TrendLines:

    def rising_falling_trendline(self, data):

        df = pd.DataFrame.from_dict(data, orient='columns')
        df['open'] = df['open'].astype(float)
        df['high'] = df['high'].astype(float)
        df['low'] = df['low'].astype(float)
        df['close'] = df['close'].astype(float)
        df['volume'] = df['volume'].astype(float)

        df.columns = ['time', 'open', 'high', 'low', 'close', 'volume', 'timastamp']
        df = df[df['volume'] != 0]
        df.reset_index(drop=True, inplace=True)
        df.isna().sum()
        data_length = df.shape[0]
        print(df.shape)
        def pivotid(df1, l, n1, n2):  # n1 n2 before and after candle l
            if l - n1 < 0 or l + n2 >= len(df1):
                return 0

            pividlow = 1
            pividhigh = 1
            for i in range(l - n1, l + n2 + 1):
                if (df1.low[l] > df1.low[i]):
                    pividlow = 0
                if (df1.high[l] < df1.high[i]):
                    pividhigh = 0
            if pividlow and pividhigh:
                return 3
            elif pividlow:
                return 1
            elif pividhigh:
                return 2
            else:
                return 0

        df['pivot'] = df.apply(lambda x: pivotid(df, x.name, 3, 3), axis=1)

        import numpy as np
        def pointpos(x):
            if x['pivot'] == 1:
                return x['low'] - 1e-3
            elif x['pivot'] == 2:
                return x['high'] + 1e-3
            else:
                return np.nan

        df['pointpos'] = df.apply(lambda row: pointpos(row), axis=1)

        backcandles = data_length - 4

        candleid = data_length - 2

        maxim = np.array([])
        minim = np.array([])
        xxmin = np.array([])
        xxmax = np.array([])
        try:
            for i in range(candleid - backcandles, candleid):
                if df.iloc[i].pivot == 1:
                    minim = np.append(minim, df.iloc[i].low)
                    xxmin = np.append(xxmin, i)  # could be i instead df.iloc[i].name
                if df.iloc[i].pivot == 2:
                    maxim = np.append(maxim, df.iloc[i].high)
                    xxmax = np.append(xxmax, i)  # df.iloc[i].name

            slmin, intercmin, rmin, pmin, semin = linregress(xxmin, minim)
            slmax, intercmax, rmax, pmax, semax = linregress(xxmax, maxim)
            xxmin = np.append(xxmin, xxmin[-1] + 15)
            xxmax = np.append(xxmax, xxmax[-1] + 15)

            last_i = 1
            while xxmin[-last_i] >= data_length or xxmax[-last_i] >= data_length:
                last_i = last_i + 1

            yymin = slmin * xxmin + intercmin

            yymax = slmax * xxmax + intercmax

            lines = {
                "x1_min": str(df.iloc[int(xxmin[0])][6]),
                "x2_min": str(df.iloc[int(xxmin[-last_i])][6]),
                "y1_min": yymin[0],
                "y2_min": yymin[-last_i],
                "x1_max": str(df.iloc[int(xxmax[0])][6]),
                "x2_max": str(df.iloc[int(xxmax[-last_i])][6]),
                "y1_max": yymax[0],
                "y2_max": yymax[-last_i],
            }
        except:
            return False

        return lines

    def price_trendline(self, data):

        df = pd.DataFrame.from_dict(data, orient='columns')
        df['open'] = df['open'].astype(float)
        df['high'] = df['high'].astype(float)
        df['low'] = df['low'].astype(float)
        df['close'] = df['close'].astype(float)
        df['volume'] = df['volume'].astype(float)

        df.columns = ['time', 'open', 'high', 'low', 'close', 'volume', 'timastamp']
        df = df[df['volume'] != 0]
        df.reset_index(drop=True, inplace=True)
        df.isna().sum()
        data_length = df.shape[0]
        # backcandles = 100
        # candleid = 1000
        brange = 10  # should be less than backcandles
        wind = 5
        candleid = data_length - (data_length % brange)
        backcandles = candleid - (brange)
        optbackcandles = backcandles
        sldiff = 100
        sldist = 10000
        try:
            for r1 in range(backcandles - brange, backcandles + brange):
                maxim = np.array([])
                minim = np.array([])
                xxmin = np.array([])
                xxmax = np.array([])
                # print(r1)
                for i in range(candleid - r1, candleid + 1, wind):
                    # print(i)
                    # print(df.iloc[i:i + wind])
                    minim = np.append(minim, df.low.iloc[i:i + wind].min())
                    # print(df.low.iloc[i:i + wind].min())
                    xxmin = np.append(xxmin, df.low.iloc[i:i + wind].idxmin())
                for i in range(candleid - r1, candleid + 1, wind):
                    maxim = np.append(maxim, df.high.loc[i:i + wind].max())
                    xxmax = np.append(xxmax, df.high.iloc[i:i + wind].idxmax())

                slmin, intercmin = np.polyfit(xxmin, minim, 1)
                slmax, intercmax = np.polyfit(xxmax, maxim, 1)

                dist = (slmax * candleid + intercmax) - (slmin * candleid + intercmin)
                if (dist < sldist):  # abs(slmin-slmax)<sldiff and
                    # sldiff = abs(slmin-slmax)
                    sldist = dist
                    optbackcandles = r1
                    slminopt = slmin
                    slmaxopt = slmax
                    intercminopt = intercmin
                    intercmaxopt = intercmax
                    maximopt = maxim.copy()
                    minimopt = minim.copy()
                    xxminopt = xxmin.copy()
                    xxmaxopt = xxmax.copy()

            dfpl = df[candleid - wind - optbackcandles - backcandles:candleid + optbackcandles]
            dfpl = df

            adjintercmax = (df.high.iloc[xxmaxopt] - slmaxopt * xxmaxopt).max()
            adjintercmin = (df.low.iloc[xxminopt] - slminopt * xxminopt).min()
            y_min = slminopt * xxminopt + adjintercmin
            y_max = slmaxopt * xxmaxopt + adjintercmax

            lines = {
                "x1_min": str(df.iloc[int(xxminopt[0])][6]),
                "x2_min": str(df.iloc[int(xxminopt[-1])][6]),
                "y1_min": y_min[0],
                "y2_min": y_min[-1],
                "x1_max": str(df.iloc[int(xxmaxopt[0])][6]),
                "x2_max": str(df.iloc[int(xxmaxopt[-1])][6]),
                "y1_max": y_max[0],
                "y2_max": y_max[-1],
            }
        except:
            return False

        return lines

    def triangle_trendline(self, data):

        try:
            df = pd.DataFrame.from_dict(data, orient='columns')
            df['open'] = df['open'].astype(float)
            df['high'] = df['high'].astype(float)
            df['low'] = df['low'].astype(float)
            df['close'] = df['close'].astype(float)
            df['volume'] = df['volume'].astype(float)

            df.columns = ['time', 'open', 'high', 'low', 'close', 'volume', 'timstamp']
            df = df[df['volume'] != 0]
            df.reset_index(drop=True, inplace=True)
            df.isna().sum()
            data_length = df.shape[0]
            df = df.rename(columns={'time': 'Date', 'open': 'Open', 'high': 'High', 'low': 'Low', 'close': 'Close',
                                    'volume': 'Volume', 'timstamp': 'Timestamp'}, inplace=False)

            # The minimum that the line must extend
            line_len_min = 2
            line_dist = 2
            # The maximum that a line can extend
            day_diff = 17

            # When matching up the lines, this is the difference in days that the
            # lines are able to extend
            match_diff_start = 2
            match_diff_end = 2
            # ----------------------

            # Create an numpy array for highs, lows, and dates from DataFrame
            highs = np.array(df['High'])
            lows = np.array(df['Low'])
            dates = np.array(df['Date'])
            days = int(highs.size)


            # Connects all of the highs together and lows together
            # p.line(dates, highs)
            # p.line(dates, lows)

            # ----------------Find the Swings-----------------------------
            # Stores the day(index) at which a max/min is found
            # Will create a dataframe of this later
            max_prices = []
            max_dates = []
            max_days = []
            min_prices = []
            min_dates = []
            min_days = []
            # This for loop will find the peak of the highs
            # This also signifies a swing pattern throughout the days
            for x in range(1, days - 1):
                if highs[x - 1] < highs[x] > highs[x + 1] or x == 1:
                    # p.circle(dates[x],highs[x])
                    max_prices.append(highs[x])
                    max_dates.append(dates[x])
                    max_days.append(x)

            for y in range(1, days - 1):
                if lows[y - 1] > lows[y] < lows[y + 1]:
                    # p.circle(dates[y],lows[y])
                    min_prices.append(lows[y])
                    min_dates.append(dates[y])
                    min_days.append(y)
            # --------------------------------------------------------
            # p.line([min_dates], [min_prices], color = "black")

            # ------------------Find Possible Lines-------------------
            # find all the combinations from a positive to a negative slope and draw that line
            # we only care about localized regions, so we can edit that with line_len_min/day_diff
            max_days_size = len(max_prices)
            start_day_max = []
            start_date_max = []
            start_price_max = []
            end_day_max = []
            end_date_max = []
            end_price_max = []

            # Find possible lines that are negatively sloping and fall within the range
            for x in range(max_days_size - line_len_min):
                # graph every slope that creates a negative within our range
                start_day = max_days[x]
                final_day = start_day + line_len_min + day_diff
                for y in range(x + line_len_min, max_days_size):
                    if (max_prices[x] <= max_prices[y]):
                        break
                    # x signifies a starting point, y will signify the 5 points in between
                    if (max_days[y] < final_day):
                        # Make sure intermediate prices are less than initial day
                        change_in_price = max_prices[y] - max_prices[x]
                        if (change_in_price <= 0):
                            # p.line([max_dates[x],max_dates[y]],[max_prices[x],max_prices[y]], color = "orange");
                            # add this data to the arrays
                            start_day_max.append(max_days[x])
                            start_date_max.append(max_dates[x])
                            start_price_max.append(max_prices[x])
                            end_day_max.append(max_days[y])
                            end_date_max.append(max_dates[y])
                            end_price_max.append(max_prices[y])

            # Repeat the same process as above
            min_days_size = len(min_prices)
            start_day_min = []
            start_date_min = []
            start_price_min = []
            end_date_min = []
            end_day_min = []
            end_price_min = []
            for x in range(min_days_size - line_len_min):
                # graph every slope that creates a positive within 5 points
                start_day = min_days[x]
                final_day = start_day + line_len_min + day_diff
                for y in range(x + line_len_min, min_days_size):
                    if (min_prices[x] >= min_prices[y]):
                        break
                    # x signifies a starting point, y will signify the 5 points in between
                    if (min_days[y] < final_day):
                        # Make sure intermediate prices are less than initial day
                        change_in_price = min_prices[y] - min_prices[x]
                        if (change_in_price > 0):
                            # p.line([min_dates[x],min_dates[y]],[min_prices[x],min_prices[y]], color = "blue");
                            start_day_min.append(min_days[x])
                            start_date_min.append(min_dates[x])
                            start_price_min.append(min_prices[x])
                            end_day_min.append(min_days[y])
                            end_date_min.append(min_dates[y])
                            end_price_min.append(min_prices[y])
            # -------------------------------------------------------------------------

            # -------------Find Matches----------------------------------------------
            # Try to match the starts and the ends of each parameter, with a range of each
            num_lines_max = len(start_day_max)
            num_lines_min = len(start_day_min)

            force_start = 0

            lines = []
            for x in range(num_lines_max):
                # go through each of the lines to meet these parameters:
                # 1! starting day of min and max must be +-x days apart (use abs())
                # 2! ending day of min and max must be +-x days apart
                # match_diff_start
                # match_diff_end
                # Make sure that we don't repeat by setting another parameter: our start day must be
                # larger than force_start, so our lines won't overlap
                for y in range(num_lines_min):
                    if (start_day_max[x] < force_start > start_day_min[y]):
                        break
                    # parameters used to identify a correct line
                    if (abs(start_day_max[x] - start_day_min[y]) <= match_diff_start and
                            abs(end_day_max[x] - end_day_min[y]) <= match_diff_end and start_day_max[
                                x] > force_start + line_dist < start_day_min[y]):
                        maxStartIndex = df.index[df['Date'] == start_date_max[x]].tolist()
                        maxEndIndex = df.index[df['Date'] == end_date_max[x]].tolist()

                        minStartIndex = df.index[df['Date'] == start_date_min[y]].tolist()
                        minEndIndex = df.index[df['Date'] == end_date_min[y]].tolist()


                        min_line = {
                            "type": "min",
                            "x1": df.loc[minStartIndex]['Timestamp'].tolist()[0],
                            "x2": df.loc[minEndIndex]['Timestamp'].tolist()[0],
                            "y1": start_price_min[y],
                            "y2": end_price_min[y],
                        }

                        max_line = {
                            "type": "max",
                            "x1": df.loc[maxStartIndex]['Timestamp'].tolist()[0],
                            "x2": df.loc[maxEndIndex]['Timestamp'].tolist()[0],
                            "y1": start_price_max[x],
                            "y2": end_price_max[x],
                        }

                        lines.append(max_line)
                        lines.append(min_line)

                        force_start = start_day_max[x]
        except:
            lines = []
            
        return lines


    def is_far_from_level(self, value, levels, df):
        ave = np.mean(df['high'] - df['low'])
        return np.sum([abs(value - level) < ave for _, level in levels]) == 0

    def support_resistance_trendline(self, data):
        df = pd.DataFrame.from_dict(data, orient='columns')
        df['open'] = df['open'].astype(float)
        df['high'] = df['high'].astype(float)
        df['low'] = df['low'].astype(float)
        df['close'] = df['close'].astype(float)
        df['volume'] = df['volume'].astype(float)

        df.columns = ['time', 'open', 'high', 'low', 'close', 'volume', 'timastamp']
        df = df[df['volume'] != 0]
        df.reset_index(drop=True, inplace=True)
        df.isna().sum()
        data_length = df.shape[0]
        pivots = []
        pivots_real = []
        max_list = []
        min_list = []
        for i in range(5, len(df) - 5):
            # taking a window of 9 candles
            high_range = df['high'][i - 5:i + 4]
            current_max = high_range.max()
            # if we find a new maximum value, empty the max_list
            if current_max not in max_list:
                max_list = []
            max_list.append(current_max)
            # if the maximum value remains the same after shifting 5 times
            if len(max_list) == 5 and self.is_far_from_level(current_max, pivots, df):
                pivots.append((df['timastamp'][high_range.idxmin()], current_max))
                pivots_real.append({'timastamp': str(df['timastamp'][high_range.idxmin()]), 'price': str(current_max), 'type': 'resistance'})


            low_range = df['low'][i - 5:i + 5]
            current_min = low_range.min()
            if current_min not in min_list:
                min_list = []
            min_list.append(current_min)

            if len(min_list) == 5 and self.is_far_from_level(current_min, pivots, df):
                pivots.append((df['timastamp'][low_range.idxmin()], current_min))
                pivots_real.append({'timastamp': str(df['timastamp'][low_range.idxmin()]), 'price': str(current_min), 'type': 'support'})

        return pivots_real