var sparql_partials = {
	
	load_partial_with_select: function (container, partial, query_template, endpoint, data, content_for_empty) {
		partials.render_template(query_template, data, function (query) { 
			sparql.select(query, endpoint, function (sparql_json) {
			        if (_.size(sparql_json.results.bindings) > 0) {
			            var bindings_with_data = _.map(sparql_json.results.bindings, function (binding) {
    						return _.extend({}, data, binding);
    					});
    					partials.load_partial_each(container, partial, bindings_with_data);
			        } else {
			            partials.load_partial(container, content_for_empty, data);
			        }
			}); 
		});
	}
	
};
