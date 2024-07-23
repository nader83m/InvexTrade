from flask import Blueprint, request, jsonify
from flask_restful import Resource
from marshmallow import Schema, fields
from flask_apispec.views import MethodResource
from app.utilities.binanceapi import BinanceApi
from app.constants.consts import Consts
from binance import Client
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin


bApi = BinanceApi()
consts = Consts()

class CryptoDataController(Resource):

    @jwt_required()
    @cross_origin()
    def post(self):
        """
        Create a new user
        User register endpoint
        ---
        tags:
          - Crypto Data
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
              id: Candlestick_Data_Params
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
        candlestick_data_list = bApi.get_candlestick_data(symbol, interval, str(from_date), str(to_date))
        return jsonify(candlestick_data_list)

class EXCoinListRequestSchema(Schema):
    exchange = fields.String(required=True, description="Exchange Name", default="binance")

class ExchangeCoinListController(MethodResource, Resource):
    @jwt_required()
    @cross_origin()
    def post(self):
        """
        Create a new user
        User register endpoint
        ---
        tags:
          - Crypto Data
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
              id: CoinList_Params
              properties:
                exchange:
                  type: string
                  description: exchange
                  default: binance
        responses:
          200:
            description: Successful operation
          400:
            description: Invalid input
        """
        params = request.get_json()  # store the json body request
        exchange = params["exchange"]

        exchange_coins_list = bApi.get_coins_list()
        return jsonify(exchange_coins_list)

class IntervalListController(MethodResource, Resource):
    @jwt_required()
    @cross_origin()
    def get(self):
        """
        Create a new user
        User register endpoint
        ---
        tags:
          - Crypto Data
        summary: Creates a new user
        security:
          - APIKeyHeader: ['Authentication']
        responses:
          200:
            description: Successful operation
          400:
            description: Invalid input
        """
        return jsonify(consts.INTERVALS)

cryptodata_controller_api = Blueprint('cryptodata_controller_api', __name__, url_prefix='/v1')
cryptodata_controller_api.add_url_rule('/getcandlestickdata', view_func=CryptoDataController.as_view('CryptoDataController'), endpoint='cryptodatacontroller')
cryptodata_controller_api.add_url_rule('/getexchancecoinslist', view_func=ExchangeCoinListController.as_view('ExchangeCoinListController'), endpoint='exchangecoinlistcontroller')
cryptodata_controller_api.add_url_rule('/getintervalslist', view_func=IntervalListController.as_view('IntervalListController'), endpoint='intervallistcontroller')

