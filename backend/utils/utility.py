from rdflib import Graph
from string import Template
import json

def getRootNodes(graph: Graph):
    # Please modify this SPARQL query if you want to change the resource
    query1 = """prefix skos: <http://www.w3.org/2004/02/skos/core#>
select ?root ?rootLabel where {
?s skos:hasTopConcept ?root.
?root skos:prefLabel ?rootLabel.
} order by ?rootLabel"""

    qres1 = graph.query(query1)
    ret = []
    for row in qres1:
        dict = {row[0].toPython(): row[1].toPython()}
        ret.append(dict)

    return ret

def getChildrenNodes(parent, graph: Graph):
    # Please modify this SPARQL query if you want to change the resource
    t = Template("""prefix skos: <http://www.w3.org/2004/02/skos/core#>
select ?child ?childLabel where {
?parent skos:narrower ?child.
?child skos:prefLabel ?childLabel.
filter (?parent = <${first}> )
}""")
    query1 = t.substitute(first=parent)
    qres1 = graph.query(query1)
    ret = []
    for row in qres1:
        dict = {row[0].toPython(): row[1].toPython()}
        ret.append(dict)

    return ret

def getKeywords(value, url):
    graph = Graph()
    # The 'publicID' is unofficial base URI.
    graph.parse(url, format="turtle")
    # Please modify this SPARQL query if you want to change the resource
    t = Template("""prefix bibtex: <http://www.edutella.org/bibtex#>
prefix dc: <http://purl.org/dc/elements/1.1/>
select ?paper ?title ?keyword ?topN where {
?paper bibtex:acmKeywordSimilarity ?keywords;
dc:title ?title.
?keywords bibtex:keyword ?keyword;
?topN ?id.
filter(?id = <${first}>)
}order by ?paper""")
    query1 = t.substitute(first=value)
    qres1 = graph.query(query1)
    ret = []
    for row in qres1:
        dict = {
            "paper": row[0].toPython(),
            "title": row[1].toPython(),
            "keyword": row[2].toPython(),
            "topN": row[3].toPython()
        }
        ret.append(dict)

    return ret