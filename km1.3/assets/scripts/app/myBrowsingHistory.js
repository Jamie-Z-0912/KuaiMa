define('app/myBrowsingHistory', function(require, exports, module) {
	var pagelist = require('../mod/pagelist');
    pagelist.fun({ 
        url: 'api/v1/readArticles',
        data:{page: 1, page_size: 20}
    },function(){
        var w_ = $('.view_3 .imgbox').width() * .3;
        $('.view_3 .imgbox').height(w_*74/113);
        $('.view_3 .imgbox').each(function(){
            var that = $(this);
            if(that.find('img').length<1){
                that.height(0)
            }
        })
    }, true);
    $('#conList').on('click', 'li', function(){
        var url = $(this).data('url'),
            id = $(this).data('id');
        window.location.href = 'kmb://recommend?url=' + url + '&id=' + id;
    })
})