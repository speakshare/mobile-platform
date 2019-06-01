var template = _.template(require('./accountInsurance.html'));
require('./accountInsurance.css');

module.exports = Backbone.View.extend({
	initialize: function () {
        
        this.render();
    },
    render:function(){
        this.$el.html(template(this.cache));
        $.setAppNav('账户安全险');
        return this;
    },
    events:{
    	'tap #toggle-btn':      'slideToggle',
        'tap .rTitle':          'viewDetail'
    },
    slideToggle:function(){
        $('.process-content').toggle(200);
        $('.up').toggleClass('down');
    },
    viewDetail:function(){
        $.changePage('staticPage/taipingInsurance');
    }
})