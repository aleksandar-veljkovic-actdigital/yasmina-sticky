(function () {
  var originalAddClassMethod = jQuery.fn.addClass;
  jQuery.fn.addClass = function () {
    var result = originalAddClassMethod.apply(this, arguments);
    jQuery(this).trigger('classAdded');
    return result;
  };
})();

// STICKY PROTOTYPE
$.fn.ySticky = function (settings) {
  var toReturn = {};
  var $stElement = $(this).eq(0);
  if (!$stElement || $stElement.length < 1) {
    //console.log("ySticky :: no element");
    return false;
  }
  settings = settings || {};
  var offsetTop = settings.offsetTop || 0;
  var offsetBot = settings.offsetBot || 0;
  var $stEnd = settings.$stEnd || $();
  if ($stEnd.length < 1) {
    //console.log("ySticky :: parameters mismach");
    return false;
  }
  var $stStart = $stElement.parent();
  var calculateAndSet = function () {
    var posStart = $stStart.offset()['top'];
    var posEnd = $stEnd.offset()['top'] - $stElement.outerHeight(true);
    var posScooll = $(window).scrollTop() + offsetTop;
    $stElement.css({position: 'fixed'});
    if (posScooll < posStart) { // scroled above
      $stElement.css({
        position: 'relative',
        top: 'auto'
      });
    }
    else if (posScooll > posEnd - offsetBot) { // scroll below
      $stElement.css({
        position: 'fixed',
        top: posEnd - posScooll + offsetTop - offsetBot
      });
    }
    else { // sticky area
      $stElement.css({
        position: 'fixed',
        top: offsetTop
      });
    }
  };
  // event bindings
  $(window).on('scroll', calculateAndSet);
  $(window).on('resize', calculateAndSet);
  $(document).on('ready', calculateAndSet);
  $(window).on('load', calculateAndSet);  
  $stElement.addClass('y-sticky');
  calculateAndSet();
  $stElement.on('classAdded', calculateAndSet);
  toReturn.destroy = function () {
    $(window).off('scroll', calculateAndSet);
    $(window).off('resize', calculateAndSet);
    $(document).off('ready', calculateAndSet);
    $(window).off('load', calculateAndSet);
    $stElement.off('classAdded', calculateAndSet);
    $stElement.removeClass('y-sticky');
    $stElement.css({
      position: '',
      top: ''
    });
  };
  $stElement.data('ySticky', toReturn);
  return toReturn;
};
// eof sticky  prototype

// STICKY MPU
$('.desktop #ad-above-fold-MPU-holder').ySticky({offsetTop: 35, $stEnd: $('#ad-SE-holder')});
// eof sticky mpu

// STICKY LB/TOP 
(function () {
  var observeDOM = function (obj, callback) {
    if (typeof (obj) === "undefined") {
      return false;
    }
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver, eventListenerSupported = window.addEventListener;
    if (MutationObserver) {
      var obs = new MutationObserver(function (mutations, observer) {
        if (mutations[0].addedNodes.length || mutations[0].removedNodes.length)
          callback();
      });
      obs.observe(obj, {childList: true, subtree: true});
    }
    else if (eventListenerSupported) {
      obj.addEventListener('DOMNodeInserted', callback, false);
      //obj.addEventListener('DOMNodeRemoved', callback, false);
    }
  };
  var stickyKickStart = function ($target, $stEnd, offsetBot) {
    offsetBot = offsetBot || 0;
    var jobLB = function () {      
      if ($target.hasClass('observed')){
        $target.parent().css({height:""});
        $target.data('ySticky').destroy();
        return;
      }
      $target.addClass('observed');
      $target.parent().css({height: $target.parent().outerHeight()});
      $target.ySticky({$stEnd: $stEnd.eq(0), offsetBot: offsetBot});
    };
    if ($target.find('iframe').length > 0) {
      jobLB();
    }
    else {
      observeDOM($target[0], function () {
        //console.log('obzerved');
        if ($target.find('iframe').length > 0) {
          jobLB();
        }
      });
    }
  };

  var stEndList = [];
  stEndList = stEndList.concat($(".cc-video article.video figure.video-player").toArray());
  stEndList = stEndList.concat($(".cc-article article .w__desk--right").toArray());
  stEndList = stEndList.concat($(".cc-event article .w__desk--right").toArray());
  stEndList = stEndList.concat($(".cc-slideshow article .w__desk--right").toArray());
  stEndList = stEndList.concat($(".tpl-personalityTest-detail article .w__desk--right").toArray());

  stEndList = stEndList.concat($(".tpl-homepage .b__hero--hp").toArray());
  stEndList = stEndList.concat($("body  > .page-wrapper-holder").toArray());

  var $stEndList = $(stEndList);

  // lb
  stickyKickStart($('.desktop #ad-above-fold-LB-holder'), $($stEndList).eq(0));
  // top
  stickyKickStart($('.desktop #ad-top-holder'), $($stEndList).eq(0));

})();
// eof sticky lb/top