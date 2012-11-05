usemockups.models.Tool = Backbone.Model.extend({
    idAttribute: "name"
});

usemockups.collections.Tools = Backbone.Collection.extend({
    model: usemockups.models.Tool
});