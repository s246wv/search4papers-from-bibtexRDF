import json
from urllib import response
from flask import Flask
from flask import request, make_response, jsonify
from flask_cors import CORS
from utils import load, embed, loadACMCCS, getRootNodes, getChildrenNodes, getKeywords

# app = Flask(__name__, static_folder="./build/static", template_folder="./build")
app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)

# @app.after_request
# def after_request(response):
#     response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
#     response.headers.add("Access-Control-Allow-Headers", "*")
#     response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
#     return response

@app.route("/", methods=['GET'])
def index():
    return "hogehoge"

@app.route("/getTree", methods=['GET'])
def getTree():
    response = loadACMCCS.loadACMCCS()
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
    return url

@app.route("/getRoot", methods=['GET'])
def getRoot():
    response = getRootNodes.getRootNodes()
    return make_response(jsonify(response))

@app.route("/getChildren", methods=['POST'])
def getChildren():
    parent = request.get_json()['parent']
    print(parent)
    response = getChildrenNodes.getChildrenNodes(parent)
    return make_response(jsonify(response))

@app.route("/getKeywords", methods=['POST'])
def getKeyword():
    req = request.get_json()
    value = req["value"]
    url = req["url"]
    response = getKeywords.getKeywords(value=value, url=url)
    return make_response(jsonify(response))

if __name__ == "__main__":
    app.debug = True
    app.run(host="localhost", port=5000)