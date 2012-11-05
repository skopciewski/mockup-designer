usemockups.views.ToolPreview = Backbone.View.extend({

    tagName: "div",
    className: "object preview",

    initialize: function () {
        this.tool = this.options.tool;
        this.template = $(this.tool.get("template")).html();
    },

    render: function () {
        this.$el.html(_.template(this.template, this.tool.get_attributes()));
        return this;
    }
});
