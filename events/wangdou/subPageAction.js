/**
 * Created by lifeng on 2017/4/25 0025.
 */
function getParamsObj() {
    //解析url参数
    var ret={}
    var str=location.search.substring(1);
    if(str&&str.length>0){
        var itemArr=str.split('&');
        itemArr.forEach(function (item) {
            var pair=item.split('=')
            if(pair&&pair.length===2){
                ret[pair[0]]=pair[1]
            }
        })
    }
    return ret

}
$(function(){
    var params=getParamsObj();
    $('.btn').on('click',function(){
        if(params.product){
            jsb.toDetail(params.product)
        }else{
            jsb.toList()
        }
    });
});