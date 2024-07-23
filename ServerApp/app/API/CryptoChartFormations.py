from flask import Blueprint, request, jsonify
from flask_restful import Resource
from app.utilities.binanceapi import BinanceApi
from app.utilities.trendlines import TrendLines
from binance import Client
from flask_jwt_extended import jwt_required
import json
from flask_cors import cross_origin


bApi = BinanceApi()
trend_line = TrendLines()


class PriceChannelController(Resource):
    @jwt_required()
    @cross_origin()
    def post(self):
        """
        Create a new user
        User register endpoint
        ---
        tags:
          - Chart Formations
        summary: Creates a new user
        security:
          - APIKeyHeader: ['Authentication']
        consumes:
          - application/json
        produces:
          - application/json
        parameters:
          - in: body
            name: body
            description:
              User object that needs to be persisted to the database
            required: true
            schema:
              id: Formation_Params
              properties:
                from_date:
                  type: string
                  format: date-time
                  default: 2022-01-01T12:00:00.0
                to_date:
                  type: string
                  format: date-time
                  default: 2022-01-01T12:00:00.0
                symbol:
                  type: string
                  description: symbol
                  default: BTCUSDT
                interval:
                  type: string
                  description: interval
                  default: KLINE_INTERVAL_15MINUTE
        responses:
          200:
            description: Successful operation
          400:
            description: Invalid input
        """
        params = request.get_json()  # store the json body request
        from_date = params["from_date"]
        to_date = params["to_date"]
        symbol = params["symbol"]
        interval = params["interval"]

        if interval == "KLINE_INTERVAL_1MINUTE":
            interval = Client.KLINE_INTERVAL_1MINUTE
        elif interval == "KLINE_INTERVAL_3MINUTE":
            interval = Client.KLINE_INTERVAL_3MINUTE
        elif interval == "KLINE_INTERVAL_5MINUTE":
            interval = Client.KLINE_INTERVAL_5MINUTE
        elif interval == "KLINE_INTERVAL_15MINUTE":
            interval = Client.KLINE_INTERVAL_15MINUTE
        elif interval == "KLINE_INTERVAL_30MINUTE":
            interval = Client.KLINE_INTERVAL_30MINUTE
        elif interval == "KLINE_INTERVAL_1HOUR":
            interval = Client.KLINE_INTERVAL_1HOUR
        elif interval == "KLINE_INTERVAL_2HOUR":
            interval = Client.KLINE_INTERVAL_2HOUR
        elif interval == "KLINE_INTERVAL_4HOUR":
            interval = Client.KLINE_INTERVAL_4HOUR
        elif interval == "KLINE_INTERVAL_6HOUR":
            interval = Client.KLINE_INTERVAL_6HOUR
        elif interval == "KLINE_INTERVAL_8HOUR":
            interval = Client.KLINE_INTERVAL_8HOUR
        elif interval == "KLINE_INTERVAL_12HOUR":
            interval = Client.KLINE_INTERVAL_12HOUR
        elif interval == "KLINE_INTERVAL_1DAY":
            interval = Client.KLINE_INTERVAL_1DAY
        elif interval == "KLINE_INTERVAL_3DAY":
            interval = Client.KLINE_INTERVAL_3DAY
        elif interval == "KLINE_INTERVAL_1WEEK":
            interval = Client.KLINE_INTERVAL_1WEEK
        elif interval == "KLINE_INTERVAL_1MONTH":
            interval = Client.KLINE_INTERVAL_1MONTH
        candlestick_data_list = bApi.get_candlestick_data(symbol, interval, str(from_date), str(to_date), timestamp=False)
        lines = trend_line.price_trendline(candlestick_data_list)

        if lines:
            lines["success"] = True
            lines["msg"] = "True"
            return jsonify(lines)
        else:
            lines = {}
            lines["success"] = False
            lines["msg"] = "The number of candles displayed on the chart should be more than 30. Keep this in mind and try again."
            return jsonify(lines)


class TriangleTrendlineController(Resource):
    @jwt_required()
    @cross_origin()
    def post(self):
        """
        Create a new user
        User register endpoint
        ---
        tags:
          - Chart Formations
        summary: Creates a new user
        security:
          - APIKeyHeader: ['Authentication']
        consumes:
          - application/json
        produces:
          - application/json
        parameters:
          - in: body
            name: body
            description:
              User object that needs to be persisted to the database
            required: true
            schema:
              id: T_T_Formation_Params
              properties:
                from_date:
                  type: string
                  format: date-time
                  default: 2022-01-01T12:00:00.0
                to_date:
                  type: string
                  format: date-time
                  default: 2022-01-01T12:00:00.0
                symbol:
                  type: string
                  description: symbol
                  default: BTCUSDT
                interval:
                  type: string
                  description: interval
                  default: KLINE_INTERVAL_15MINUTE
        responses:
          200:
            description: Successful operation
          400:
            description: Invalid input
        """
        params = request.get_json()  # store the json body request
        from_date = params["from_date"]
        to_date = params["to_date"]
        symbol = params["symbol"]
        interval = params["interval"]

        if interval == "KLINE_INTERVAL_1MINUTE":
            interval = Client.KLINE_INTERVAL_1MINUTE
        elif interval == "KLINE_INTERVAL_3MINUTE":
            interval = Client.KLINE_INTERVAL_3MINUTE
        elif interval == "KLINE_INTERVAL_5MINUTE":
            interval = Client.KLINE_INTERVAL_5MINUTE
        elif interval == "KLINE_INTERVAL_15MINUTE":
            interval = Client.KLINE_INTERVAL_15MINUTE
        elif interval == "KLINE_INTERVAL_30MINUTE":
            interval = Client.KLINE_INTERVAL_30MINUTE
        elif interval == "KLINE_INTERVAL_1HOUR":
            interval = Client.KLINE_INTERVAL_1HOUR
        elif interval == "KLINE_INTERVAL_2HOUR":
            interval = Client.KLINE_INTERVAL_2HOUR
        elif interval == "KLINE_INTERVAL_4HOUR":
            interval = Client.KLINE_INTERVAL_4HOUR
        elif interval == "KLINE_INTERVAL_6HOUR":
            interval = Client.KLINE_INTERVAL_6HOUR
        elif interval == "KLINE_INTERVAL_8HOUR":
            interval = Client.KLINE_INTERVAL_8HOUR
        elif interval == "KLINE_INTERVAL_12HOUR":
            interval = Client.KLINE_INTERVAL_12HOUR
        elif interval == "KLINE_INTERVAL_1DAY":
            interval = Client.KLINE_INTERVAL_1DAY
        elif interval == "KLINE_INTERVAL_3DAY":
            interval = Client.KLINE_INTERVAL_3DAY
        elif interval == "KLINE_INTERVAL_1WEEK":
            interval = Client.KLINE_INTERVAL_1WEEK
        elif interval == "KLINE_INTERVAL_1MONTH":
            interval = Client.KLINE_INTERVAL_1MONTH
        candlestick_data_list = bApi.get_candlestick_data(symbol, interval, str(from_date), str(to_date), timestamp=False)
        lines = trend_line.triangle_trendline(candlestick_data_list)
        res = {}
        if lines:
            res["success"] = True
            res["msg"] = "True"
            res['lines'] = lines
            # return jsonify(lines)
        else:
            # res = {}
            res["success"] = False
            res["msg"] = "There is no triangle formation in the time frame you selected, Please change the time frame and try again."
            res['lines'] = lines

        return jsonify(res)

class RisingFallingTrendController(Resource):
    @jwt_required()
    @cross_origin()
    def post(self):
        """
        Create a new user
        User register endpoint
        ---
        tags:
          - Chart Formations
        summary: Creates a new user
        security:
          - APIKeyHeader: ['Authentication']
        consumes:
          - application/json
        produces:
          - application/json
        parameters:
          - in: body
            name: body
            description:
              User object that needs to be persisted to the database
            required: true
            schema:
              id: R_F_Formation_Params
              properties:
                from_date:
                  type: string
                  format: date-time
                  default: 2022-01-01T12:00:00.0
                to_date:
                  type: string
                  format: date-time
                  default: 2022-01-01T12:00:00.0
                symbol:
                  type: string
                  description: symbol
                  default: BTCUSDT
                interval:
                  type: string
                  description: interval
                  default: KLINE_INTERVAL_15MINUTE
        responses:
          200:
            description: Successful operation
          400:
            description: Invalid input
        """
        params = request.get_json()  # store the json body request
        from_date = params["from_date"]
        to_date = params["to_date"]
        symbol = params["symbol"]
        interval = params["interval"]

        if interval == "KLINE_INTERVAL_1MINUTE":
            interval = Client.KLINE_INTERVAL_1MINUTE
        elif interval == "KLINE_INTERVAL_3MINUTE":
            interval = Client.KLINE_INTERVAL_3MINUTE
        elif interval == "KLINE_INTERVAL_5MINUTE":
            interval = Client.KLINE_INTERVAL_5MINUTE
        elif interval == "KLINE_INTERVAL_15MINUTE":
            interval = Client.KLINE_INTERVAL_15MINUTE
        elif interval == "KLINE_INTERVAL_30MINUTE":
            interval = Client.KLINE_INTERVAL_30MINUTE
        elif interval == "KLINE_INTERVAL_1HOUR":
            interval = Client.KLINE_INTERVAL_1HOUR
        elif interval == "KLINE_INTERVAL_2HOUR":
            interval = Client.KLINE_INTERVAL_2HOUR
        elif interval == "KLINE_INTERVAL_4HOUR":
            interval = Client.KLINE_INTERVAL_4HOUR
        elif interval == "KLINE_INTERVAL_6HOUR":
            interval = Client.KLINE_INTERVAL_6HOUR
        elif interval == "KLINE_INTERVAL_8HOUR":
            interval = Client.KLINE_INTERVAL_8HOUR
        elif interval == "KLINE_INTERVAL_12HOUR":
            interval = Client.KLINE_INTERVAL_12HOUR
        elif interval == "KLINE_INTERVAL_1DAY":
            interval = Client.KLINE_INTERVAL_1DAY
        elif interval == "KLINE_INTERVAL_3DAY":
            interval = Client.KLINE_INTERVAL_3DAY
        elif interval == "KLINE_INTERVAL_1WEEK":
            interval = Client.KLINE_INTERVAL_1WEEK
        elif interval == "KLINE_INTERVAL_1MONTH":
            interval = Client.KLINE_INTERVAL_1MONTH
        candlestick_data_list = bApi.get_candlestick_data(symbol, interval, str(from_date), str(to_date), timestamp=False)
        lines = trend_line.rising_falling_trendline(candlestick_data_list)

        if lines:
            lines["success"] = True
            lines["msg"] = "True"
            return jsonify(lines)
        else:
            lines = {}
            lines["success"] = False
            lines["msg"] = "The number of candles displayed on the chart should be more than 30. Keep this in mind and try again."
            return jsonify(lines)

class SupportResistanceController(Resource):
    @jwt_required()
    @cross_origin()
    def post(self):
        """
        Create a new user
        User register endpoint
        ---
        tags:
          - Chart Formations
        summary: Creates a new user
        security:
          - APIKeyHeader: ['Authentication']
        consumes:
          - application/json
        produces:
          - application/json
        parameters:
          - in: body
            name: body
            description:
              User object that needs to be persisted to the database
            required: true
            schema:
              id: Formation_Params
              properties:
                from_date:
                  type: string
                  format: date-time
                  default: 2022-01-01T12:00:00.0
                to_date:
                  type: string
                  format: date-time
                  default: 2022-01-01T12:00:00.0
                symbol:
                  type: string
                  description: symbol
                  default: BTCUSDT
                interval:
                  type: string
                  description: interval
                  default: KLINE_INTERVAL_15MINUTE
        responses:
          200:
            description: Successful operation
          400:
            description: Invalid input
        """
        params = request.get_json()  # store the json body request
        from_date = params["from_date"]
        to_date = params["to_date"]
        symbol = params["symbol"]
        interval = params["interval"]

        if interval == "KLINE_INTERVAL_1MINUTE":
            interval = Client.KLINE_INTERVAL_1MINUTE
        elif interval == "KLINE_INTERVAL_3MINUTE":
            interval = Client.KLINE_INTERVAL_3MINUTE
        elif interval == "KLINE_INTERVAL_5MINUTE":
            interval = Client.KLINE_INTERVAL_5MINUTE
        elif interval == "KLINE_INTERVAL_15MINUTE":
            interval = Client.KLINE_INTERVAL_15MINUTE
        elif interval == "KLINE_INTERVAL_30MINUTE":
            interval = Client.KLINE_INTERVAL_30MINUTE
        elif interval == "KLINE_INTERVAL_1HOUR":
            interval = Client.KLINE_INTERVAL_1HOUR
        elif interval == "KLINE_INTERVAL_2HOUR":
            interval = Client.KLINE_INTERVAL_2HOUR
        elif interval == "KLINE_INTERVAL_4HOUR":
            interval = Client.KLINE_INTERVAL_4HOUR
        elif interval == "KLINE_INTERVAL_6HOUR":
            interval = Client.KLINE_INTERVAL_6HOUR
        elif interval == "KLINE_INTERVAL_8HOUR":
            interval = Client.KLINE_INTERVAL_8HOUR
        elif interval == "KLINE_INTERVAL_12HOUR":
            interval = Client.KLINE_INTERVAL_12HOUR
        elif interval == "KLINE_INTERVAL_1DAY":
            interval = Client.KLINE_INTERVAL_1DAY
        elif interval == "KLINE_INTERVAL_3DAY":
            interval = Client.KLINE_INTERVAL_3DAY
        elif interval == "KLINE_INTERVAL_1WEEK":
            interval = Client.KLINE_INTERVAL_1WEEK
        elif interval == "KLINE_INTERVAL_1MONTH":
            interval = Client.KLINE_INTERVAL_1MONTH
        candlestick_data_list = bApi.get_candlestick_data(symbol, interval, str(from_date), str(to_date), timestamp=False)
        lines = trend_line.support_resistance_trendline(candlestick_data_list)
        print(lines)
        return jsonify(lines)


pricechannel_controller_api = Blueprint('pricechannel_controller_api', __name__, url_prefix='/v1')
pricechannel_controller_api.add_url_rule('/pricechannel', view_func=PriceChannelController.as_view('PriceChannelController'), endpoint='pricechannelcontroller')
pricechannel_controller_api.add_url_rule('/triangletrendline', view_func=TriangleTrendlineController.as_view('TriangleTrendlineController'), endpoint='triangletrendlinecontroller')
pricechannel_controller_api.add_url_rule('/risingfallingtrend', view_func=RisingFallingTrendController.as_view('RisingFallingTrendController'), endpoint='risingfallingtrendcontroller')
pricechannel_controller_api.add_url_rule('/supportresistance', view_func=SupportResistanceController.as_view('SupportResistanceController'), endpoint='supportresistancecontroller')

