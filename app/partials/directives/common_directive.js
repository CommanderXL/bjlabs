/**
 * Created by XRene on 2015/10/19.
 */
app.directive('baseDroplist', function ( ) {
    return {
        restrict: 'EA',
        link: function (scope, ele) {
            $(ele).on('click', function (e) {

                var obj = $(this).find('.dropdown-menu');
                if(obj.css('display') === 'block'){
                    obj.hide();
                    return;
                }

                $('.dropdown-menu').hide();
                obj.show();

                e.stopPropagation();
            }).on('click', 'input', function (e) {
                e.stopPropagation();
            });

            $(window).on('click', function () {
                $('.dropdown-menu').hide();
            })
        }
    }
})