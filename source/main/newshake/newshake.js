var template = _.template(require('./newshake.html'));

require('./newshake.css');

var domTemplate = '<div class="experienceBox" >'+
'  <!-- <span class="closeX">X</span> -->' +
'  <div class="shakeprofit">' + 
'    <p><span class="shakeamount"></span><span>元</span></p>' + 
'    <p>预计收益<span class="shakesal"></span>元</p>' + 
'  </div>' + 
'  <div class="rightuse" id="J_rightuse"></div>' + 
'  <div class="firstarm" id="J_firstarm">下载摇旺APP</div>' +
'</div>';

var cssTemplate = '';

var Popup = $.popup;
var ShakePop = new Popup({
	style:cssTemplate,
	content:domTemplate,
	close:''
});


var speed = 15, x, y, lastX, lastY;
if (window.DeviceMotionEvent) {
	
	// var audio = document.getElementById("shakemusic");
	// openAudio = document.getElementById("openmusic");
	x = y = lastX = lastY = 0;
}

var isShaked = false;
var ready = true; // 摇好运 按钮只准摇一次
var J_rightuse = document.getElementById('J_rightuse'), J_firstarm = document.getElementById('J_firstarm');
var productNo = null;

function decideHasRegTxt(){
	// 决定是否有注册文字显示
	// 判断当前是处于哪种情况，1从立即购买进来 2从注册页面进来
	var origin = window.localStorage.getItem('newshake_origin');
	origin = +origin;
	if(origin > 0){
		// 产品详情
		$('.shakebg').addClass('notxt');
	}
}


getNewHandDetailID();

// 获取 新手标 ID 号
function getNewHandDetailID(){
	$.sync({
		url:fresh.apiRoot + 'newProductList',
		type: 'post',
		dataType:'json',
		data:{productType:0, currentPage:0, pageCount:99},
		success: function(data){
			var resList = data.list || [];
			var resObj = resList[0] || {};
			productNo = resObj.productNo;
		   // if( !productNo && resList.length ){
		   		// getNewHandDetailID();
		   // }   
		},
		error: function(){
			// getNewHandDetailID();
		}
	});
}

bindEvent( J_rightuse, 'touchend', function(){
	// 立即使用
	ShakePop.hide();
	if( productNo ){
		$.changePage("product/"+productNo);
	}else{
		$.changePage("product");
	}
	// $.changePage('product');
	/*clearInterval( J_rightuse.timer );
	J_rightuse.timer = setInterval( function(){
		if( productNo ){
			$.changePage("productdetail/"+productNo);
			clearInterval( J_rightuse.timer );
		}else{
			$.changePage("product");
		}

	}, 50 );*/
	
} );


bindEvent( J_firstarm, 'touchend', function(){
	
	// 先逛逛
	ShakePop.hide();
	/*
	 这是一个神奇的功能
	 下载摇旺App
	* */
	$.changePage('app/download');
} );

function new_wobbles(){
	if (window.DeviceMotionEvent){
		window.addEventListener('devicemotion',
			function () {
				var acceleration = event.accelerationIncludingGravity;
				x = acceleration.x;
				y = acceleration.y;
				if ((Math.abs(x - lastX) > speed || Math.abs(y - lastY) > speed) && !isShaked) {
					isShaked = true;
					doShakeMove();
				}
				lastX = x;
				lastY = y;
			},true);
	}
}

function doShakeMove(){
	if(ready){
		$('#J_shakebtn').addClass('pressed');
		var J_shakemove = document.getElementById('J_shakemove');
		J_shakemove.classList.add('shakeend');
		var audio = document.getElementById("shakeHandMusic");
		audio.play();
		setTimeout( function(){	
			audio.pause();
			requestShakeResult();
		}, 2000 );
	}	
}

function requestShakeResult(){	
	$.sync({
		url:fresh.apiRoot + 'shakeOnce',
		type: 'post',
		dataType:'json',
		data:{
			shakeId:0
		},
		success: function(data){
			ready = false;
			// 取到 amount 体验金
			// data.amount
			$('.shakeamount').html(data.amount);
			$('.shakesal').html((data.amount*0.14/365*5).toFixed(2));
			
			ShakePop.show();
			// 清空下 newshake_origin
			// window.localStorage.removeItem('newshake_origin');
		},
		error:function(){
			isShaked = false;
			$('#J_shakebtn').removeClass('pressed');
			$.toast('请求出错');
		}
	});
	
}

function bindEvent(obj, ev, fn){
	obj.addEventListener?obj.addEventListener(ev, fn, false):obj.attachEvent('on'+ev, fn);
}

module.exports = Backbone.View.extend({
	initialize: function () {
		this.getData();
	},
	getData:function(){
		var self = this;
		self.render();
	},
	render:function (){
		this.$el.html(template());
		$.setAppNav('新手摇');

      	decideHasRegTxt(); // 看看是否从立即购买进来，还是从注册流程过去
      	new_wobbles();

      	return this;
      },
      events:{
      	'tap #J_shakebtn':'tapShakeBtn'
      },
      tapShakeBtn:function(e){
      	doShakeMove();
      }
});
