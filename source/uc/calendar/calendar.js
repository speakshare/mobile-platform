var template = _.template(require('./calendar.html'));
var monthAmount = _.template(require('./monthAmount.html'));
var dayRecord = _.template(require('./dayRecord.html'));
var calendar = require('./calendarScroller/calendar');
require('./calendar.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.day=1;
        this.year=options.year||'';
        this.month=options.month||'';
        this.MonthCache={}
        this.dayCache={}
        this.getData();
    },
    getData:function(){
        var self=this;
        $.checkUser(function(){
            var str=self.year+'-'+(self.month>9?self.month:'0'+self.month);
            // console.log(str);
            $.batSync({
                data:[
                    {url:fresh.apiRoot +'order/monthCalendarDayInfo',data:{
                        dateStr:self.year?str:''}},
                    {url:fresh.apiRoot +'order/monthRecordListTotalAmount',data:{
                        dateStr:self.year?str:''}},
                    {url:fresh.apiRoot +'order/dayRecordListTotalAmount',data:{
                        dateStr:''}}
                ],
                success:function(d){
                    self.$el.html(template());
                    // d[0].lastDate='';
                    // d[0].firstDate=''
                    var syDate=new Date(d[0].sysDate),
                        syYear=syDate.getFullYear(),
                        syMonth=syDate.getMonth(),
                        endDate=new Date(d[0].lastDate||d[0].sysDate),
                        lastDate=$.dateFormat(endDate,'yyyy-MM');

                    if(endDate-syDate<0){
                        lastDate=$.dateFormat(syDate,'yyyy-MM');
                    }

                    var date,year,month,day=syDate.getDate();

                    if(self.year){
                        if(self.year==syYear && self.month==syMonth+1){
                            year=syYear;
                            month=syMonth;
                        }else{
                            date=new Date(self.year,self.month-1);
                            year=date.getFullYear();
                            month=parseInt(date.getMonth(),10);
                            day='';
                        }
                    }else{
                        year=syYear;
                        month=syMonth;
                    }


                    // var date=self.year?((self.year==syYear && self.month==syMonth+1)?syDate:new Date(self.year,self.month-1)):syDate,
                    //     year=date.getFullYear(),
                    //     month=parseInt(date.getMonth(),10),
                    //     day=(self.year==year && self.month==month+1)?date.getDate():'';
                    self._showYearMonth(year,month+1);
                    self._showMonthAmount(d[1]);

                    self.calendarSlider=new calendar({
                        el:self.$el.find('.calendar-box'),
                        syDate:syDate,
                        year:year,
                        month:month+1,
                        day:day,
                        min:$.dateFormat(d[0].firstDate||d[0].sysDate,'yyyy-MM'),
                        max:lastDate,
                        changeMonth:function(year,month){
                            self._changeMonth(year,month);
                        },
                        changeDay:function(year,month,day){
                            self._changeDay(year,month,day);
                        }
                    });
                    self.calendarSlider.AddTag(year,month+1,d[0].monthCalendarList);
                    if(self.year){
                        self._changeDay(year, month + 1, new Date(d[0].defaultDate).getDate());
                    }else {
                        self._showDayRecord(year, month + 1, day, d[2]);
                    }
                    self.render();
                }
            });
        });
    },
    render:function(){
        $.setAppNav('理财日历');
        return this;
    },
    _showYearMonth:function(year,month){
        this.$el.find('.c-p-month').html(year+'年'+month+'月');
    },
    _showMonthAmount:function(d){
        this.$el.find('.c-p-amount').html(monthAmount({amount:d}));
    },
    _showDayRecord:function(year,month,day,data){
        this.$el.find('.day-record').show().html(dayRecord({year:year,month:month,day:day,d:data}));
        this.calendarSlider.SetHighlight(year,month,day);
    },
    _hideDayRecord:function(){
        this.$el.find('.day-record').hide()
    },
    _changeMonth:function(year,month){

        // $.changePage('uc/calendar/'+year+'/'+month,true)
        // return ;

        var self=this;
        this._showYearMonth(year,month);
        var str=year+'-'+(month>9?month:'0'+month);
        this._hideDayRecord();

        var cache=this.MonthCache[str];

        if(cache){
            self._changeMonthAmount(cache[1]);
            self._changeMonthRecord(year,month,cache[0].monthCalendarList);
            self._showDayRecord(year,month,new Date(cache[0].defaultDate).getDate(),cache[0]);
            return ;
        }

        $.batSync({
            data:[
                {url:fresh.apiRoot +'order/monthCalendarDayInfo',data:{
                    dateStr:str}},
                {url:fresh.apiRoot +'order/monthRecordListTotalAmount',data:{dateStr:str}}
            ],
            success:function(d){
                self.MonthCache[str]=d;
                self._changeMonthAmount(d[1]);
                self._changeMonthRecord(year,month,d[0].monthCalendarList);
                self._showDayRecord(year,month,new Date(d[0].defaultDate).getDate(),d[0]);
            }
        })
    },
    _changeDay:function(year,month,day){
        var self=this;
        var str=year+'-'+(month>9?month:'0'+month)+'-'+(day>9?day:'0'+day);

        var cache=this.dayCache[str]
        if(cache){
            self._showDayRecord(year,month,day,cache);
            return ;
        }

        $.sync({
            url:fresh.apiRoot +'order/dayRecordListTotalAmount',
            data:{
                dateStr:year+'-'+(month>9?month:'0'+month)+'-'+(day>9?day:'0'+day)
            },
            type:'post',
            success:function(d){
                self.dayCache[str]=d;
                self._showDayRecord(year,month,day,d);
            }
        })
    },
    _changeMonthAmount:function(amount){
        this.$el.find('.c-p-amount').html(monthAmount({amount:amount}));
    },
    _changeMonthRecord:function(year,month,list){
        this.calendarSlider.AddTag(year,month,list);
    },
    events:{
        'tap .go-buy-btn':'toProductList',
        'tap .day-record .c-a-row':'toDetail'
    },
    toProductList:function(){
        $.changePage('product');
    },
    toDetail:function(e){
        $.changePage($(e.currentTarget).attr('data-link'));
    }
});