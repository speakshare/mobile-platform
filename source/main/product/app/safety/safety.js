var template = _.template(require('../../detail/html/pd-safe.html'));

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.pid = options.pid;
        this.getData();
    },
    getData: function () {
        var self = this;
        this.cache = {};
        $.sync({
            url: fresh.apiRoot + 'productInfo',
            data: {
                productNo: this.pid,
                type: 1
            },
            type: 'post',
            success: function (d) {
                self.cache.pd = d;
                self.render();
            }
        });
    },

    render:function (){
        this.$el.html('<div class="pd-infos">'+ template(this.cache)+'</div>')
    }
});