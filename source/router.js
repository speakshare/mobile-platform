var oldRouter;

function loadLayer() {
    fresh.$content.off().html('<div class="loading"><div class="loading-icon"></div></div>');
}

var routes = {
    '':                          'home',
    'home/*':                    'home',

    'channel':                   'channelPage',

    'app/download/*':            'appDownload',
    'app/download/:flag/*':      'appDownload',
    'staticPage/securityGuarantee/:investmentAmount/:registration':'showSecurityGuarantee',
    'staticPage/securityGuarantee':'showSecurityGuarantee',
    'staticPage/:vid/*':         'staticPage',

    'platformData/*':            'AboutPlatformData',
    'about/platformData/*':      'AboutPlatformData',

    'login/*':                   'login',
    'forget/*':                  'forgetPassword',
    'register/*':                'register',

    'newhand/*':                 'newhand',
    'newshake/*':                'newshake'

}

var ucRoutes=require('./router/uc-routes'),
    mallRoutes=require('./router/mall-routes'),
    fundRoutes=require('./router/fund-routes'),
    productRoutes=require('./router/product-routes'),
    ucManageRoutes=require('./router/uc-manage-routes'),
    payRoutes=require('./router/pay-routes'),
    memberRoutes=require('./router/member-routes');

var mascot=require('./main/mascot')
routes = $.extend(routes,
    ucRoutes.routes,
    mallRoutes.routes,
    fundRoutes.routes,
    productRoutes.routes,
    ucManageRoutes.routes,
    payRoutes.routes,
    memberRoutes.routes
);

var router = {
    //after Route
    initialize: function (curRouter) {
        var self = this;
        self.bind('route', function (curRouter) {
            mascot.find(curRouter);
            //setTimeout(function(){
            //    self.fadeOut();
            //},400000);
        });
    },
    //before route
    _beforeRoute: function (curRouter) {
        var pageHideRoutes = {
            mall: '2.1.6',
            mallRedExchange: '2.7.7',
            productDetail: '2.7.8',
            mallPhonefeeExchange: '2.7.9'
        };

        if (pageHideRoutes[oldRouter]) {
            window.customEvent(3, pageHideRoutes[oldRouter], '');
        }


        $.setLoginTokenFormApp();
        fresh.loadData && fresh.loadData.destory();
        loadLayer();
        oldRouter = curRouter;
        var showFooter = {'home': 1, 'productList': 2, 'mall': 3, 'ucHome': 4,};
        if (showFooter[curRouter]) {
            fresh.$footer.off().show();
            var footer = require('./../source/common/footerNav/footerNav');
            new footer({el: fresh.$footer, index: showFooter[curRouter]});
        } else {
            fresh.$footer.hide();
        }
    },
    routes: routes,
    home: function () {
        var Home = require('./main/home/home');
        new Home({el: fresh.$content});
    },
    appDownload: function (flag) {
        if (!flag) {
            //微信bug
            window.location = '#app/download/1';
            location.reload();
            return false;
        }
        var Home = require('./main/download/download');
        new Home({el: fresh.$content});
    },

    channelPage: function () {
        var channelPage = require('./channel/channel');
        new channelPage({el: fresh.$content});

    },

    login: function () {
        var login = require('./passport/login/login');
        login();
        // new login({el:fresh.$content})
    },
    register: function () {
        var register = require('./passport/register/register');
        new register()
    },
    forgetPassword: function () {
        var forgetPassword = require('./passport/forget/forget');
        new forgetPassword()
    },

    // checkIns: function () {
    //     var checkIns = require('./main/checkIns/checkIns');
    //     new checkIns({el: fresh.$content});
    // },
    showSecurityGuarantee:function (investmentAmount,registration) {
        var securityGuarantee=require('./staticPage/securityGuarantee/securityGuarantee');
        new securityGuarantee({el: fresh.$content, investmentAmount: investmentAmount,registration:registration});
    },
    staticPage: function (vid) {
        require.ensure([],function(){
            var signHint = require('./staticPage/staticPage');
            new signHint({el: fresh.$content, vid: vid});
        },'static');
    },

    newhand: function () {
        require.ensure([],function(){
            var NewHand = require('./main/newhand/newhand');
            new NewHand({el: fresh.$content});
        },'static');
    },
    newshake: function () {
        var NewShake = require('./main/newshake/newshake');
        new NewShake({el: fresh.$content});
    },

    AboutPlatformData: function () {
        require.ensure([],function(){
            var platformData = require('./about/platformData/platformData');
            new platformData({el: fresh.$content});
        },'static');
    }
}

router = $.extend(router,
    ucRoutes.methods,
    mallRoutes.methods,
    fundRoutes.methods,
    productRoutes.methods,
    ucManageRoutes.methods,
    payRoutes.methods,
    memberRoutes.methods
);

module.exports = Backbone.Router.extend(router);