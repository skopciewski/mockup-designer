usemockups.models.Tool = Backbone.Model.extend({
    idAttribute: "name",
    defaults: {
        resizable: true,
        attributes: []
    },
    initialize: function () {
    },
    get_attributes: function (mockup) {
        var attributes = {};
        _.forEach(this.get("attributes"), function (attribute) {
            attributes[attribute.name] = (mockup || this).get(attribute.name) || attribute.default;
        }, this);
        return attributes;
    }
});

usemockups.collections.Toolbox = Backbone.Collection.extend({
    model: usemockups.models.Tool
});