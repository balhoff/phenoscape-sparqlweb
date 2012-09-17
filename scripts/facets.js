var facets = {
	
    /**
    * Query for direct subclasses of the class with the given IRI
    * @param {String} iri
    * @param {Function(String[])} callback Will be called with the list of subclass IRIs
    * @returns undefined
    */
	direct_subclasses: function (iri, callback) {
		partials.render_template("/facets/direct_subclasses.rq", {superclass: iri}, function (query) {
			sparql.select(query, endpoint, function (sparql_json) {
				var subclasses = _.map(sparql_json.results.bindings, function (item) { return item.subclass.value });
				callback(subclasses);
			});
		});	
	},
	
	/**
    * 
    * @param {String} container ID of DOM node to fill with facet info
    * @param {String} facet_key
    * @param {Object[String:String[]]} facet_paths
    * @param query_template
    * @param {Function(String[])} callback
    * @returns undefined
    */
	fill_facet: function (container, facet_key, facet_paths, text, query_template, callback) {
		partials.compile_template(query_template, function (compiled_query) {
			var iris = _.toArray(_.map(facet_paths[facet_key], function (item) { return {iri: item, facet: facet_key};}));
			iris.splice(0, 0, {iri: "any"});
			partials.load_partial_each(container, "/facets/_facet_item.html", iris, function () {
				var facet_items = $(container).find(".facet-item");
				facet_items.each(function (index, item) {
					var iri = $(item).data("iri");
					if (iri === "any") {
						iri = null;
					}
					var params = facets.extract_query_parameters(facet_paths);
					params[facet_key] = iri;
					params.text = text;
					var is_last = (index === (facet_items.size() - 1));
					if (is_last) { $(item).addClass("focal-facet-item") };
					sparql.select(compiled_query(params), config.endpoint, function (sparql_json) {
						partials.load_partial_each($(item).find(".facet-item-count"), "/shared/_count.html", sparql_json.results.bindings, callback);
					});
					// start subclass queries here?
				});
			});
		});	
	},
	
	/**
    * Finds the last item from each facet path and set as value for a query using all facets.
    * @param {Object[String:String[]]} facet_paths
    * @returns {Object}
    */
	extract_query_parameters: function (facet_paths) {
		var params = {};
		_.each(facet_paths, function (item, facet_key) { params[facet_key] = _.last(item); }); //FIXME what if the facet path is empty?
		return params;
	}
	
};