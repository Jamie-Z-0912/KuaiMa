define(function(require,exports,module){
    var util = {}, version;
	var userAgent = navigator.userAgent;
 //    var u_test = [
 //    	'Mozilla/5.0 (Linux; Android 6.0.1; MI 4LTE Build/MMB29M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/46.0.2490.76 Mobile Safari/537.36 ssy={Android;KuaiMaBrowser;V1.2.1;360;;MOBILE}',
	// 	'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92  ssy={iOS;KuaiMaBrowser;V1.1.2;AppStore;101010300;;libertyad;ebrowser;}',
	// 	'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92  ssy={KuaiMaBrowser;V1.2.0;AppStore;101010300;;libertyad;ebrowser;}',
 //        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92  ssy={KuaiMaBrowser;V1.1.1;AppStore;101010300;;libertyad;ebrowser;}',
	// 	'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C92  ssy={KuaiMaBrowser;V1.0.0;AppStore;101010300;;libertyad;ebrowser;}'
 //    ]
	// var userAgent = u_test[1];

	util.isKM = /KuaiMa/.test(userAgent);
    if(util.isKM){
    	var _ssy = userAgent.split('ssy=')[1];
        if(/iOS|Android/.test(_ssy.split(';')[0])){
            version = _ssy.split(';')[2]
        }else{
            version = _ssy.split(';')[1]
        }
        util.version = version.replace('V','');
    }
    util.equal = function(v){
        if(util.isKM){
        	if(v == this.version){
        		return true;
        	}else{
        		return false;
        	}
        }else 
            return false;
    }
    util.greater = function(v){
        if(util.isKM){
        	var cur = this.version.split('.'), 
        		v_arr  = v.split('.'), flag = false;
        	for (var i = 0; i < cur.length; i++) {
        		if(cur[i] < v_arr[i]){
        			break;
        		}else{
    	    		if(cur[i] > v_arr[i]){
    	    			flag = true;
    	    		}
        		}
        	}
        	return flag;
        }else 
            return false;
    }
    util.less = function(v){
        if(util.isKM){
        	var cur = this.version.split('.'),
        		v_arr  = v.split('.'), flag = false;
        	for (var i = 0; i < cur.length; i++) {
        		if(cur[i] > v_arr[i]){
        			break;
        		}else{
    	    		if(cur[i] < v_arr[i]){
    	    			flag = true;
    	    		}
        		}
        	}
        	return flag;
        }else 
            return false;
    }
    util.gEq = function(v){
    	if(this.equal(v) || this.greater(v)) return true;
    	else return false;
    }
    util.lEq = function(v){
    	if(this.equal(v) || this.less(v)) return true;
    	else return false;
    }
    module.exports = util;
});