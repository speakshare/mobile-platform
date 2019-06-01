var template = _.template(require('./success.html'));
require('../list/list.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.render();
    },
    render:function (){
        var data = {};
        data.sName = decodeURIComponent(encodeURIComponent($.getParam(location.href,'name'))),
        data.sAmount = $.getParam(location.href,'amount'),
        data.sCycle = $.getParam(location.href,'cycle'),
        data.sProfit = $.getParam(location.href,'profit'),
        data.sType = $.getParam(location.href,'type'),
        data.sTime = $.getParam(location.href,'time');
        this.$el.html(template(data));
        $.setAppNav('投资结果','#product');
        $.fixDownloadApp();
        return this;
    },
    events:{
        'tap .btn':'complete'
    },
    complete:function(){
        $.changePage('transfer');
    }
});

