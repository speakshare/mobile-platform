var template = _.template(require('./rightProduct.html'));
require('./rightProduct.css');
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.data = options.data;
        this.getData(this.data);
    },
    getData:function(data){
        this.$el.append(template({data: data}));
    },

    events:{
        'touchend .pro1':'gotoBuy',
        'touchend .layermbtn':'close',
    },

    gotoBuy: function(event){
        var productNo = $(event.target).attr("data-productno")
        event.preventDefault();
        var temp = "";
        if(this.data.redBagId){
            temp = "?redBagId=" + this.data.redBagId;
        }
        $.changePage("product/" + productNo + "/checkout/" + temp);
    },

    close: function(event){
        event.preventDefault();
        $(".layermbox").remove();
    }
});