define('app/myCard', function(require, exports, module) {
    var Ajax = require('../mod/base');
    require('../plugs/swiper-2.7.min.js');
    Ajax.custom({
        url:'api/v1/cards/my'
    }, function(d){
        var endDate = d.data.endDate, startDate = d.data.startDate;
        endDate !=0 && (d.data.endDate = endDate.replace(/-/g,'/'));
        startDate !=0 && (d.data.startDate = startDate.replace(/-/g,'/'));
        Ajax.render('#myCard', '#myCard-tmpl', d.data, undefined, true);
    });
    Ajax.custom({
        url:'api/v1/cards'
    }, function(d){
        Ajax.render('#cards', '#cards-tmpl', d, undefined, true);

        new Swiper('#cardsWrap',{
            freeMode : true,
            loop : false,
            slidesPerView : 'auto'
        });
    })
});