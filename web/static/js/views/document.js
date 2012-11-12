usemockups.views.Page = Backbone.View.extend({
    "el": "article",

    mockup_count: 0,

    initialize: function () {
        this.model.mockups.on("add", this.add_mockup, this);
        this.model.mockups.on("reset", this.render_mockups, this);
        this.render_mockups()
    },

    add_mockup: function (mockup, options) {

        var mockup_view = new (this.get_mockup_view(mockup.get("tool")))({
            model: mockup
        });
        this.$el.append(mockup_view.render(options).el);

        if (mockup.is_resizable())
            mockup_view.make_resizable();

        mockup_view.$el.attr("tabindex", this.mockup_count++);

        mockup_view.focus();

        return this;
    },
    
    render_mockups: function () {
        this.$el.empty();
        _.forEach(this.model.mockups.models, function (model) {
            this.add_mockup(model, {
                focus: false,
                show_property_dialog: false
            })
        }, this);
        this.model.mockups.off("reset")
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

    events: {
        "click header": "change_title"
    },

    initialize: function () {
        this.model.on("change:title", this.render_title, this);
    },

    render: function () {

        (new usemockups.views.Toolbox({
            model: usemockups.toolbox
        })).render();

        this.article = (new usemockups.views.Page({
            model: this.model
        }));
        this.article.render();

        this.render_title();
    },

    render_title : function () {
        this.$el.find("header h1").html(this.model.escape("title"));
        return this;
    },

    change_title: function () {
        var title = window.prompt("Title", this.model.get("title"));
        if (title) {
            this.model.save({
                title: title
            })
        }
    }
});


usemockups.views.NavigationItem = Backbone.View.extend({
    tagName: "li",
    template: $("#navigation-item-template").html(),
    events: {
        "click a.show": "navigate",
        "click a.destroy": "destroy"
    },
    render: function () {
        this.$el.html(_.template(this.template, this.model.toJSON()))
        return this;
    },
    navigate: function () {
        this.options.router.navigate_document(this.model);
        this.options.parent.toggle_navigation();
    },
    destroy: function () {
        if (!window.confirm("Are you sure?"))
            return false;

        this.model.destroy();
        this.$el.remove();
        return false;
    }
});

usemockups.views.NewDocumentForm = Backbone.View.extend({
    el: "nav form",
    events: {
        "submit": "submit_form"
    },
    submit_form: function () {
        var title = this.$el.find("#title");
        if (title) {
            (new usemockups.models.Document()).save({ title: title.val() },{
                success: function (model) {
                    this.model.add(model);
                    title.val("");
                }.bind(this)
            });
        }
        return false;
    }
});

usemockups.views.Navigation = Backbone.View.extend({
    el: "nav",
    events: {
        "click h2": "toggle_navigation"
    },
    initialize: function () {
        this.model.on("reset", this.render, this);
        this.model.on("add", this.add_document_item, this);
        this.model.fetch();
    },
    add_document_item: function (model) {
        this.$el.find("ul").append((new usemockups.views.NavigationItem({
            model: model,
            router: this.options.router,
            parent: this
        })).render().el);
    },
    render: function () {

        _.forEach(this.model.models, this.add_document_item, this);

        new usemockups.views.NewDocumentForm({
            model: this.model
        });

    },
    toggle_navigation: function () {
        this.$el.find("section").toggle();
        return false;
    }
});