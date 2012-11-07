usemockups.views.PropertyDialog = Backbone.View.extend({
    el: "aside form",
    template: $("#property-form-template").html(),
    initialize: function () {
        this.on("update", this.update_for_attribute);
    },
    render: function () {

        this.$el.html(_.template(this.template, {
            "attributes": this.model.get_attributes()
        })).find("input").keyup(function (ui) {
            var input = $(ui.target);
            this.model.set(input.attr("name"), input.val());
        }.bind(this));
        return this;
    },
    update_for_attribute: function (field) {
        this.$el.find("#id_"  + field.data("attribute")).val(field.val());
    }
});