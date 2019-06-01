var template = _.template(require('./home.html'));
require('./home.css');

module.exports = Backbone.View.extend({
    // initialize: function () {
    //     this.getData();
    // },
    // getData:function(){
    //     this.render();
    // },
    // render:function(){
    //     this.$el.html(template());
    //     Home=require('./sub/home');
    //     new Home({el:this.$el.find('.fund-main')});
    //     return this;
    // },
    // events:{
    //
    // }
    initialize: function () {
        this.getData();
    },
    getData:function(){
        this.render();
    },
    render:function(){
        this.$el.html(template());
        $('#preMask').attr('src',$.getStaticOrgin()+'/yaowang/dist/globalImg/fund-bg.jpg');
        return this;
    },
    events:{
        'tap .item': "displayDesc",
        'tap .head-tab':'headTab'
        // 'tap .product':'pageProduct',
        // 'tap .transfer-btn':'transferList'
    },
    headTab:function(e){
        var self = $(e.currentTarget),
            _index = self.index();
        if(_index == 0){
            $.changePage('product');
        }
    },
    // pageProduct:function(){
    //     $.changePage('product');
    //     return false;
    // },
    // transferList:function(){
    //     $.changePage('transfer');
    // },
    displayDesc: function(event){
        var temp = event.target;
        if(!$(temp).hasClass("item")){
            temp = $(temp).parent();
        }
        if($(temp).find('[class*=desc]').css("display") == "block"){
            $(temp).find('[class*=desc]').css({display:'none'});
        }else{
            $(".item").find('[class*=desc]').css({display:'none',width:'0'});
            $(event.target).parent().find('[class*=desc]').css({display:'block'}).animate({width:'85%'});
        }

    }
});