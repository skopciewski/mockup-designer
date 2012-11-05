usemockups.views.ToolPreview = Backbone.View.extend({

    tagName: "div",
    className: "object preview",

    initialize: function () {
        this.template = $(this.options.tool.get("template")).html();
    },

    render: function () {
        this.$el.html(_.template(this.template, {}));
        return this;
    }
});
