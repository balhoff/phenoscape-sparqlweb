var widgets = {
    
    paginator: function (url_function, params, total_items) {
        var offset = params.offset ? params.offset : 0;
        var page_size = params.limit;
        var control = $('<span class="paginator">View page: </span>');
        var previous = $('<a>previous</a>');
        if (offset > 0) {
            var new_offset = Math.max((offset - page_size), 0);
            var prev_params = _.clone(params);
            prev_params.offset = new_offset;
            previous.attr("href", url_function(prev_params));
        }
        var next = $('<a>next</a>');
        if ((offset + page_size) < total_items) {
            var new_offset = offset + page_size;
            var next_params = _.clone(params);
            next_params.offset = new_offset;
            next.attr("href", url_function(next_params));
        }
        control.append(previous, "|", next);
        return control;
    }
    
};