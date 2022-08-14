from sentence_transformers import util
import json
import numpy as np
import sys

# 第一引数がembeddingファイル．
input_emb_file = sys.argv[1]
# 第二引数が出力ファイル名
output_filename = sys.argv[2]

# Read acm_css_embedding information. You can change any other reference terminology.
with open('acm_ccs_emb.json') as f:
    acm_ccs_embs = json.load(f)

with open(input_emb_file, "r") as f:
    input_embs = json.load(f)

words = []
embs = []
for key in input_embs:
    words.extend(list(input_embs[key].keys()))
    embs.extend(list(input_embs[key].values()))

key_sims = {}

for emb, word in zip(embs, words):
    dicts = {}
    for key in acm_ccs_embs:
        acm_emb = np.array(list(acm_ccs_embs[key].values())[0], dtype=np.float32)
        cos_sim = util.cos_sim(acm_emb, np.array(emb, dtype=np.float32))
        dic = {list(acm_ccs_embs[key].keys())[0]: cos_sim.item()}
        dicts.update(dic)
    key_sim = {word: dicts}
    key_sims.update(key_sim)

with open(output_filename + "_all.json", "w") as f:
    json.dump(key_sims, f)

key_sims_sorted = {}
for key in key_sims:
    key_sim_sorted = sorted(key_sims[key].items(), key=lambda x:x[1], reverse=True)
    top5 = key_sim_sorted[0:5]
    top5_dic = dict(top5)
    dic = {key: top5_dic}
    key_sims_sorted.update(dic)

with open(output_filename + "_top5.json", "w") as f:
    json.dump(key_sims_sorted, f)
