function fitElementToParent(el, padding) {
  var timeout = null;
  function resize() {
    if (timeout) clearTimeout(timeout);
    anime.set(el, {scale: 1});
    var pad = padding || 0;
    var parentEl = el.parentNode;
    var elOffsetWidth = el.offsetWidth - pad;
    var parentOffsetWidth = parentEl.offsetWidth;
    var ratio = parentOffsetWidth / elOffsetWidth;
    timeout = setTimeout(anime.set(el, {scale: ratio}), 10);
  }
  resize();
  window.addEventListener('resize', resize);
}

var sphereEl = document.querySelector('.sphere-animation');
var spherePathEls = sphereEl.querySelectorAll('.sphere path');
var pathLength = spherePathEls.length;
var hasStarted = false;
var aimations = [];

fitElementToParent(sphereEl);

var Vanimation = anime({
  targets: '.animation-wrapper .sphere-animation',
  keyframes: [
    {translateY: 30},
    {translateY: 0}
  ],
  duration: 3000,
  direction: 'normal',
  loop: true,
  autoplay: true,
  easing: 'easeInOutSine'
});

var breathAnimation = anime({
  begin: function() {
    for (var i = 0; i < pathLength; i++) {
      aimations.push(anime({
        targets: spherePathEls[i],
        stroke: {value: ['rgba(0,0,0,1)', 'rgba(80,80,80,.35)'], duration: 500},
        translateX: [2, -5],
        translateY: [2, -5],
        easing: 'easeOutQuad',
        autoplay: false
      }));
    }
  },
  update: function(ins) {
    aimations.forEach(function(animation, i) {
      var percent = (1 - Math.sin((i * .35) + (.0022 * ins.currentTime))) / 2;
      animation.seek(animation.duration * percent);
    });
  },
  duration: Infinity,
  autoplay: false
});

var introAnimation = anime.timeline({
  autoplay: false
})
.add({
  targets: spherePathEls,
  strokeDashoffset: {
    value: [anime.setDashoffset, 0],
    duration: 3900,
    easing: 'easeInOutCirc',
    delay: anime.stagger(190, {direction: 'reverse'})
  },
  duration: 1000,
  delay: anime.stagger(60, {direction: 'reverse'}),
  easing: 'linear'
}, 0);

var shadowAnimation = anime({
  targets: '#sphereGradient',
  x1: '25%',
  x2: '25%',
  y1: '0%',
  y2: '92.5%',
  duration: 10000,
  easing: 'easeOutQuint',
  autoplay: false
}, 0);

  introAnimation.play();
  shadowAnimation.play();


  document.querySelector('.buttons .listen').addEventListener("click", listenClick);

  function listenClick() {
    function reply() {
      breathAnimation.play();
      $.ajax({
        url: '/reply',
        type: 'GET',
        success: function(response){
          console.log(response);
          breathAnimation.pause();
          Vanimation.play();
        },
        error: function(error){
          console.log(error);
        }
      });
    }

    Vanimation.pause();
    $.ajax({
			url: '/listen',
			type: 'GET',
			success: function(response){
				console.log(response);
        reply();
			},
			error: function(error){
				console.log(error);
			}
		});
  }

function init_bot() {
  $.ajax({
    url: '/init_bot',
    type: 'GET',
    success: function(response){
      console.log(response);
    },
    error: function(error){
      console.log(error);
    }
  });
}