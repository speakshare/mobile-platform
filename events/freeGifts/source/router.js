var oldRouter,
    ref='';

function clearPageData(){
    $(window).scrollTop(0);
    fresh.$content.off().html('<div class="loading"></div><div class="grey center">加载中...</div>');
}

module.exports=Backbone.Router.extend({
    initialize:function(){
        var that = this;
        this.bind('route',function(curRouter){
            //after Route
            ref=location.href;
            setTimeout(function(){
                $('#changePageAnimate').fadeOut();
            },400);
        });
    },
    //before route
    _beforeRoute:function(curRouter){
        //if(st.loadDate) st.loadDate.destory();
        clearPageData();
        oldRouter=curRouter;
        if(!ref){
            fresh.$body.append('<div class="change_page_loading" id="changePageAnimate"><div class="page_loading"></div></div>');
        }else{
            $('#changePageAnimate').show();
        }
    },

    routes:{
        '':                             'home',
        'myGift/*':                     'myGift',
        'rd':                           'home'
    },

    home:function(){
        var Index=require('./home/home');
        new Index({el:fresh.$content});
    },
    myGift:function(type){
        var Rank=require('./myGift/myGift');
        new Rank({el:fresh.$content,type:type});
    }
});