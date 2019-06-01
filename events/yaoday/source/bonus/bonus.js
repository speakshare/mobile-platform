var template = _.template(require('./bonus.html'));
var templateList = _.template(require('./bonus-list.html'));
require('./bonus.css');
module.exports = Backbone.View.extend({
    initialize: function () {
        this.getData();
    },
    getData: function () {
        var self = this;
        self.cache = {
            totalRewardAmt: 0,
            rewardList: [],
            isShowList: false
        }

        $.checkUser(function () {
            self.firstPage=1;
            fresh.loadData && fresh.loadData.destory();
            fresh.loadData = $.loadMore({
                url: fresh.apiRoot + 'promotion/shake/myRewardList',
                type: 'post',
                data: {
                    pageSize: 10,
                    pageNo: 1
                },
                loadFirstPage: true,
                success: function (d) {
                    self.cache.totalRewardAmt = d.totalRewardAmt;
                    self.cache.rewardList = d.rewardList;
                    if (d.rewardList.length > 0) {
                        self.cache.isShowList = true;
                    }
                    self.render(self.firstPage);
                    self.firstPage = false;
                }
            });
        })
    },
    render: function (temp) {
        if(temp){
            this.$el.html(template(this.cache));
        }
        this.$el.find(".ui-bonus-list").append(templateList(this.cache));
        $.setAppNav('我的奖金');
        return this;
    },
    events: {
        'tap .ui-red-button': 'goCouponList'
    },
    goCouponList: function () {
        jsb.couponList();
    },
});