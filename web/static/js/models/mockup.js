usemockups.models.Mockup = Backbone.Model.extend({
    defaults: {
        top: 0,
        left: 0
    },
    initialize: function () {
        this.tool = usemockups.toolbox.get(this.get("tool"));
        this.get_attributes = this.tool.get_attributes.bind(this.tool, this);
        _.forEach(this.get_attributes(), function (value, key) {
            this.set(key, value);
        }, this);
        this.on("change persist", this.persist, this);
        this.document = this.collection
    },
    is_resizable: function () {
        return this.has("width") || this.has("height")
    },
    persist: function () {
        this.document && this.document.trigger("persist");
    }
});

usemockups.collections.Mockups = Backbone.Collection.extend({
    model: usemockups.models.Mockup,
    initialize: function () {

    }
});