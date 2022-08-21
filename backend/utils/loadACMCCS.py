from rdflib import Graph
import json

def loadACMCCS():
    graph = Graph()
    # The 'publicID' is unofficial base URI. 
    graph.parse("acm_ccs2012-1626988337597.xml", publicID="https://dl.acm.org/ccs/")
    # Please modify this SPARQL query if you want to change the resource
    query = """
    select ?id ?label where {
        ?id <http://www.w3.org/2004/02/skos/core#prefLabel> ?label. 
    }
    """
    qres = graph.query(query)
