from rdflib import Graph
import json

def loadACMCCS():
    graph = Graph()
    # The 'publicID' is unofficial base URI.
    graph.parse("./backend/utils/acm_ccs2012-1626988337597.xml", publicID="https://dl.acm.org/ccs/")
    # Please modify this SPARQL query if you want to change the resource
    query1 = """
        prefix skos: <http://www.w3.org/2004/02/skos/core#>
        select ?root ?rootLabel where {
        ?s skos:hasTopConcept ?root.
        ?root skos:prefLabel ?rootLabel.
        }
    """
    query2 = """
        prefix skos: <http://www.w3.org/2004/02/skos/core#>
        select ?parent ?parentLabel ?child ?childLabel where {
        ?parent skos:narrower ?child.
        ?parent skos:prefLabel ?parentLabel.
        ?child skos:prefLabel ?childLabel.
    }
    """
    qres1 = graph.query(query1)
    qres2 = graph.query(query2)

    ret = {}
    for row in qres1:
        root = row[0].toPython()
        rootLabel = row[1].toPython()
        ret[root] = {"parentLabel": rootLabel}
    for row in qres2:
        for key in ret:
            if(key == row["parent"]):
                ret[key][row["child"]] = {"parentLabel": row["childLabel"]}
                # 再帰が必要だわ．

    keys = [ key.toPython() for key in qres2.vars]
    ret = []
    for row in qres2:
        dict = {}
        for key, e in zip(keys,row):
            dict[key] = e
        ret.append(dict)
    
    return ret


    
