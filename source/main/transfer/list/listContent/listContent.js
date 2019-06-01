/**
 * Created by chenguodong on 2017/2/14.
 */
var template = _.template(require('./listContent.html')),
    template1 = _.template(require('./listContent1.html')),
    template2 = _.template(require('./listContent2.html'));
require('./listContent.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.sortType = options.sortType;
        this.Nums = 0;
        this.Nums2 = 0;
        this.pageNo = 0;
        this.counts = 0;
        this.getData(this.sortType);
    },
    getData:function(sortType){
        var self= this;
        $.sync({
            url:fresh.apiRoot+'member/queryCreditoTransferList',
            type:'post',
            data:{
                pageNo:'0',
                pageCount:'10',
                transferStatus:'1',
                sortType:sortType,
                transferVersion:'1'
            },
            success:function(d){
                self.cache = d;
                self.Nums2 = d.list.length;
                self.counts = d.totalCount;
                self.render();
            }
        });

    },
    render:function(){
        this.$el.html(template());
        this.$el.find('.y-completed-list').append(template1(this.cache));
        this.pullUp(this);
        return this;
    },
    events:{
        'tap .slideBtn':'loadTransfer'
    },
    pullUp:function(self){
        $(window).scroll(function(){
            var docHei = $(document).height(),
                winHei = $(window).height(),
                topHei = $(window).scrollTop();
            if(winHei + topHei == docHei){
                console.log(self.cache.totalCount,self.Nums2);
                console.log(self.counts/self.Nums2 >= 1 && self.counts%self.Nums2 >= 0)

                if(self.counts/self.Nums2 >= 1 && self.counts%self.Nums2 >= 0){
                    self.Nums2 = self.Nums2 + 10;
                    self.pageNo++;
                    self.chen1(self.pageNo.toString());
                }else{
                    if(self.Nums == 0){
                        self.Nums = self.Nums + 10;
                        self.loadTransfer(self.Nums.toString());
                    }else{
                        var tranTotalCount = $.getCache('tranTotalCount')/self.Nums;
                        var tranTotalCounts = $.getCache('tranTotalCount')%self.Nums;
                        if(tranTotalCount >= 1 && tranTotalCounts >=0){
                            self.Nums = self.Nums + 10;
                            self.loadTransfer(self.Nums.toString());
                        }else{
                            $('.completed-word').show();
                        }
                    }
                }
            }
        });
    },
    chen1:function(pageNo){
        var self= this;
        $.sync({
            url:fresh.apiRoot+'member/queryCreditoTransferList',
            type:'post',
            data:{
                pageNo: pageNo,
                pageCount:'10',
                transferStatus:'1',
                sortType:self.sortType,
                transferVersion:'1'
            },
            success:function(d){
                self.chen2(d);
            }
        });
    },
    chen2:function(data){
        this.$el.find('.y-completed-list').append(template1(data))
    },
    loadTransfer:function(pageCount){
        var self = this;
        $.sync({
            url:fresh.apiRoot+'member/queryCreditoTransferList',
            type:'post',
            loadFirstPage:true,
            data:{
                pageNo:'0',
                pageCount:pageCount,
                transferStatus:'2',
                sortType:'0'
            },
            success:function(d){
                $.setCache('tranTotalCount',d.totalCount);  //变现中产品总条目
                self.cache = d;
                // self._transferList();
                self.$el.find('.prd-complete').append(template2(d))
            }
        })
    },
    // _transferList:function(){
    //     this.$el.find('.prd-complete').append(template2(this.cache))
    // }
});