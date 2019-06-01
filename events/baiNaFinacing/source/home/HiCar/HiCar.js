var template = _.template(require('./HiCar.html'));
var  protocol=require('../../protocol/protocol');
require('./HiCar.css');

module.exports = Backbone.View.extend({
	initialize: function (options) {
		this.type=options.type;
		this.scrollTop=0;
		this.code='PRO_1';
		this.getData();
	},
	getData:function(){
		var self=this;
		$.sync({
			url:fresh.apiRoot+'baiNaActiProductList',
			type:'post',
			data:{
				promotionCode:self.code
			},
			success:function(d){
				self.cache=d;
				self.render();
			}
		})
	},
	render: function () {
		this.$el.html(template(this.cache));
		this.setProtocol();
		$.setAppNav('租车一起嗨');
		jsb.setShareInfo({
			title:'真的任性！送车送房！',
			desc:'大牌摇旺 必须宠你到任性',
			icon:$.getStaticOrgin()+'/yaowang/events/baiNaFinacing/dist/hicaricon.jpg',
			link:location.href
		});
		return this;
	},
	events:{
		'tap .share'    :'share',
		'tap .fwxq'     :'fwDetail',
		'tap .recordbtn':'record',
		'tap .get_btn'  :'toDetail'
	},
	fwDetail:function(e){
		var _target=e.currentTarget;
		var _id=$(_target).attr('data-pid');
		$(_target).toggleClass('up');
		if(!$(_target).hasClass('up')){
			$(".desc"+_id).slideUp(0);
		}else{
			$(".desc"+_id).slideDown(0);
		}
	},
	record:function(){
		$.changePage('order/'+this.code);	
	},
	toDetail:function(e){
		var _target=e.currentTarget,
		code=$(_target).attr('data-code'),
		gid=$(_target).attr('data-gid'),
		pid=$(_target).attr('data-pid');
		$.changePage('goods/'+code+'/'+gid+'/'+pid);
	},
	share:function(){
		jsb.share();
	},
	setProtocol:function(){
		var array=this.$el.find('.fwIntro');
		array.each(function(i,n){
			var flag=$(n).attr('data-flag');
			new protocol({el:$(n),protocolCode:flag});
			console.log(new protocol({el:$(n),pcode:flag}));
		});	
		// new protocol({el:$('.fwIntro'),protocolCode:'mgs'});
	}
});