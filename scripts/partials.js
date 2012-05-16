var partials = {
	
	uniqueIDIncrementer: 0,
	
	nextID: function () {
		partials.uniqueIDIncrementer += 1;
		return "id" + partials.uniqueIDIncrementer;
	},
	
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
			if (callback) { callback(); };
		});
	},
	
	load_partial_each: function (container, partial_url, data, callback) {
		partials.compile_template(partial_url, function (compiled) {
			var html = "";
			_.each(data, function (item) {
				html += compiled(item);
			});
			jQuery(container).html(html);
			if (callback) { callback(); };
		});	
	}

};

