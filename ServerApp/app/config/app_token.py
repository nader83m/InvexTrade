import pathlib
from functools import wraps
import json
from flask import jsonify, Flask, request, Blueprint
import jwt
import os
from pathlib import Path
import uuid
# from services import id_recognition_backup as id_recognition
# ROOT_DIR = Path(__file__).parent.parent
# data_path = ROOT_DIR.parent.parent
# data_path = os.path.join(data_path, "data/device_id.txt")
# config_dir = os.path.join(ROOT_DIR,'config')
# config_file_path = os.path.join(config_dir,'config.json')

# with open(config_file_path) as config_file:
#     config_data = json.load(config_file)
# config_data['swagger']['API_URL'] = os.environ['api_ip']
# api_url = config_data['swagger']['API_URL']


error_map = {'api': {'authorization': {0: 'Missing Token', 1: 'Invalid Token', 2: 'Expired Token',
                                       3: 'Wrong Token Type; token must be Bearer',4:'Invalid Device ID'}}, 'face': {
    'verify_faces': {0: 'Missing Params', 1: 'Image format is wrong; image type must be .png, .jpeg or jpg',
                     2: 'More than one faces detected in selfie', 3: 'No face detected in selfie',
                     4: 'More than one faces detected in NFC photo', 5: 'No face detected in NFC photo'},
    'check_liveness': {0: 'Missing Params', 1: 'Image format is wrong; image type must be .png, .jpeg or jpg',
                       2: 'More than one faces detected', 3: 'No face detected'}}, 'id': {
    'crop_face': {0: 'Missing Params', 1: 'Image format is wrong; image type must be .png, .jpeg or .jpg',
                  2: 'No ID card detected'},
    'read_mrz': {0: 'Missing Params', 1: 'Image format is wrong; image type must be .png, .jpeg or .jpg',
                 2: 'No ID card detected', 3: 'Cannot read MRZ'}},
             'speech': {'speech_to_text': {0: 'Missing Params', 1: 'Audio format is wrong; audio type must be .wav',
                                           2: 'Can not convert'}}}


def get_error(func, sub_func, code):
    return jsonify(
        {'error': {'description': error_map[func][sub_func][code], 'code': code, 'function': sub_func, 'class': func}})


class AppToken:
    def __init__(self):
        self.secret_key = "RsxEE53+pY-$FzRdZ+6Q>(sDX-qFXn"
        self.clientId = "123456789"
        # # f = open('/home/nadir/ulwfd/digital_onboarding_kubernetes/digital_onboarding/data/device_id.txt', "w")
        # f = open("/data/device_id.txt", "w")

        # f.write("Your ID is {}, please send it your Papilon Account Manager to get authorization token".format(uuid.getnode()))
        # f.close()
       
        # print("Your ID is {}, please send it your Papilon Account Manager to get authorization token".format(uuid.getnode()))
        # print("="*20)

    def token_required(self):
        # @wraps(f)
        def decorated(*args, **kwargs):
            token = None

            if 'Authorization' in request.headers:
                auth = request.headers['Authorization'].split()
                if len(auth) == 1:
                    token = auth[0]
                else:
                    if len(auth) != 2:
                        return get_error('api', 'authorization', 0), 401
                    if auth[0] != 'Bearer':
                        return get_error('api', 'authorization', 3), 401
                    else:
                        token = auth[1]

            if not token:
                return get_error('api', 'authorization', 0), 401
            try:
                user_id = int(jwt.decode(token, self.secret_key)['user'])
                if jwt.decode(token, self.secret_key)['client_id'] != self.clientId:
                    return get_error('api', 'authorization', 4), 401
            except jwt.ExpiredSignatureError:
                return get_error('api', 'authorization', 2), 401
            except jwt.InvalidTokenError:
                return get_error('api', 'authorization', 1), 401
            return f(user_id, *args, **kwargs)

        return decorated

