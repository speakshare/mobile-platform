module.exports=function(opt){
    var defaults={
        min:'1999-01',
        max:'9999-12',
        year:2000,
        month:1,
        day:1,
        rows:6,
        change:function(year,month,day){

        },
        click:function(year,month,day){

        },
        tips:['日','一','二','三','四','五','六']
    };

    opt=$.extend(defaults,opt);
    var curYear=opt.year,
        curMonth=opt.month,
        day=opt.day;

    
    function getDays(year,month){
        var date,count,days=[],i=0;

        //补白
        count=new Date(year,month-1,1).getDay();
        for(;i<count;i++) {
            days.unshift({
                day:0
            });
        }

        //本月
        date=new Date(year,month,0);
        count=date.getDate();
        for(i=1;i<count+1;i++){
            days.push({
                year:year,
                month:month>9?month:'0'+month,
                day:i>9?i:'0'+i
            });
        }

        //补下个月
        count=6-date.getDay();
        days.length+count<42 && (count+=7);
        for(i=1;i<count+1;i++){
            days.push({
                day:0
            });
        }
        return days;
    }

    function drawMonthList(){
        var calendar=$('<div class="week-days"></div><div class="month-box"></div> ')
        calendar.find('.week-days').html(drawTips());
        calendar.find('.month-box').append(drawMonth(year,month-1));
        calendar.find('.month-box').append(drawMonth(year,month));
        calendar.find('.month-box').append(drawMonth(year,month+1));
    }

    function drawTips(){
        var str='<div class="week-days">';
        for(var i=0;i<opt.tips.length;i++){
            str+='<span class="">'+opt.tips[i]+'</span>'
        }
        str+='</div>';
        return str;
    }

    function drawMonth(year,month){
        var days=getDays(year,month);

    }
}