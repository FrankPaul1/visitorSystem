/**
 * Created by frankubuntu on 15-4-6.
 */
module.exports = function() {
    return function () {
        var reg = /0/g;
        return {
            reverse: function(str){
                return str.split('').reverse().join('');
            },
            format: function (num, format) {
                var _len = format.match(reg).length;
                var _org = num + '';
                if (_org.length > _len){
                    _org = _org.substring(_org.length-_len);
                }
                _org = this.reverse(_org);
                //console.log(_org + ' -- ' + format);
                var _index = 0;
                var _result = this.reverse(format).replace(reg, function(){
                    //console.log(_index + ' === ' + _org + ' :: ' +  _org.substr(_index+1,1));
                    //console.log( _org.length + '##' + _index + '==');
                    return _org.length>_index?_org.substr(_index++,1):0;
                });
                //console.log('result : ' + _result);
                return this.reverse(_result);
            },
            isString: function(str){
                return (typeof str=='string') && str.constructor==String;
            },
            isArray: function(obj){
                return (typeof obj=='object') && obj.constructor==Array;
            },
            endWith: function(oriStr, str){
                var reg = new RegExp(str + '$');
                return reg.test(oriStr);
            }
        }
    }();
}