usemockups.views.Mockup = Backbone.View.extend({
    tagName: "div",
    className: "object",
    initialize: function () {
        this.template = $(this.options.tool.get("template")).html();
    },
    render: function () {
        this.$el.css({
            "top": this.options.top,
            "left": this.options.left
        }).draggable({
                "containment": "article"
            }).html(_.template(this.template, {}));
        return this;
    }
});
