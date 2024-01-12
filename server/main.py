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
userDataCollection = db["UserData"]
listedProductsCollection = db["ListedProducts"]

@app.route("/retriveUserData", methods=["POST", "GET"])
def retriveUserData():
    _idAddress = '' if not request.get_json(force=True) else request.get_json(force=True)

    return userDataCollection.find_one(_idAddress) if userDataCollection.find_one(_idAddress) else "Data Not Found"


@app.route('/userposter', methods=["POST", "GET"])
def loadUserData():
    userDataRecive = '' if not request.get_json(force=True) else request.get_json(force=True)

    presentDate = datetime.datetime.now()
    unix_timestamp = datetime.datetime.timestamp(presentDate)

    if userDataRecive["_id"] == "":
        userDataRecive["_id"] = hashlib.sha256(str(unix_timestamp).encode()).hexdigest()
    else:
        exitingUserData = userDataCollection.find_one({"_id": userDataRecive["_id"]})
        if(exitingUserData):
            if userDataRecive["address"] == "":
                userDataRecive["address"] = exitingUserData["address"]
            if userDataRecive["username"] == "":
                userDataRecive["username"] = exitingUserData["username"]
            if userDataRecive["pfp"] == "":
                userDataRecive["pfp"] = exitingUserData["pfp"]

    print(userDataRecive)

    userDataCollection.update_one({'_id': userDataRecive['_id']}, {'$set': userDataRecive}, upsert=True) 

    return "Data Pushed To Mongo DB"

@app.route("/retriveProducts", methods=["POST", "GET"])
def retriveProducts():
    _idTokenID = '' if not request.get_json(force=True) else request.get_json(force=True)

    return listedProductsCollection.find_one(_idTokenID) if listedProductsCollection.find_one(_idTokenID) else "Data Not Found"
@app.route("/createProduct", methods=["POST", "GET"])
def createProduct():
    pass

@app.route("/retriveReviews", methods=["POST", "GET"])
def retriveReviews():
    _idTokenID = '' if not request.get_json(force=True) else request.get_json(force=True)

    return listedProductsCollection.find_one(_idTokenID)["reviews"] if listedProductsCollection.find_one(_idTokenID) else "Data Not Found"

@app.route("/loadReview", methods=["POST", "GET"])
def loadReview():
    pass

if __name__ == "__main__":
    app.run(debug=True, port=8080)
