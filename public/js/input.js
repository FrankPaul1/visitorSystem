/**
 * Created by frankubuntu on 15-4-6.
 */

(function($) {

    // set execute ajax as sync
    $.ajaxSetup({
        async: false
    });

    var loadUser = function(employeeNo, callback){
        if(employeeNo){
            $.get('/visitorSystem/user/'+employeeNo,function(user){
                //console.log(user);
                callback(user);
            });
        }
    };

    var manageMember = function(type, params){
        $('#add-'+type).on('click',function(){
            var $temp = params.temp.clone();
            for(key in params.inits){
                $(params.inits[key],$temp).val('');
            }
            params.wapper.append($temp.hide());
            $temp.slideDown();
            if(params.emit){
                params.wapper.trigger('member-add');
            }
        });

        params.wapper.delegate('.delete-member','click',function(e){
            //e.preventDefault();
            if($('.'+type+'-info').length>=2){
                if(confirm('即将删除本条记录，本操作不可逆，是否继续？')){
                    $(this).parents('.'+type+'-info').slideUp('normal',function(){
                        if(params.emit){
                            params.wapper.trigger('member-remove');
                        }
                        $(this).remove();
                    });
                }
            }else{
                alert('操作被拒绝，至少需要保留一条记录。');
            }

        });

    };

    var methods = {
        required: function(obj){
            if(obj){
                return true;
            }else{
                return false;
            }
        },
        empExists: function(obj){
            var exists = false;
            loadUser(obj, function(user){
                if(user){
                    exists = true;
                }
            });
            return exists;
        },
        checkDate: function(obj){
            if(moment().isAfter(obj)){
                return false;
            };
            return true;
        }
    }

    var validate = function(){
        var errorList = [];
        $('[validate]').each(function(){
            var _validateInfos = $(this).attr('validate').split('||');
            var _value = $(this).val();
            for(var i=0;i<_validateInfos.length;i++){
                var _func = _validateInfos[i].split(':')[0];
                if(methods[_func] && !methods[_func](_value)){
                    var _errInfo = _validateInfos[i].split(':')[1];
                    errorList.push(_errInfo);
                    break;
                }
            }
        });
        if(errorList && errorList.length>0){
            publishError(errorList);
            return false;
        }else{
            return true;
        }
    };

    var publishError = function(errorList){
        //var $errorInfoWapper = $('#error-info-wapper');
        var _html = '';
        for(key in errorList){
            _html += '<li>' + errorList[key] + '</li>';
        }
        $('#error-info').html('<ul>' + _html + '</ul>').slideDown();
    }

    $(document).ready(function(){
        var $lis = $('li:eq('+0+')',$('#navigation'));
        $lis.addClass('active');

        var $recpInfoWapper = $('.recp-info-wapper');
        var $recpInfoTemp = $('.recp-info:eq(0)');

        var $visitorInfoWapper = $('.visitor-info-wapper');
        var $visitorInfoTemp = $('.visitor-info:eq(0)');
        var $visitorCount = $('input[name="visitorCount"]');

        $recpInfoWapper.delegate('.recp-info','blur',function(e){
            var $employeeNo = $('input[name="recp.employeeNo"]',$(this));
            var $name = $('input[name="recp.name"]',$(this));
            $employeeNo.blur(function(){
                var _employeeNo = $employeeNo.val();
                loadUser(_employeeNo, function(user){
                    if(user){
                        $name.val(user.name);
                    }else{
                        alert('工号为 : ' + _employeeNo + ' 的员工不存在， 清确认!');
                        $employeeNo.val('');
                        $name.val('');
                        $employeeNo[0].focus();
                    }
                });
            });
        });

        manageMember('recp',{inits: ['input[name="recp.employeeNo"]','input[name="recp.name"]'], temp: $recpInfoTemp, wapper: $recpInfoWapper, emit: false});
        manageMember('visitor',{inits: ['input[name="visitor.name"]','select[name="visitor.sex"]'], temp: $visitorInfoTemp, wapper: $visitorInfoWapper, emit: true});

        $visitorInfoWapper.bind('member-add', function(){
            $visitorCount.val(+$visitorCount.val()+1);
        });
        $visitorInfoWapper.bind('member-remove', function(){
            $visitorCount.val(+$visitorCount.val()-1);
        });

        $('#submitVisitorCase').bind('click', function(e){
            if(!validate()){
                e.preventDefault();
            }else{
                $('form#visitor-case-form').submit();
            }
        });

        //$('.form_datetime').datetimepicker({format: 'yyyy-mm-dd hh:ii'});
        $('.form_datetime').datetimepicker({
            //language:  'fr',
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            forceParse: 0,
            showMeridian: 1,
            format: 'yyyy-mm-dd hh:ii'
        });
    });

})(jQuery);
