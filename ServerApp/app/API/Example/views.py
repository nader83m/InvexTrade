from flask import Blueprint
from flask_restful import Resource
from flask_apispec.views import MethodResource
from flask_apispec import doc


class ExampleController(MethodResource, Resource):
    @doc(description='This is example Endpoint', tags=['Example Endpoint'])
    def get(self):
        '''
        Get method represents a GET API method
        '''
        return {'message': 'APi are working fine'}, 200

example_controller_api = Blueprint('example_controller_api', __name__, url_prefix='/v1')
example_controller_api.add_url_rule('/example', view_func=ExampleController.as_view('ExampleController'), endpoint='examplecontroller')

