var template = _.template(require('../../detail/html/pd-desc.html'));

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.pid=options.pid;
        this.getData();
    },
    getData:function(){
        var self=this;
        this.cache={};
        $.batSync({
            data:[
                {url:fresh.apiRoot + 'productInfo',data:{productNo:this.pid,type:1}},
                {url:fresh.apiRoot +'member/queryBankCodeList'}
            ],
            success:function(d){
                self.cache.pd=d[0];
                self.cache.bankList=d[1]||[];
                self.render();
            }
        });
    },
    render:function (){
        this.$el.html('<div class="pd-infos">'+template(this.cache)+'</div>')
    },
    events:{
        'tap .law':'changePage'
    },
    changePage:function(){
        window.location='staticPage/legalDoc?sort='+$.getParam('sort');
    }
});