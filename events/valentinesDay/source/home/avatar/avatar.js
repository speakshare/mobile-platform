var template = _.template(require('./avatar.html'));
require('./avatar.css');

module.exports = Backbone.View.extend({
    initialize: function (options) { 
        this.afterUpload=options.afterUpload||function(){};
        // this.uploadError=options.uploadError||function(){};
        this.idx=options.idx||'0';
        this.index=options.idx;
        this.render();
    },
    render: function () {
        var self=this;
        this.$el.html(template());
        this.$el.find('.img'+this.idx).addClass('chooseed');
        
        return this;
  },
  events:{
    'tap .close':'remove',
    'tap .imgbox':'selectImg',
    'tap .yesbtn':'upload'
},

remove:function(){
    $('.defaultavatar').remove();
},
selectImg:function(e){
    var self = $(e.currentTarget);
    this.index=parseInt(self.attr('data-index'));
    self.addClass('chooseed').siblings().removeClass("chooseed");
},
upload:function(){
    var self=this;
    if(this.index>0){
        if(this.index!=this.idx){
            var file=$.getImgStream(this.index-1);
            if(file){
                $.sync({
                    url:fresh.apiRoot+'loveractivity/upload',
                    type:'post',
                    data: {
                        file:file,
                        uploadFlag:1,
                        imgRotation:0
                    },
                    success: function (d) {
                        self.afterUpload && self.afterUpload(file, d,self.index);
                        self.remove();
                    },
                    error: function (d) {
                        $.toast('上传失败');
                    }
                })  
            }else{
                $.toast("上传失败");
            }
        }else{
            self.remove();  
        }
    }else{
        $.toast("请选择头像");
    }
}

});