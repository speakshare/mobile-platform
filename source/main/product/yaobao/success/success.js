var template = _.template(require('./success.html'));
require('./success.css');
// require('../../../component/dateFormat');

module.exports = Backbone.View.extend({

  initialize: function (options) {
    this.pid=options.pid;
    this.amount=options.amount;
    this.date = options.date;
    this.getData();
  },

  getData: function () {
    var self = this;
    self.cache={
      profitDate: self.date,
      rollinAmount: self.amount,
      rollinTime: new Date()
    }
    self.render();
  },

  render: function () {
    this.$el.html(template(this.cache));
    $.setAppNav('结果');
      $.fixDownloadApp();
    return this;
  },
  events: {
    'tap .detail-banner': 'goInviteFriends',
    'tap .form-btn': 'goYaoBaoHome'
  },
  goInviteFriends:function(){
      $.changePage('#uc/invite');
  },
  goYaoBaoHome:function(){
    var self = this;
    $.changePage('yaobao/' + self.pid);
  }
});