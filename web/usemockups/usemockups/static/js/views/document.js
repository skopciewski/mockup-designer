usemockups.views.Page = Backbone.View.extend({
    "el": "article",

    mockup_count: 0,

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

                var mockup_view = new (this.get_mockup_view(tool_name))({
                    model: mockup
                });

                this.$el.append(mockup_view.render().el);

                if (mockup.is_resizable())
                    mockup_view.make_resizable();

                mockup_view.$el.attr("tabindex", this.mockup_count++);

                mockup_view.focus();


            }.bind(this)
        });

        this.$el.click(function (event) {
            if ($(event.target).is("article")) {
                $("footer").hide()
            }
        })

    },

    get_mockup_view: function (tool_name) {
        return usemockups.custom_mockup_views[tool_name] ||
               usemockups.views.Mockup;
    }
});


usemockups.views.Document = Backbone.View.extend({
    el: "body",

    render: function () {
        (new usemockups.views.Toolbox({
            model: usemockups.toolbox
        })).render();
        (new usemockups.views.Page()).render();
    }
});