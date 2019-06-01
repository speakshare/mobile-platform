var template = _.template(require('./asset.html'));
require('./asset.css');

var ring=require('../../../libs/ring');
module.exports = Backbone.View.extend({
    initialize: function () {
        this.getData();
    },
    getData:function(){
        var self=this;
        $.checkUser(function(){
            $.sync({
                url:fresh.apiRoot+'member/queryCustomerAllMoneyInfo4Fund',
                type:'post',
                data:{loginToken:$.getToken(),platform:'wap'},
                success:function(d){
                    d.fundAssets = d.fundAssets ? d.fundAssets : 0;
                    d.temptotal = parseFloat(d.regularAssets)+parseFloat(d.currentAssets)
                            +parseFloat(d.piggy)+parseFloat(d.fundAssets);
                    self.cache=d;
                    self.render();
                },
                error:function(d) {    
                                  
                }  
            })

        });
    },
    render:function(){
        this.$el.html(template(this.cache));
        $.setAppNav('我的资产');
        this._initEvent();
        return this;
    },
    _initEvent:function(){
        var p1=[],p2=[],d=this.cache,
            count=d.temptotal;
        p1[0]=(d.regularAssets/count*100).toFixed(2);
        p1[1]=(d.currentAssets/count*100).toFixed(2);
        p1[2]=(d.piggy/count*100).toFixed(2);
        p1[3] = (d.fundAssets/count*100).toFixed(2);//基金
        // p1[3]=(100-p1[0]-p1[1]-p1[2]-p1[4]).toFixed(2);

        p2[0]=(d.regularProfit/(d.regularProfit+d.currentProfit)*100).toFixed(2);
        p2[1]=(d.currentProfit/(d.regularProfit+d.currentProfit)*100).toFixed(2);

        ring({
            parent:this.$el.find('.asset-chart')[0],
            animated: true,
            width: 456,
            radius: 189,
            arc: 78,
            perent: p1,
            color: ['#f6f6f6','#FF5532', '#FCA032','#3b8be8','#A432FC'],
            textColor: '#f30',
            textSize: '30px',
            after: function(){
                //console.timeEnd('用时');
            }
        });

        // ring({
        //     parent:this.$el.find('.asset-chart')[1],
        //     animated: true,
        //     width: 320,
        //     radius: 135,
        //     arc: 50,
        //     perent: p2,
        //     color: ['#f6f6f6', '#ff6046','#ffcd00','#b34afc','#5682f7'],
        //     textColor: '#f30',
        //     textSize: '30px',
        //     after: function(){
        //         //console.timeEnd('用时');
        //     }
        // });
    },
    events:{
        'tap .asset-li':'changeTab'
    },
    changeTab:function(e){
        var obj=$(e.currentTarget),
            id=obj.attr('data-id');
        if(!obj.hasClass('active')){
            obj.addClass('active').siblings().removeClass('active');
            this.$el.find('.asset-ring-box').eq(id-1).show().siblings().hide();
        }
    }
});