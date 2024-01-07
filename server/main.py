from flask import Flask, request
from flask_cors import CORS
from pymongo import MongoClient
import datetime
import hashlib
# import JSON

app = Flask(__name__)
CORS(app)
myclient = MongoClient("mongodb://localhost:27017/")

db = myclient["BlockBazzarDB"]
collection = db["UserData"]

@app.route("/retriveUserData", methods=["POST", "GET"])
def retriveUserData():
    _idAddress = '' if not request.get_json(force=True) else request.get_json(force=True)

    return collection.find_one(_idAddress) if collection.find_one(_idAddress) else "Data Not Found"


@app.route('/userposter', methods=["POST", "GET"])
def user_poster():
    userDataRecive = '' if not request.get_json(force=True) else request.get_json(force=True)

    presentDate = datetime.datetime.now()
    unix_timestamp = datetime.datetime.timestamp(presentDate)

    if userDataRecive["_id"] == "":
        userDataRecive["_id"] = hashlib.sha256(str(unix_timestamp).encode()).hexdigest()
    else:
        exitingUserData = collection.find_one({"_id": userDataRecive["_id"]})
        if(exitingUserData):
            if userDataRecive["address"] == "":
                userDataRecive["address"] = exitingUserData["address"]
            if userDataRecive["username"] == "":
                userDataRecive["username"] = exitingUserData["username"]
            if userDataRecive["pfp"] == "":
                userDataRecive["pfp"] = exitingUserData["pfp"]

    print(userDataRecive)

    collection.update_one({'_id': userDataRecive['_id']}, {'$set': userDataRecive}, upsert=True) 

    return "Data Pushed To Mongo DB"

if __name__ == "__main__":
    app.run(debug=True, port=8080)
