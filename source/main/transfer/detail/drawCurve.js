module.exports =function drawCurve(option){
    var cxt=document.createElement('canvas');
    var parent=$('.parentdiv')[0],
    width=parent.offsetWidth*2,
    height=parent.offsetHeight*2;
    parent.appendChild(cxt); 
    cxt = cxt.getContext("2d");
    cxt.canvas.width = width;
    cxt.canvas.height = height;

    var data=option.commonProductRate;
    var curdata={rate:option.annualizedRate,days:option.surplusDay};

    var map = { w: width, h: height }; //坐标图的宽和高 
    var range={x:400,y:22};          
    var basePoint = { x: 30, y: 0 };  //原点位置  
    var space = { w: map.w/range.x, h: map.h/range.y };  // 线条间隔 
    var time = ['1', '3', '6', '12'];  //时间轴
    var rate = { min: 0, max: 25 };
    var rateSpace=(rate.max-rate.min)/range.y;

    cxt.lineWidth = 2;  
    cxt.font = '24px 宋体';  
    cxt.translate(basePoint.x, basePoint.y); //设置原点          

    //画坐标  
    // cxt.clearRect(0, 0, width, height);  
    // cxt.strokeStyle = '#000';  
    // cxt.lineWidth = 1;  
    // cxt.beginPath();  
    // cxt.strokeRect(0, 0, map.w, map.h);  
    // cxt.closePath();  

    //画横线  
    // for (var i = 0; i < range.y; i++) {  
    //     cxt.strokeStyle ='#fff';  
    //     cxt.beginPath();  
    //     cxt.moveTo(0, space.h * (i + 1));  
    //     cxt.lineTo(width, space.h * (i + 1));  
    //     cxt.stroke();  
    //     cxt.closePath();  
    // }  

    //画竖线  
    // for (var i = 0; i < range.x; i++) {  
    //     cxt.beginPath();  
    //     cxt.moveTo(space.w*(i+1), 0);  
    //     cxt.lineTo(space.w *(i +1), map.h);  
    //     cxt.stroke();  
    //     cxt.closePath();  
    // }  

    //画时间  
    for (var i = 0, l = time.length; i < l; i++) {  
        cxt.fillStyle = '#FEE1DE';  
        cxt.fillText(time[i], time[i]*space.w*30-5*2, map.h);  
    }  

    //画图例  
    // cxt.fillStyle = '#FEd2d1';  
    // cxt.fontSize='15px';
    // cxt.fillText('收益率参考', map.w/2-30, 30); 

    //画当前点
    cxt.strokeStyle ='#fff';
    cxt.fillStyle = '#fff';
    var img=new Image();
    img.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAAA+CAMAAACGLxzyAAAAllBMVEUAAADiS0HiS0HiS0HiS0HiS0HiS0HiS0HjS0HjS0HiS0HiS0HiS0H/0J75toz+yJj/z57tfWT+zJv/z57/zp3/zp3+zZz+y5r8xZb7v5L6uY7+y5r+zJv2o3/zmnj+y5r9yZn9xpf/0J7GiUfOlFXeqG/xv4r4x5TlsXrWnmLptoDKjk77zJntuoX0w4/ao2nirHTSmVxNnrQgAAAAInRSTlMAAgUICxEaFyEeFQ0P9FyMwC3D+uzi1MagfmpQTko6yLewYF32wQAAAqZJREFUWMPk1E1TwjAQgGGl9aSM3PW0u/mgm7Tw//+cWTbTQKW22HjyPaQ7ZXjoBMhT6Xlz6lQkSxP087CHje0PnwoX9R2q9C5WUT+gUh/qKrs71GIPO2GzutvXYve77IraQLUacZVt2nps2/wdq3vQvtZjX1vZBX3YN5gUI0yzpl/DvrXNPEsE0xwOcF1nxroZ9uVHNnaXCPWaEYNjBkovq1nC21xmQXPLrD9qiHnwANBbG3GwVi4mrfAweyKJMcUknUCjs6wRxXyc1byQHqSChLQe6fqO104r2cA+qRwg5/E2/7uvzHAgAhoKO5jrrH64GwtrWIsdJDZiN7IOpmWwDEus47P+wAa2s6xFbRzsAhuInbLhzP08O3jvz8Ie0zAssY7QgrLgWJ/X3GM7eUFYn4ZugbWM0aSYZe358u4BYRvbI1vAMefyjmxkQQ+/IgWr/6IN7NxR4zHeYSkdGIx5oMfZwDLXZ4/xO9uT3DxRGmQ3IvWr2BDgwRZZ7R+yX+3Xb2vDIBDH8bBorJ5zpP9baLfl/b/I/a46LkE7Bj3ok36f+0m4RFC9M9iCXWux6zkbkxab4pwNWqfxIOybIevS4fG7wyE5W85gZbjBDX7V7Htadlzdyw8u2MVBlNgdfBUeNe4W6ievbzawSjMWboQLuM77y2aSdiPWt3NQI9TCZpesDSG4KsCn2fguQF0rLLaWbipYcQ3FaKsCD13+6jNQrG8VIxlRwWYXcBVRtHDHbVE/WLWRyDTrswpWXMh1kNlNWf3CtwZq+nYgiiou5FZ9do+s7kdW+Z3uVF+mW5XhsOv307S93lSgCpf/8r7X903CXP9Wu/8m7vnkRO0eTFxktVT0u1kQ/wJKqmwWMqKquX3PqKhKLqeqwkUZVWeRqNpw9+r5/QCEG5ESymXjGQAAAABJRU5ErkJggg==";
    img.onload=function(){
        cxt.drawImage(img,space.w *curdata.days-20*2,  map.h-(space.h*(curdata.rate-rate.min)/rateSpace)-35*2,86,62);
    }
    cxt.arc(space.w *curdata.days,  map.h-(space.h*(curdata.rate-rate.min)/rateSpace), 4, 0, Math.PI * 2, true); 
    cxt.fill(); 
    
    //画曲线  
    cxt.beginPath();  
    cxt.strokeStyle ='#FFD09E';
    cxt.lineJoin="round";
    cxt.lineWidth =4;
    cxt.fillStyle = '#FEd2d1';  
    cxt.font = '25px 宋体'; 
    for (var i = 0, l = data.length; i < l; i++) {  
        cxt.arc(space.w * time[i]*30,  map.h- (space.h*(data[i]-rate.min)/rateSpace), 2, 0, Math.PI * 2, true);  
        cxt.lineTo(space.w * time[i]*30, map.h- (space.h*(data[i]-rate.min)/rateSpace));
        cxt.fillText(data[i]+"%", space.w * time[i]*30-15*2, map.h- (space.h*(data[i]-rate.min)/rateSpace-15*2));

    } 
    cxt.stroke(); 
    cxt.closePath(); 
}
