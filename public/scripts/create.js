/*global $*/
$(document).ready(function () {
    var warpper = $("#option:last");
    var max_fill = 5;
    var x = 2;//number of option (default:2)
    $(".add_option").click(function(e){
        if(x < max_fill){
            x++;
            $(warpper).append('<input type="text" class="form-control" name="options['+(x-1)+'][name]" placeholder="Option '+x+'">');
        } else{
            alert("You reached the limits");
        }
    });
});
