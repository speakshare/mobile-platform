var template = _.template(require('./recharge.html'));
var template1 = _.template(require('./item.html'));
require('./recharge.css');
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.cache = options.cache || {};
        // this.render();
        this.getData();
    },
    getData:function(){
        var self = this;
        if($.getToken()){
            $.sync({
                url:fresh.apiRoot + 'pointshop/liumi/list',
                type:'post',
                data:{
                    telephone:$.getNub(),
                    rechargeType:'4'
                },
                success:function(d){
                    console.log(d);
                    self.cache = d;
                    self.render();
                    self.$el.find('.selectContainer').append(template1({data:self.cache}));
                    $('#checkTel').val($.getNub());
                    // $('#checkTel').val($.getNub().substr(0,3)+' '+$.getNub().substr(3,4)+' '+$.getNub().substr(7,4));
                    $('.clearBtn').show();
                    self.$el.find('.operator').show();
                    $('.operator').html(d.ispNo==1?'中国电信':d.ispNo==2?'中国移动':'中国联通');
                }
            })
        }else{
            $.sync({
                url:fresh.apiRoot + 'pointshop/liumi/list',
                type:'post',
                data:{
                    telephone:'',
                    rechargeType:'4'
                },
                success:function(d){
                    console.log(d);
                    self.cache = d;
                    self.render();
                    self.$el.find('.selectContainer').append(template1({data:self.cache}));
                }
            })
        }     
    },
    events:{
        'keyup .numPanel':'check',
        'tap .clearBtn':'clear',
        'tap .charge':'charge',
        'tap .flow':'flow',
        'tap .item':'pickOn',
        'tap .rechargeBtn':'tip'
    },
    charge:function(){
        var self = this;
        self.$el.find('.beanCount').html('');
        var phone = $('#checkTel').val();
        if(phone){
            if(self.isPhoneNum(phone)){
                $.sync({
                    url:fresh.apiRoot + 'pointshop/liumi/list',
                    type:'post',
                    data:{
                        telephone:$('#checkTel').val(),
                        // telephone:($('#checkTel').val()).replace(/\s+/g,""),
                        rechargeType:'4'
                    },
                    success:function(d){
                        self.cache = d;
                        console.log(self.cache);
                        self.$el.find('.selectContainer').html(template1({data:self.cache}));
                    }
                })
            }
        }else{
            $.sync({
                url:fresh.apiRoot + 'pointshop/liumi/list',
                type:'post',
                data:{
                    telephone:'',
                    rechargeType:'4'
                },
                success:function(d){
                    self.cache = d;
                    console.log(self.cache);
                    self.$el.find('.selectContainer').html(template1({data:self.cache}));
                }
            })
        }
        $('.charge').addClass('selected').siblings().removeClass('selected');
    },
    flow:function(){
        var self = this;
        self.$el.find('.beanCount').html('');
        var phone = $('#checkTel').val();
        if(phone){
            if(self.isPhoneNum(phone)){
                $.sync({
                    url:fresh.apiRoot + 'pointshop/liumi/list',
                    type:'post',
                    data:{
                        telephone:$('#checkTel').val(),
                        // telephone:($('#checkTel').val()).replace(/\s+/g,""),
                        rechargeType:'5'
                    },
                    success:function(d){
                        self.cache = d;
                        console.log(self.cache);
                        self.$el.find('.selectContainer').html(template1({data:self.cache}));
                    }
                })
            }
        }else{
            $.sync({
                url:fresh.apiRoot + 'pointshop/liumi/list',
                type:'post',
                data:{
                    telephone:'',
                    rechargeType:'5'
                },
                success:function(d){
                    self.cache = d;
                    console.log(self.cache);
                    self.$el.find('.selectContainer').html(template1({data:self.cache}));
                }
            })
        }
        $('.flow').addClass('selected').siblings().removeClass('selected');
    },
    render:function (){
        var self = this;
        self.$el.html(template({data:self.cache}));
        $.setAppNav('话费充值');
        return this;
    },
    check:function(){
        var checkTel = $('#checkTel').val(),
            _length = checkTel.length;
        if(checkTel){
            $('.clearBtn').show();
            if(_length==11){
                if(!this.isPhoneNum(checkTel)){
                    this.$el.find('.warn').addClass('show');
                    this.$el.find('.operator').hide();
                }else{
                    if($('.charge').hasClass('selected')){
                        $.sync({
                            url:fresh.apiRoot + 'pointshop/liumi/list',
                            type:'post',
                            data:{
                                telephone:$('#checkTel').val(),
                                // telephone:($('#checkTel').val()).replace(/\s+/g,""),
                                rechargeType:'4'
                            },
                            success:function(d){
                                console.log('手动输入'+JSON.stringify(d));
                                $('.warn').removeClass('show');
                                $('.operator').show();
                                $('.operator').html(d.ispNo==1?'中国电信':d.ispNo==2?'中国移动':'中国联通');
                                $('.selectContainer').html(template1({data:d}));
                            },
                            error:function(d){
                                $('.warn').addClass('show');
                            }
                        })
                    }else{
                        $.sync({
                            url:fresh.apiRoot + 'pointshop/liumi/list',
                            type:'post',
                            data:{
                                telephone:$('#checkTel').val(),
                                // telephone:($('#checkTel').val()).replace(/\s+/g,""),
                                rechargeType:'5'
                            },
                            success:function(d){
                                console.log('手动输入'+JSON.stringify(d));
                                $('.warn').removeClass('show');
                                $('.operator').show();
                                $('.operator').html(d.ispNo==1?'中国电信':d.ispNo==2?'中国移动':'中国联通');
                                $('.selectContainer').html(template1({data:d}));
                            },
                            error:function(d){
                                $('.warn').addClass('show');
                            }
                        })
                    }
                }
            }
        }
    },
    pickOn:function(e){
        var self = this;
        var phone = $('#checkTel').val(),
            _self = $(e.currentTarget),
            _count = $(e.currentTarget).attr('data-count');
        if($('.warn').hasClass('show')){
            return false;
        }else{
            if(self.isPhoneNum(phone)){
                _self.addClass('pick').siblings().removeClass('pick');
                self.$el.find('.beanCount').html(_count);
            }else {
                this.$el.find('.warn').addClass('show');
                return false;
            }
        }
    },
    clear:function(){
        this.$el.find('#checkTel').val('');
        this.$el.find('.clearBtn').hide();
        this.$el.find('.warn').removeClass('show');
        this.$el.find('.operator').hide();
    },
    tip:function(){
        var beanCount = $('.pick .bean').html(),
            // amount = ($('.pick .amount').html()).substring(0,($('.pick .amount').html().length)-1),
            amount = $('.pick .amount').html(),
            operator = $('.operator').html(),
            _id = $('.pick').attr('data-id'),
            tel = $('#checkTel').val();
        if($.getToken()){
            var memberType = ['普通','白银','黄金','铂金','钻石'];
            if($('.charge').hasClass('selected')){
                if($('.item').hasClass('pick')){
                    $.popWindow({
                        title: '',
                        content: '您将以'+memberType[this.cache.level-1]+'会员的价格<br/>'+ parseInt(beanCount * this.cache.pointDiscount) + '旺豆兑换'+ amount +'话费<br/>充值手机号:' + tel,
                        type: 2,            
                        yes:'确认充值',
                        no:'取消',            
                        callback:function(pos,e){
                            var _current = $(e.target);
                            if(_current.hasClass('no_btn')){
                                $('.pop_win_wrap').off();
                            }else{
                                $.sync({
                                    url:fresh.apiRoot + 'pointshop/exchange',
                                    type:'post',
                                    data:{
                                        loginToken:$.getToken(),
                                        ruleId:_id,
                                        telephone:tel
                                        // telephone:($('#checkTel').val()).replace(/\s+/g,"")
                                    },
                                    success:function(d){
                                        $.changePage('mall/rechargeResult');
                                    },
                                    error:function(d){
                                        $.toast(d.msg); 
                                    }
                                })
                            }
                        }
                    });
                }else{
                    $.toast('请选择可兑换的话费');
                }
            }else{
                if($('.item').hasClass('pick')){

                    $.popWindow({
                        title: '',
                        content: '您将以'+memberType[this.cache.level-1]+'会员的价格<br/>'+ parseInt(beanCount * this.cache.pointDiscount) + '旺豆兑换'+ amount +'流量<br/>充值手机号:' + tel,
                        type: 2,            
                        yes:'确认充值',
                        no:'取消',            
                        callback:function(pos,e){
                            var _current = $(e.target);
                            if(_current.hasClass('no_btn')){
                                $('.pop_win_wrap').off();
                            }else{
                                $.sync({
                                    url:fresh.apiRoot + 'pointshop/exchange',
                                    type:'post',
                                    data:{
                                        loginToken:$.getToken(),
                                        ruleId:_id,
                                        telephone:tel
                                        // telephone:($('#checkTel').val()).replace(/\s+/g,"")
                                    },
                                    success:function(d){
                                        $.changePage('mall/rechargeResult');
                                    },error:function(d){
                                        $.toast(d.msg);
                                    }
                                })
                            }
                        }
                    });
                }else{
                    $.toast('请选择可兑换的流量');
                }
            }
        }else{
            $.changePage('login');
        }
    },
    isPhoneNum:function(num){
        var _num = num.replace(/\s+/g,"");
        return !isNaN(_num) && /^1\d{10}$/.test(_num);
    }
});