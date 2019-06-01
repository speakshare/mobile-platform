var template = _.template(require('./investRecord.html'));
var investRecord = _.template(require('./investRecord2.html'));
var investAmount = _.template(require('./investRecord3.html'));
require('../manage.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        $.setLoginTokenFormApp();
        this.render();
        this.type = options.type;
        this.curMonth();
        if(JSON.parse(localStorage.getItem("date"))){
            this.callback((JSON.parse(localStorage.getItem("date"))).year,(JSON.parse(localStorage.getItem("date"))).month);
            this.$el.find('.filter-date').empty().html((JSON.parse(localStorage.getItem("date"))).year+'年'+(JSON.parse(localStorage.getItem("date"))).month+'月');
            localStorage.removeItem("date");
        }else{
            this.getData();
        }
    },
    curMonth:function(){
        var curMonth = new Date().getMonth() + 1;
        if(curMonth < 10){
            return new Date().getFullYear()+'-0'+(new Date().getMonth()+1)
        }else{
            return new Date().getFullYear()+'-'+(new Date().getMonth()+1)
        }
    },
    getData:function(){
        var self= this;
        self.flag = false;
        $.sync({
            url:fresh.apiRoot+'inviteTotalAchievement',
            // url:'http://192.168.62.219:8080/app/webservice/v2/'+'inviteTotalAchievement',
            type:'post',
            data:{
                loginToken:$.getToken(),
                investDate:self.curMonth()
            },
            success: function(d){
                console.log(d);
                self.cache=d;
                $(self.$el).find('.asset-profit').html(investAmount({amount:self.cache}));
            },error:function(d){
                $.toast(d.respMsg)
            }
        });

        fresh.loadData && fresh.loadData.destory();
        fresh.loadData=$.loadMore({
            url:fresh.apiRoot+'inviteRecordsListByMonth',
            // url:'http://192.168.62.219:8080/app/webservice/v2/'+'inviteRecordsListByMonth',
            type:'post',
            loadFirstPage:true,
            data:{
                loginToken:$.getToken(),
                investDate:self.curMonth(),
                pageNo:0,
                pageSize:10
            },
            success:function(d,hasMore){
                self.cache1 = d.inviteRecordsList;
                console.log(d);
                if(!self.flag){
                     $(self.$el).find('.bottomLine').hide();
                    $(self.$el).find('.invest ul').html(investRecord({record:self.cache1}));
                }else{
                    $(self.$el).find('.invest ul').append(investRecord({record:self.cache1}));
                }
                if(!hasMore){
                    $('.manage').css('position','relative');
                    $('.bottomLine').css('bottom','-48px');
                    $(self.$el).find('.bottomLine').show();
                }
                self.flag = true;
            }
        });
    },
    render:function (){
        this.$el.html(template());
        $.setAppNav('投资记录');
        return this;
    },
    _date:function(dd){
        if(dd.length==7){
            return dd.substr(0,4)+'-'+dd.substr(5,1);
        }else{
            return dd.substr(0,4)+'-'+dd.substr(5,2);
        }
    },
    events:{
        'click .filter-date':'selectDate',
        'tap .orderInfo':'toOrderDetail'
    },

    callback: function(curYear, curMonth){
        var self = this;
        self.flag = false;
        $.sync({
            url:fresh.apiRoot+'inviteTotalAchievement',
            // url:'http://192.168.62.219:8080/app/webservice/v2/'+'inviteTotalAchievement',
            type:'post',
            data:{
                loginToken:$.getToken(),
                investDate:curYear+'-'+curMonth
            },
            success: function(d){
                console.log(d);
                self.cache=d;
                var cache = d;
                $.setCache('amount',cache);
                $(self.$el).find('.asset-profit').html(investAmount({amount:self.cache}));
            },error:function(d){
                $.toast(d.respMsg)
            }
        });


        fresh.loadData && fresh.loadData.destory();
        fresh.loadData=$.loadMore({
            url:fresh.apiRoot+'inviteRecordsListByMonth',
            // url:'http://192.168.62.219:8080/app/webservice/v2/'+'inviteRecordsListByMonth',
            type:'post',
            loadFirstPage:true,
            data:{
                loginToken:$.getToken(),
                investDate:curYear+'-'+curMonth,
                pageNo:0,
                pageSize:10
            },
            success:function(d,hasMore){
                self.data = d.inviteRecordsList;
                var data = d.inviteRecordsList;
                $.setCache('list',data);
                console.log(d);
                if(!self.flag){
                    $(self.$el).find('.bottomLine').hide();
                    $(self.$el).find('.invest ul').html(investRecord({record:self.data}));
                }else{
                    $(self.$el).find('.invest ul').append(investRecord({record:self.data}));
                }
                if(!hasMore){
                    $('.manage').css('position','relative');
                    $('.bottomLine').css('bottom','-48px');
                    $(self.$el).find('.bottomLine').show();
                }
                self.flag = true;
            }
        }); 
    },
    selectDate:function(e){
        var self = this;
        var obj=$(e.currentTarget);
        var month=$.trim($('.filter-date').html());
        $.monthPicker({
            curValue:month.substr(0,4)+'-'+month.substr(5,2),
            onSelect:function(year,month){
                obj.html(year+'年'+month+'月');
                var date = {"year":year,"month":month};
                localStorage.setItem("date",JSON.stringify(date));
            },
            callback: self.callback.bind(self)
        });
    },
    toOrderDetail:function(e){
        var _item = $(e.currentTarget).attr('data-item');
        var _flag = $(e.currentTarget).attr('data-flag');
        var _id = $(e.currentTarget).attr('data-id');
        if(_flag==0){
            $.changePage('uc/manage/yaobaoRecord/'+_id);
        }else{
            $.changePage('uc/manage/orderDetail/'+_item);
        }       
    }
});
