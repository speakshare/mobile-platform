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

function buffer(obj, cur, target, fnDo, fnEnd, fs)
{
	if(!fs)fs=6;
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
	function fnMove(){
		v=Math.ceil((100-x)/fs);
		
		x+=v;
		
		for(var i in cur)
		{
			now[i]=(target[i]-cur[i])*x/100+cur[i];
		}
		
		
		if(fnDo)fnDo.call(obj, now);
		
		if(Math.abs(v)<1 && Math.abs(100-x)<1)
		{
			clearInterval(obj.timer);
			if(fnEnd)fnEnd.call(obj, target);
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

// 导出 三种基本类型的运动
module.exports = {
	flex:flex, // 弹性运动
	buffer:buffer, // 缓冲运动
	linear:linear // 匀速运动
};