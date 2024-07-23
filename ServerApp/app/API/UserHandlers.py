#!/usr/bin/python
# -*- coding: utf-8 -*-
import hashlib
from flask import Blueprint, request, jsonify
from flask_restful import Resource
from app.utilities.database import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import cross_origin


users_collection = db["users"]

class Register(Resource):
    @staticmethod
    @jwt_required()
    @cross_origin()
    def post():
        """
        Create a new user
        User register endpoint
        ---
        tags:
          - User
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
              id: User_register
              required:
                - username
                - email
                - password
              properties:
                username:
                  type: string
                  description: username for user
                  default: invexuser
                email:
                  type: string
                  description: E-mail address of user
                  default: info@invextrade.con
                password:
                  type: string
                  description: Password of user
                  default: password
        responses:
          200:
            description: Successful operation
          400:
            description: Invalid input
        """
        new_user = request.get_json()  # store the json body request
        new_user["password"] = hashlib.sha256(new_user["password"].encode("utf-8")).hexdigest()  # encrpt password
        doc = users_collection.find_one({"username": new_user["username"]})  # check if user exist
        if not doc:
            new_user['guest'] = False
            new_user['email_verified'] = False
            new_user['tel_verified'] = False

            users_collection.insert_one(new_user)
            return jsonify({'msg': 'User created successfully'}), 201
        else:
            return jsonify({'msg': 'Username already exists'}), 409

class Update(Resource):
    @staticmethod
    @jwt_required()
    @cross_origin()
    def post():
        """
        Create a new user
        User register endpoint
        ---
        tags:
          - User
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
              id: User_update
              properties:
                username:
                  type: string
                  description: username for user
                  default: invexuser
                firstname:
                  type: string
                  description: First name of user
                  default: invex
                lastname:
                  type: string
                  description: Last name of user
                  default: invex
                age:
                  type: integer
                  description: Age of user
                  default: 18
                sex:
                  type: string
                  description: Sex of user
                  default: male
                email:
                  type: string
                  description: E-mail address of user
                  default: info@invextrade.con
                password:
                  type: string
                  description: Password of user
                  default: password
                tel:
                  type: string
                  description: Telephone number of user
                  default: 05317987511
        responses:
          200:
            description: Successful operation
          400:
            description: Invalid input
        """

        user = request.get_json()
        if user.__contains__("username"):
            exist_query = {"username": user["username"]}
        else:
            return jsonify({'msg': 'Username cannot be emptys'}), 409

        new_user_info = {}
        if user.__contains__("firstname"):
            new_user_info["firstname"] = user["firstname"]

        if user.__contains__("lastname"):
            new_user_info["lastname"] = user["lastname"]

        if user.__contains__("age"):
            new_user_info["age"] = user["age"]

        if user.__contains__("sex") and (user["sex"] == "male" or user["sex"] == "female"):
            new_user_info["email"] = user["email"]

        if user.__contains__("email"):
            new_user_info["email"] = user["email"]

        if user.__contains__("tel"):
            new_user_info["tel"] = user["tel"]

        if user.__contains__("password"):
            new_user_info["password"] = hashlib.sha256(user["password"].encode("utf-8")).hexdigest()

        newvalues = {"$set": new_user_info}

        result = users_collection.update_one(exist_query, newvalues)
        print(result.modified_count)

        if result.modified_count > 0:
            return jsonify({'msg': 'User information successfully'}), 200
        else:
            return jsonify({'msg': 'Check the correctness of the entered information and try again'}), 409

class Login(Resource):
    @staticmethod
    @cross_origin()
    def post():
        """
        User login
        Login endpoint
        ---
        tags:
          - User
        summary: Creates a new user
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
              id: User_login
              required:
                - username
                - password
              properties:
                username:
                  type: string
                  description: username for user
                  default: invexuser
                password:
                  type: string
                  description: Password of user
                  default: password
        responses:
          200:
            description: Successful operation
          400:
            description: Invalid input
        """
        login_details = request.get_json()  # store the json body request
        user_from_db = users_collection.find_one({'username': login_details['username']})  # search for user in database

        if user_from_db:
            encrpted_password = hashlib.sha256(login_details['password'].encode("utf-8")).hexdigest()
            if encrpted_password == user_from_db['password']:
                access_token = create_access_token(identity=user_from_db['username'])  # create jwt token
                return jsonify({"access_token": access_token, "guest": user_from_db['guest']}), 200

        return jsonify({'msg': 'The username or password is incorrect'}), 401

class Profile(Resource):
    @staticmethod
    @jwt_required()
    @cross_origin()
    def get():
        """
        Get user profile
        User profile endpoint
        ---
        tags:
          - User
        security:
          - APIKeyHeader: ['Authentication']
        responses:
          200:
            description: Successful operation
          400:
            description: Invalid input
        """
        current_user = get_jwt_identity()  # Get the identity of the current user
        user_from_db = users_collection.find_one({'username': current_user})
        if user_from_db:
            del user_from_db['_id'], user_from_db['password']  # delete data we don't want to return
            return jsonify({'profile': user_from_db}), 200
        else:
            return jsonify({'msg': 'Profile not found'}), 404

class RefreshToken(Resource):
    @staticmethod
    @jwt_required()
    @cross_origin()
    def post():
        """
        Get refreshed token
        User refreshed endpoint
        ---
        tags:
          - User
        security:
          - APIKeyHeader: ['Authentication']
        responses:
          200:
            description: Successful operation
          400:
            description: Invalid input
        """
        identity = get_jwt_identity()
        access = create_access_token(identity=identity)

        return jsonify({
            'access_token': access
        }), 200


user_handlers_api = Blueprint('user_handlers_api', __name__, url_prefix='/v1')
user_handlers_api.add_url_rule('/register', view_func=Register.as_view('Register'), endpoint='register')
user_handlers_api.add_url_rule('/login', view_func=Login.as_view('Login'), endpoint='login')
user_handlers_api.add_url_rule('/profile', view_func=Profile.as_view('Profile'), endpoint='profile')
user_handlers_api.add_url_rule('/update', view_func=Update.as_view('Update'), endpoint='update')
user_handlers_api.add_url_rule('/refreshtoken', view_func=RefreshToken.as_view('RefreshToken'), endpoint='refreshtoken')
