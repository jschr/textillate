/*
 * textillate.js
 * http://jschr.github.com/textillate
 * MIT licensed
 *
 * Copyright (C) 2012-2013 Jordan Schroter
 */

(function ($) {
  "use strict"; 

  function isInEffect (effect) {
    return /In/.test(effect) || $.inArray(effect, $.fn.textillate.defaults.inEffects) >= 0;
  };

  function isOutEffect (effect) {
    return /Out/.test(effect) || $.inArray(effect, $.fn.textillate.defaults.outEffects) >= 0;
  };

  // custom get data api method
  function getData (node) {
    var attrs = node.attributes || []
      , data = {};

    if (!attrs.length) return data;

    $.each(attrs, function (i, attr) {
      if (/^data-in-*/.test(attr.nodeName)) {
        data.in = data.in || {};
        data.in[attr.nodeName.replace(/data-in-/, '')] = attr.nodeValue;
      } else if (/^data-out-*/.test(attr.nodeName)) {
        data.out = data.out || {};
        data.out[attr.nodeName.replace(/data-out-/, '')] = attr.nodeValue;
      } else if (/^data-*/.test(attr.nodeName)) {
        data[attr.nodeName] = attr.nodeValue;
      }
    })

    return data;
  }

  function shuffle (o) {
      for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
  }

  function animate ($c, effect, cb, duration) {
    $c.addClass('animated ' + effect)
      .css('visibility', 'visible')
      .show();

    //set appropriate duration
    if (duration) {
      $c.css('-webkit-animation-duration', parseInt(duration) + 'ms')
        .css('-moz-animation-duration', parseInt(duration) + 'ms')
        .css('-ms-animation-duration', parseInt(duration) + 'ms')
        .css('-o-animation-duration', parseInt(duration) + 'ms')
        .css('animation-duration', parseInt(duration) + 'ms');
    }

    $c.one('animationend webkitAnimationEnd oAnimationEnd', function () {
        $c.removeClass('animated ' + effect);
        cb && cb();
    });
  }

  function animateChars ($chars, options, cb) {
    var that = this
      , count = $chars.length;

    if (!count) {
      cb && cb();
      return;
    } 

    if (options.shuffle) shuffle($chars);

    $chars.each(function (i) {
      var $this = $(this);
      
      function complete () {
        if (isInEffect(options.effect)) {
          $this.css('visibility', 'visible');
        } else if (isOutEffect(options.effect)) {
          $this.css('visibility', 'hidden');
        }
        count -= 1;
        if (!count && cb) cb();
      }

      //Animate to a fixed duration - essentially ignores delay to achieve this
      if (!options.sync && options.duration) var duration = options.delay = options.duration / $chars.length;

      var delay = options.sync ? options.delay : options.delay * i * options.delayScale;     

      $this.text() ? 
        setTimeout(function () { animate($this, options.effect, complete, duration) }, delay) :
        complete();
    })
  };

  var Textillate = function (element, options) {
    var base = this
      , $element = $(element);

    base.init = function () {
      base.$texts = $element.find(options.selector);
      
      if (!base.$texts.length) {
        base.$texts = $('<ul class="texts"><li>' + $element.text() + '</li></ul>');
        $element.html(base.$texts);
      }

      base.$texts.hide();

      base.$current = $('<span>')
        .text(base.$texts.find(':first-child').text())
        .prependTo($element);

      if (isInEffect(options.effect)) {
        base.$current.css('visibility', 'hidden');
      } else if (isOutEffect(options.effect)) {
        base.$current.css('visibility', 'visible');
      }

      base.setOptions(options);

      setTimeout(function () {
        base.options.autoStart && base.start();
      }, base.options.initialDelay)
    };

    base.setOptions = function (options) {
      base.options = options;
    };

    base.triggerEvent = function (name) {
      var e = $.Event(name + '.tlt', { data: base });
      $element.trigger(e);
      return e;
    };

    base.in = function (index, cb) {
      index = index || 0;
       
      var $elem = base.$texts.find(':nth-child(' + (index + 1) + ')')
        , options = $.extend({}, base.options, getData($elem))
        , $chars;

      base.triggerEvent('inAnimationBegin');

      base.$current
        .text($elem.html())
        .lettering('words');

      base.$current.find('[class^="word"]')
          .css({ 
            'display': 'inline-block',
            // fix for poor ios performance
            '-webkit-transform': 'translate3d(0,0,0)',
               '-moz-transform': 'translate3d(0,0,0)',
                 '-o-transform': 'translate3d(0,0,0)',
                    'transform': 'translate3d(0,0,0)'
          })
          .each(function () { $(this).lettering() });

      $chars = base.$current
        .find('[class^="char"]')
        .css('display', 'inline-block');

      if (isInEffect(options.in.effect)) {
        $chars.css('visibility', 'hidden');
      } else if (isOutEffect(options.in.effect)) {
        $chars.css('visibility', 'visible');
      }

      base.currentIndex = index;

      animateChars($chars, options.in, function () {
        base.triggerEvent('inAnimationEnd');
        if (options.in.callback) options.in.callback();
        if (cb) cb(base);
      });
    };

    base.out = function (cb) {
      var $elem = base.$texts.find(':nth-child(' + (base.currentIndex + 1) + ')')
        , $chars = base.$current.find('[class^="char"]')
        , options = $.extend({}, base.options, getData($elem));

      base.triggerEvent('outAnimationBegin');

      animateChars($chars, options.out, function () {
        base.triggerEvent('outAnimationEnd');
        if (options.out.callback) options.out.callback();
        if (cb) cb(base);
      });
    };

    base.start = function (index) {
      base.triggerEvent('start');

      (function run (index) {
        base.in(index, function () {
          var length = base.$texts.children().length;

          index += 1;
          
          if (!base.options.loop && index >= length) {
            if (base.options.callback) base.options.callback();
            base.triggerEvent('end');
          } else {
            index = index % length;

            setTimeout(function () {
              base.out(function () {
                run(index)
              });
            }, base.options.minDisplayTime);
          }
        });
      }(index || 0));
    };

    base.init();
  }

  $.fn.textillate = function (settings, args) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('textillate')
        , options = $.extend(true, {}, $.fn.textillate.defaults, getData(this), typeof settings == 'object' && settings);

      if (!data) { 
        $this.data('textillate', (data = new Textillate(this, options)));
      } else if (typeof settings == 'string') {
        data[settings].apply(data, [].concat(args));
      } else {
        data.setOptions.call(data, options);
      }
    })
  };
  
  $.fn.textillate.defaults = {
    selector: '.texts',
    loop: false,
    minDisplayTime: 2000,
    initialDelay: 0,
    in: {
      effect: 'fadeInLeftBig',
      delayScale: 1.5,
      delay: 50,
      sync: false,
      shuffle: false,
      callback: function () {}
    },
    out: {
      effect: 'hinge',
      delayScale: 1.5,
      delay: 50,
      sync: false,
      shuffle: false,
      callback: function () {}
    },
    autoStart: true,
    inEffects: [],
    outEffects: [ 'hinge' ],
    callback: function () {}
  };

}(jQuery));
