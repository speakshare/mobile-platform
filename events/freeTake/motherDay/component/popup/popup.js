/*
config:配置参数
{
	
	content:'', // html内容
	close:'' // 关闭按钮
}
*/

// 存储 popup对象列表
var popList = [];
bindEvent(window, 'hashchange', function(){
	for( var i = 0; i < popList.length; i ++ ){
		popList[i].hide();
	}
} );

// 先生成mask
var zMinIndex = 1;
var oMask = document.createElement('div');
oMask.className = 'popmask_' + (999999 * Math.random() | 0);
oMask.style.position = 'fixed';
oMask.style.left = 0;
oMask.style.right = 0;
oMask.style.top = 0;
oMask.style.bottom = 0;
oMask.style.backgroundColor = 'rgba(0,0,0,0.5)';
oMask.style.display = 'none';
oMask.style.opacity = 0;
document.body.appendChild(oMask);

function popup(config){

	if( !(this instanceof(popup)) ){
		return new popup(config);
	}
	config = config || {};
	this.css = config.style || '';
	this.content = config.content || '';
	this.close = config.close || 'closeX';

	popList.push(this);

	// 生成 style
	var oStyle = document.createElement('style');
	oStyle.type = 'text/css';
	oStyle.appendChild( document.createTextNode(this.css) );
	// oStyle.innerHTML = this.css;
	var oHead = document.getElementsByTagName('head')[0];
	oHead.appendChild(oStyle);

	// fakeDiv
	var fakeDiv = document.createElement('div');
	fakeDiv.style.position = 'fixed';
	fakeDiv.style.display = 'none';
	fakeDiv.style.opacity = 0;
	fakeDiv.style.top = '50%';
	fakeDiv.style.left = '50%';
	fakeDiv.style.webkitTransform = fakeDiv.style.transform = 'translateX(-50%) translateY(-50%)';
	fakeDiv.innerHTML = this.content;

	document.body.appendChild(fakeDiv);
	this.newdiv = fakeDiv;

	var me = this;

	// 点击关闭 隐藏弹框
	this.closeBtns = fakeDiv.getElementsByClassName(this.close);
	for( var i = 0; i < this.closeBtns.length; i ++ ){

		bindEvent( this.closeBtns[i], 'touchend', function(){
			me.hide();
		} );
	}


	this.show = function(){
		var nowMaxIndex = getMaxZindexInDocument();
		oMask.style.zIndex = nowMaxIndex;

		fakeDiv.style.zIndex = nowMaxIndex + 1;

		// mask
		linear( oMask, {opacity:0}, {opacity:100}, function(now){
			this.style.display = 'block';
			this.style.opacity = now.opacity / 100;
		}, function(end){
			this.style.opacity = 1;
		} );

		// content
		flex( fakeDiv, {opacity:0, scale:10}, {opacity:100, scale:100}, function(now){
			// centerPop(); // 把弹框居中显示
			this.style.display = 'block';
			this.style.opacity = now.opacity / 100;
			this.style.webkitTransform = this.style.transform = 'translateX(-50%) translateY(-50%) scale('+ (now.scale/100) +', '+ (now.scale/100) +')';
		}, function(end){
			this.style.opacity = 1;

		} );
	}

	this.hide = function(){
		// mask
		linear( oMask, {opacity:100}, {opacity:0}, function(now){
			
			this.style.opacity = now.opacity / 100;
		}, function(end){
			this.style.opacity = 0;
			this.style.display = 'none';
		}, 16 );

		// content
		linear( fakeDiv, {opacity:100}, {opacity:0}, function(now){
			// centerPop(); // 把弹框居中显示
			this.style.opacity = now.opacity / 100;
		}, function(end){
			this.style.opacity = 0;
			this.style.display = 'none';

		}, 16 );
	}

}// end for popup

// 找body下面最大的z-index值
function getMaxIndexInBody(){
	var oBody = document.body;
	var max = 1;

	for( var i = 0; i < oBody.children.length; i ++ ){
		var oEle = oBody.children[i];
		var val = window.getComputedStyle(oEle, false)['z-index'];

		if(val == 'auto' || val == '0'){

		}else{
			val = val - 0;
			max = val + 1;
		}
	}

	return max;
}

function getMaxZindexInDocument( oElement ){

	var iMax = 1;

	function __get__( oElement ){
		var aChildren = oElement.children;

		for( var i = 0; i < aChildren.length; i ++ ){
			var val = window.getComputedStyle(aChildren[i], false)['z-index'];
			if( val == 'auto' || val == '0' ){
				iMax = __get__(aChildren[i]);
			}else{
				val = val - 0;
				if(iMax < val + 1){
					iMax = val + 1;
				}
			}
		}

		return iMax;
	}
	
	__get__(document.body);
	
	return iMax;

}

// 居中弹层
function centerPop( oDiv ){

	var winWidth = document.documentElement.clientWidth || document.body.clientWidth, winHeight = document.documentElement.clientHeight || document.body.clientHeight;
	var divWidth = oDiv.offsetWidth, divHeight = oDiv.offsetHeight;

}

function flex(obj, cur, target, fnDo, fnEnd, fs, ms)
{
	var MAX_SPEED=16;
	
	if(!fs)fs=6;
	if(!ms)ms=0.75;
	var now={};
	var x=0;	//0-100
	
	if(!obj.__flex_v)obj.__flex_v=0;
	
	if(!obj.__last_timer)obj.__last_timer=0;
	var t=new Date().getTime();
	if(t-obj.__last_timer>20)
	{
		fnMove();
		obj.__last_timer=t;
	}
	
	clearInterval(obj.timer);
	obj.timer=setInterval(fnMove, 20);
	
	function fnMove(){
		obj.__flex_v+=(100-x)/fs;
		obj.__flex_v*=ms;

		if(Math.abs(obj.__flex_v)>MAX_SPEED)obj.__flex_v=obj.__flex_v>0?MAX_SPEED:-MAX_SPEED;
		
		x+=obj.__flex_v;
		
		for(var i in cur)
		{
			now[i]=(target[i]-cur[i])*x/100+cur[i];
		}
		
		
		if(fnDo)fnDo.call(obj, now);
		
		if(Math.abs(obj.__flex_v)<1 && Math.abs(100-x)<1)
		{
			clearInterval(obj.timer);
			if(fnEnd)fnEnd.call(obj, target);
			obj.__flex_v=0;
		}
	}
}

function linear(obj, cur, target, fnDo, fnEnd, fs)
{
	if(!fs)fs=20;
	var now={};
	var x=0;
	var v=0;
	
	if(!obj.__last_timer)obj.__last_timer=0;
	var t=new Date().getTime();
	if(t-obj.__last_timer>20)
	{
		fnMove();
		obj.__last_timer=t;
	}
	
	clearInterval(obj.timer);
	obj.timer=setInterval(fnMove, 20);
	
	v=100/fs;
	function fnMove(){
		x+=v;
		
		for(var i in cur)
		{
			now[i]=(target[i]-cur[i])*x/100+cur[i];
		}
		
		if(fnDo)fnDo.call(obj, now);
		
		if(Math.abs(100-x)<1)
		{
			clearInterval(obj.timer);
			if(fnEnd)fnEnd.call(obj, target);
		}
	}
}

function bindEvent(obj, ev, fn){
	obj.addEventListener?obj.addEventListener(ev, fn, false):obj.attachEvent('on'+ev, fn);
}

module.exports = popup;