usemockups.views.Page = Backbone.View.extend({
    "el": "article",

    mockup_count: 0,

    initialize: function () {
        this.model.mockups.on("add", this.add_mockup, this);
        this.model.mockups.on("reset", this.render_mockups, this);
        this.render_mockups()
    },

    add_mockup: function (mockup) {

        var mockup_view = new (this.get_mockup_view(mockup.get("tool")))({
            model: mockup
        });
        this.$el.append(mockup_view.render().el);

        if (mockup.is_resizable())
            mockup_view.make_resizable();

        mockup_view.$el.attr("tabindex", this.mockup_count++);

        mockup_view.focus();

        return this;
    },
    
    render_mockups: function () {
        _.forEach(this.model.mockups.models, this.add_mockup, this);
    },

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

                this.model.mockups.add(mockup);

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

    initialize: function () {
        this.model.on("change:title", this.render_title, this);
    },

    render: function () {

        (new usemockups.views.Toolbox({
            model: usemockups.toolbox
        })).render();

        (new usemockups.views.Page({
            model: this.model
        })).render();

        this.render_title();
    },

    render_title : function () {
        this.$el.find("header h1").html(this.model.escape("title"));
        return this;
    }
});