var template = _.template(require('./index.html'));
require('./index.css');
module.exports = Backbone.View.extend({
    initialize: function (options) {
        this.pid = options.pid;
        this.checkPid();
    },
    checkPid:function () {
        if (this.pid > 0) {
            this.getData();
        }else{
            this.getPid();
        }
    },
    getPid:function(){
        var self=this;
        $.sync({
            url:fresh.apiRoot + 'productList2',
            type:'post',
            success:function(d){
                self.pid=d.currentProduct.productNo;
                self.getData();
            }
        })
    },
    getData: function () {
        var self = this;
        $.checkUser(function () {
            $.batSync({
                data: [
                    {url: fresh.apiRoot + 'member/selectShakeMong', data: {productNo: self.pid, sort: '-1'}},
                    {url: fresh.apiRoot + 'member/shakeRollOut', data: {isTurn: '0'}}
                ],
                success: function (d) {
                    self.cache = d[0];
                    self.cache.productNo = self.pid;
                    self.render();
                    if (d[1].isTurn == '0') {
                        $('.yaoBao-hint').show();
                    } else {
                        $('.yaoBao-hint').hide()
                    }
                }
            });
        })

    },
    render: function () {
        this.$el.html(template(this.cache));
        $.setAppNav('摇宝');
        this.dollarTabSeven();
        return this;
    },

    dollarCacheData: function () {
        var self = this;
        var sevenYearRate = self.cache.sevenYearRate, millionProfit = self.cache.millionProfit;
        var sevenRate = [], sevenDate = [], millionDate = [], millionRate = [];
        if (sevenYearRate) {
            for (var i = 0; i < sevenYearRate.length; i++) {
                sevenRate.push(Number(sevenYearRate[i].Rate));
                sevenDate.push(sevenYearRate[i].date);
            }
        }

        if (millionProfit) {
            for (var i = 0; i < millionProfit.length; i++) {
                millionDate.push(millionProfit[i].date);
                millionRate.push(Number(millionProfit[i].profit));
            }
        }

        return {
            sevenRate: sevenRate.reverse(),
            sevenDate: sevenDate.reverse(),
            millionDate: millionDate.reverse(),
            millionRate: millionRate.reverse()
        }
    },

    events: {
        'tap .yaobao-dollar-summary': 'dollarSummary',
        'tap .yaobao-dollar-auto': 'dollarAuto',
        'tap .yaobaoProfit': 'yaobaoProfit',
        'tap .dollar-tab-li': 'dollarTabFn',
        'tap #yaobaoOut': 'yaoBaoOut',
        'tap #yaobaoInto': 'yaoBaoInto',
        'tap .yaoBao-hint': 'yaoBaoHint'
    },
    yaoBaoHint: function (e) {
        var self = $(e.target),
            toAuto = self.hasClass('cha-icon');
        if (toAuto) {
            $('.yaoBao-hint').hide();
        } else {
            $.changePage('yaobao/yaoBaoAutoInto');
        }
    },
    yaobaoProfit: function () {
        $.changePage('yaobao/' + this.pid + '/profit');
    },
    dollarTabFn: function (e) {
        var obj = $(e.currentTarget), id = obj.attr('data-id');
        if (obj.hasClass('active')) return false;
        obj.addClass('active').siblings().removeClass('active');
        switch (id) {
            case '1':
                this.dollarTabSeven();
                break;
            case '2':
                this.dollarTabProfit();
        }
    },

    dollarSummary: function () {
        location.href = '#staticPage/yaoPro';
    },

    dollarAuto: function () {
        $.changePage('yaobao/yaoBaoAutoInto');
        // location.href = window.location.origin + '/weizhan/pages/product/yaoBaoAutoInto';
    },

    dollarTabSeven: function () {
        var self = this;
        var data = self.dollarCacheData();
        var sevenRate = data.sevenRate;
        var sevenDate = data.sevenDate;
        $('.dollar-chart').highcharts({
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                gridLineWidth: 1,
                lineColor: '#D9D9D9',
                tickColor: '#FFFFFF',
                // categories: sevenDate,
                gridLineColor: '#F2F2F2',
                labels: {
                    style: {
                        'color': '#999999',
                        'font-family': '"PingFang SC"'
                    },
                    formatter: function () {
                        return sevenDate[this.value];
                    }
                },
                tickPixelInterval: 45,
                endOnTick: false,
                maxPadding: 0.10
            },
            yAxis: {
                title: {
                    text: ''
                },
                min: 0,
                max: 8,
                tickPositions: [1, 2, 3, 4, 5, 6, 7],
                startOnTick: false,
                endOnTick: false,
                maxPadding: 0.01,
                gridLineColor: '#F2F2F2',
                lineColor: '#D9D9D9',
                labels: {
                    style: {
                        'color': '#999999',
                        'font-family': '"PingFang SC"'
                    },
                    x: -3,
                    format: '{value}%'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                enabled: false,
                backgroundColor: '#ff6938',
                style: {
                    color: '#fff'
                },
                pointFormat: '{point.y}'
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.Color('#ff6938').setOpacity(0.5).get('rgba')],
                            [1, Highcharts.Color('#fff').setOpacity(0.2).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    enableMouseTracking: false,
                    color: '#ff6938',
                    lineWidth: 2,
                    lineColor: '#ff6938',
                    threshold: false,
                    events: {
                        afterAnimate: function () {
                            var point = this.chart.series[0].points[6];
                            this.chart.renderer.label(Highcharts.numberFormat(sevenRate[6], 2) + "%", point.plotX + 15, point.plotY - 20, 'callout', point.plotX + this.chart.plotLeft, point.plotY + this.chart.plotTop)
                                .css({
                                    color: '#FFFFFF',
                                    fontSize: '10px'
                                })
                                .attr({
                                    fill: '#FF6046',
                                    padding: 3,
                                    r: 5,
                                    zIndex: 6
                                })
                                .add();
                        }
                    }
                }
            },
            series: [{
                type: 'area',
                name: '7日年化：',
                data: sevenRate
            }],
            credits: {
                enabled: false
            }
        });
    },

    dollarTabProfit: function () {
        var self = this;
        var data = self.dollarCacheData();
        var millionProfitArray = data.millionRate;
        var sevenDate = data.millionDate;
        $('.dollar-chart').highcharts({
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                gridLineWidth: 1,
                lineColor: '#D9D9D9',
                tickColor: '#FFFFFF',
                gridLineColor: '#F2F2F2',
                labels: {
                    style: {
                        'color': '#999999',
                        'font-family': '"PingFang SC"'
                    },
                    formatter: function () {
                        return sevenDate[this.value];
                    }
                },
                tickPixelInterval: 45,
                endOnTick: false,
                maxPadding: 0.10
            },
            yAxis: {
                title: {
                    text: ''
                },
                min: 0,
                max: 2.5,
                tickPositions: [1, 2],
                startOnTick: false,
                endOnTick: false,
                maxPadding: 0.02,
                gridLineColor: '#F2F2F2',
                lineColor: '#D9D9D9',
                //  lineWidth: '1',
                labels: {
                    style: {
                        'color': '#999999',
                        'font-family': '"PingFang SC"'
                    },
                    x: -3,
                    format: '{value}'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                enabled: false,
                backgroundColor: '#ff6938',
                style: {
                    color: '#fff'
                },
                pointFormat: '{point.y}'
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.Color('#ff6938').setOpacity(0.5).get('rgba')],
                            [1, Highcharts.Color('#fff').setOpacity(0.2).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    color: '#ff6938',
                    lineWidth: 2,
                    lineColor: '#ff6938',
                    threshold: false,
                    enableMouseTracking: false,
                    events: {
                        afterAnimate: function () {
                            var point = this.chart.series[0].points[6];
                            this.chart.renderer.label(Highcharts.numberFormat(millionProfitArray[6], 2), point.plotX + this.chart.plotLeft - 14, point.plotY + this.chart.plotTop - 30, 'callout', point.plotX + this.chart.plotLeft, point.plotY + this.chart.plotTop)
                                .css({
                                    color: '#FFFFFF',
                                    fontSize: '10px'
                                })
                                .attr({
                                    fill: '#FF6046',
                                    padding: 4,
                                    r: 6,
                                    zIndex: 6
                                })
                                .add();
                        }
                    }
                }
            },
            series: [{
                type: 'area',
                name: '万元收益：',
                data: millionProfitArray
            }],
            credits: {
                enabled: false
            }
        });
    },

    yaoBaoOut: function () {
        var self = this,
            id = this.pid,
            tel = $.getNub();
        $.checkUser(function () {
            $.sync({
                url: fresh.apiRoot + 'member/queryUserFlowStatus',
                type: 'post',
                data: {phoneNum: tel},
                success: function (d) {
                    if (d.realNameVerifyFlag == '0') {
                        self._popWindow('您还未实名认证，请先去实名认证', '立即认证', 'payment/userAuthentication')
                    } else if (d.bindCardFlag == '0') {
                        self._popWindow('您还未绑定银行卡，请先去绑定银行卡', '立即绑定', 'payment/userTiedCard')
                    } else if (d.setTradePwdFlag == '0') {
                        self._popWindow('您还未设置交易密码', '请先去设置交易密码', 'payment/userSetPayPass')
                    } else {
                        $.changePage('yaobao/' + id + '/rollout');
                    }
                }, error: function (d) {
                    $.toast(d.msg)
                }
            });
        });
    },

    yaoBaoInto: function () {
        var self = this,
            id = this.pid,
            tel = $.getNub();
        $.checkUser(function () {
            $.sync({
                url: fresh.apiRoot + 'member/queryUserFlowStatus',
                type: 'post',
                data: {phoneNum: tel},
                success: function (d) {
                    if (d.realNameVerifyFlag == '0') {
                        self._popWindow('您还未实名认证，请先去实名认证', '立即认证', 'payment/userAuthentication')
                    } else if (d.bindCardFlag == '0') {
                        self._popWindow('您还未绑定银行卡，请先去绑定银行卡', '立即绑定', 'payment/userTiedCard')
                    } else if (d.setTradePwdFlag == '0') {
                        self._popWindow('您还未设置交易密码', '请先去设置交易密码', 'payment/userSetPayPass')
                    } else {
                        $.changePage('yaobao/' + id + '/rollin');
                    }
                }, error: function (d) {
                    $.toast(d.msg)
                }
            });
        });
    },
    _popWindow: function (content, yes, url) {
        $.popWindow({
            content: content,
            type: 2,
            yes: yes,
            no: '取消',
            callback: function (bl) {
                if (bl) {
                    $.changePage(url)
                }
            }
        });
    }
});