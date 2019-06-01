var template = _.template(require('../../detail/html/pd-project-info.html'));

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.pid=options.pid;
        this.getData();
    },
    getData:function(){
        var self=this;
        this.cache={};
        $.sync({
            url:fresh.apiRoot + 'projectDetails',
            data:{
                productNo: this.pid
            },
            type:'post',
            success:function(d){
                self.cache.pro=d;
                self.render();
            }
        });
    },
    events: {
        'tap .fixed-more': 'openProList',
        'tap .ux-shutdown': 'shutDownBox'
    },
    render:function (){
        this.$el.html('<div class="pd-infos">'+template(this.cache)+'</div>')
    },
    openProList: function () {
        var $win = $(window);
        var width = $win.width() * 0.85;
        var height = $win.height() * 0.85;
        this.$el.find('.fixed-pop').show();
        this.$el.find('.ui-pro-list').width(width).height(height);
    },
    shutDownBox: function () {
        this.$el.find('.fixed-pop').hide();
    }
});