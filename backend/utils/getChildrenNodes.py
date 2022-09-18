from rdflib import Graph
from string import Template
import json

def getChildrenNodes(parent):
    graph = Graph()
    # The 'publicID' is unofficial base URI.
    graph.parse("./backend/utils/acm_ccs2012-1626988337597.xml", publicID="https://dl.acm.org/ccs/")
    # Please modify this SPARQL query if you want to change the resource
    t = Template("""
        prefix skos: <http://www.w3.org/2004/02/skos/core#>
        select ?child ?childLabel where {
        ?parent skos:narrower ?child.
        ?child skos:prefLabel ?childLabel.
        filter (?parent = <${first}> )
        }
    """)
    query1 = t.substitute(first=parent)
    qres1 = graph.query(query1)
    ret = []
    for row in qres1:
        dict = {row[0].toPython(): row[1].toPython()}
        ret.append(dict)

    return ret