var template = _.template(require('./list2.html'));
require("./list.css");
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.cache = options.cache;
        this.callback=options.callback||function(){};
        this.render();
    },
    render:function (){
        // console.log(this.cache)
        this.$el.html(template({gift:this.cache.gift,selectedBagId:this.cache.selectedBagId,isUseByProduct:this.cache.isUseByProduct||false}));
        return this;
    },
    events:{
        'tap .red-bag-one':'choose',
        'tap .withoutredbtn':'choose'
    },
    choose:function(e){
        var obj=$(e.currentTarget);
        if($.findEleByClass(e.target, 'withoutredbtn')){
            $('.selectbtn').removeClass('selected'); 
            this.callback();
        }else{
            var temp = {
                id:obj.attr('data-id'),
                amount:obj.attr('data-amount'),
                limitAmount:obj.attr('data-limitAmount'),
                ruleType:obj.attr("data-ruleType"),
            };
            if(temp.ruleType == 2){
                temp.limitDay = obj.attr('data-limitDay');
                temp.maxLimit = obj.attr('data-maxAmount');
            }
            $('.selectbtn').removeClass('selected');
            obj.find('.selectbtn').addClass('selected');
            this.callback(temp);
        }

        $('.redbag').remove();
        $("html, body").animate({ scrollTop: 0 }, 0);
    }
});