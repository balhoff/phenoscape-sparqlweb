var facets = {
	
	direct_subclasses: function (iri, callback) {
		partials.render_template("/facets/direct_subclasses.rq", {superclass: iri}, function (query) {
			sparql.select(query, endpoint, function (sparql_json) {
				var subclasses = _.map(sparql_json.results.bindings, function (item) { return item.subclass.value });
				callback(subclasses);
			});
		});	
	},
	
	fill_facet: function (container, facet_key, facet_paths, compiled_query, callback) {
		$(container).find(".facet-item").each(function (index, item) {
			var iri = $(item).data("iri");
			var params = facets.extract_query_parameters(iri, facet_key, facet_paths);
			sparql.select(compiled_query(params), config.endpoint, function (sparql_json) {
				partials.load_partial_each($(item).find(".facet-item-count"), "/shared/_count.html", sparql_json.results.bindings, callback);
			});
		});
	},
	
	extract_query_parameters: function (iri, key, facet_paths) {
		var params = {};
		_.each(facet_paths, function (item, key) { params[key] = _.last(item); });
		params[key] = iri;
		return params;
	}
	
};