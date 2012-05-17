var facets = {
	
	direct_subclasses: function (iri, callback) {
		partials.render_template("/facets/direct_subclasses.rq", {superclass: iri}, function (query) {
			sparql.select(query, endpoint, function (sparql_json) {
				var subclasses = _.map(sparql_json.results.bindings, function (item) { return item.subclass.value });
				callback(subclasses);
			});
		});	
	},
	
	fill_facet: function (container, facet_key, facet_paths, query_template, callback) {
		partials.compile_template(query_template, function (compiled_query) {
			var iris = _.toArray(_.map(facet_paths[facet_key], function (item) { return {iri: item, facet: facet_key};}));
			iris.splice(0, 0, {iri: "any"});
			partials.load_partial_each(container, "/facets/_facet_item.html", iris, function () {
				var facet_items = $(container).find(".facet-item");
				facet_items.each(function (index, item) {
					var iri = $(item).data("iri");
					if (iri == "any") {
						iri = null;
					}
					var params = facets.extract_query_parameters(iri, facet_key, facet_paths);
					var is_last = (index == (facet_items.size() - 1));
					if (is_last) { $(item).addClass("focal-facet-item") };
					sparql.select(compiled_query(params), config.endpoint, function (sparql_json) {
						partials.load_partial_each($(item).find(".facet-item-count"), "/shared/_count.html", sparql_json.results.bindings, callback);
					});
					// start subclass queries here?
				});
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