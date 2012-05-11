(function($){
	$.spark.format.template_each = function(element, result, reduced, params) {
		var partial = params.param.partial;
		$.get(partial, function(template) {
			var html = "";
			var compiled = _.template(template);
			_.each(result.results.bindings, function(item) {
				html += compiled({sparql: item, context: params.param});
			});
			element.html(html);
			// element.find('.spark').each(function() {
			// 			var $this = $(this);
			// 			var options = {};
			// 			options.param = {};
			// 			$.each($this.mapAttributes('data-spark-'), function(key, value) {
			// 				var path = key.split('-').slice(2, 4);
			// 				if (path.length > 1) {
			// 					if (options[path[0]] == undefined) options[path[0]] = {};
			// 					options[path[0]][path[1]] = value;
			// 				} else {
			// 					options[path[0]] = value;
			// 				}
			// 			});
			// 			$this.spark(options);
			// 		});
		});
	};
	})(jQuery);