var template = _.template(require('./orders.html'));
require('./orders.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.currentPage = 0;
        this.type = options.type;
        this.getData();
    },
    getData:function(){
        var self=this;
        $.checkUser(function(){
            fresh.loadData&&fresh.loadData.destory();
            fresh.loadData=$.loadMore({
               loading: '.loading',
               padding: 500,
               url: fresh.apiRoot + 'order/orderList',
               type:'post',
               loadFirstPage: true,
               data: {
                    pageNo:self.currentPage
                },
               success: function (d) {
                    var temp = d?d.list:[];
                    for(var i = 0; i < temp.length; i++){
                        temp[i].expireDate = temp[i].expireDate.replace(/-/g, "/");
                        if(temp[i].transferDate){
                            temp[i].transferDate = temp[i].transferDate.replace(/-/g, "/");
                        }
                    }
                    self.orderslist= self.orderslist ? self.orderslist.concat(temp) : temp;
                    self.render();
                   console.log(d)
               },
               error: function(d){
                    self.render()
                }
            });
        });
    },
    render:function(){
        this.$el.html(template({olist: this.orderslist}));
        $.setAppNav('我的订单');
        return this;
    },
    events:{
        'tap .orderitem'    :'ordersDetail',
        'touchend .toinvestbtn'  :'toinvest'
    },
    ordersDetail:function(e){
        var oid = $(e.currentTarget).attr('data-oid');
        var pType = $(e.currentTarget).attr('data-pType');
        $.changePage('uc/orders/'+oid+'?pType='+pType);
    },
    toinvest:function(e){
        e.preventDefault();
        $.changePage('product');
    }
});