function reload_table(callback) {
	$("#content").html('<img src="/images/rotation.gif">');
	$.get("provisional.xsl", function (xslt) {
		jQuery.get("/bioportal/provisional?submittedby=39814&apikey=" + bioportal_apikey, function (data) {
			var xsltProcessor = new XSLTProcessor();
			xsltProcessor.importStylesheet(xslt);
			var html_data = xsltProcessor.transformToFragment(data, document);
			$("#content").html(html_data);
			callback();
		});
	});
}

function delete_term(iri) {
	if (confirm("Are you sure you want to delete " + iri + "?")) {
		$.ajax("/bioportal/provisional?apikey=" + bioportal_apikey + "&termid=" + iri, {type: "DELETE", success: function () { alert("Successfully deleted " + iri); reload_table(add_labels_to_term_links); }, error: function () { alert("Failed to delete " + iri); }});
	}
}

function insert_permanent_id_editor(td) {
	var form = $('<form><input type="text" name="permanent_iri"></input><input type="submit"></input></form>');
	form.submit(function () { 
		update_permanent_id(td.parent().data("provisional-iri"), $(this).children('input[name="permanent_iri"]').val()); return false;
		});
	td.html(form);
}

function update_permanent_id(provisional_iri, permanent_iri, callback) {
	$.ajax("/bioportal/provisional?apikey=" + bioportal_apikey + "&termid=" + provisional_iri + "&permanentid=" + permanent_iri, {type: "PUT", success: function () { alert("Successfully updated " + provisional_iri); reload_table(add_labels_to_term_links); }, error: function () { alert("Failed to update " + provisional_iri); }});
}

function add_labels_to_term_links() {
    var query = _.template("SELECT DISTINCT ?label WHERE { <<%= iri %>> <http://www.w3.org/2000/01/rdf-schema#label> ?label . }");
    $(".term-link").each(function (index, element) {
        
        sparql.select(query({iri: $(element).attr("href")}), "/ontobee", function (json) {
            var bindings = json.results.bindings;
            if (bindings.length > 0) {
                $(element).html(bindings[0].label.value);
            }
        });
    });
}