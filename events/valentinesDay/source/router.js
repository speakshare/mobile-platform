var oldRouter,
ref='';

function clearPageData(){
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
        'home/*':                       'home',
        'home/:id/*':                   'home',
        'landPage/:id/*':               'landPage',
        'coupleCard/:id/*':             'coupleCard',
        'rule/*':                       'rule',
        'rd':                           'home',
        ':id/*':                        'home'
    },
    home:function(id){
        var home=require('./home/home');
        new home({el:fresh.$content,uid:id});
    },
    rule:function(){
        var rule=require('./rule/rule');
        new rule({el:fresh.$content});
    },
    landPage:function(id){
        var landPage=require('./landPage/landPage');
        new landPage({el:fresh.$content,lid:id});
    },
    coupleCard:function(id){
      var coupleCard=require('./coupleCard/coupleCard');
      new coupleCard({el:fresh.$content,cid:id});
  }
});