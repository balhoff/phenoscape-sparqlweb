var url_helper = {
    
    /**
    * @param {Object} params (facets, text, offset, limit)
    * @returns {String} the url
    */
    character_state_facet: function (params) {
        var param_prefix = "?";
        var param_string = "";
        var add_param = function (param) {
            param_string += param_prefix;
            param_string += param;
            param_prefix = "&";
        }
        if (params.facets) {
            add_param("facets=" + encodeURIComponent(JSON.stringify(params.facets)));
        }
        if (params.text) {
            add_param("text=" + encodeURIComponent(params.text));
        }
        if (params.offset) {
            add_param("offset=" + params.offset);
        }
        if (params.limit) {
            add_param("limit=" + params.limit);
        }
        return "/character_states/" + param_string;
    }
    
};