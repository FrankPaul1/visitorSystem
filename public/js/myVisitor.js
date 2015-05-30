/**
 * Created by frankubuntu on 15-4-6.
 */

(function($) {

    // set execute ajax as sync
    $.ajaxSetup({
        async: true
    });

    $(document).ready(function(){
        var $lis = $('li:eq('+1+')',$('#navigation'));
        $lis.addClass('active');

        var $visitorListWapper = $('#visitorList');

        $visitorListWapper.delegate('.remove','click',function(e){
            e.preventDefault();
            var $parent = $(this).parents('.visitor-item');
            var _id = $('input[name="visitorCase._id"]',$parent).val();
            $.ajax({
                url: '/visitorSystem/visitorCase',
                data: {'visitorCase._id': _id},
                type: 'DELETE',
                success: function(result){
                    if(result.success){
                        $parent.remove();
                    }
                }
            });
        });
    });

})(jQuery);
