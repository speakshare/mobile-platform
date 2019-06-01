var template = _.template(require('./gift-list.html'));
require('./gift-list.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.uid=options.uid;
        this.cache= options.cache && options.cache.loverAmountList || {}
        this.getData();
    },
    getData:function(){
        var self=this;
        $.sync({
            type:'post',
            url:fresh.apiRoot+'loveractivity/rewardList',
            data:{
                loverUserId:this.uid
            },
            success:function(d){
                var list={lv1:[],lv2:[],lv3:[],lv4:[]};
                if(d && d.hdLoverUserRewardList) {
                    $.each(d.hdLoverUserRewardList, function (i, n) {
                        list['lv' + n.rewardLevel].push(n);
                    });
                }
                self.cache=list;
                self.render();
            },
            error:function(){
                self.cache={lv1:[],lv2:[],lv3:[],lv4:[]};
                self.render();
            }
        });
    },
    render: function () {
        var self=this;
        this.$el.html(template(this.cache));
        this.$el.find('.upload-img').upload({
            clipSquare:true,
            loading:self.$el.find('.loading-box'),
            showThumbnail:function(img){
                self.$el.find('.user-icon-1').attr('src',img);
            },
            afterUpload:function(file,d){

            }
        });
        this.$el.find('.animate').overSlide();
        // $.shareDefault();
        return this;
    },
    events:{
        'tap .receive-btn':'receiveCoupon'
    },
    _changeBtn:function (obj,id) {
        this.cache['lv'+id].shift();
        if(!this.cache['lv'+id].length){
            obj.addClass('fighting-btn').removeClass('receive-btn');
        }
    },
    receiveCoupon:function(e){
        var self=this,
            obj=$(e.currentTarget),
            id=obj.attr('data-id');
        var coupon=this.cache['lv'+id][0];
        $.popWindow({
            title:'领取奖励',
            type:2,
            content:'<div class="user-icons"><img class="u-i-1" src="'+coupon.masterHeadImg+'">'
            +'<img class="u-i-2" src="'+coupon.slaveHeadImg+'"></div>'
            +'恭喜，'+coupon.masterName+'和'+coupon.slaveUserName+'，投资年化达到'+coupon.amountYear+'元，'
            +'平分'+(coupon.amount*2)+'元奖励，你得到'+coupon.amount+'元现金红包。',
            yes:'立刻领取',
            tapMask:true,
            callback:function(bl){
                if(bl){
                    $.sync({
                        type:'post',
                        url:fresh.apiRoot+'member/receiveCoupon',
                        data:{
                            sendRewardId:coupon.rewardId
                        },
                        success:function(d){
                            $.toast('已领取'+coupon.amount+'元现金红包，请到我的礼券或余额中查看');
                            self._changeBtn(obj,id);
                        }
                    });
                }
            }
        })
    }
});