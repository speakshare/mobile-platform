/**
 * Created by xmm  on 2016/9/5
 */
 var template = _.template(require('./goodsExchange.html'));
 require('./goodsExchange.css');
 module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type = options.type;
        this.gid=options.gid;
        this.getData(this.gid);
    },
    getData:function(gid){
        var self=this;
        $.checkUser(1,function(){
            $.batSync({
                data:[
                {url:fresh.apiRoot + 'pointshop/address/default'},
                {url:fresh.apiRoot + 'pointshop/item/detail',data:{itemId:gid}}
                ],
                success:function(d){
                    self.addr = d[0].entity;
                    self.good=d[1].entity;
                    self.render();
                },error:function(d){
                    self.render();
                }
            });
        });
    },
    render:function (){
        this.$el.html(template({addr:this.addr,good: this.good}));
        $.setAppNav('兑礼品');
        if(this.good.level && this.good.pointDiscount){
            var memberType = ['普通','白银','黄金','铂金','钻石'];
            $('.hui-yuan').html(memberType[this.good.level-1]+'会员专享'+this.good.pointDiscount * 100+'折');
        }
        return this;
    },
    events:{
        'tap .setaddr'          :'setaddr' ,
        'tap .confrimexchange'  :'confrimexchange'
    },
    setaddr:function(){
        var _url=window.location.href;
        $.setCache("addrcallbacklink",_url);
        $.changePage("mall/addr");
    },
    confrimexchange:function(e){
        var self = $(e.currentTarget);
        var _ruleId=parseInt(self.attr('data-ruleId'));
        var _exId=parseInt(self.attr('data-exId'));
        var _addrId=parseInt($("#addrid").val());
        var _remark=$("#remark").val();
        if(_addrId<0){
            $.toast("请先添加收货地址");
            return;
        }
        $.sync({
            url: fresh.apiRoot + 'pointshop/exchange',
            type: 'post',
            data:{ruleId:_ruleId,addressId:_addrId,remark:_remark},
            success: function(d){
                $.changePage("mall/exchangeResult/"+_exId);
            },error:function(d){
                $.toast(d.msg);
            }
        });
    }
});