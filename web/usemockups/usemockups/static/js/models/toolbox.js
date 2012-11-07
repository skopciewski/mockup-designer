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
            var default_value;

            if (_.isArray(attribute.default)) {
                // deep copy for multi dimensional arrays.
                // http://stackoverflow.com/a/817050/498402
                default_value = $.extend(true, [], attribute.default);
            } else {
                default_value = attribute.default;
            }

            attributes[attribute.name] = (mockup || this).get(attribute.name) || default_value;

        }, this);
        return attributes;
    }
});

usemockups.collections.Toolbox = Backbone.Collection.extend({
    model: usemockups.models.Tool
});