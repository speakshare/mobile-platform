require('./index.css');
var template = _.template(require('./index.html'));
module.exports = function () {
  var win = $(template());
  $('body').append(win);
  $('.ux-load-times').on('tap', function () {
    $('.ux-load-box, .ux-mask').hide();
  });
  $('.ux-load-main').on('tap', function () {
    window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.zb.yaowang';
  })

  $(window).on('popstate', function () {
    win.remove();
  })
}