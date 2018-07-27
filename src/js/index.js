(function () {
    window.player = window.player ? window.player : {};

    this.player = window.player;

    this.player.index = 0;

    this.player.audio = new Audio();

    player.init = function () {
        this.getData();
        this.initState(this.index);
        this.bindEvent();
    }

    player.getData = function () {
        $.ajax({
            type: 'get',
            url: '../json/data.json',
            async: false,
            success: function (data) {
                player.data = data;
            },
            error: function () {
                console.log('error');
            }
        })
    }

    player.initState = function (index) {
        this.audioreload(this.data[index].audio);
        var state = {};
        for (var prop in this.data[index]) {
            state[prop] = this.data[index][prop];
        }
        state.now = 0;
        this.state = state;
        if ($('.pors-btn').hasClass('play')) {
            this.starttime = new Date().getTime();
            this.audioplay();
            this.timereload();
        } else{
            this.audiopause();
            this.timereloadstop();
        }
    
        this.buildUI();
    }

    player.buildUI = function () {
        var img = new Image();
        img.src = this.state.image;
        img.onload = function () {
            player.blurImg(img, $(document.body));
            $('.img-box').empty();
            $('.img-box').append(img);
        }
        $('.sg-if .sg-name').html(this.state.song);
        $('.sg-if .sg-singer').html(this.state.singer);
        $('.sg-if .sg-album').html(this.state.album);
        $('.sg-pro .tm-start').html(this.formatTime(this.state.now));
        $('.sg-pro .tm-end').html(this.formatTime(this.state.duration));
        if (this.state.isLike) {
            $('.sg-op div').eq(0).addClass('liking');
        } else {
            $('.sg-op div').eq(0).removeClass('liking');
        }
    }

    player.formatTime = function (sec) {
        var min = Math.floor(sec / 60);
        var sec = sec - min * 60;
        if (min < 10) {
            min = '0' + min;
        }
        if (sec < 10) {
            sec = '0' + sec;
        }
        return min + ':' + sec;
    }

    player.bindEvent = function () {
        var _this = this;
        $('.prev-btn').on('click', function (e) {
            _this.prev();
        })
        $('.next-btn').on('click', function (e) {
            _this.next();
        })
        $('.pors-btn').on('click', function (e) {
            $(this).toggleClass('play');
            if ($(this).hasClass('play')) {
                _this.starttime = new Date().getTime();
                _this.audioplay();
                _this.timereload();
            } else{
                _this.audiopause();
                _this.timereloadstop();
            }
        })
        
        $('.tm-pro-bar-pointer').on('touchstart', function () {
            _this.audiopause();
            _this.timereloadstop();
        }).on('touchmove', function (e) {
            var x = e.changedTouches[0].clientX;
            var per;
            var offset = $('.tm-pro').offset();
            var left = offset.left;
            var width = $('.tm-pro').width();
            per = (((x - left) / width) * 100);
            if (per > 100) {
                per = 100;
            } else if (per < 0) {
                per = 0;
            }
            per = per - 100;
            $('.tm-pro-bar-top').css({'transform': 'translateX(' + per + '%)'})
        }).on('touchend', function (e) {
            var x = e.changedTouches[0].clientX;
            var per;
            var offset = $('.tm-pro').offset();
            var left = offset.left;
            var width = $('.tm-pro').width();
            per = (((x - left) / width) * 100);
            if (per > 100) {
                per = 100;
            } else if (per < 0) {
                per = 0;
            }
            var time = parseInt(_this.data[_this.index].duration * per / 100);
            _this.howlong = time;
            if ($('.pors-btn').hasClass('play')) {

            } else {
                $('.pors-btn').addClass('play')
            }
            _this.audio.currentTime = time;
            _this.audioplay();
            _this.timereload();
        })
    }

    player.prev = function () {
        var len = this.data.length;
        this.howlong = undefined;
        if (this.index > 0) {
            this.index = this.index - 1;
            player.initState(this.index);
        } else{
            this.index = this.data.length - 1;
            player.initState(this.index);
        }
    }

    player.next = function () {
        var len = this.data.length;
        this.howlong = undefined;
        if (this.index < len - 1) {
            this.index = this.index + 1;
            player.initState(this.index);
        } else {
            this.index = 0;
            player.initState(this.index);
        }
    }

    player.audioplay = function () {
        this.audio.play();
    }

    player.audiopause = function () {
        this.audio.pause();
    }

    player.audioreload = function (src) {
        this.audio.src = src;
        this.audio.load();
    }

    player.timereload = function () {
        cancelAnimationFrame(this.frameID);
        var _this = this;
        function frame() {
            var curtime = new Date().getTime();
            var howlong;
            var per;
            if (_this.howlong) {
                howlong = Math.floor((curtime - _this.starttime) / 1000) +  _this.howlong;
            } else{
                howlong = Math.floor((curtime - _this.starttime) / 1000) ;
            }
            _this.howlongtime = howlong;
            var time = _this.formatTime(howlong);
            $('.sg-pro .tm-start').html(time);
            per = ((howlong / _this.data[_this.index].duration) - 1) * 100;
            if(per > 0) {
                _this.next();
            }
            $('.tm-pro-bar-top').css({'transform': 'translateX(' + per + '%)'})
            _this.frameID = requestAnimationFrame(frame);
        }
        frame();
    }

    player.timereloadstop = function () {
        this.howlong = this.howlongtime;
        cancelAnimationFrame(this.frameID);
    }

    player.init();
}())
    
