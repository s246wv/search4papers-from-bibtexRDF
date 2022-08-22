from rdflib import Graph
import json

def loadACMCCS():
    graph = Graph()
    # The 'publicID' is unofficial base URI.
    graph.parse("./backend/utils/acm_ccs2012-1626988337597.xml", publicID="https://dl.acm.org/ccs/")
    # Please modify this SPARQL query if you want to change the resource
    query = """
        prefix skos: <http://www.w3.org/2004/02/skos/core#>
        select ?parent ?parentLabel ?child ?childLabel where {
        ?parent skos:narrower ?child.
        ?parent skos:prefLabel ?parentLabel.
        ?child skos:prefLabel ?childLabel.
    }
    """
    qres = graph.query(query)
    keys = [ key.toPython() for key in qres.vars]
    ret = []
    for row in qres:
        dict = {}
        for key, e in zip(keys,row):
            dict[key] = e
        ret.append(dict)
    
    return ret


    
