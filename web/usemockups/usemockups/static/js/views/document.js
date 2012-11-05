usemockups.views.Page = Backbone.View.extend({
    "el": "article",
    render: function () {
        this.$el.droppable({
            accept: ".toolbox li",
            drop: function (event, ui) {
                
                var left =  ui.offset.left - this.$el.offset().left,
                    top = ui.offset.top - this.$el.offset().top,
                    tool_name = ui.draggable.data("tool");

                var mockup = new usemockups.models.Mockup({
                    top: top,
                    left: left,
                    tool: tool_name
                });

                var mockup_view = usemockups.custom_mockup_views[tool_name]
                                || usemockups.views.Mockup;

                this.$el.append(new mockup_view({
                    model: mockup
                }).render().el);

            }.bind(this)
        })
    }
});


usemockups.views.Document = Backbone.View.extend({
    el: "body",
    render: function () {

        _.forEach(usemockups.toolbox.models, function (tool) {

            $("<li>").addClass(tool.get("name")).data("tool", tool.get("name")).appendTo(
                this.$el.find(".toolbox"));

        }, this);


        this.$el.find(".toolbox li").draggable({
            cursor: "move",
            stack: "article",
            helper: function () {
                return new usemockups.views.ToolPreview({
                    tool: usemockups.toolbox.get($(this).data("tool"))}).render().el
            }
        });

        (new usemockups.views.Page()).render();
    }
});