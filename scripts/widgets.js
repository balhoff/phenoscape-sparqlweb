var widgets = {
    
    paginator: function (url, offset_parameter, offset, page_size, total_items) {
        var url_with_offset = function (url, old_offset, new_offset) {
            var old_param = offset_parameter + "=" + old_offset;
            var new_param = offset_parameter + "=" + new_offset;
            if ((url.indexOf(old_param)) > -1) {
                return url.replace(old_param, new_param);
            } else {
                var prefix = (url.indexOf("?") > -1) ? "&" : "?";
                return url + prefix + new_param;
            }
        };
        var control = $('<span class="paginator">View page: </span>');
        var previous = $('<a>previous</a>');
        if (offset > 0) {
            var new_offset = Math.max((offset - page_size), 0);
            previous.attr("href", url_with_offset(url, offset, new_offset));
        }
        var next = $('<a>next</a>');
        if ((offset + page_size) < total_items) {
            var new_offset = offset + page_size;
            next.attr("href", url_with_offset(url, offset, new_offset));
        }
        control.append(previous, "|", next);
        return control;
    }
    
};