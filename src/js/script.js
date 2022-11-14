$(function () {
    //AOS
    //--------------------------------------------------
    AOS.init({
        offset: 100,
        duration: 3000
    })

    //ナビボタン
    //--------------------------------------------------
    const $trigger = $('.navbtn');
    const $nav = $('.spmenu');
    // //ヘッダーのブレイクポイントを point_headerに格納
    const point_header = window.matchMedia('screen and (min-width: 576px)');
    $trigger.on('click', function () {
        $('html').toggleClass('open');
        const expanded = $(this).attr('aria-expanded');
        if (expanded === 'false') {
            openMenu();
        } else {
            closeMenu();
        }
    });
    function openMenu() {
        $trigger.attr('aria-expanded', true);
        $nav.attr('aria-hidden', false);
    }
    function closeMenu() {
        $trigger.attr('aria-expanded', false);
        $nav.attr('aria-hidden', true);
    }

    //flatpickr
    //--------------------------------------------------
    const config = {
        // locale: 'ja',
        position: 'above',
        mode: 'multiple',
        dateFormat: 'Y-m-d',
        minDate: 'today',
    }
    flatpickr("#calendar", config);

    // モーダル設定
    //--------------------------------------------
    MicroModal.init({
        disableScroll: true,
        awaitOpenAnimation: true,
        awaitCloseAnimation: true
    });

});



