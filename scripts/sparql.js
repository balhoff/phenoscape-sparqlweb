var sparql = {
	
	queries: [],

	select: function (query, endpoint, callback) {
		
		sparql.queries.push({query: query});
		
		jQuery.ajaxSetup({ 
			  beforeSend: function (xhr) { xhr.setRequestHeader("Accept", "application/sparql-results+json"); } 
		});
		
		jQuery.ajax({
			url : endpoint,
			type : 'GET',
			data : {query: query},
			dataType : 'json',
			success : callback, // send the sparql-json directly to the caller
			error : function () { } // TODO
		});
	},
	
	construct: function (query, endpoint, callback) {
		
		sparql.queries.push({query: query});
		
		var responder = function (response) {
			var rdf = jQuery.rdf();
			rdf.load(response);
			callback(rdf);
		};
		
		jQuery.ajaxSetup({ 
			  beforeSend: function (xhr) { xhr.setRequestHeader("Accept", "application/rdf+xml"); } 
		});
		
		jQuery.ajax({
			url : endpoint,
			type : 'GET',
			data : {query: query},
			dataType : 'xml',
			success : responder,
			error : function () { } // TODO
		});
	},

	decorate: function (rdf, properties, endpoint, callback) {
		var angle = function (text) { return "<" + text + ">"; };
		var paren = function (text) { return "(" + text + ")"; };
		var template = "CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o . FILTER (?p in (<%= properties.join(', ') %>))} BINDINGS ?s { <%= subjects.join(' ') %> }";
		var resources = [];
		rdf.databank.triples().each(function (index, triple) {
			if (triple.subject.type === "uri") { resources.push(triple.subject.value); }
			if (triple.property.type === "uri") { resources.push(triple.property.value); }
			if (triple.object.type === "uri") { resources.push(triple.object.value); }
		});
		var uris = _.uniq(resources).map(function (uri) { return paren(angle(uri)) });
		if (uris.length < 1) {
		    callback(rdf);
		} else {
		    var compiled = _.template(template);
    		var query = compiled({subjects: uris, properties: _.map(properties, function (property) { return angle(property); })});
    		sparql.queries.push({query: query});
    		sparql.construct(query, endpoint, function (decorations) {
    			var databank = rdf.databank.add(decorations.databank);
    			var combined_rdf = jQuery.rdf({databank: databank});
    			callback(combined_rdf);
    		}); 
		}
	
	}

};

