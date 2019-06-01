var template = _.template(require('./newhand.html'));

require('./newhand.css');

module.exports = Backbone.View.extend({
    initialize: function () {
        this.analysis();
        this.getData();
    },
    analysis:function(){
        window.customEvent(3, '1.3.1', '新手专区可见');
    },
    getData:function(){
        var self = this;
        self.render();
    },
    render:function (){
        this.$el.html(template());
        $.setAppNav('新手专区');
        return this;
    },
    events:{
        'tap #J_nowUse':'tabEvent'
    },
    tabEvent:function(e){
        $.checkUser( function(bool){
    			if(bool){
    				$.sync({
	                    url:fresh.apiRoot + 'newProductList',
	                    type: 'post',
	                    dataType:'json',
	                    data:{productType:0, currentPage:0, pageCount:99},
	                    success: function(data){
						   var resList = data.list || [];
						   var resObj = resList[0] || {};
						   var productNo = resObj.productNo;

						   if(productNo==null || productNo==""){
                            $.changePage("product");
                           }else {
                            $.changePage("product/"+productNo);
                           }
	                    }
	                });
    			}else{
    				$.login();
    			}

	    });
    }
});
