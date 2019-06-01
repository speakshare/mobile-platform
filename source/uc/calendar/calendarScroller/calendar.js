var template = _.template(require('./calendar.html'));
var months = _.template(require('./month.html'));
require('./calendar.css');

var weekDay=['日','一','二','三','四','五','六'];
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.syDate=options.syDate;
        this.day=options.day;
        this.year=options.year||2000;
        this.month=options.month||1;
        this.min=(options.min||'1999-01').split('-');
        this.max=(options.max||'2001-03').split('-');
        this.changeMonth=options.changeMonth||function(year,month){};
        this.changeDay=options.changeDay||function(year,month,day){};
        this.$el.html(template({weekDay:weekDay}));
        this.allMonths=[];
        this.cache={};
        this.render();
    },
    render:function(){
        var self=this;
        console.log(this.year,this.month,this.day)
        this.calendarSlider=this.$el.find('.month-box .animate').html(months({
            year:this.year,month:this.month,day:this.day,
            months:this._getAllMonth()
        })).calendarSlider(function(index){
                self.$el.find('.select-date').removeClass('select-date');
                self._changeMonth(index-1);
            });

        this.calendarSlider.go(this.defaultMonthIndex);
        $.setAppNav('理财日历');
        return this;
    },
    _getAllMonth:function(){
        var months=[],i,ii,em,index=1,
            minYear=parseInt(this.min[0],10),
            minMonth=parseInt(this.min[1],10),
            maxYear=parseInt(this.max[0],10),
            maxMonth=parseInt(this.max[1],10);

        for(i=minYear;i<=maxYear;i++){
            ii=i==minYear?minMonth:1;
            em=i==maxYear?maxMonth:12;
            for(;ii<=em;ii++){
                months.push(this._getDays(i,ii));
                this.allMonths.push({
                    year:i,
                    month:ii
                });
                if(i==this.year && ii==this.month){
                    this.defaultMonthIndex=index;
                }else{
                    index+=1;
                }
            }
        }
        return months;

    },
    _getDays:function(year,month){
        var date,count,days=[],i=0;

        //补白
        count=new Date(year,month-1,1).getDay();
        count=count==0?7:count;
        // console.log(count)
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
    },
    _changeMonth:function(index){
        var ym=this.allMonths[index];
        this.changeMonth(ym.year,ym.month);
    },
    AddTag:function(year,month,list){
        var yy=year+'-'+(month>9?month:'0'+month);
        if(this.cache[yy]){
            return;
        }
        this.cache[yy]=1;
        // console.log(year,month,list);
        var obj=this.$el.find('[data-id='+yy+']');
        $.each(list,function(i,n){
            var day=new Date(n).getDate();
            day=day>9?day:'0'+day;
            obj.find('[data-day='+day+']').addClass('has-data');
        })
    },
    SetHighlight:function(year,month,day){
        var yy=year+'-'+(month>9?month:'0'+month);
        this.$el.find('[data-id='+yy+']').find('[data-day='+(day>9?day:'0'+day)+']').addClass('select-date');
    },
    events:{
        'tap .back-btn':'toDay',
        'tap .prev-btn':'toPrev',
        'tap .next-btn':'toNext',
        'tap .month-days-one':'tapDay'
    },
    toDay:function(){
        // $.changePage('uc/calendar/'+this.syDate.getFullYear()+'/'+(this.syDate.getMonth()+1),true);
        // return ;
        this.calendarSlider.go(this.defaultMonthIndex,1);
        this.changeDay(this.syDate.getFullYear(),this.syDate.getMonth()+1,this.syDate.getDate());
    },
    toPrev:function(){
        this.calendarSlider.prev();

    },
    toNext:function(){
        this.calendarSlider.next();
    },
    tapDay:function(e){
        var obj=$(e.currentTarget);
        obj.addClass('select-date').siblings().removeClass('select-date');
        this.changeDay(obj.attr('data-year'),parseInt(obj.attr('data-month'),10),parseInt(obj.attr('data-day'),10))
    }
});