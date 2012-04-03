(function($){
	$.spark.format.template = function(element, result, reduced, params) {
		var partial = params.param.partial;
		$.get(partial, function(template) {
			var compiled = _.template(template);
			element.html(compiled(reduced));
		});
	};
})(jQuery);