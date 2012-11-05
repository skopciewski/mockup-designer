usemockups.views.PropertyDialog = Backbone.View.extend({
    el: "aside form",
    template: $("#property-form-template").html(),
    render: function () {
        this.$el.html(_.template(this.template, {
            "attributes": this.model.get_attributes()
        })).find("input").keyup(function (ui) {
            var input = $(ui.target);
            this.model.set(input.attr("name"), input.val());
        }.bind(this))
    }
});