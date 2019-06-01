var template = _.template(require('./result.html'));
require('./result.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        $.setLoginTokenFormApp();
        var percent=$.getParam(location.href,'resultType')||15;

        var data = {};
        if(percent == "A"){
            percent = 15;
        }else if(percent == "B"){
            percent = 55;
        }else if(percent == "C"){
            percent = 85;
        }
        data.percent = 100-percent;
        if(percent <= 20){
            data.type = 1;
        }else if(percent <= 70){
            data.type = 2;
        }else{
            data.type = 3;
        }
        this.render(data);
    },
    render:function(data){
        this.$el.html(template({data:data}));
        $.setAppNav('评估结果');
        return this;
    },
    events:{
        'tap .close-btn':'closeResult',
        'tap .ok-btn':'closeResult',
        'tap .re-elevation':'reStart'
    },

    closeResult: function(){
        jsb.goBack(true);
        // if($.isApp()){
        //      window.location.href = "/weizhan/product/productClassifyList";
        // }else{
        //    $.changePage("uc/home");
        // }
    },
    reStart: function(){
        $.changePage("uc/risk/question");
    }
   
});