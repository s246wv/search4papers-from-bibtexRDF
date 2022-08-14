from sentence_transformers import SentenceTransformer
from rdflib import Graph
import json
import sys

# You can choose the model here https://www.sbert.net/docs/pretrained_models.html 
model = SentenceTransformer('all-MiniLM-L6-v2')

# 第一引数がttlファイルです．
ttl_file = sys.argv[1]
# 第二引数がquetyファイルです．
query_file = sys.argv[2]
# 第三引数が出力ファイル名です．
out_filename = sys.argv[3]

graph = Graph()
graph.parse(ttl_file)
# Please modify this SPARQL query if you want to change the resource
query = ""
with open(query_file, "r") as f:
    query = f.read()

qres = graph.query(query)
keys = []
words = []
for row in qres:
    keys.append(row.id)
    words.append(row.label)
# Computing sentence embeddings. 
embs = model.encode(words)
dicts = {}
for key, word, emb in zip(keys, words, embs):
    dict_word_emb = {word.toPython(): emb.tolist()}
    if( not (key.toPython() in dicts.keys())):
        dict = {key.toPython(): {}}
        dicts.update(dict)
    else:
        pass
    dicts[key.toPython()].update(dict_word_emb)

# Output the json file.
with open(out_filename + ".json", "w") as f:
    json.dump(dicts, f)
