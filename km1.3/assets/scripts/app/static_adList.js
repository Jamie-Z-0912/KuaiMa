define('app/static_adList', function(require, exports, module) {
    var Ajax = require('../mod/base');
    $.ajax({
        url: 'adlist.json?t='+ new Date().getTime(),
        type: 'GET',
        success: function(data){
            var d = typeof data == 'object' ? data : JSON.parse(data);
            Ajax.render('#conList', '#conList-tmpl',d, undefined, false);
            var w_ = $('.view_3 .imgbox').width() * .3;
            $('.view_3 .imgbox').height(w_*74/113);
        }
    })
    $('#conList').on('click', 'li', function(){
        var url = $(this).data('url');
        window.location.href = url;
    })
})