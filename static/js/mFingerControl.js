var ham = document.querySelector('.ham');
var main = document.querySelector('.main');
var extra = document.querySelector('.extra');
let currentPan = 1;

let el_bodyContent = document.body;
let slideCount = 3;
var activeSlide = 1;
var sliderManager = initHammer();

function initHammer() {
    return new Hammer(main, {
        inputClass: null,
        recognizers: [
            [Hammer.Pan, { 
                direction: 6, 
                threshold: 25,
                velocity: 0.3
            }]
        ]
    });
}

let isScrolling = false;

document.querySelector('.main').addEventListener('scroll', function () {
    isScrolling = true;
}, { passive: true });

 var WindowCustomEventsModule = (function () {
     var _scrollEndTimeout = 300;
     var _delayedExec = function (callback) {
         var timer;
         return function () {
             timer && clearTimeout(timer);
             timer = setTimeout(callback, _scrollEndTimeout);
         }
     };
     var onScrollEnd = function (callback) {
        main.addEventListener('scroll', _delayedExec(callback), false);
     };
     return {
         onScrollEnd: onScrollEnd
     }
 })();
 WindowCustomEventsModule.onScrollEnd(function () {
     isScrolling = false;
 });

 main.addEventListener('touchend', function () {
    isScrolling = false;
});

var percentage;        
let allowSwipe;

document.addEventListener('touchend', onTouchEnd, { passive: true });

function onTouchEnd(e) {
    // body.classList.remove("dragging");
    // if (e.cancelable) {
    //     if (/android.*mobile/i.test(window.navigator.userAgent)) {
    //         if (!document.fullscreenElement) {
    //             document.documentElement.requestFullscreen();
    //         }
    //     }            
    // }
}
let matrix;
function setTransformation(transformPercentage) {
    main.style.transform = 'translateX( ' + transformPercentage + '% )';
    main.style.webkitTransform  = 'translateX( ' + transformPercentage + '% )';
    ham.style.transform = 'translateX( ' + transformPercentage + '% )';
    ham.style.webkitTransform  = 'translateX( ' + transformPercentage + '% )';
    extra.style.transform = 'translateX( ' + transformPercentage + '% )';
    extra.style.webkitTransform  = 'translateX( ' + transformPercentage + '% )';
    matrix = getComputedStyle(main).transform.match(/matrix.*\((.+)\)/)[1].split(',');
}

sliderManager.on('pan', function(e) {
    

    if (isScrolling 
        || (e.eventType != 2 && e.eventType != 4)
        ||(['panright', 'pandown', 'panup'].includes(e.additionalEvent) && activeSlide === 0 && +matrix[4] >= 0) 
        || (['panleft', 'pandown', 'panup'].includes(e.additionalEvent) && activeSlide === slideCount - 1 && +matrix[4] <= -window.innerWidth * (slideCount - 2))
        || (['panleft'].includes(e.additionalEvent) && activeSlide === 0 && e.deltaX > 0)
        || (['panright'].includes(e.additionalEvent) && activeSlide === slideCount - 1 && e.deltaX < 0)
        || (e.type === 'pan' && !e.additionalEvent)

    ) {
        allowSwipe = false;
        return;
    }

    percentage = 100 / slideCount * e.deltaX / window.innerWidth;
    var transformPercentage = percentage;
    setTransformation(transformPercentage);
})
