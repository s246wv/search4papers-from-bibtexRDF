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

    dict = {}
    for row in qres1:
        root = row[0].toPython()
        rootLabel = row[1].toPython()
        dict[root] = {"parentLabel": rootLabel}
    print(dict)

    keys = [ key.toPython() for key in qres2.vars]
    query_response = []
    for row in qres2:
        temp_dict = {}
        for key, e in zip(keys,row):
            temp_dict[key] = e.toPython()
        query_response.append(temp_dict)
    print(query_response)

    ret = makeTreeJson(dict, query_response)
    return ret

###
# func(dict, dict2):
#   dictがreturnするもの．
#   dict2がSPARQL結果．
#   for key in dict:
#       for e in dict2:
#           if key == e["?parent"]:
#               
#               ret = func(dict[key], dict2)
#               dict[key][e["?child"]] = ret
#   return(dict)
#  

def makeTreeJson(dict, query_response):
    for key in dict:
        for row in query_response:
            if key == row["?parent"]:
                ret = makeTreeJson(dict[key], query_response)
                dict[key][row["?child"]] = ret
    return dict