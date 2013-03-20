#Textillate.js v0.1

See live demo [here](http://jschr.github.com/textillate/).

Textillate.js combines some awesome libraries to provide an ease-to-use plugin for applying CSS3 animations to any text.

##Usage

Let's start with the basic markup:

```html
<h1 class="tlt">My Title</h1>
```

And your javascript should look like this:

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

You can also tell textillate.js to animate a list of texts with the following markup:

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
    shuffle: false
  },
  
  // out animation settings.
  out: {
    effect: 'hinge',
    delayScale: 1.5,
    delay: 50,
    sync: false,
    shuffle: false,
  }
});
```
