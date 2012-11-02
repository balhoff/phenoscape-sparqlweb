var sparql_util = {
	
	partof_iri: function (iri) {
		return "http://purl.obolibrary.org/obo/BFO_0000050_some_" + iri;
	},
	
	involves_iri: function (iri) {
		return "http://vocab.phenoscape.org/involves_some_" + iri;
	}
	
}
