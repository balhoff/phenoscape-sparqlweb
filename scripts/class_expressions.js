var owl = {
	
	class_expression: function class_expression(node, rdf) {
		rdf.prefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#");
		rdf.prefix("rdfs", "http://www.w3.org/2000/01/rdf-schema#");
		rdf.prefix("owl", "http://www.w3.org/2002/07/owl#");
		
		var list = function list(listnode, items) {
			var items = items || [];
			items.push(rdf.where(listnode + " rdf:first ?item").select(["item"]).pop().item);
			var rest = rdf.where(listnode + " rdf:rest ?rest").select(["rest"]).pop().rest;
			if (rest == jQuery.rdf.nil) {
				return items;
			} else {
				return list(rest, items);
			}
		};
		
		var wrap = function (text) {
			return "(" + text + ")";
		}
		
		var label = function (resource) {
			var binding = rdf.where(resource + " rdfs:label ?label").select(["label"]).pop();
			if (binding) {
				return binding.label.value;
			} else {
				return resource.value;
			}
		}
		
		var some_values_from = function (owl_class) {
			owl_class.owltype = "ObjectSomeValuesFrom";
			owl_class.filler = owl.class_expression(rdf.where(node + " owl:someValuesFrom ?o").select(["o"]).pop().o, rdf);
			owl_class.manchester_syntax = function () { return (owl_class.property + " some " + owl_class.filler.manchester_syntax()); }
			var html_template = "<a href=\"<%= owl_class.property %>\" class=\"OWLProperty\"><%= owl_class.property_label %></a> some <%= owl_class.filler.html_manchester_syntax() %>";
			var compiled = _.template(html_template);
			owl_class.html_manchester_syntax = function () { return compiled({owl_class: owl_class}); };
			return owl_class;
		};
		
		var restriction = function (owl_class) {
			owl_class.owltype = "Restriction";
			var property_node = rdf.where(node + " owl:onProperty ?prop").select(["prop"]).pop().prop;
			owl_class.property = property_node.value;
			owl_class.property_label = label(property_node);
			owl_class.filler = "";
			if (rdf.where(node + " owl:someValuesFrom ?o").length > 0) {
				return some_values_from(owl_class);
			} else {
				return "yikes";
			}
		};
		
		var intersection = function (owl_class) {
			owl_class.owltype = "ObjectIntersection";
			var listnode = rdf.where(node + " owl:intersectionOf ?list").select(["list"]).pop().list;
			owl_class.operands = _.map(list(listnode), function (item) { return owl.class_expression(item, rdf); });
			owl_class.manchester_syntax = function() { return wrap(_.map(owl_class.operands, function (operand) { return operand.manchester_syntax(); }).join(" and ")); };
			owl_class.html_manchester_syntax = function() { return wrap(_.map(owl_class.operands, function (operand) { return operand.html_manchester_syntax(); }).join(" and ")); };
			return owl_class;
		}
		
		var named_class = function (owl_class) {
			owl_class.owltype = "OWLClass";
			owl_class.uri = node.value;
			owl_class.label = label(node);
			owl_class.manchester_syntax = function () { return owl_class.uri };
			var html_template = "<a href=\"<%= owl_class.uri %>\" class=\"OWLClass\"><%= owl_class.label %></a>";
			var compiled = _.template(html_template);
			owl_class.html_manchester_syntax = function () { return compiled({owl_class: owl_class}); };
			return owl_class;
		}
		
		var owl_class = {
			owltype: "ClassExpression"
		};
		
		if (node.type == "uri") {
			return named_class(owl_class);
		} else if (rdf.where(node + " rdf:type owl:Restriction").length > 0) {
			return restriction(owl_class);
		} else if (rdf.where(node + " owl:intersectionOf ?list").length > 0) {
			return intersection(owl_class);
		} else {
			alert(node);
		}	
	}
	
};