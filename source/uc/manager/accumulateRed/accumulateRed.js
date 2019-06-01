var template = _.template(require('./accumulateRed.html'));
var redList = _.template(require('./redList.html'));
var dateList = _.template(require('./datefilter.html'));
require('../manager.css');
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.getData();
        this.monthlist=$.getLastYearDateList();
        this.selectedMonthIndex=0;
    },
    getData:function(){
        var self = this;
        $.checkUser(function(){
            $.sync({
                url:fresh.apiRoot+'lcds/moneyinfo',
                type:'post',
                success:function(d){
                    self.cache={
                        red :d
                    }
                    self.render();
                }
            });
            
        });  
    },
    events:{
        'tap .month-select':'selectDate',
        'tap .datebox':'datafilter',
        'tap .datemask':'maskClose'
    },
    render:function (){
        this.$el.html(template(this.cache));
        $.setAppNav('累计红包');  
        this.curMonthRed();
        return this;
    },
    selectDate:function(e){
        var selectid=$(e.currentTarget).attr('data-idx');
        this.curMonthRed(selectid);
        $('.datemask').hide(0); 
    },
    curMonthRed:function(i){
        var self=this;
        i=i||this.selectedMonthIndex;
        var seletedDate=this.monthlist[i].year+'-'+this.monthlist[i].month;
        $.sync({
            url:fresh.apiRoot+'lcds/month/detail',
            type:'post',
            data:{
                statisticMonth:seletedDate,
            },
            success:function(d){
                self.selectedMonthIndex=i;
                d.seletedDate=seletedDate;
                d.MostRed=self.getMostRed(d.redPacketList );
                $('.redlist').html(redList(d));
            }
        });   
    },
    datafilter:function(){
        $('.datecontent').html(dateList({ monthlist: this.monthlist,index:this.selectedMonthIndex}));
        $('.datemask').show(0);   
    },
    maskClose:function(e){
        if(e){
            var oTarget=$.findEleByClass(e.target, 'date-picker');
            if(!oTarget){
                $('.datemask').hide(0); 
            } 
        }
    },
    getMostRed:function(list){
        var tempred=0;
        if(list.length>0){
           _.each(list,function(n){
            if(n.redPacketAmount>0 &&(n.redPacketAmount>=+tempred) ){
                tempred=n.redPacketAmount;
            }
        })
           return tempred;
       }
   }

});