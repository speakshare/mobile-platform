require('./../legal.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type=options.type;
        this.pid=options.pid;
        this.render();
    },
    render:function (){
        var index = this.pid,
            title='';
        switch (index){
            case '0':title='风险提示书';break;
            case '1':title='免责声明';break;
            case '2':title='债权转让及服务协议1';break;
            case '3':title='债权转让及服务协议2';break;
            case '4':title='银行类金融产品收益权转让合同';break;
            case '5':title='应收账款收益权转让合同';break;
            case '6':title='债权资产权益转让协议';break;
            case '7':title='融资租赁收益权转让协议';break;
            case '8':title='催收授权委托书';break;
            default:title='法律文件';break;
        }
        var _template = require('./legal_'+this.pid+'.html');
        this.$el.html(_template);
        $.setAppNav(title);
        return this;
    }
});


