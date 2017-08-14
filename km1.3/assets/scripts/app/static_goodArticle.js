define('app/static_goodArticle', function(require, exports, module) {
    var Ajax = require('../mod/base');
    var show = Tools.getQueryValue('type');
    function loadData(type){
        Ajax.custom({ 
            url: 'api/v1/post/topList',
            renderEle: '#conList_read',
            data:{type:type}
        },function(d){
            var w_ = $('.view_3 .imgbox').width() * .3;
            if(type==1){
                Ajax.render('#conList_read', '#conList-tmpl', d, undefined, true);
            }
            if(type==2){
                Ajax.render('#conList_comment', '#conList-tmpl', d, undefined, true);
            }
            $('.view_3 .imgbox').height(w_*74/113);
        });
    }
    if(show == 'comment'){
        $('#conList_read').hide();
        loadData(2);
        setTimeout(function(){ 
            loadData(1);
            $('#comment').parent().addClass('second').show();
        },300);
    }else{
        $('#conList_comment').hide();
        loadData(1);
        setTimeout(function(){ 
            loadData(2);
            $('#read').parent().show();
        },300);
    }
    $('#read').on('click', function(){
        $(this).parent().removeClass('second');
        $('#conList_read').show();
        $('#conList_comment').hide();
    })
    $('#comment').on('click', function(){
        $(this).parent().addClass('second');
        $('#conList_comment').show();
        $('#conList_read').hide();
    })
    $('#conList_read,#conList_comment').on('click', '.item', function(){
        var id = $(this).data('id'), type= $(this).data('type');
        console.log(type);
        if(type=='post'){
            window.location = 'kmb://worthreading?id='+id;
        }
        if(type=='photo'){
            window.location = 'kmb://worthreadingimg?id='+id;
        }
    })
})