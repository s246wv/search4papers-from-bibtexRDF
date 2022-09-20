from flask import Flask
from flask import request, make_response, jsonify
from flask_cors import CORS
from utils import getRootNodes, getChildrenNodes, getKeywords

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)

@app.route("/", methods=['GET'])
def index():
    return "hogehoge"

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