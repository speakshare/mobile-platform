var template = _.template(require('./question.html'));
require('./question.css');

module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.questions=[
            {
                q: '您的年龄是？',
                a: {
                    '18-30': -2,
                    '31-50': 0,
                    '51-60': -4,
                    '高于60岁': -10
                }
            },
            {
                q: '您的家庭年收入为（折合人民币）？',
                a: {
                    '5万元以下': 0,
                    '5-20万元': 2,
                    '20-50万元': 6,
                    '50-100万元': 8,
                    '100万元以上': 10
                }
            },
            {
                q: '在您每年的家庭收入中，可用于金融投资（储蓄存款除外）的比例为？',
                a: {
                    '小于10%': 2,
                    '10%至25%': 4,
                    '25%至50%': 8,
                    '大于50%': 10
                }
            },
            {
                q: '以下哪项最能说明您的投资经验？',
                a: {
                    '除存款、国债外，我几乎不投资其他金融产品': 0,
                    '大部分投资于存款、国债等，较少投资于股票、基金等风险产品': 2,
                    '资产均衡地分布于存款、国债、银行理财产品、信托产品、股票、基金等': 6,
                    '大部分投资于股票、基金、外汇等高风险产品，较少投资于存款、国债': 10
                }
            },
            {
                q: '您有多少年投资股票、基金、外汇、金融衍生产品等风险投资品的经验？',
                a: {
                    '没有经验': 0,
                    '少于2年': 2,
                    '2至5年': 6,
                    '5至8年': 8,
                    '8年以上': 10
                }
            },
            {
                q: '以下哪项描述最符合您的投资态度？',
                a: {
                    '厌恶风险，不希望本金损失，希望获得稳定回报': 0,
                    '保守投资，不希望本金损失，愿意承担一定幅度的收益波动': 4,
                    '寻求资金的较高收益和成长性，愿意为此承担有限本金损失': 8,
                    '希望赚取高回报，愿意为此承担较大本金损失': 10
                }
            },
            {
                q: '以下情况，您会选择哪一种？',
                a: {
                    '有100%的机会赢取1000元现金': 0,
                    '有50%的机会赢取5万元现金': 4,
                    '有25%的机会赢取50万元现金': 6,
                    '有10%的机会赢取100万元现金': 10
                }
            },
            {
                q: '您计划的投资期限是多久？',
                a: {
                    '1年以下': 4,
                    '1－3年': 6,
                    '3—5年': 8,
                    '5年以上': 10
                }
            },
            {
                q: '您的投资目的是？',
                a: {
                    '资产保值': 2,
                    '资产稳健增长': 6,
                    '资产迅速增长': 10
                }
            },
            {
                q: '您的投资出现何种程度的波动时，您会呈现明显的焦虑？',
                a: {
                    '本金无损失，但收益未达预期': -5,
                    '出现轻微本金损失': 5,
                    '本金10％以内的损失': 10,
                    '本金20-50％的损失': 15,
                    '本金50％以上损失': 20
                }
            }
        ];
        this.result=0;
        this.index=0;
        // this.result=parseInt($.getCache('risk-current-result',1))||0;
        // this.index=parseInt($.getCache('risk-current-index',1))||0;
        var self=this;
        $.setLoginTokenFormApp();
        $.checkUser(function(){
            self.render();
            // $(window).off('popstate.riskQusetion').on('popstate.riskQusetion',function(){
            //     $.popWindow({
            //         content: '<div class="contentdesc">本次风险评测还未完成，退出后将不保存当前进度，确定退出？</div>',
            //         type: 2,
            //         yes:'继续评估',
            //         no:'退出',
            //         callback:function(bl){
            //             if(!bl){
            //                 $.setCache('risk-current-result',0,86400,1);
            //                 $.setCache('risk-current-index',0,86400,1);
            //                 jsb.toUcSetting();
            //                 $(window).off('popstate.riskQusetion');
            //                 // $.sync({
            //                 //     url:fresh.apiRoot + 'member/updateRiskControlTypes',
            //                 //     type: 'post',
            //                 //     data:{riskType:'A'},
            //                 //     success: function(){
            //                 //         // self._saveResult('A');
            //                 //         $.setCache('risk-current-result',0,86400,1);
            //                 //         $.setCache('risk-current-index',0,86400,1);
            //                 //         jsb.toUcSetting();
            //                 //     }
            //                 // });
            //             }
            //         }
            //     });
            //     history.go(1);
            // });
        });

    },
    render:function(){
        this.evalCount=true;
        var qs=$.extend({},this.questions[this.index]);
        qs.q=(this.index+1)+'. '+qs.q;
        qs.en=['A','B','C','D','E','F'];
        this.$el.html(template(qs));
        $.setAppNav('风险评测问答 '+(this.index+1)+'/'+this.questions.length);
        return this;
    },
    events:{
        'tap .answer':'nextQuestion'
    },
    nextQuestion:function(e){

        var self=this,
            obj=$(e.currentTarget),
            val=parseInt(obj.attr('data-id'));
        if(!this.evalCount) return;
        this.evalCount=false;
        this.result+=val;
        this.index+=1;
        obj.addClass('active');
        setTimeout(function(){
            if(self.index==self.questions.length){
                self._saveResult();
            }else{
                // fresh.router.navigate('uc/risk/question/'+self.index+'/'+self.result, {trigger:false,replace:false});
                // $.setCache('risk-current-result',self.result,86400,1);
                // $.setCache('risk-current-index',self.index,86400,1);
                self.render()
            }
        },100)
    },
    _saveResult:function(type){
        var self=this,
            type=type||(this.result<=20?'A':(this.result>70?'C':'B'));
        $.sync({
            url:fresh.apiRoot+'member/updateRiskControlTypes',
            type:'post',
            data:{
                riskType:type
            },
            success:function(){
                // $(window).off('popstate.riskQusetion');
                // $.setCache('risk-current-result',null,11,1);
                // $.setCache('risk-current-index',null,11,1);
                $.changePage('uc/risk/result?resultType='+type);
            }
        })
    }
});