var oo = function(a_id, auth, idx, seconds){
    var _this = this;
    this.open = false;
    this.listH = false;
    this.isTime = false;
    this.hasRecord = false;
    this.idx = idx;
    this.rid = $('#rec_'+idx).data('id');
    this._ajax = function(){
        if(_this.open && _this.listH && _this.isTime && !_this.hasRecord){
            _this.hasRecord = true;
            Ajax.custom({
                url: config.view,
                data: {
                    articleId: a_id,
                    rid: _this.rid,
                    auth_token: auth
                }
            }, function(data){
                if(data.status == 1000){
                    if(data.data.coin_num!=0){
                        alertDialog({
                            text: '获得'+ data.data.coin_num +'金币',
                            img:'img/coin.png',
                            time: 1500
                        });
                    }
                    _this.hasRecord = true;
                    var iframe = document.createElement('iframe');
                    iframe.src = 'kmb://refreshgold';
                    iframe.style.display = 'none';
                    $('body').append(iframe);
                    $(iframe).remove();
                }else _this.hasRecord = false;
            });
        }
    };
    /****计时****/
    setTimeout(function(){
        _this.isTime = true;_this._ajax();
    }, seconds*1000);
    /****距离****/
    $(window).scroll(function(){
        var elTop = $('#rec_'+_this.idx).offset().top - innerHeight;
        var scrollt = document.documentElement.scrollTop || document.body.scrollTop;
        if(elTop < scrollt){
            _this.listH = true;_this._ajax();
        }
    });
    /****开始****/
    if(/v.html/.test(window.location)){
        $('#videoplayer')[0].addEventListener("play", function(){
            _this.open = true;_this._ajax();
        });
    }else{
        $('#unfold').on('click', function(){
            _this.open = true;_this._ajax();
        });
    }
};window.validread = oo;