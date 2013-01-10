var facets = {
	
    /**
    * Query for direct subclasses of the class with the given IRI
    * @param {String} iri
    * @param {Function(String[])} callback Will be called with the list of subclass IRIs
    * @returns undefined
    */
	direct_subclasses: function (iri, params, callback) {
	    if (iri == null) {
    		callback([]);
	    } else {
	        partials.render_template("/facets/direct_subclasses.rq", {superclass: iri}, function (query) {
    			sparql.select(query, config.endpoint, function (sparql_json) {
    				var subclasses = _.map(sparql_json.results.bindings, function (item) { return item.subclass.value });
    				callback(subclasses);
    			});
    		});
	    }
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
	fill_facet: function (container, facet_key, page_params, query_template, callback) {
	    var local_params = $.extend(true, {}, page_params);
	    var facet_paths = local_params.facets;
	    var params = facets.extract_query_parameters(facet_paths);
	    params.text = page_params.text;
		partials.compile_template(query_template, function (compiled_query) {
			var iris = _.toArray(_.map(facet_paths[facet_key], function (item) { return {iri: item, facet: facet_key};}));
			iris.splice(0, 0, {iri: "any"});
			partials.load_partial_each(container, "/facets/_facet_item.html", iris, function () {
				var facet_items = $(container).find(".facet-item");
				facet_items.each(function (index, element) {
				    var is_focal = (index === (facet_items.size() - 1));
				    facets.fill_facet_item(element, _.clone(params), facet_key, is_focal, index, compiled_query);
				});
			});
		});	
	},
	
	fill_facet_item: function (facet_item, params, facet_key, is_focal, level, query, callback) {
	    for (var i = 0; i < level; i++) {
	        $(facet_item).prepend("&nbsp;&nbsp;&nbsp;&nbsp;");
	    }
		var iri = $(facet_item).data("iri");
		if (iri === "any") {
			iri = null;
		}
		params[facet_key] = iri;
		if (is_focal) { $(facet_item).addClass("focal-facet-item"); }
		sparql.select(query(params), config.endpoint, function (sparql_json) {
			partials.load_partial_each($(facet_item).find(".facet-item-count"), "/shared/_count.html", sparql_json.results.bindings, function () {
			    if (is_focal) {
			        var facet_children_node = $(facet_item).find(".facet-children");
			        facets.direct_subclasses(iri, _.clone(params), function (returned_subclasses) {
			            var subclasses = (iri == null) ? config.facet_roots[facet_key] : returned_subclasses;
			            _.each(subclasses, function (subclass_iri) {
			                var subclass_params = _.clone(params);
			                subclass_params[facet_key] = subclass_iri;
			                sparql.select(query(subclass_params), config.endpoint, function (subclass_json) {
			                    if (subclass_json.results.bindings.length > 0) {
			                        var subclass_count = subclass_json.results.bindings[0].count.value;
    			                    if (subclass_count > 0) {
    			                        partials.render_template("/facets/_facet_leaf_item.html", {iri: subclass_iri, count: subclass_count}, function (rendered) {
    			                            var rendered_node = $(rendered);
    			                            for (var i = 0; i < (level + 1); i++) {
                                    	        rendered_node.prepend("&nbsp;&nbsp;&nbsp;&nbsp;");
                                    	    }
    			                            facet_children_node.append(rendered_node);
    			                        });
    			                    }
			                    }
			                });
			            });
			        });
			    }
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