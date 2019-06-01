/**
 * Created by xmm  on 2016/9/5
 */
 var template = _.template(require('./addr.html'));
 require('./addr.css');
 module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.type = options.type;
        this.getData();
    },
    getData:function(){
        var self=this;
        $.setLoginTokenFormApp();
        this.addr= $.getCache('useraddr');
        this.addrafter=$.getafterSetAddr(); 
        $.checkUser(function(){
                if(_.isEmpty(this.addr)){
                    $.sync({
                        url: fresh.apiRoot + 'pointshop/address/default',
                        type: 'post',
                        success: function(d){
                            var addr = d.entity;
                            $.setCache('useraddr',addr);
                            self.addr=d.entity;
                            self.render(); 
                        },error:function(d){
                            self.render();
                        }
                    });
                }else{
                    self.render();  
                }
            
        });
    },
    render:function (){
        this.$el.html(template({addr:this.addr}));
        $.setAppNav('设置地址');
        return this;
    },
    events:{
        "tap .addrfinishbtn":'addrFinish'
    },
    addrFinish:function(e){
        var msgObj=this.addrVerify();
        var self = $(e.currentTarget);
        var _idx=parseInt(self.attr('data-id'));
        if(parseInt(msgObj.code)==1){ 
            if(_idx==1){
                $.sync({
                    url: fresh.apiRoot + 'pointshop/address/add',
                    type: 'post',
                    data:{addressId:$('#addrid').val(),memberName:$.trim($('#addrName').val()),telephone:$('#addrTel').val(),zipCode:$('#addrZipCode').val(),address:$.trim($('#addrDetail').val())},
                    success: function(d){
                        var addr = d.entity;
                        $.setCache('useraddr',addr);
                        self.addr=d.entity;
                        $.toast("添加成功");
                        location.href=$.getCache('addrcallbacklink');
                    },error:function(d){
                        $.toast(d.msg);
                    }
                });  
            }else{
                $.sync({
                    url: fresh.apiRoot + 'pointshop/address/edit',
                    type: 'post',
                    data:{addressId:$('#addrid').val(),memberName:$.trim($('#addrName').val()),telephone:$('#addrTel').val(),zipCode:$('#addrZipCode').val(),address:$.trim($('#addrDetail').val())},
                    success: function(d){
                        var addr = d.entity;
                        $.setCache('useraddr',addr);
                        self.addr=d.entity;
                        $.toast('修改成功');
                        location.href=$.getCache('addrcallbacklink');
                    },error:function(d){
                       $.toast(d.msg);
                   }
               });
            }
        }else{
            $.toast(msgObj.msg);
        }
    },
    addrVerify:function(){
        var msgObj={code:0,msg:''},addrName=$('#addrName').val(),addrTel=$('#addrTel').val(),addrZipCode=$('#addrZipCode').val(),addrDetail=$('#addrDetail').val();
        if(addrName.replace(/(^\s*)|(\s*$)/g,"").length<2 || addrName.replace(/(^\s*)|(\s*$)/g,"").length>20){
            msgObj.msg="请正确填写收货人姓名,字数在2~20之间" ;
        }else if(!$.isMobileNum(addrTel)){
            msgObj.msg="请正确填写手机号码" ; 
        }else if(!$.isZipCode(addrZipCode)){
           msgObj.msg="请正确填写邮政编码" ; 
       }else if(addrDetail.replace(/(^\s*)|(\s*$)/g,"").length<11 || addrDetail.replace(/(^\s*)|(\s*$)/g,"").length>100){
        msgObj.msg="请正确填写详细地址，字数在11~100之间" ; 
    }else{
       msgObj.code=1; 
   }
   return msgObj;
}
});