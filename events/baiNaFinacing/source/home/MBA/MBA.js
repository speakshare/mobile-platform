var template = _.template(require('./MBA.html'));
var subtemplate = _.template(require('./subdesc.html'));
require('./MBA.css');
module.exports = Backbone.View.extend({
	initialize: function (options) {
		this.type=options.type;
		this.scrollTop=0;
		this.code='PRO_2';
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
		$.setAppNav('中欧在线');
		jsb.setShareInfo({
			title:'哇，不止财富，还有学历！',
			desc:'大牌摇旺 授之以鱼又授之以渔',
			icon:$.getStaticOrgin()+'/yaowang/events/baiNaFinacing/dist/mbaicon.jpg',
			link:location.href
		});
		return this;
	},
	events:{
		'tap .share'        :'share',
		'tap .konwmore'     :'showsubdesc',
		'tap .canclesubdesc':'canclesubdesc',
		'tap .rulemore'     :'rule',
		'tap .recordbtn'    :'record',
		'tap .getbtn'       :'toDetail'
	},
	showsubdesc:function(){
		this.scrollTop=$(document).scrollTop();
		this.$el.append(subtemplate()).find('.MBA-wrap').hide(0);
		$('html, body').animate({scrollTop: 0}, 0);
	},
	canclesubdesc:function(){
		var self=this;
		this.$el.find('.MBA-wrap').show(0);
		this.$el.find('.MBA-subdesc-wrap').remove();
		$('html, body').animate({scrollTop: self.scrollTop}, 0);
	},
	rule:function(e){
		var _target=e.currentTarget;
		$(_target).toggleClass('up');
		if(!$(_target).hasClass('up')){
			$(".ruledesc").slideUp(0);
		}else{
			$(".ruledesc").slideDown(0,function(){
				$('html, body').animate({scrollTop:$(document).scrollTop()+100}, 0);
			});
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
	}
});