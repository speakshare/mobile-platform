var template = _.template(require('./securityGuarantee.html'));
require('./securityGuarantee.css')

module.exports = Backbone.View.extend({
    initialize: function () {
        // this.cache = {investmentAmount: options.investmentAmount, registration: options.registration}
        this.getData();
    },
    getData: function () {
        var self = this;
            $.batSync({
                data: [
                    {url: fresh.apiRoot + 'avenueofstars/sysdateQuery'},
                    {url: fresh.apiRoot + 'platformData/queryPlatformData'}
                ],
                success: function (d) {
                    self.cache = d[1];
                    self.cache.sysDate=d[0].sysdate
                    self.render();
                }, error: function (d) {
                    $.toast("数据异常")
                }
            })

    },
    render: function () {
        $.setAppNav('安全保障')
        this.$el.html(template(this.cache));
        new Swiper('.swiper-container-banner', {loop: false, pagination: '.swiper-pagination-banner'});
        return this;
    }
});