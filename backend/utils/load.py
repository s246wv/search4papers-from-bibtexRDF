from rdflib import Graph

def load(url):
    graph = Graph()
    graph.parse(location=url, format='ttl')
    print(len(graph))
    return graph