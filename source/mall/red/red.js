/**
 * Created by xmm  on 2016/9/5
 */
 var template = _.template(require('./red.html'));
 require('./red.css');
 module.exports = Backbone.View.extend({
 	initialize: function (options) {
 		this.type = options.type;
 		this.getData();
 	},
     events:{
         'tap .mall-want':'toWantList'
     },
     toWantList:function () {
         $.changePage('mall/wantgoods/')
     },
 	getData:function(){
 		var self = this;	
 		$.sync({
 			url: fresh.apiRoot + 'pointshop/coupon/list',
 			type: 'post',
 			success: function(d){
 				var list = d.list;
 				self.redlist=list;
 				self.render();
 			},error:function(d){
 				self.redlist={};
 				self.render();
 			}
 		});
 	},
 	render:function (){
 		var self=this;
 		this.$el.html(template({redlist:this.redlist}));
 		var mySwiper=$.swiper('.swiper-container', {preventLinksPropagation:true,preventClicks:true,touchMoveStopPropagation:true,slidesPerView: 2.5, spaceBetween: 10,freeMode: true,
 			onTap:function(swiper,e){
 				var oTarget = $.findEleByClass(e.target, 'redinfo');
 				if(oTarget){
 					self.redinfo(oTarget);
 				}
 			}});
 		return this;
 	} ,
 	redinfo:function(obj){
 		if(obj){
 			var _idx=parseInt(obj.getAttribute('data-id'));
 			window.customEvent( 2, '2.3.1', '点击红包兑换,id:'+_idx);
 			$.changePage("mall/redExchange/"+_idx);
 		} 		
 	}
 });