/**
 * Created by Administrator on 2016/8/29.
 */
require('./staticPage.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type=options.type;
        this.vid=options.vid;
        this.render();
    },
    render:function (){
        var self=this,
            index = this.vid,
            title='';
        switch (index){
            case 'aboutUs':title='关于我们';break;
            case 'aboutYaoWang':title='了解摇旺';break;
            case 'concatUs':title='联系我们';break;
            case 'shakeHikePage':title='摇加息';break;
            case 'registerAgr':title='会员注册协议';break;
            case 'checkInsHint':title='签到规则';break;
            case 'awardsRule':title='金榜排行规则';break;
            case 'redRule':title='使用规则';break;
            case 'accInvestor':title='合格投资人申明';break;
            case 'yaoPro':title='摇宝产品说明书';break;
            case 'yaoSub':title='摇宝产品认购协议';break;
            case 'yaoRule':title='摇宝产品投资规则说明';break;
            case 'automateAgr':title='资金自动转入及摇宝代扣服务协议';break;
            case 'peasRaiders':title='旺豆攻略';break;
            case 'legalDoc':title='法律文件';break;
            case 'riskHint':title='风险提示书';break;
            case 'indemnity':title='免责声明';break;
            case 'orientation':title='定向委托投资协议';break;
            case 'orientationYao':title='定向委托投资协议';break;
            case 'makeOver':title='资产权益转让及受让协议';break;
            case 'mobDealPlug':title='移动客户终端基金交易插件三方协议';break;
            case 'fundAccount':title='开户协议';break;
            case 'equityPro':title='投资人权益须知';break;

            case 'accreditedInvestor':title='合格投资人声明';break;

            case 'updateStrategy':title='理财大使规则';break;
            case 'inviteRule':title='详细规则';break;//邀请好友
            case 'growthGuide':title='理财大使成长指南';break;
            case 'realizationRule':title='变现规则';break;
            case 'credit':title='征信查询授权书';break;
            default:title='摇旺';break;
        }
        var _template = _.template(require('./view/'+this.vid+'.html'));
        if(index=='yaoPro'){
            $.sync({
                url:fresh.apiRoot+'queryYaoBaoCompName',
                type:'post',
                success:function(d){
                    self.$el.html(_template({compName:d.compName}));
                }
            })
        }else{
            this.$el.html(_template());
        }
        
        
        $.setAppNav(title);
        this.yaoWangPic(); //导入“了解摇旺”的图片
        return this;
    },
    events:{
        'tap #touRule':'touRule',
        'tap .iconsa':'legalDoc',
        'tap #toYaoWang':'toYaoWang',
        'tap #toBao':'toBao',
        'tap #toCon':'toCon',
        'tap .moreruletab':'showmorerule'
       
    },
    yaoWangPic:function(){
        $('#pic1').attr('src',$.getStaticOrgin()+'/yaowang/dist/images/fc.jpg');
        $('#pic2').attr('src',$.getStaticOrgin()+'/yaowang/dist/images/js.jpg');
        $('#pic3').attr('src',$.getStaticOrgin()+'/yaowang/dist/images/kf.jpg');
        $('#pic4').attr('src',$.getStaticOrgin()+'/yaowang/dist/images/yx.jpg');
        $('#pic5').attr('src',$.getStaticOrgin()+'/yaowang/dist/images/cp.png');
        // $('#pic1').attr('src','../dist/images/fc.jpg');
        // $('#pic2').attr('src','../dist/images/js.jpg');
        // $('#pic3').attr('src','../dist/images/kf.jpg');
        // $('#pic4').attr('src','../dist/images/yx.jpg');
        // $('#pic5').attr('src','../dist/images/cp.png');
    },
    toYaoWang:function(){
        $.changePage('staticPage/aboutYaoWang')
    },
    toBao:function(){
        $.changePage('staticPage/securityGuarantee')
    },
    toCon:function(){
        $.changePage('staticPage/concatUs')
    },
    touRule:function(){
        $.changePage('staticPage/yaoRule');
    },
    legalDoc:function(e){
        var self = $(e.currentTarget);
        var _id = parseInt(self.attr('data-id'));
        if(_id == 1){
            $.changePage('staticPage/riskHint');
        }else if(_id == 2){
            $.changePage('staticPage/indemnity');
        }else if(_id == 3){
           var sort = $.getParam('sort') || 1;
            if(sort == '0' || sort == '1'){
                $.changePage('staticPage/orientation');
            }else if(sort == '2'){
                $.changePage('staticPage/underwriting');
            }
        }
    },
    showmorerule:function(){
        $('.moreruletab').hide(0).siblings('.morerule').show(10);
        $("html, body").animate({scrollTop: $(document).scrollTop()+100}, 120);
       
    }
    
});