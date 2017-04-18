define(function(require, exports, module) {
	var pagelist = require('../mod/pagelist');
   
    pagelist.fun({ 
        url: 'api/v1/collectArticles',
        data:{page: 1, page_size: 20}
    },function(){
        var w_ = $('.view_3 .imgbox').width() * .3;
        $('.view_3 .imgbox').height(w_*148/226);
        console.log(w_)
    }, true);
    seajs.use('./scripts/plugs/confirmTip.js',function(confirmTip){
        $('#conList').on('click', '.del', function(e){
            e.preventDefault();
            e.stopPropagation();
            var that = $(this), id = that.data('id');
            new confirmTip({
                title: '<p style="padding: .2rem 0;">确定不再收藏这篇文章</p>'
            },function(a){
                if(a){
                    Ajax.custom({
                        url:'api/v1/collectArticles/delete/'+ id
                    },function(d){
                        if(d.status == 1000){
                            Tools.alertDialog({
                                text: "已取消收藏"
                            });
                            that.parent().remove();
                        }
                        if(d.status == 8006){
                            Tools.alertDialog({
                                text: "文章尚未被收藏"
                            })
                        }
                    });
                }
            });
        })
    });
})