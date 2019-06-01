var template = _.template(require('./myPolicy.html'));
require('./../accountInsurance.css');

module.exports = Backbone.View.extend({
	initialize: function () {
        this.render();
    },
    events:{
    	'tap .rTitle':          'viewDetail'
    },
    render:function(){
        this.$el.html(template(this.cache));
        $.setAppNav('账户安全险');
        this.toggle();
        return this;
    },
    toggle:function(){
        $.each($('.slideBtn'),function(){
            $(this).click(function(){
                $(this).find('.up').toggleClass('down');
                $(this).next('.item-content').toggle(300);
            })
        })
    },
    viewDetail:function(){
        $.changePage('staticPage/taipingInsurance');
    }
})