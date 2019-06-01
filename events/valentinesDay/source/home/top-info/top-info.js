var template = _.template(require('./top-info.html'));
require('./top-info.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.uid=options.uid;
        this.cache=options.cache;
        this.render();
    },
    render: function () {
        var self=this;
        this.partner={};
        if(this.cache && this.cache.relationList && this.cache.relationList.length && this.cache.relationList[0].isBind==1){
            this.partner=this.cache.relationList[0];
        }
        this.$el.html(template({info:this.cache,partner:this.partner}));
        this.$el.find('.upload-img').upload({
            clipSquare:true,
            bindUser:1,
            loading:self.$el.find('.loading-box'),
            showThumbnail:function(img,imgRotation){
                self.$el.find('.user-icon-1').attr('src',img).css('transform','rotate('+(imgRotation)+'deg)')
            },
            afterUpload:function(file,d){

            },
            uploadError:function(){
                self.$el.find('.user-icon-1').attr('src',$.getStaticOrgin()+'/events/valentinesDay/dist/i1.png');
            }
        });
        this.$el.find('.animate').overSlide();
        return this;
    },
    _checkUid:function(callback){
        if(this.uid>0){
            if(this.cache.isLogin){
                callback();
            }else{
                jsb.login();
            }
        }else {
            $.checkUser(function () {
                callback();
            });
        }
    },
    events:{
        'tap .edit-name-btn':'editName',
        'tap .user-one':'changePartner',
        'tap .invite-btn':'invitePartner',
        'tap .icon-2':'invitePartner2',
        'tap .share-btn':'sharePage',
        'tap .history-btn':'createHistory',
        'tap .invest-btn': 'confirmInvest',
        'tap .user-icon-1':'toLogin'
    },
    toLogin:function(e){
        var self=this;
        if(this.cache && this.cache.masterUserId){
            if($.isApp()){ 
               var obj = $(e.currentTarget),
                   idx=parseInt(obj.attr('data-index'));
               self.$el.append('<div class="defaultavatar"></div>');
               var avatar=require('./../avatar/avatar');
               new avatar({el:this.$el.find('.defaultavatar'),
               idx: idx,
               afterUpload:function(file, d,index){
                  $(".user-icon-1").attr('src',d.url);
                  $(".user-icon-1").attr('data-index',index);
              }
          });
           }
           return;
       }
       jsb.login();
   },
   _editName:function(){
        var self=this;

        $.popWindow({
            title:'编辑姓名',
            content:'<input type="text" class="input-text edit-name-input" placeholder="输入姓名">',
            type:2,
            yes:'取消',
            no:'保存',
            callback:function(bl){
                if(!bl){
                    var v=$('.edit-name-input').val();
                    if($.charLen(v)>8){
                        $.toast('姓名最长4个中文字');
                    }else{
                        $.sync({
                            url:fresh.apiRoot+'loveractivity/loverActivityNickNameUpdate',
                            type:'post',
                            data:{
                                niceName:v
                            },
                            success:function(){
                                self.$el.find('.edit-name-btn').html(v);
                            }
                        })
                    }
                }
            }
        })
    },
    editName:function(){
        var self=this;
        this._checkUid(function(){
            self._editName();
        });
    },
    _changePartner:function(obj,name,id){
        if(obj.hasClass('love')) return;
        $.popWindow({
            title:'确定选择 '+name+' 为情人吗?',
            content:'如更换情人组队投资年化值会重新记录投资所得恋爱基金与Ta分享',
            type:2,
                yes:'取消',
                no:'确认',
            callback:function(bl){
                    if(!bl){
                    $.sync({
                        url:fresh.apiRoot+'loveractivity/confirmRelation',
                        data:{
                            slaveUserId:id
                        },
                        type:'post',
                        success:function(){
                            var s=window.location.href;
                            window.location=s+(s.indexOf('?')>0?'&':'?')+('t='+new Date().getTime())
                        }
                    })
                }
            }
        })
    },
    changePartner:function(e){
        var self=this,
        obj=$(e.currentTarget),
        name=obj.attr('data-name'),
        id=obj.attr('data-id');

        this._checkUid(function(){
            self._changePartner(obj,name,id);
        });
    },
    _invitePartner:function(){
        jsb.setShareInfo({
            title : '额。。有句话想对你说！',
            desc : '表白贴',
            link : location.origin+'/events/valentinesDay/index.html#landPage/'+this.cache.masterUserId,
            icon : $.getStaticOrgin()+'/yaowang/events/valentinesDay/dist/share.jpg'
        });
        this.$el.find('.share_mask').addClass('share_mask2');
        jsb.share();
    },
    invitePartner:function(){
        var self=this;
        this._checkUid(function(){
            self._invitePartner();
        });
    },
    invitePartner2:function(e){
        var self=this;
        if(this.partner.isBind && $(e.currentTarget).hasClass('love')){
            return false;
        }
        this._checkUid(function(){
            self._invitePartner();
        });
    },
    sharePage:function(){
        $.shareDefault();
        this.$el.find('.share_mask').removeClass('share_mask2');
        jsb.share();
    },
    _createHistory:function(){
        var self=this;
        if (self.partner.isBind) {
            $.sync({
                url: fresh.apiRoot + 'loveractivity/createLoverCard',
                data: {
                    teamId: self.partner.teamId
                },
                type: 'post',
                success: function (d) {
                    $.changePage('coupleCard/' + d.cardId);
                }
            });
        } else {
            $.toast('先邀请选择一个情人才能生成情侣证哦！');
        }
    },
    createHistory:function(){
        var self=this;
        this._checkUid(function(){
            self._createHistory();
        })
    },
    _confirmInvest:function(){
        var self=this;
        if(!self.partner.isBind){
            $.popWindow({
                type:2,
                title:'万元恋爱基金大作战',
                content:'您还没有选择情人，只有邀请成功并选择为情人才能得到恋爱基金奖励。',
                yes:'继续去投资',
                no:'去邀请情人',
                callback:function(bl){
                    if(bl){
                        jsb.toList();
                    }else{
                        self.invitePartner();
                    }
                }
            })
        }else{
            $.popWindow({
                type:2,
                title:'万元恋爱基金大作战',
                content:'<div class="user-icons"><img class="u-i-1" src="'+self.cache.masterHeadImg+'">'
                +'<img class="u-i-2" src="'+self.partner.headImg+'"></div>'
                +'您和<span class="color">'+self.partner.niceName+'</span>将会得到恋爱基金现金奖励',
                yes:'换一个情人',
                no:'确认去投资',
                callback:function(bl){
                    if(!bl){
                        jsb.toList();
                    }
                }
            })
        }
    },
    confirmInvest:function(){
        var self=this;
        this._checkUid(function(){
            self._confirmInvest();
        })
    }
});