/**
 * Created by frankubuntu on 15-5-3.
 */
(function($){
// set execute ajax as sync
    $.ajaxSetup({
        async: true
    });

    STATUS = {
        0: '未接待',
        1: '警卫已接待',
        2: '已接待'
    };

    $(document).ready(function(){
        var $lis = $('li:eq('+2+')',$('#navigation'));
        $lis.addClass('active');

        var $visitorListWapper = $('#visitorList');

        $visitorListWapper.delegate('.status','click',function(e){
            e.preventDefault();
            var $_this = $(this);
            var $parent = $_this.parents('.visitor-item');
            var _id = $('input[name="visitorCase._id"]',$parent).val();
            $.ajax({
                url: '/visitorSystem/visitorCase/changeStatus',
                data: {'visitorCase._id': _id},
                type: 'PUT',
                success: function(result){
                    if(result.success){
                        $_this.text(STATUS[result.status]);
                        if(result.status==2){
                            $parent.addClass('recpted');
                        }
                        //$_this.attr('data', {status: result.status});
                    }
                }
            });
        });
    });
})(jQuery);
