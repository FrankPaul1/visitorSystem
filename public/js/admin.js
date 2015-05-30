/**
 * Created by frankubuntu on 15-4-6.
 */

// set execute ajax as sync
$.ajaxSetup({
    async: false
});

(function($) {
    // Role Model
    var Role = Backbone.Model.extend({
        urlRoot: '/visitorSystem/admin/role',
        idAttribute: '_id',
        defaults: function(){
            return {
                empty: false
            };
        },
        validate: function(attrs, options){
            var _this = this;
            var _err = [];
            console.log(' validate start! ');
            if(attrs && attrs.success) {
                console.log(' save success! ' + JSON.stringify(attrs));
                _this.set({_id: attrs._id,emp :{employeeNo: attrs.emp.employeeNo, name: attrs.emp.name}});
            }else{
                if(attrs.emp.employeeNo && attrs.roleType){
                    // check if employeeNo exists
                    $.get('/visitorSystem/user/' + attrs.emp.employeeNo, function(user){
                        if(user){
                            //console.log(' load user : ' + JSON.stringify(user));
                            _this.set({emp :{employeeNo: attrs.emp.employeeNo, name: user.name}});
                            // validate if has the same role for the user
                            $.get('/visitorSystem/admin/rolesByEmployeeNo/' + user.employeeNo, function(roles){
                                if(roles && roles.length>0){
                                    for(var i=0; i<roles.length; i++){
                                        if(roles[i].roleType == attrs.roleType){
                                            console.log(' role repeat !! ');
                                            _err.push('该员工已经设置该角色，不能重复添加！');
                                            break;
                                        }
                                    }
                                }
                            });
                        }else{
                            _err.push('填写的工号不存在，请确认！');
                        }
                    });
                }else{
                    _err.push('参数未填写完整，请确认！');
                }
                if(_err && _err.length>0){
                    return _err;
                }
            }

        }
    });

    var RoleList = Backbone.Collection.extend({
        url: '/visitorSystem/admin/roles',
        model: Role,
        isInsert: false,
        getInsert: function(){
            return this.isInsert;
        },
        setInsert: function(isInsert){
            this.isInsert = isInsert;
        }
    });

    var roles = new RoleList;

    var RoleView = Backbone.View.extend({
        tagName: 'tr',
        initialize: function(){
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'invalid', this.logErr);
        },
        template: {
            empty: _.template($('#item-empty').html()),
            role: _.template($('#item-role').html())
        },
        events: {
            'click .saveRole': 'add',
            'click .delete': 'destroy'
        },
        render: function(){
            //console.log(this.model.get('empty'));
            if(this.model.get('empty')){
                this.$el.html(this.template.empty(this.model.toJSON()));
            }else{
                this.$el.html(this.template.role(this.model.toJSON()));
            }
            return this;
        },
        logErr: function(model, err){
            alert(JSON.stringify(err));
        },
        add: function(){
            //roles.setInsert(false);
            var _employeeNo = this.$('input[name="emp.employeeNo"]').val();
            var _roleType = this.$('select[name="roleType"]').val();
            var _update = this.$('input[name="updateBy.employeeNo"]').val();
            console.log(' add new role start! ');
            this.model.save({
                emp: {employeeNo: _employeeNo},
                roleType: _roleType,
                updateBy: {employeeNo: _update},
                empty: false,
                meta: {
                    updateAt: new Date()
                }
            }, {
                validate: true,
                success: function(err, model){
                    roles.setInsert(false);
                }
            });

        },
        destroy: function(){
            if(!this.model.get('empty') && !confirm('即将删除此角色，此操作不可逆，是否继续？')){
                return;
            }
            if(this.model.get('empty')){
                roles.setInsert(false);
            }
            this.model.destroy();
        }

    });

    var AppView = Backbone.View.extend({
        el: '#roles',
        initialize: function(){
            this.listenTo(roles, 'add', this.addOne);
            this.listenTo(roles, 'all', this.render);
            roles.fetch();
        },
        render: function(){
            //console.log('render function going ' + roles.getInsert());
            this.setButton();
        },
        events: {
            'click #addNewRole': 'addNew'
        },
        addNew: function(){
            roles.setInsert(true);
            roles.push({empty: true, now: moment().format('YYYY-MM-DD HH:mm')});
        },
        addOne: function(role){
            //console.log(JSON.stringify(role));
            var view = new RoleView({model: role});
            this.$('#roleList').append(view.render().el);
        },
        setButton: function(){
            //console.log('reset button trigger ' + roles.getInsert());
            if(roles.getInsert()){
                this.$('#addNewRole').attr('disabled', 'disabled');
            }else{
                this.$('#addNewRole').removeAttr('disabled');

            }
        }
    });

    
    $(document).ready(function(){
        var $lis = $('li:eq('+3+')',$('#navigation'));
        $lis.addClass('active');

        var appView = new AppView;
    });

})(jQuery);
