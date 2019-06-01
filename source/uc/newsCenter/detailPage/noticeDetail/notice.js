var template = _.template(require('./notice.html'));
require('../../newsCenter.css');
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.cache = options.cache || {};
        this.type = options.type;
        this.nid = options.nid;
        // this.render();
        this.getData();
    },
    getData:function(nid){
        var self = this;
        $.sync({
            url:fresh.apiRoot+'member/querySysInfoDetail',
            type:'post',
            loadFirstPage:true,
            data:{
                loginToken:$.getToken(),
                sysInfoId:self.nid
            },
            success:function(d){
                self.data = d;
                console.log(d);
                self.render();
            }
        })
    },
    events:{

    },
    render:function (){
        var self = this;
        self.$el.html(template({notice:self.data}));
        $.setAppNav('公告详情');
        return this;
    }
});