import json
from operator import methodcaller
from re import A
import re
from urllib import response
from flask import Flask
from flask import request, make_response, jsonify
from flask_cors import CORS
# from utils import getTree, getPapers

app = Flask(__name__, static_folder="./build/static", template_folder="./build")
CORS(app)

@app.route("/", methods=['GET'])
def index():
    return "hogehoge"

@app.route("/getTree", methods=['GET'])
def getTree():
    # res = utils.getTree()
    response 
    return make_response(jsonify(response))

@app.route("/getPapers", methods=['GET'])
def getPapers():
    # res = utils.getPapers()
    response
    return make_response(jsonify(response))

@app.route("onLoad", methods=['POST'])
def onLoad(url):
    utils.load(url)

if __name__ == "__main__":
    app.debug = True
    app.run(host="localhost", port=5000)