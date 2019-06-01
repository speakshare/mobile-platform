var template = _.template(require('./help.html'));
var qaList = _.template(require('./qa-list.html'));
require('./jquery.rotate');
require('./help.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        this.getData();
    },
    getData: function() {
        var self =this;
        self.cache = {
            typeList: [],
            questionList:[]
        }
        $.sync({
            url: fresh.apiRoot + 'helpCenter/qryQuestionType',
            data:{clientNo:'02'},
            type: 'post',
            success: function (d) {
                self.cache.typeList = d.typeList;
                console.log(self.cache.typeList);
                if(d.typeList.length>0){
                    self.qaList(d.typeList[0].code);
                }
                self.render();
            },
            error: function () {
                self.render();
            }
        });
    },
    render: function () {
        var self =this;
        self.$el.html(template(self.cache));
        var mySwiper = $.swiper('.swiper-container', {
            preventLinksPropagation: true,
            preventClicks: true,
            touchMoveStopPropagation: true,
            slidesPerView: 3.5, 
            spaceBetween: 10, 
            freeMode: true,
            onTap: function (swiper) {
                var $clickedSlide= $(swiper.clickedSlide);
                var code = $clickedSlide.data('code');
                if (!$clickedSlide.hasClass('active')) {
                    self.qaList(code);
                }
                $clickedSlide.parent('.swiper-wrapper').find('.swiper-slide').removeClass('active');
                $clickedSlide.addClass('active');
            }
        });
        $.setAppNav('帮助中心');
        return this;
    },
    events: {
        'tap .ui-qa-title': 'qaCollapse'
    },
    qaList:function(typeCode){
        var self = this;
        $.sync({
            url: fresh.apiRoot + 'helpCenter/qryQuestionList',
            data:{"categoryCode":typeCode},
            type: 'post',
            success: function (d) {
                self.cache.questionList = d.questionList;
                var $qaList = self.$el.find(".ui-qa-list");
                $qaList.empty().append(qaList(self.cache));
            },
            error: function () {
                var $qaList = self.$el.find(".ui-qa-list");
                $qaList.empty().append(qaList(self.cache));
            }
        });
    },
    qaCollapse: function(e){
        var $itemTarget = $(e.currentTarget);
        var $qaArrow = $itemTarget.find('.ui-qa-arrow');
        var $qaAnswer = $itemTarget.siblings('.ui-qa-answer');

        if($qaArrow.hasClass('ui-arrow-up')){
            $qaArrow.animateRotate(360);
            $qaArrow.removeClass('ui-arrow-up');
        }else{
            $qaArrow.animateRotate(540);
            $qaArrow.addClass('ui-arrow-up');
        }
        if($qaAnswer.is(':hidden')){
            $qaAnswer.slideDown({'duration':200});
        }else{
            $qaAnswer.slideUp({'duration': 200});
        }
    }
    
});