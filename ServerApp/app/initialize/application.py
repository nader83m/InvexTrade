from flask import Flask
from flask_restful import Api
from app.API.Example.views import example_controller_api, ExampleController
from app.API.CryptoData import cryptodata_controller_api, CryptoDataController, ExchangeCoinListController, IntervalListController
from app.API.CryptoChartFormations import pricechannel_controller_api, PriceChannelController
from app.API.UserHandlers import user_handlers_api
from flasgger import Swagger
from flask_jwt_extended import JWTManager
import datetime
from flask_cors import CORS


class Application():
    def __init__(self):
        pass

    def create_app(self):
        self.app = Flask(__name__)  # Flask app instance initiated
        cors = CORS(self.app, resources={r"/v1/*": {"origins": "*"}})

        SWAGGER_TEMPLATE = {"securityDefinitions": {"APIKeyHeader": {"type": "apiKey", "name": "Authorization", "in": "header"}}}

        self.app.config['SWAGGER'] = {
            'title': 'www.invextrade.com',
            "description": "**Authentication**\n\nAll API methods require a simple token-based HTTP Authentication. \n\nIn order to authenticate, you should put word \"Bearer\" and a key into the Authorization HTTP header, separated by a whitespace:\n*__Authorization: Bearer 000...__*\n\n But when you are using this swagger documentation to send requests for test purposes you dont need to put \"Bearer\" word. Just pass the token in the authorization part of documentation. \n\nAll requests that fail to provide a valid authentication token will result in a HTTP 401 Unauthorized response.",
            "version": "1.0.0",
            "security": {
                "bearerAuth": []
            },
        }

        swagger = Swagger(self.app, template=SWAGGER_TEMPLATE)

        self.app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1000)
        self.app.config['JWT_REFRESH_TOKEN_EXPIRES'] = datetime.timedelta(days=1000) 
        self.app.config['JWT_SECRET_KEY'] = '!rdjlfgkkglfkgj889#@$'
        jwt = JWTManager(self.app)

        self.app.register_blueprint(example_controller_api)
        self.app.register_blueprint(cryptodata_controller_api)
        self.app.register_blueprint(pricechannel_controller_api)
        self.app.register_blueprint(user_handlers_api)
        api = Api(self.app)  # Flask restful wraps Flask app around it.

        return self.app



