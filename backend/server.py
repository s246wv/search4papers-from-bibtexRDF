import json
from operator import methodcaller
from re import A
import re
from urllib import response
from flask import Flask
from flask import request, make_response, jsonify
from flask_cors import CORS
from utils import load, embed

# app = Flask(__name__, static_folder="./build/static", template_folder="./build")
app = Flask(__name__)
CORS(app, origins="http://localhost:3000", supports_credentials=True)

# @app.after_request
# def after_request(response):
#     response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
#     response.headers.add("Access-Control-Allow-Headers", "*")
#     response.headers.add("Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS")
#     return response

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

@app.route("/onLoad", methods=['POST'])
def onLoad():
    print("foobar")
    url = request.get_json()['url']
    print(url)
    rdf_graph = load.load(url)
    embedding = embed.embed(rdf_graph)
    print(embedding)
    return url

if __name__ == "__main__":
    app.debug = True
    app.run(host="localhost", port=5000)