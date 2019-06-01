var echarts = require("./echarts.min.bar.js");
module.exports =function line(list){
    // console.log(list);
    var textarra=[], curindexcache=list.length-1,defData=(getMostDataInList(list)/10).toFixed(2);
    var myChart = echarts.init(document.getElementById('line'));
    // 指定图表的配置项和数据
    var option = {
        color: ['#EEF3F9'],
        grid: {  
            left: '0',  
            right: '0',  
            top:'25',
            bottom: '30'
            // containLabel: true  
        }, 
        tooltip : {
            trigger: 'axis'
        },
        xAxis : [
        {
            type : 'category',
            axisLine: {
                lineStyle:{
                    color:"#FFB864"       
                }
            },
            axisTick:{
                alignWithLabel: true,
                // show:false,
                length:7
            },
            axisLabel:{  
                interval:0,
                textStyle:{
                    color:"#BEBEBE"
                },
                splitLine:{show:true}
            },
            splitNumber:7,
            data: function (){
                var list_x = [];
                for (var i = 0; i < list.length; i++) {
                    if(i==curindexcache){
                        var temp=setClickStatus($.dateFormat(list[i].grantTime*1000,'MM/dd')).Axis;
                        list_x.push(temp);
                    }else{
                        list_x.push($.dateFormat(list[i].grantTime*1000,'MM/dd'));
                    }
                    textarra.push($.dateFormat(list[i].grantTime*1000,'MM/dd').replace('/','-'));
                }
                // console.log(list_x);
                return list_x;
            }()
        }
        ],
        yAxis: [
        {
            type: 'value',
            min:0,
            // boundaryGap : false,
            axisLine: {show:false},
            axisTick:{show:false},
            axisLabel:{show:false},
            splitLine:{show:false}
        }
        ],
        series: [
        {
            type:'bar',
            name:'',
            animation:false,
            barWidth:'60%',
            label: {
                normal: {
                    show: true,
                    position: 'top',
                    textStyle:{
                        color:'#ffffff'
                    },
                    formatter: function(params){
                        // console.log(params)
                        return params.data.def;

                    }
                }
            },
            itemStyle:{
                emphasis :{
                    color:'#FEF0DB'
                }
            },
            data:function (){
                var list_temp=setDefaultData(list);
                var list_d = [];
                for (var i = 0; i < list_temp.length; i++) {
                    if(i==curindexcache){
                        var temp=setClickStatus(list_temp[i]).Data;
                        list_d.push(temp);
                    }else{
                        list_d.push(list_temp[i]); 
                    }
                }
                 // console.log(list_d);
                 return list_d;
             }()
         }
         ]
     };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    myChart.on('click', function (params) {
        if(params.dataIndex!=curindexcache){
          setCurrentDataStatus(params.dataIndex,curindexcache);  
      }

  });

    // 设置点击状态
    function setClickStatus(n){
        var Axis ={
            value:n,
            textStyle:{
                color:'#FFA233'
            }
        };
        var data={
            value:n.value||n.redPacketAmount,
            def:n.def,
            label:{
                normal:{
                    textStyle:{
                        color:'#FFA233'
                    }
                }   
            },
            itemStyle: {
                normal: {
                    color:'#FEF0DB'
                }
            }
        };
        return {
            Axis:Axis,
            Data:data
        }
    }

    function setCurrentDataStatus(idx,idxcache){
        if(idx!=idxcache){
            curindexcache=idx;
            var temp={
                xAxis:{
                    data:option.xAxis[0].data
                },
                series:{
                    data:option.series[0].data
                }
            };
            temp.series.data[idx]=setClickStatus(option.series[0].data[idx]).Data; 
            temp.xAxis.data[idx]=setClickStatus(option.xAxis[0].data[idx]).Axis;
            temp.series.data[idxcache]={
                value:option.series[0].data[idxcache].value,
                def:option.series[0].data[idxcache].def
            };
            temp.xAxis.data[idxcache]= option.xAxis[0].data[idxcache].value;
            myChart.setOption(temp); 
        }
    }
    function getMostDataInList(list){
        var tempred=0;
        if(list.length>0){
            _.each(list,function(n){
                if(n.redPacketAmount>0 &&(n.redPacketAmount>=+tempred) ){
                    tempred=n.redPacketAmount;
                }
            })
            return tempred;
        }
    }
    function setDefaultData(list){
        var temp_list=[];
        if(list.length>0||true){
            _.each(list,function(n){
                // if((typeof n)=='object'){
                //     n.value=n.val>defData?n.val:defData;
                //     n.def= n.val;
                //     temp_list.push(n);  
                // }else{
                //     temp_list.push({value:n>defData?n:defData,def:n}); 
                // }
                temp_list.push({value:(n.redPacketAmount>0 && n.redPacketAmount<defData)?defData:n.redPacketAmount,def:n.redPacketAmount}); 


            })
            // console.log(temp_list);
            return temp_list;
        }

    }
}