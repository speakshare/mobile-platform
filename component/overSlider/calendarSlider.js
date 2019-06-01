module.exports = function (callback) {
    var slideObj = $(this),
        $child = $(this).children(),
        slideWidth = $child.outerWidth(true),
        countPage = $child.length,
        slideCurPage = 1,
        returnObj,
        timeout;
    $child.css('width', $child.outerWidth(true));

    var turnPage = function (dx) {

        if(dx>20 && slideCurPage-1==0 || dx<-20 && slideCurPage+1 > countPage){
            return;
        }


        if (dx > 20) {
            slideCurPage -= 1;
        } else if (dx < -20) {
            slideCurPage += 1;
        }

        if (dx > 20 || dx< -20) {
            slideObj.translate3d(-(slideCurPage - 1) * slideWidth);
            callback(slideCurPage);
        }
        //console.log(slideCurPage, countPage, dx);
    };

    returnObj = slideObj.overSlide({move: false, tap: true}, function (dx) {
        turnPage(dx);
    });

    return {
        next: function () {
            turnPage(-21);
        },
        prev: function () {
            turnPage(21);
        },
        go:function(page,bl){
            slideCurPage=page;
            slideObj.translate3d(-(page - 1) * slideWidth);
            if(bl) callback(page);
        }
    };
}