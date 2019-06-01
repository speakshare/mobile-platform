var template = _.template(require('./footerNav.html'));
require('./footerNav.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.index = options.index;
        this.getData();
    },
    getData:function(){
        var self = this;
        self.msgCount = 0;
        self.isLogin = $.getLogin();
        if(self.isLogin){
            $.sync({
                // url: fresh.apiRoot + 'member/selectCustomerMessageCount',
                url: fresh.apiRoot + 'member/queryMessageCount',
                type: 'post',
                data: {
                    loginToken: $.getToken()
                },
                success: function(d){
                    // localStorage.yw_user_msg_count = d.count;
                    self.msgCount = d.isRedDot?d.isRedDot:'';
                    self.render();
                },error:function(d){
                    // $.toast(d.msg);
                    self.render();
                }
            })
        }else{
             self.render();
        }

    },
    render:function (){
        this.$el.html(template({index:this.index,msgCount:parseInt(this.msgCount)}));
        return this;
    },
    events:{
        'click .foot':'menu'
    },
    menu:function(e){
        var self = $(e.target);
        var _idx=parseInt(self.attr('attr-idx'));
        var navMenu = ['home','product','mall','uc/home'];
        self.addClass('active').siblings().removeClass('active');
        $.changePage(navMenu[_idx-1]);
    }
});