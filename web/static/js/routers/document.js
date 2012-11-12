usemockups.routers.Document = Backbone.Router.extend({
    routes: {
        "document/:id": "get_document"
    },
    get_document: function (document_id) {

        var document = new usemockups.models.Document({
            "id": document_id
        });

        document.fetch();

        if (usemockups.active_document_view) {
            usemockups.active_document_view.undelegateEvents();
            usemockups.active_document_view.article.undelegateEvents();
        }

        usemockups.active_document_view = new usemockups.views.Document({
            model: document
        });

        usemockups.active_document_view.render();


    }
});