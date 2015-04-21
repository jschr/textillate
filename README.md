#Textillate.js v0.4.0  [![JS.ORG](https://img.shields.io/badge/js.org-textillate-ffb400.svg?style=flat-square)](http://js.org)

See a live demo [here](http://textillate.js.org/).

Textillate.js combines some awesome libraries to provide an easy-to-use plugin for applying CSS3 animations to any text.

##Usage

Let's start with the basic markup:

```html
<h1 class="tlt">My Title</h1>
```

And your JavaScript should look like this:

```js
$(function () {
	$('.tlt').textillate();
})
```

This will animate using the default options. To change the defaults, you can either use the html data api:

```html
<h1 class="tlt" data-in-effect="rollIn">Title</h1>
```

or pass in options on initialization (see full list of options below):

```js
$('.tlt').textillate({ in: { effect: 'rollIn' } });
```

You can also tell textillate.js to animate a list with the following markup:

```html
<h1 class="tlt">
	<ul class="texts">
		<li data-out-effect="fadeOut" data-out-shuffle="true">Some Title</li>	
		<li data-in-effect="fadeIn">Another Title</li>
	</ul>
</h1>
```

```js
$('.tlt').textillate();
```

Notice that you can control the animation parameters on each text (`<li>`) using the data api.

##Dependencies
To start using textillate.js, you will need the following:

* [jQuery](http://jquery.com/download/)
* [lettering.js](https://github.com/davatron5000/Lettering.js)
* [animate.css](https://github.com/daneden/animate.css)


##Options

```js
$('.tlt').textillate({
  // the default selector to use when detecting multiple texts to animate
  selector: '.texts',
  
  // enable looping
  loop: false,
  
  // sets the minimum display time for each text before it is replaced
  minDisplayTime: 2000,
  
  // sets the initial delay before starting the animation
  // (note that depending on the in effect you may need to manually apply 
  // visibility: hidden to the element before running this plugin)
  initialDelay: 0,
    
  // set whether or not to automatically start animating
  autoStart: true,
  
  // custom set of 'in' effects. This effects whether or not the 
  // character is shown/hidden before or after an animation  
  inEffects: [],
  
  // custom set of 'out' effects
  outEffects: [ 'hinge' ],
  
  // in animation settings
  in: {
  	// set the effect name
    effect: 'fadeInLeftBig',
    
    // set the delay factor applied to each consecutive character
    delayScale: 1.5,
    
    // set the delay between each character
    delay: 50,
    
    // set to true to animate all the characters at the same time
    sync: false,
    
    // randomize the character sequence 
    // (note that shuffle doesn't make sense with sync = true)
    shuffle: false,

    // reverse the character sequence 
    // (note that reverse doesn't make sense with sync = true)
    reverse: false,

    // callback that executes once the animation has finished
    callback: function () {}
  },
  
  // out animation settings.
  out: {
    effect: 'hinge',
    delayScale: 1.5,
    delay: 50,
    sync: false,
    shuffle: false,
    reverse: false,
    callback: function () {}
  },

  // callback that executes once textillate has finished 
  callback: function () {},

  // set the type of token to animate (available types: 'char' and 'word')
  type: 'char'
});
```

##Events

Textillate triggers the following events:

* `start.tlt` - triggered when textillate starts
* `inAnimationBegin.tlt` - triggered when the in animation begins
* `inAnimationEnd.tlt` - triggered when the in animation ends
* `outAnimationBegin.tlt` - triggered when the out animation begins
* `outAnimationEnd.tlt` - triggered when the in animation ends
* `end.tlt` - triggered when textillate ends

```js
$('.tlt').on('inAnimationBegin.tlt', function () {
  // do something
});
```

##Methods

* `$element.textillate('start')` - Manually start/restart textillate
* `$element.textillate('stop')` - Manually pause/stop textillate
* `$element.textillate('in')` - Trigger the current text's in animation
* `$element.textillate('out')` - Trigger the current text's out animation

##Code Samples
* [textillate.js + bounce.js](http://codepen.io/jschr/pen/GaJCi)
