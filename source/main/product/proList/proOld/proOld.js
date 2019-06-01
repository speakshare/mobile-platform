/**
 * Created by chenguodong on 2017/4/6.
 */
var template = _.template(require('./proOld.html')),
    template1 = _.template(require('./addList.html'));
require('./proOld.css');

module.exports = Backbone.View.extend({
    initialize:function(){
        this.pageNo = 1;
        this.pageSize = 10;
        this.allNum = 0;
        this.getData();
    },
    getData:function(){
        var self = this;
        $.sync({
            url:fresh.apiRoot + 'productList2SoldOutList',
            type:'post',
            data:{pageNo:self.pageNo,pageSize:self.pageSize},
            success:function(d){
                self.cache = {list:d.productList2SoldOutList};
                self.allNum = d.soldOutListTotalCount;
                self.render();
            }
        });
    },
    render:function(){
        this.$el.html(template(this.cache));
        $.setAppNav('历史产品');
        this.pullUp();
        return this;
    },
    events:{
        'tap .to-oldDetail':'toOldDetail'
    },
    toOldDetail:function(e){
        var proId = $(e.currentTarget).attr('data-id');
        $.changePage('product/' + proId)
    },
    pullUp:function(){
        var self = this;
        $(window).scroll(function(){
            var docHei = $(document).height(),
                winHei = $(window).height(),
                topHei = $(window).scrollTop();
            if(winHei + topHei == docHei){
                if(self.pageNo == 1){
                    self.pageNo++;
                    self.allNum = self.allNum - 2*self.pageSize;
                    self.loadProOld(self.pageNo);
                }else{
                    var dd1 = self.allNum/self.pageSize;
                    var dd2 = self.allNum%self.pageSize;
                    if(dd1 >= 0 && dd2 >= 0){
                        self.pageNo++;
                        self.allNum = self.allNum - self.pageSize;
                        console.log(self.pageNo,self.allNum);
                        self.loadProOld(self.pageNo);
                    }else{
                        $('.pro-old-hint').show()
                    }
                }
            }
        });
    },
    loadProOld:function(num){
        var self = this;
        $.sync({
            url:fresh.apiRoot + 'productList2SoldOutList',
            type:'post',
            data:{pageNo:num,pageSize:self.pageSize},
            success:function(d){
                self.cache = {list:d.productList2SoldOutList};
                self.$el.find('.add-list').append(template1(self.cache))
            }
        });
    }
});