/**
 * Created by chenguodong on 2017/4/6.
 */
module.exports = {
    routes:{
        'member/home/*':                            'memberHome'
    },
    methods:{
        memberHome:function(){
            var memberHome = require('../member/home');
            new memberHome({el: fresh.$content});
        }
    }
};