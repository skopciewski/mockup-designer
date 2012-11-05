usemockups.views.Mockup = Backbone.View.extend({
    tagName: "div",
    className: "object",
    events: {
        "click": "show_property_dialog"
    },
    initialize: function () {
        this.tool = usemockups.toolbox.get(this.model.get("tool"));
        this.template = $(this.tool.get("template")).html();
        this.model.on("change", this.render, this);
        this.article = $("article");
    },
    render: function () {
        this.$el.css({
            "top": this.model.get("top") + this.article.offset().top,
            "left": this.model.get("left") + this.article.offset().left
        }).draggable({
                "containment": "article",
                "stop": function (event, ui) {
                    this.model.set({
                        "top": ui.position.top - this.article.offset().top,
                        "left": ui.position.left - this.article.offset().left
                    })
                }.bind(this)
            }).html(_.template(this.template, this.model.get_attributes()));
        this.show_property_dialog();
        return this;
    },
    show_property_dialog: function () {
        (new usemockups.views.PropertyDialog({
            "model": this.model
        })).render()
    }
});

/*
* Custom Mockups
* */

usemockups.views.TableMockup = usemockups.views.Mockup.extend({
    initialize: function () {
        usemockups.views.Mockup.prototype.initialize.apply(this);
        this.model.on("change:columns change:rows", this.persist_values, this)
    },
    render: function () {
        usemockups.views.Mockup.prototype.render.apply(this);
        this.$el.find("input").change(function (event) {
            var input = $(event.target);
            var values = this.model.get("values");
            values[input.data("row")][input.data("column")] = input.val();
            this.model.set("values", values)
        }.bind(this));
        return this;
    },
    persist_values: function () {
        var values = this.model.get("values"),
            rows = this.model.get("rows"),
            columns = this.model.get("columns");

        for (var i=0; i<rows; i++) {
            values[i] = values[i] || [];
            for (var j=0; j<columns; j++) {
                values[i][j] = values[i][j] || "";
            }
        }

        this.model.set("values", values);
    }
});