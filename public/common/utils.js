/**
 * Created by frankubuntu on 15-4-12.
 */
(function(exports){
    var roleTypeList = {
        'ROLE_ADMIN': '管理员',
        'ROLE_REC': '前台',
        'ROLE_GUARD': '警卫',
        '管理员': 'ROLE_ADMIN',
        '前台': 'ROLE_REC',
        '警卫': 'ROLE_GUARD'
    }
    exports.utils = {
        transforRoleType: function(roleType){
            return roleTypeList[roleType];
        }
    };
})(window);

