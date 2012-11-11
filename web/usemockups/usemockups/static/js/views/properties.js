usemockups.views.PropertyDialog = Backbone.View.extend({
    el: "footer form",
    template: $("#property-form-template").html(),
    initialize: function () {
        this.on("update", this.update_for_attribute);
    },
    render: function () {

        $("footer").show();

        this.$el.html(_.template(this.template, {
            "attributes": this.get_attributes()
        })).find("input").change(function (ui) {


            var input = $(ui.target);
            var value;

            if (input.is(":checkbox")) {
                value = input.is(":checked");
            } else {
                value = input.val();
            }

            this.model.set(input.attr("name"), value);

        }.bind(this));
        return this;
    },
    update_for_attribute: function (field) {
        this.$el.find("#id_"  + field.data("attribute")).val(field.val());
    },
    get_attributes: function () {
        return _.map(this.model.tool.get("attributes"), function (attribute) {
            return _.extend({
                "value": this.model.get(attribute.name)
            }, attribute);
        },this)
    }
});