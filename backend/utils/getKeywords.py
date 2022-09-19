from rdflib import Graph
from string import Template
import json

def getKeywords(value, url):
    graph = Graph()
    # The 'publicID' is unofficial base URI.
    graph.parse(url)
    # Please modify this SPARQL query if you want to change the resource
    t = Template("""
        prefix bibtex: <http://www.edutella.org/bibtex#>
        select ?papre ?keyword ?topN where {
        ?paper bibtex:acmKeywordSimilarity ?keywords.
        ?keywords bibtex:keyword ?keyword;
                ?topN ?id.
        filter(?id = <${first}>)
        }
    """)
    query1 = t.substitute(first=value)
    qres1 = graph.query(query1)
    ret = []
    for row in qres1:
        dict = {row[0].toPython(): row[1].toPython()}
        ret.append(dict)

    return ret