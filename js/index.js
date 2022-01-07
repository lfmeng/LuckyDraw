!(function () {
        'use strict';

        var file_num = 23;
        var photo_row = 4;
        var photo_col = 10;
        var photo_num = photo_row * photo_col;
        var gallery = $('#gallery');
        var checkList = $('#selectedList');
        var photos = [];
        var selectedList = [];
        var photoList = getPhotos()
        var numList = getNumList()

        for (var i = 1; i <= photo_num; i++) {
            photos.push('photo/' + Math.ceil(Math.random() * file_num) + '.jpg');
        }

        var loadedIndex = 1;
        $.each(photos, function (index, photo) {
            var img = document.createElement('img');
            var link = document.createElement('a');
            var li = document.createElement('li');

            link.href = 'javascript:;';
            link.appendChild(img);
            li.appendChild(link);

            gallery[0].appendChild(li);

            img.onload = function (e) {
                img.onload = null;
                setTimeout(function () {
                    $(li).addClass('loaded');
                }, 10 * loadedIndex++);
            };

            img.src = photo;

            /* 此方式会将重复图片连在一起输出
            var img = document.createElement('img');

            img.onload = function(e){
                img.onload = null;
                var link = document.createElement('a');
                var li = document.createElement('li');

                link.href = '#';
                link.appendChild(this);
                li.appendChild(link);

                gallery[0].appendChild(li);

                setTimeout(function(){
                    $(li).addClass('loaded');
                }, 25*loadedIndex++);
            };
            img.src = photo;
            */
        });

        var timer_big, timer_small;
        var timer_small_slow = setInterval(function () {
            $('#gallery li:eq(' + Math.ceil(Math.random() * photo_num) + ')')
                .addClass('animated bounce')
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $(this)
                        .removeClass('animated bounce')
                        .find('img')
                        .attr('src', 'photo/' + Math.ceil(Math.random() * file_num) + '.jpg')
                });
        }, 100);

        $(document).keypress(function (event) {
            if (event.which == 13 || event.which == 32) {
                $('#action').click();
            }
        });

        $('#action').click(clickButton);
        $('#reaction').click(function () {
            selectedList = []
            numList = getNumList();
            photoList = getPhotos();
            $('#selectedList').empty();
            var txt = "表演人员列表已清空，请点击'开始'重新抽取表演人员";
            window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.success);
        })

        $('#list').click(function () {
            if ($(this).data('action') == 'show') {
                $(this).data('action', 'hide');
                $('.selectedList').hide()

            } else {
                $(this).data('action', 'show');
                $('.selectedList').show()
            }

        })

        function clickButton() {
            let value = $('#txtNum').val();
            if (value > file_num - selectedList.length) {
                var txt = "表演人数大于剩余未表演人数,当前未表演人数：" + (file_num - selectedList.length);
                window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.warning);
                return;
            }
            if (timer_small_slow) {
                clearInterval(timer_small_slow);
            }

            if ($(this).data('action') == 'start') {
                $(this).data('action', 'stop').html('停止');

                timer_big = setInterval(function () {
                    $('#gallery li.focus').removeClass('focus hover');
                }, 100);
                timer_small = setInterval(function () {
                    $('#gallery li:eq(' + Math.ceil(Math.random() * photo_num) + ') img').attr('src', 'photo/' + Math.ceil(Math.random() * file_num) + '.jpg');
                }, 1);
            } else {
                $(this).data('action', 'start').html('开始');
                clearInterval(timer_big);
                clearInterval(timer_small);
                let randomList = getRandomList(value, numList);
                let randomPhotos = []
                for (let i = 0; i < randomList.length; i++) {
                    let photo = getPhoto(photoList);
                    randomPhotos.push(photo);
                }
                for (let i = 0; i < randomList.length; i++) {

                    let li = $('#gallery li:eq(' + randomList[i] + ')').addClass('focus').addClass('hover')
                    li.children('a').children('img').attr('src', randomPhotos[i])
                    selectedList.push(randomPhotos[i])
                }
                $('#selectedList').empty();
                $.each(selectedList, function (index, photo) {
                    var img = document.createElement('img');
                    var link = document.createElement('a');
                    var li = document.createElement('li');
                    var span = document.createElement('span');
                    link.href = 'javascript:;';
                    link.appendChild(img);
                    li.appendChild(link);
                    li.appendChild(span)
                    span.textContent = '删除'
                    span.addEventListener('click', function () {
                        let img = $(this).parent().children('a').children('img').attr('src')
                        let index = selectedList.indexOf(img);
                        console.log(img)
                        selectedList.splice(index, 1);
                        photoList.push(img)
                        console.log(selectedList)
                        $(this).parent().remove();
                    })
                    img.src = photo;
                    checkList[0].appendChild(li);
                })

            }
        }


        function getRandomList(num, numberList) {
            let list = []
            for (let i = 0; i < num; i++) {
                let random = getRandom(numberList);
                list.push(random)
            }
            return list;
        }

        function getPhoto(photoList) {
            let random = Math.ceil(Math.random() * (photoList.length - 1));
            let photo = photoList[random];
            photoList.splice(random, 1);
            return photo;
        }

        function getRandom(numberList) {
            let random = Math.ceil(Math.random() * (numberList.length - 1));
            let result = numberList[random];
            numberList.splice(random, 1);
            return result;
        }


        function getPhotos() {
            let list = []
            for (let i = 1; i <= 23; i++) {
                list.push('photo/' + i + '.jpg');
            }
            return list;
        }

        function getNumList() {
            let list = []
            for (let i = 1; i <= 40; i++) {
                list.push(i);
            }
            return list;
        }


    }


)();



