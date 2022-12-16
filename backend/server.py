from flask import Flask
from flask import request, make_response, jsonify
from flask_cors import CORS
from utils import utility as util
from rdflib import Graph

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)

graph = Graph()
# The 'publicID' is unofficial base URI.
graph.parse("./backend/utils/acm_ccs2012-1626988337597.xml", publicID="https://dl.acm.org/ccs/")

bibGraph = Graph()

@app.route("/", methods=['GET'])
def index():
    return "the server is working."

@app.route("/getRoot", methods=['GET'])
def getRoot():
    response = util.getRootNodes(graph)
    return make_response(jsonify(response))

@app.route("/getChildren", methods=['POST'])
def getChildren():
    parent = request.get_json()['parent']
    print(parent)
    response = util.getChildrenNodes(parent, graph)
    return make_response(jsonify(response))

@app.route("/getKeywords", methods=['POST'])
def getKeyword():
    req = request.get_json()
    value = req["value"]
    response = util.getKeywords(value=value, graph=bibGraph)
    return make_response(jsonify(response))

@app.route("/postRDF", methods=['POST'])
def sendText():
    req = request.get_json()
    value = req["value"]
    bibGraph.parse(data=value)
    # 特に使わない．
    return ""

if __name__ == "__main__":
    app.debug = True
    app.run(host="localhost", port=5000)