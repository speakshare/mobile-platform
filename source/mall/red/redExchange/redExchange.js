/**
 * Created by xmm  on 2016/9/5
 */
 var template = _.template(require('./redExchange.html'));
 require('./redExchange.css');
 module.exports = Backbone.View.extend({
 	initialize: function (options) {
 		this.type = options.type;
 		this.rid=options.rid;
 		$.setLoginTokenFormApp();
 		window.customEvent( 3, '2.7.1', '红包详情可见,id:'+this.rid);
 		this.getData(this.rid);
 	},
 	getData:function(rid){
 		var self=this;
 		this.islogin=$.getLogin();
 		$.batSync({
 			data:[
 			{url:fresh.apiRoot + 'pointshop/coupon/detail',data:{couponId:rid}},
 			{url:fresh.apiRoot + 'pointshop/itemExchangeDesc',data:{itemId:rid,exchangeType:'2'}}
 			],
 			success:function(d){
 				self.cache ={
 					coupon:d[0].entity,
 					exchangeDesc:d[1].exchangeDesc.replace('\r','').split('\n')
 				}
 				self.render();
				console.log(d[0].entity)
 			},error:function(d){
 				$.toast(d.msg);
 				self.render();
 			}
 		});
 	},
 	render:function (){
 		this.$el.html(template(this.cache));
 		$.setAppNav('兑礼券');
		if(this.cache.coupon.level>1){
			var memberType = ['普通','白银','黄金','铂金','钻石'];
			var ddd = this.cache.coupon.pointDiscount*100;
			if(this.cache.coupon.pointDiscount*100%10 == 0){
				ddd = this.cache.coupon.pointDiscount*10;
			}
			$('.zhe-kou').html(memberType[this.cache.coupon.level-1]+'会员专享'+ddd+'折');
		}else{
			$('.zhe-kou').remove();
		}
 		return this;
 	},
 	events:{
 		"tap .canExchange":"Exchange",
 		"tap .tologinbtn" :"login"
 	},
 	Exchange:function(e){
 		var self = $(e.currentTarget),
			_ruleId=parseInt(self.attr('data-ruleId'));
		var memberType = ['普通','白银','黄金','铂金','钻石'];
 		var _exId=parseInt(self.attr('data-exId'));
 		var _redId=parseInt(self.attr('data-redid'));
 		window.customEvent( 2, '2.7.2', '点击红包兑换按钮,id:'+_redId);
 		if($.isApp()){
 			location.href="appredExchange/"+_exId;
 		}else{
			if(this.cache.coupon.isMember == 1){
				var that = this;
				$.popWindow({
					content:'您将以'+memberType[this.cache.coupon.level-1]+'会员价格<br/>'+parseInt(this.cache.coupon.needPoints * this.cache.coupon.pointDiscount)+'旺豆<br/>兑换商品'+this.cache.coupon.name,
					yes:'确定',
					no:'取消',
					type:2,
					callback:function(bl){
						if(bl){
							that.toExchange(_ruleId,_exId);
						}
					}
				})
			}else{
				this.toExchange(_ruleId,_exId);
			}
 		} 		
 	},
	toExchange:function(_ruleId,_exId){
		$.sync({
			url: fresh.apiRoot + 'pointshop/exchange',
			type: 'post',
			data:{ruleId:_ruleId},
			success: function(d){
				$.changePage("mall/exchangeResult/"+_exId);
			},error:function(d){
				$.toast(d.msg);
			}
		});
	},
 	login:function(){
		jsb.login()
 	}
 });