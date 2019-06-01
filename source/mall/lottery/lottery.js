/**
 * Created by xmm  on 2016/11/7
 */
 var template = _.template(require('./lottery.html'));
 require('./lottery.css');
 module.exports = Backbone.View.extend({
 	initialize: function (options) {
 		$.setLoginTokenFormApp();
 		this.type = options.type;
 		this.minFund=10;
 		this.maxFund=100;
 		this.fundStep=10;
 		this.picNum=6;
 		this.getData();
 	},
 	getData:function(){
 		var self = this;
 		self.islogin=$.getLogin();
 		self.runflag=false;
 		self.timer=null;
 		self.audio=null;
 		self.gambleFund=parseInt(localStorage.getItem('yw_user_gambleFund')|| self.minFund); 
 		if($.getLogin()){
 			$.batSync({
 				data:[
 				{url:fresh.apiRoot + 'point/prize/list'},
 				{url:fresh.apiRoot + 'point/total'}
 				],
 				success:function(d){
 					self.cache={
 						list : d[0]?d[0].list:[],
 						total : d[1]?d[1].pointTotalAmt:0,
 						gambleFund:self.gambleFund,
 						islogin: d[1]? true:false
 					};
 					self.render(); 
 				},error:function(d){
 					$.toast(d.msg);
 					self.cache={
 						list:[],
 						gambleFund:self.gambleFund,
 						total : 0,
 						islogin:false
 					};
 					self.render(); 
 				}
 			});
 		}else{
 			$.sync({
 				url:fresh.apiRoot + 'point/prize/list',
 				type: 'post',
 				success: function(d){
 					self.cache={
 						list :d?d.list:[],
 						gambleFund:self.gambleFund,
 						total : 0,
 						islogin:false
 					};	
 					self.render();	
 				},error:function(d){
 					self.cache={
 						list:[],
 						gambleFund:self.gambleFund,
 						total : 0,
 						islogin:false
 					};
 					self.render(); 
 				}
 			});
 		}	
 	},
 	render:function (){
 		var self=this;
 		this.$el.html(template(self.cache));
 		$.setAppNav('疯狂水果机');
 		//this.findMuisucFile();
 		return this;
 	},
 	events:{
 		'tap .gobtn'  :'lottery',
 		'tap .add'    :'add',
 		'tap .maxbtn' :'add',
 		'tap .reduce' :'reduce',
 		'tap .minbtn' :'reduce',
 		'tap .close'  :'popremove',
 		'tap .maskpop':'popremove',
 		'tap .toagin' :'popremove',
 		'tap .toview' :'viewRaiders',
 		'touchmove .maskpop':'touchmoveCancel'
 	},
 	add:function(e){
 		var self=this;
 		if(!self.cache.islogin||self.runflag){
 			return;
 		}
 		var gambleFund=parseInt(localStorage.getItem('yw_user_gambleFund')|| self.minFund);
 		var maxNum=self.cache.total<self.minFund?self.minFund:Math.min(self.cache.total-self.cache.total % self.fundStep,self.maxFund);
 		if(e.target.classList.contains('maxbtn')){
 			gambleFund=maxNum;
 		}else if(gambleFund+self.fundStep<=maxNum){
 			gambleFund+=self.fundStep;
 		}
 		localStorage.setItem('yw_user_gambleFund',gambleFund);
 		$('.gamblefund').html($.strHtml(gambleFund));  
 	},
 	reduce:function(e){
 		var self=this;
 		if(!self.cache.islogin||self.runflag){
 			return;
 		}
 		var gambleFund=parseInt(localStorage.getItem('yw_user_gambleFund')|| self.minFund);	
 		if(e.target.classList.contains('minbtn')){
 			gambleFund=self.minFund;
 		}else if(gambleFund-self.fundStep>=self.minFund){
 			gambleFund-=self.fundStep;
 		}
 		localStorage.setItem('yw_user_gambleFund',gambleFund);
 		$('.gamblefund').html($.strHtml(gambleFund));  
 	},
 	lottery:function(){
 		var self=this;
 		if(!self.cache.islogin){
 			$.toast('登录后即可参与...',2000);
 			$.setLogin(null);
 			setTimeout(function(){
				jsb.login();
 			},1000);
 		}else{
 			if(self.cache.total<self.minFund){
 				self.ResultPop();
 				return;
 			}
 			var gambleFund=parseInt(localStorage.getItem('yw_user_gambleFund')|| self.minFund);
 			if(!self.runflag){
 				self.runflag=true;
 				$('.gobtn').addClass('active');
 				self.audio = document.getElementById("Music"),
 				self.audio.play();
 				$.sync({
 					url:fresh.apiRoot + 'point/prize/execute',
 					type: 'post',
 					data:{gambleFund:gambleFund},
 					success: function(d){
 						self.Runing(d.content.displayIcon);
 						setTimeout(function(){
 							self.audio.pause();
 							self.audio.currentTime = 0;
 							self.ResultPop(d.content.win);
 							self.runflag=false;
 							$('.gobtn').removeClass('active');
 							clearInterval(self.timer);
 							$('.lottery-box').removeClass('light1').removeClass('light2');
 							$('.mybalance').html($.strHtml(d.content.balance)); 
 							self.cache.total=d.content.balance*1;
 						},3000);
 					},error:function(d){
 						self.audio.pause();
 						self.audio.currentTime = 0;
 						if(d.status==1900){
 							$.toast('对不起当前投注人数较多，请稍后继续',1000);
 						}
 						if(d.status==1901){
 							$.toast('旺豆余额不足',1000);
 						}
 						setTimeout(function(){
 							self.runflag=false;
 							$('.gobtn').removeClass('active');
 						},1000);
 					}
 				});			
 			}
 		}	
 	},
 	Reset:function(){
 		$(".lhj-pos").css({"top":0});
 	},
 	Runing:function(str){
 		var self=this;
 		var indexarr=str.split(',');
 		var toH=this.$el.find('.lhj-img').height(),
 		baseH=this.$el.find('.lhj-con').height(),
 		posarr=[];
 		for(var i=0;i<self.picNum;i++){
 			posarr.push(0-toH-baseH*i);
 		}
 		self.Reset();
 		self.Lightting();
 		// self.audio = document.getElementById("Music"),
 		// self.audio.play();
 		self.Aminate($(".lhj-pos1"),indexarr[0],posarr);
 		self.Aminate($(".lhj-pos2"),indexarr[1],posarr);
 		self.Aminate($(".lhj-pos3"),indexarr[2],posarr);
 	},
 	Aminate:function(obj,index,arr){
 		obj.animate({"top":arr[3]},1000,"linear", function () {
 			$(this).css("top",0).animate({"top":arr[3]},1000,"linear",function(){
 				$(this).css("top",0).animate({"top":arr[index]},900,"linear");
 			});
 		});
 	},
 	Lightting:function(){
 		var lightflag=false;
 		this.timer= setInterval(function(){
 			if(lightflag){
 				$('.lottery-box').removeClass('light1').addClass('light2');
 				lightflag=false;
 			}else{
 				$('.lottery-box').removeClass('light2').addClass('light1');
 				lightflag=true;
 			}
 		}, 50);		
 	},
 	ResultPop:function(num){
 		var mask='';
 		if(num>0){
 			var gambleFund=parseInt(localStorage.getItem('yw_user_gambleFund')||this.minFund);
 			mask=$('<div class="maskpop"><div class="popcenter"><div class="close"></div><div class="pic pic1"></div><p class="text">获得了'+gambleFund+'×'+(num/gambleFund)+'倍<br/>总计<span class="ycolor">'+num+'旺豆</span></p><div class="btn toagin"></div></div></div>');
 		}else if(num==0){
 			var tipsarr=['好可惜喔<br/>与大奖擦肩而过','最重要的是开心咯~','听说一天抽奖50次,<br/>中奖几率比较高','不要灰心，么么哒~','好可惜喔<br/>差点就中奖了'];
 			mask=$('<div class="maskpop"><div class="popcenter"><div class="close"></div><div class="pic pic2"></div><p class="text">'+tipsarr[Math.floor(Math.random()*5)]+'</p><div class="btn toagin"></div></div></div>');
 		}else{
 			mask=$('<div class="maskpop"><div class="popcenter"><div class="close"></div><div class="pic pic3"></div><p class="text f16">旺豆余额不足<br/>购买理财产品后中奖几率比较高喔</p><div class="btn toview"></div></div></div>');
 		}
 		this.$el.append(mask);
 	},
 	popremove:function(e){
 		$('.maskpop').off().remove();
 		e.preventDefault();
 	},
 	viewRaiders:function(){
 		$.changePage('staticPage/peasRaiders');
 	},
 	touchmoveCancel:function(e){
 		e.preventDefault();
 	}
 });
