var template = _.template(require('./resign.html'));
var resignList = _.template(require('./resignList.html'));
require('./resign.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type = options.type;
        this.getData();
    },
    getData:function(){
        var self = this;
        $.checkUser(function(){
            $.batSync({
                data:[
                    {url:fresh.apiRoot+'member/sign/queryMissSignRecord',data:{loginToken:$.getToken()}},
                    {url:fresh.apiRoot +'member/sign/newHistory',data:{loginToken:$.getToken()}}             
                ],
                success:function(d){
                    console.log(d);
                    self.cache={
                        info: d[0]?d[0]:'',
                        history:d[1]?d[1]:''
                    };
                    self.render();
                },
                error:function(){
                    self.render();
                }
            })  
        })
    },
    render:function(){
        this.$el.html(template({signInfo:this.cache.info,history:this.cache.history,record:this.cache.info.signRecordList,mask:this.data,list:this.data1}));
        $.setAppNav('补签');
        $('.container li:first-child').find('.resignDate').css('color','#4f4f4f');
        $('.container li:first-child').find('.dot').css('backgroundColor','#4f4f4f');
        $('.container li:last-child').find('.leftBar').css('width','0px');
        return this;
    },
    events:{
        'tap .returnBtn': 'hideLayer',
        'tap .signAgain': 'signAgain',
        'tap .resignBtn': 'resign',
        'tap .iconBox':   'hideLayer',
        'tap .inviteBtn': 'invite',
        'tap .investBtn':  'invest'
    },
    invest:function(){
        $.changePage('product');
    },
    invite:function(){
        $.changePage('uc/invite');
    },
    hideLayer:function(e){
        var self = this;
        var _self = $(e.currentTarget).hasClass('iconBox');
        if(_self){
            $('.resignMask').hide();
            setTimeout(function(){
                $.changePage('#mall');
            },500);
        }else{
            $.changePage('#mall');
        }
        setTimeout($.sync({
            url:fresh.apiRoot+'member/sign/showLuckBox',
            data:{
                loginToken:$.getToken()
            },
            type:'post',
            success:function(res){ 
               console.log(res);
               self.data = res.luckObject;
                if(res.luckObject.nodeType=='02'){
                    if(res.luckObject.luckType==1){
                        self.windowpop(self.openchest(res.luckObject.quantity),3500);
                    }else{
                        self.windowpop(self.openvouchers(res.luckObject.quantity),3500);
                    }
                }
            }
        }),500);      
    },
    getpeas:function(i){//普通得旺豆
        var mark=$('<div class="mask"></div>');
        var boxhtml=$('<div class="peasbox"><p class="text">恭喜您获得<span class="num">'+i+'</span>旺豆</p></div>');
        $('body').append(mark);
        $('body').append(boxhtml);
    },
    getpeas1:function(i){
        var mark=$('<div class="mask"></div>');
        var boxhtml=$('<div class="peasbox1"><i></i><p class="text">您抽中<span class="num">'+i+'个</span>旺豆</p><span class="plusNum">+'+i+'</span><span class="closeBtn"></span></div>');
        $('body').append(mark);
        $('body').append(boxhtml);
    },
    openchest:function(i){//开宝箱得旺豆
        var mark=$('<div class="mask"></div>');
        var boxhtml=$('<div class="chestbox"><span class="num"><span class="iconBean"></span><span class="beanNum">+'+i+'</span></span></div>');
        $('body').append(mark);
        $('body').append(boxhtml);
    },
    openvouchers:function(i){//开宝箱得礼券
        var mark=$('<div class="mask"></div>');
        var boxhtml=$('<div class="chestbox1"><span class="num1"><span class="iconvouchers"><span class="beanNum">¥'+i+'</span></span></span></div>');
        $('body').append(mark);
        $('body').append(boxhtml);
    },
    getvouchers:function(i,m){
        var mark=$('<div class="mask"></div>');
        var boxhtml=$('<div class="vouchers"><p class="text">您抽中<span class="num">'+i+'元</span>代金券一张</p><span class="plusNum">¥'+i+'</span><span class="tips">满'+m+'可减</span><span class="item">代金券</span><button class="useBtn"></button><span class="closeBtn"></span></div>');
        $('body').append(mark);
        $('body').append(boxhtml);
    },
    windowpop:function(bl,timer){
        var self=this;
        if(typeof(bl)=='function'){
            bl && bl();
        }
        $('body').off('tap.closeBtn').on("tap.closeBtn", ".closeBtn", function() {
            self.close()
            $('.mask,.chestbox,.peasbox1,.vouchers').remove();
            location.reload();
        })
        $('body').off('tap.useBtn').on("tap.useBtn", ".useBtn", function() {
            $('.mask,.vouchers').remove();
            $.changePage('uc/couponList');
        })
        if(timer){
            setTimeout(function(){self.close()},timer);
        }
    },
    close:function(){
        var self = this;
        $('.mask,.chestbox,.chestbox1,.peasbox').remove();
        if(self.data.nodeType && self.data.nodeType=='01'){
            location.reload();
        }else{
            if(self.data.luckType==1){
                self.windowpop(self.getpeas1(self.data.quantity));
            }else{
                self.windowpop(self.getvouchers(self.data.quantity,self.data.investThreshold));
            }
        }
    },
    resign:function(e){
        var self = this;
        var target = $(e.target).hasClass('invalid');
        if(target) return;

        $.sync({
            url:fresh.apiRoot+'member/sign/executeBQ',
            data:{
                loginToken:$.getToken()
            },
            type:'post',
            success:function(d){
               self.data = d;
               self.data1 = d.bqRecordList;
               console.log(d);
               $(self.$el).find('.resignWrap').append(resignList({mask:self.data,list:self.data1}));
            }
        });
    },
    signAgain:function(){
        $.popWindow({
            content: '确认要重新签到吗？<br/>重新开始<span class="resignStress">旺豆+5</span>',            
            type: 2,            
            yes:'确定',
            no:'取消',            
            callback:function(pos,e){
                var self = this;
                var _current = $(e.target);
                if(_current.hasClass('no_btn')){
                    $('.pop_win_wrap').off();
                }else{
                    $.changePage('#mall');
                    $.sync({
                        url:fresh.apiRoot+'member/sign',
                        data:{
                            loginToken:$.getToken()
                        },
                        type:'post',
                        success:function(res){
                           console.log('重新签到'+JSON.stringify(res));
                           self.windowpop(self.getpeas(res.quantity),3500);
                        },
                        error:function(d){
                            $.toast(d.msg);
                            console.log(d.msg);
                        }
                    });
                }
            }
        });
    }
});