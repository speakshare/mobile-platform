var template = _.template(require('./detail.html'));
var List = _.template(require('./list.html'));
require('./detail.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.day=options.day||1;
        this.year=options.year||2017;
        this.month=options.month||1;
        this.type=options.type||1;
        this.$el.html(template({type:this.type,year:this.year,month:this.month,day:this.day}));
        $.setAppNav('当日记录');
        this.getData();
    },
    getData:function(){
        var self=this;
        this.checkDate=true;
        $.checkUser(function(){
            var str=self.year+'-'+(self.month>9?self.month:'0'+self.month)+'-'+(self.day>9?self.day:'0'+self.day);
            fresh.loadData && fresh.loadData.destory();
            $.loadMore({
                url:fresh.apiRoot +'order/dayRecordList',
                data:{
                    dateStr:str,
                    pageNo:1,
                    pageSize:10,
                    type:self.type
                },
                type:'post',
                loadFirstPage:true,
                success:function(d,hasMore){
                    if(self.checkDate){
                        self.checkDate=false;
                        if(d.orderlist.length)
                            self.$el.find('.c-d-l-t').show();
                    }
                    self.render(d.orderlist)
                }
            })
        });
    },
    render:function(list){
        this.$el.find('.c-d-list').append(List({list:list,type:this.type}));
        return this;
    },
    events:{
        'tap .go-buy-btn':'toProductList',
        'tap .c-d-m':'changePage'
    },
    toProductList:function(){
        $.changePage('product');
    },
    changePage:function(e){
        var id=$(e.currentTarget).attr('data-id');
        if(id!=this.type)
            $.changePage('uc/calendar/'+this.year+'/'+this.month+'/'+this.day+'/'+id,true);
    }
});