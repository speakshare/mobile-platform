var template = _.template(require('./goodsDetail.html'));
require('./goodsDetail.css');
require('./lazyLoad.js');

module.exports = Backbone.View.extend({
  initialize: function (options) {
     $.setLoginTokenFormApp();
     this.gid = options.gid;
     window.customEvent( 3, '2.7.3', '商品详情页可见,id:'+this.gid);
     this.getData(this.gid);
 },
 getData:function(gid){
  var self = this;
  this.islogin=$.getLogin();
    $.batSync({
        data:[
        {url:fresh.apiRoot + 'pointshop/item/detail',data:{itemId:gid}},
        {url:fresh.apiRoot + 'pointshop/itemExchangeDesc',data:{itemId:gid,exchangeType:'1'}}
        ],
        success:function(d){
         self.cache ={
            good:d[0].entity,
            exchangeDesc:d[1].exchangeDesc.replace('\r','').split('\n')
        }
        self.render();
    },error:function(d){
        $.toast(d.msg);
        self.render();
    }
});

},
render:function (){
    this.$el.html(template(this.cache));
    $.setAppNav('兑礼品');
    $.imgLazyLoad();
    return this;

},
events:{
    'tap .exchangeconfirm':'exchangeBtn',
    'tap .loginbtn'       :'tologin',
    'tap .togoactivity'   :'toactivity'
},
exchangeBtn:function(e){
    var _self=$(e.currentTarget);
    var _id=parseInt(_self.attr('data-id'));
    window.customEvent( 2, '2.7.4', '点击兑换商品按钮,id:'+_id);
    var version= $.getParam(location.href,'version');
    if($.isApp() ){
        jsb.goToApp("goodsExchange",{id:_id});
      // location.href="appgoodsExchange/"+ _id;
  }else{
      if(parseInt($("#ownPoints").val()) >=parseInt($("#needPoints").text())){
        $.changePage("mall/goodsExchange/"+_id );
    }else {
        $.toast("旺豆不足");
    }
}
},
tologin:function(){
    jsb.login()
},
toactivity:function(e){
    var _self = $(e.currentTarget);
    var _url = _self.attr('data-url');
    
    var isapp = $.getParam('isapp');
    
    if(isapp){
        if (this.cache.good.productNo) {
            _url += "?product=" + this.cache.good.productNo + "&isapp=1";
        }
    }else{
        if (this.cache.good.productNo) {
            _url += "?product=" + this.cache.good.productNo;
        }
    }

    if(_url){
       location.href=_url;
   }
}
});
