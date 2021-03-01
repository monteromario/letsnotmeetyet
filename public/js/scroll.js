function check_scroll() {
    if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
        $(".link-top").removeClass("d-none");
    } else {
        $(".link-top").addClass("d-none");
    }
}

window.onscroll = function() {check_scroll()};