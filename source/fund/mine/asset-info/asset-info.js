var template = _.template(require('./asset-info.html'));

module.exports = Backbone.View.extend({
    initialize: function () {
        this.getData();
    },
    getData:function(){
        var self=this;
        this.cache=$.getCache('fundAsset');
        if(this.cache){
            this.render();
        }else{
            $.sync({
                url:fresh.apiRoot + 'fund/customer/asset',
                data:{
                    loginToken:$.getToken(),
                    platform:$.isWeixin() ? 4 : 3
                },
                type:'post',
                success:function(d){
                    self.cache=d||{
                            assetSumAmount:0,
                            fundDate:new Date().getTime()/1000,
                            profitYesterdayAmount:0,
                            profitSumAmount:0
                        };
                    $.setCache('fundAsset',self.cache);
                    self.render();
                }
            });
        }
    },
    render:function(){
         this.$el.html(template({zc:this.cache}));
        return this;
    }
});