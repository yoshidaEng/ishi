$(function () {
    //swiper
    //--------------------------------------------------
    let mySwiper = new Swiper('.swiper', {
        loop: true, //最後に達したら先頭に戻る
        effect: 'fade',
        autoplay: {
            delay: 3000,
            //ユーザー側操作でスライドを操作しても自動再生を継続させる
            disableOnInteraction: false,
        },
        speed: 2000,
        //マウスでのスライド操作を禁止させる
        allowTouchMove: false,
    });

    //hamburger menu
    //--------------------------------------------------
    //ハンバーガーボタンを $triggerに格納
    const $trigger = $('#hamburger');

    //SPメニュー $navに格納
    const $nav = $('#spmenu');
    //ヘッダーのブレイクポイントを point_headerに格納
    const point_header = window.matchMedia('screen and (min-width: 576px)');

    //ハンバーガーメニューボタンがクリックされた時
    $trigger.on('click', function () {
    const expanded = $(this).attr('aria-expanded');
    if (expanded === 'false') {
        openMenu();
    } else {
        closeMenu();
    }
    });

    function openMenu() { //メニューを開く操作
        $trigger.attr('aria-expanded', true).attr('aria-label', 'メニューを閉じる');
        $nav.attr('aria-hidden', false).fadeIn();
    }
    function closeMenu() { //メニューを閉じる操作
        $trigger.attr('aria-expanded', false).attr('aria-label', 'メニューを開く');
        $nav.attr('aria-hidden', true).fadeOut();
    }

  // //ブレイクポイントをまたいだときの挙動
    function checkBreakPoint() {
        if (point_header.matches) {
        closeMenu(); //ハンバーガーメニューをリセット
        }
    }
    point_header.addListener(checkBreakPoint);
});


