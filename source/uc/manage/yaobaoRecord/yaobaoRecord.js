var template = _.template(require('./yaobaoRecord.html'));
var list = _.template(require('./yaobao-list.html'));
require('../manage.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        $.setLoginTokenFormApp();
        this.type = options.type;
        this.yid = options.yid;
        this.getData(this.yid);
        this.flag = false;
    },
    getData:function(yid){
        var self= this;
        fresh.loadData && fresh.loadData.destory();
        fresh.loadData=$.loadMore({
            url:fresh.apiRoot +'inviteCustomerYaoBaoOrderList',
            type:'post',
            loadFirstPage:true,
            data:{
                loginToken:$.getToken(),
                customerId:yid,
                pageNo:0,
                pageSize:20
            },
            success:function(d,hasMore){
                console.log(d);
                if(!hasMore){
                    if(self.list.length > 8){
                      self.$el.find('.yaobaoRecord').addClass("manage1");
                    }
                    $(self.$el).find('.bottomLine').show();
                }
                self.cache = d;
                self.list = d.inviteCustomerYaoBaoOrderList;
                if(!self.flag){
                    self.render();
                    self.$el.find('.detailRecord ul').html(list({list:self.list}));
                }else{
                    self.$el.find('.detailRecord ul').append(list({list:self.list}));
                }
                self.flag = true;
            }
        });
    },
    render:function (){
        var self = this;
        self.$el.html(template({yaobao:self.cache}));
        $.setAppNav('摇宝记录');
        return this;
    }
});
