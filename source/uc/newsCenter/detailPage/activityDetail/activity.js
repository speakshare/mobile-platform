var template = _.template(require('./activity.html'));
require('../../newsCenter.css');
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.cache = options.cache || {};
        this.type = options.type;
        this.aid = options.aid;
        // this.render();
        this.getData();
    },
    getData:function(aid){
        var self = this;
        $.sync({
            url:fresh.apiRoot+'member/querySysInfoDetail',
            type:'post',
            loadFirstPage:true,
            data:{
                loginToken:$.getToken(),
                sysInfoId:self.aid
            },
            success:function(d){
                self.data = d;
                console.log(d);
                self.render();
            }
        })
        this.render();
    },
    events:{
        'tap .entryBtn':'entryActivity'
    },
    render:function (){
        var self = this;
        self.$el.html(template({activity:self.data}));
        $.setAppNav('公告详情');
        return this;
    },
    entryActivity:function(e){
        var _link = $(e.target).attr('data-link');
        if(_link){
            location.href = _link;
        }
    }
});