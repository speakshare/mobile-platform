require('./download.css');
var template = _.template(require('./download.html'));
module.exports = function () {
  var win = $(template());
  if(!sessionStorage.getItem('app') && sessionStorage.getItem('app')!='1'){
      $('body').append(win);
  }
  setTimeout(function(){
      $('.ux-fixed-box').css({'display':'block'});
  },1000)
  $('.ux-shutdown').on('tap', function () {
    $('.ux-fixed-box').hide();
    sessionStorage.setItem('app','1');
  });
  $('.btn-download').on('tap', function () {
    window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.zb.yaowang';
  })

  $(window).on('popstate', function () {
    win.remove();
  })
}