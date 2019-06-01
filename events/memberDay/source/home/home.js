var template = _.template(require('./home.html'));
require('./home.css');

module.exports = Backbone.View.extend({
	initialize: function () {
		$.setLoginTokenFormApp();
		this.getData();
	},
	getData:function(){
		var self=this;
		$.sync({
			url:fresh.apiRoot+'memberday/list',
			type:'post',
			success:function(d){
				self.cache=d;
				self.render();
			}
		})
	},
	render: function () {
		var level={
			0:'',
			1:'普通会员',
			2:'白银会员',
			3:'黄金会员',
			4:'铂金会员',
			5:'钻石会员'
		};
		this.cache.levelName=level[this.cache.level];
		this.$el.html(template(this.cache));
		jsb.setShareInfo({
			title:'iPad Pro、三星S8+手机0元送！',
			desc:'7月福利升级 还有秒杀惊喜！',
			icon:'https://file.91yaowang.com/yaowang/events/memberDay/dist/share.jpg'
		});
		// this._getAddress(2)
		return this;
	},
	_getAddress:function(id){
		this.exID=id;
		var self=this,
			
			level={
				2:'白银',
				3:'黄金',
				4:'铂金',
				5:'钻石'
			},
			data=this.cache.list[id];
		data.levelName=level[data.buyLevel];
		$.sync({
			url:fresh.apiRoot+'pointshop/address/default',
			type:'post',
			success:function(d){
				var count=data.balance,
					num=data.balance;
				$.popWindow({
					content:_.template(require('./getGift.html'))({p:data,d:(d.entity ||{})}),
					type:2,
					yes:'提交',
					no:'退出',
					callback:function(bl){
						if(bl){
							var name=$('.f-name').val(),
								mobile=$('.f-mobile').val(),
								address=$('.f-address').val();
							if($.charLen(name)>20 || name.length<2 || !$.isMobileNum(mobile) || address.length<=4 || address.length>50){
								$.toast('请认真填写您的收货地址');
								return false;
							}
							self._exchange(data.id,name,mobile,address,num)
						}
					}
				});
				if(data.isMultiple==1 && count>=2){
					$('.change2').on('tap',function(){
						if(num+1<=count)
							$('.change-num').text(++num);
					});
					$('.change1').on('tap',function(){
						if(num-1>=1)
							$('.change-num').text(--num);
					})
				}
			}
		});

	},
	_exchange:function(id,name,mobile,address,num){
		var self=this;
		$.sync({
			url:fresh.apiRoot+'memberday/exchange',
			type:'post',
			data:{
				id:id,
				count:num,
				address:address,
				contacts:name,
				mobile:mobile
			},
			success:function(){
				self._success(id,num);
			}
		});
	},
	_success:function(id,num){
		var data=this.cache.list[this.exID];
		$.popWindow({
			content: _.template(require('./success.html'))({p: data,num:num}),
			type: 2,
			yes: '关闭',
			callback: function () {
				location.reload();
			}
		});
		
	},
	events:{
		'tap .p-btn':'checkBtn',
		'tap .share-btn':'share',
		'tap .fix-bottom':'order'
	},
	share:function () {
		jsb.share();
	},
	order:function () {
		if(this.cache.level==0){
			window.location='/weizhan/#login';
		}else{
			$.changePage('order')
		}
	},
	checkBtn:function(e){
		var obj=$(e.currentTarget),
			id=obj.attr('data-id'),
			data=this.cache.list[id];
		if(data.status==0){
			jsb.login();
		}else if(data.status==1){
			jsb.toDetail(data.productNo)
		}else if(data.status==2){
			this._getAddress(id);
		}
	}


});