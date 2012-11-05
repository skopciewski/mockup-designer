usemockups.views.Page = Backbone.View.extend({
    "el": "article",
    render: function () {
        this.$el.droppable({
            accept: ".toolbox li",
            drop: function (event, ui) {

                var left =  ui.offset.left,
                    top = ui.offset.top,
                    draggable = ui.draggable;

                this.$el.append(new usemockups.views.Mockup({
                    "top": top,
                    "left": left,
                    "tool": usemockups.tools.get(draggable.data("tool"))
                }).render().el);

            }.bind(this)
        })
    }
});


usemockups.views.Document = Backbone.View.extend({
    el: "body",
    render: function () {

        _.forEach(usemockups.tools.models, function (tool) {

            $("<li>").addClass(tool.get("name")).data("tool", tool.get("name")).appendTo(
                this.$el.find(".toolbox"));

        }, this);


        this.$el.find(".toolbox li").draggable({
            cursor: "move",
            stack: "article",
            helper: function () {
                return (new usemockups.views.ToolPreview({tool: usemockups.tools.get($(this).data("tool"))}).render().el)
            }
        });

        (new usemockups.views.Page()).render();
    }
});