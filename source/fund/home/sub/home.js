var template = _.template(require('./index.html'));
require('./home.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        this.getData();
    },
    getData:function(){
        this.render();
        new Swiper(".swiper-container",{loop:true, });
        $('.bannerSlide .animate').bannerSlider($('.bannerSlide .pages li'),3000);
    },
    render:function(){
        this.$el.html(template());
        return this;
    },
    events:{
        'tap .search-btn': 'gotoSearch',
        'tap .self': 'selfCollection',
        'tap .zhi': 'exponent',
        'tap .market': 'gotoMarket'
    },

    gotoSearch: function(){
        var searchWords = $(".fund-search input").val();
        //跳转到搜索页
        $.changePage("fund/search/" + searchWords);
    },

    selfCollection: function(){
        $.changePage("fund/cate/");
    },

    exponent: function(){
        $.changePage("fund/exponent/");
    },

    gotoMarket: function(){
        $.changePage("fund/cate/");
    }
    
});