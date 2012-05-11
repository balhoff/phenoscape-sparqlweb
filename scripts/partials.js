var uniqueIDIncrementer = 0;
function nextID() {
	uniqueIDIncrementer += 1;
	return "id" + uniqueIDIncrementer;
}

var partials = {
	
	compile_template: function (template_url, callback) {
		jQuery.get(template_url, function (template) {
			var compiled = _.template(template);
			callback(compiled);
		});
	},

	render_template: function (template_url, data, callback) {
		partials.compile_template(template_url, function (compiled) {
			var rendered = compiled(data);
			callback(rendered);
		});
	},
	
	load_partial: function (container, partial_url, data, callback) {
		partials.render_template(partial_url, data, function (rendered) {
			jQuery(container).html(rendered);
		});
	},
	
	load_partial_each: function (container, partial_url, data, callback) {
		partials.compile_template(partial_url, function (compiled) {
			var html = "";
			_.each(data, function (item) {
				html += compiled(item);
			});
			jQuery(container).html(html);
		});	
	}

};


(function ($) {
	$.fn.load_partial = function (partial, data, processor) {
		var $this = $(this);
		$.get(partial, function (template) {
			var compiled = _.template(template);
			var html = compiled(data);
			$this.html(html);
			if (processor) {
				processor($this);
			}
		});
	};
})(jQuery);
	
	
(function ($) {
	$.fn.spark_template = function (queryTemplate, sparkOptions, data) {
		var $this = $(this);
		$.get(queryTemplate, function (queryText) {
			var compiled = _.template(queryText);
			var query = compiled(data);
			sparkOptions.query = query;
			$this.spark(sparkOptions)
		});
	};
})(jQuery);
	


function spark_init(element) {
	element.find('.spark').each(function () {
		var $this = $(this);
		var options = {};
		options.param = {};
		$.each($this.mapAttributes('data-spark-'), function (key, value) {
			var path = key.split('-').slice(2, 4);
			if (path.length > 1) {
				if (options[path[0]] == undefined) options[path[0]] = {};
				options[path[0]][path[1]] = value;
			} else {
				options[path[0]] = value;
			}
		});
		var queryFile = $this.attr('data-spark-param-query');
		if (queryFile) {
			$.get(queryFile, function (query) {
				var compiled = _.template(query);
				var renderedQuery = compiled(options.param);
				options.query = renderedQuery;
				$this.spark(options);
			});
		} else {
			$this.spark(options);
		}
	});
}
