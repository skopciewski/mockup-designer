usemockups.views.Mockup = Backbone.View.extend({
    tagName: "div",
    className: "object",
    events: {
        "click": "show_property_dialog"
    },
    initialize: function () {

        this.model.on("change", this.render, this);

        this.article = $("article");
        this.tool = usemockups.toolbox.get(this.model.get("tool"));
        this.template = $(this.tool.get("template")).html();

    },
    render: function () {

        this.$el.css({
            "top": this.model.get("top") + this.article.offset().top,
            "left": this.model.get("left") + this.article.offset().left,
            "width": this.model.get("width") || "auto",
            "height": this.model.get("height") || "auto"
        }).draggable({
                "containment": "article",
                "stop": function (event, ui) {
                    this.model.set({
                        "top": ui.position.top - this.article.offset().top,
                        "left": ui.position.left - this.article.offset().left
                    })
                }.bind(this)
        }).html(_.template(this.template, this.model.get_attributes()));

        this.$el.find("[data-attribute]").dblclick(function (event) {
            var attribute = $(event.target).data("attribute");
            var input = $("<input>")
                .attr("name", attribute)
                .data("attribute", attribute)
                .val(this.model.get(attribute));
            $(event.target).html(input);
            input.select();

            input.bind("change blur", function (event) {
                var input = $(event.target);
                this.model.set(input.data("attribute"), input.val());
            }.bind(this)).keyup(function (event) {
                usemockups.active_property_dialog.trigger("update", $(event.target));
            }.bind(this));

        }.bind(this));

        this.make_resizable();

        this.$el.bind("click mousedown", function (event) {
            if (!$(event.target).is("input")) {
                this.focus();
            }
        }.bind(this));

        this.show_property_dialog();

        this.focus();

        return this;
    },

    make_resizable: function () {

        if (!this.model.is_resizable())
            return;

        if (this.$el.hasClass("ui-resizable"))
            this.$el.resizable("destroy");

        this.$el.resizable({
            handles: "se",
            resize: function(event, ui) {
                if (!this.model.has("height"))
                    ui.size.height = ui.originalSize.height;
                if (!this.model.has("width"))
                    ui.size.width = ui.originalSize.width;
            }.bind(this),
            stop: function (event, ui) {
                if (this.model.has("width"))
                    this.model.set("width", ui.size.width);
                if (this.model.has("height"))
                    this.model.set("height", ui.size.height)
            }.bind(this),
            minWidth: this.tool.get("min_width"),
            minHeight: this.tool.get("min_height")
        });

        this.$el.find("")


    },

    focus: function () {
        this.$el.focus();
        return this;
    },

    show_property_dialog: function () {


        if (usemockups.active_property_dialog &&
            usemockups.active_property_dialog.model === this.model) {
            return;
        }

        usemockups.active_property_dialog = (new usemockups.views.PropertyDialog({
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
            values[input.data("row")][input.data("column")] = input.val() || "";
            this.model.set("values", values);
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