var template = _.template(require('./inviteRecords.html'));
require('./inviteRecords.css');

module.exports = Backbone.View.extend({
	initialize: function () {
		$.setLoginTokenFormApp();
        this.getData();
        this.list=[];
        this.info=[];
        this.entity=null;
    },
    getData:function(){
        var self=this;
        $.batSync({
            data:[
            {url:fresh.apiRoot+'lcds/baseinfo'},
            {url:fresh.apiRoot + 'lcds/investor/list'}
            ],
            success:function(d){
                    if(d[0].userType!='0'){//避免因手动审核通过造成不同步
                        $.changePage('uc/manager');
                    }else{
                     self.entity={
                        info:d[0],
                        list:d[1].cusInfoList
                    }
                    self.render();  
                }
                
            },
            error: function(d){
                $.toast(d.msg);
                self.render();
            }
        });
    },
    render:function(){
        this.$el.html(template(this.entity));
        $.setAppNav('邀请记录');
        this.setDefaultShare();
        return this;
    }, 
    events:{
        'tap .banner'   :'togrow',
        'tap .invitebtn':'share',
        'tap .tobeplannerbtn':'tobeplanner'
    },
    loadMore:function(d){
        var self = this;
        fresh.loadData&&fresh.loadData.destory();
        fresh.loadData=$.loadMore({
            loading: '.loading',
            padding: 20,
            url: fresh.apiRoot + 'lcds/investor/list',
            type:'post',
            loadFirstPage: true,     
            data: {
                pageNo:1,
                pageSize:100
            },
            success: function (d,hasmore) {
                self.entity=d;
                self.list=self.list.concat(d.cusInfoList);
                self.entity.list=self.list;
                self.entity.info=self.info;
                self.entity.hasmore=hasmore;
                self.render();
            },
            error: null
        });
    },
    togrow:function(){
      $.changePage('uc/manager/makeMoneyGuide');
  },
  tobeplanner:function(){
    var self=this;
    $.sync({
        url :fresh.apiRoot+'lcds/apply',
        type:'post',
        success: function (d) {
              // self.render();
              location.reload();
          },
          error:function(d){
             console.log(d);
         }
     }); 
},
setDefaultShare:function(){
    var shareurl= location.protocol+'//'+location.host+'/weizhan/#uc/invite/landingPage?code='+ localStorage.getItem('yw_user_inviteCode');
    jsb.setShareInfo({
                    title:'跟我来摇旺赚钱吧，100元代金券、14%新手专享产品和万元体验金等你来拿~', //分享标题
                    desc:'不会理财的人不漂亮！', //分享描述
                    link:shareurl,
                    callback:function(){
                    }
                });
},
share:function(){
    jsb.share();
}

})