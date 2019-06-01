var template = _.template(require('./landPage.html'));
require('./landPage.css');


module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type=options.type;
        this.lid=options.lid;
        this.getData(options.lid);
        this.currimgurl=null;
    },
    getData:function(id){
        var self=this;
        $.sync({
            url:fresh.apiRoot + 'loveractivity/initInviterInfo',
            type:'post',
            data:{masterUserId:id},
            success:function(d){
                self.initInviterInfo=d;
                self.render();
            },
            error:function(d){
                $.toast(d.msg);
                $.changePage('home')
            }
        });
    },
    render: function () {
        var self=this;
        this.$el.html(template({initInviterInfo:this.initInviterInfo}));
        $.setWeixinTitle('邀请好友');
        this.$el.find('.upload-img').upload({
            clipSquare:true,
            loading:self.$el.find('.loading-box'),
            showThumbnail:function(img){
                self.$el.find('.slaveHeadImg').attr('src',img).show();
                $('.subname').text('更换美照');
            },
            afterUpload:function(file,d){
               self.currimgurl=d.url;
           },
           uploadError:function(){
            self.$el.find('.slaveHeadImg').attr('src','').hide();
        }
    });
        $.shareDefault();
        return this;
    },
    events:{
        'tap .bottombtn':'acceptResult'
    },
    acceptResult:function(e){
        var self=this,
        name=this.$el.find('.inviteename').val().trim(),
        mobile=this.$el.find('.inviteemobile').val();
        if($(e.currentTarget).hasClass('yesbtn')){
            if($.charLen(name)<1 || $.charLen(name)>8){
                $.toast('姓名为1~8个字符');
                return;
            }
            if(!$.isMobileNum(mobile) || !self.currimgurl){
                $.toast('请完整填写姓名手机号、上传头像后接受邀请。');
                return;
            }
            $.sync({
                url:fresh.apiRoot + 'loveractivity/acceptInvite',
                type:'post',
                data:{
                    masterUserId:self.lid,
                    headImg:self.currimgurl,
                    niceName:name,
                    mobile:mobile
                },
                success:function(d){
                    $.changePage('home/'+d.slaveUserId);
                },error:function(d){
                    $.toast(d.msg);
                }
            });
        }else{
         $.changePage('home');
     }
 }
});