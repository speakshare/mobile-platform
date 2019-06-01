var template = _.template(require('./list.html'));
require('./list.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type = options.type;
        this.currentPage=0;
        this.getData();
    },
    getData:function(){
        var self= this;
        if (self.startload) return;
        self.render();
    },
    render:function (){
        this.$el.html(template(this.cache));
        $.setAppNav('变现列表');
        $('#transferBan').attr('src',$.getStaticOrgin()+'/yaowang/dist/images/banner@2x.png');
        // $('#transferBan').attr('src','dist/images/banner@2x.png');
        this._initEvent('0');
        return this;
    },
    _initEvent:function (sortType) {
        var listContent = require('./listContent/listContent');
        new listContent({el:this.$el.find(".transfer-list"),sortType:sortType})
    },
    events:{
        'tap .product':'pageProduct',
        'tap .transferItem':'transferDetail',
        'tap .fund': "gotoFundIndex",
        // 'tap .transfer-pop-fork':'transferPop',
        // 'tap .transfer-pop-but':'transferPop',
        'tap .classify-tab':'classifyBab',
        'tap #transferBan':'transferBan'
    },
    classifyBab:function(e){
        var self = $(e.target),
            mark_id = self.index();
        $('.classify-tab span').removeClass('active1').removeClass('active2').removeClass('active');
        if(mark_id == 0){
            this.switchType(self,'active1','active2','1','2');
        }else if((mark_id == 1)){
            this.switchType(self, 'active2', 'active1', '6', '5');
        }else if((mark_id == 2)){
            this.switchType(self, 'active2', 'active1', '4', '3');
        }
    },
    switchType:function(self,cla1,cla2,sort1,sort2){
        self.addClass('active').siblings().removeClass('active');
        $('.classify-tab i').removeClass('active');
        self.children().addClass('active');
        if(self.children().hasClass(cla1)){
            this._initEvent(sort1);
            self.children().removeClass(cla1).addClass(cla2);
        }else{
            this._initEvent(sort2);
            self.children().removeClass(cla2).addClass(cla1);
        }
    },
    // transferPop:function(){
    //     $('.transfer-pop').hide();
    //     $.setCache('transfer_pop',true)
    // },
    gotoFundIndex: function(){
        $.changePage("fund");
    },
    pageProduct:function(){
        $.changePage('product');
        return false;
    },
    transferDetail:function(e){
        var _id = $(e.currentTarget).attr('data-id');
        $.changePage("transfer/detail/"+_id);
    },
    transferBan: function(){
        window.location.href= location.protocol + '//' + location.host + '/events/transfer/index.html'
    }
});