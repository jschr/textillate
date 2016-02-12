/*global jQuery */
/*!
* Lettering.JS 0.6.1
*
* Copyright 2010, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Thanks to Paul Irish - http://paulirish.com - for the feedback.
*
* Date: Mon Sep 20 17:14:00 2010 -0600
*/
(function($){
    function injector(t, splitter, klass, after) {
        var a = t.text().split(splitter),
            inject = '';
        if (a.length) {
            $(a).each(function(i, item) {
                inject  += '<span class="' + klass + (i + 1) + '">' + item + '</span>' + after;
            });
            t.empty().append(inject);
        }
    }

    function tagInjector(t, splitter, klass, after) {
        var content = t.contents(),
            a,
            n,
            i = 0,
            inject,
            tagName,
            elClass,
            newT,
            target;
        t.empty();
        if(klass == 'word') {
            target = $(content)[0].childNodes;
        } else {
            target = $(content)[0];
        }
        $(target).each(function() {
            n = this;

            // if node has class containing 'icon', don't split chars
            if($(n).is('[class*="icon"]') && klass == 'char') {
                a = [$.trim($(n).text())];
            } else {
                a = $.trim($(n).text()).split(splitter);
            }
            if (a.length) {
                if(n.nodeType === 3) { // text
                    inject = '';
                    $(a).each(function(index, item) {
                        inject  += '<span class="' + klass + (i + 1) + '">' + item + '</span>' + after;
                        i++;
                    });
                    t.append(inject);
                } else if(n.nodeType === 1) { // element
                    tagName = $(n).prop("tagName").toLowerCase();
                    if(klass == 'word') {
                        elClass = '';
                        if($(n).attr('class') !== undefined) {
                            elClass = ' class="' + $.trim($(n).attr('class').replace(/current/, '')) + '"';
                        }
                        $(a).each(function(index, item) {
                            newT  = '<span class="' + klass + (i + 1) + '"><' + tagName + elClass + '>' + item + '</' + tagName + '></span>' + after;
                            t.append(newT);
                            i++;
                        });
                    } else if(klass == 'char') {
                        $(a).each(function(index, item) {
                            elClass = '';
                            if($(n).attr('class') !== undefined) {
                                elClass = ' ' + $.trim($(n).attr('class'));
                            }
                            inject  = '<' + tagName + ' class="' + klass + (i + 1) + elClass + '">' + item + '</' + tagName + '>' + after;
                            t.append(inject);
                            i++;
                        });
                    }
                }
            }
        });
    }

    var methods = {
        init : function() {

            return this.each(function() {
                injector($(this), '', 'char', '');
            });

        },

        // Custom function to transmit tag/class (ie : icon) to each character
        wordsWithTags : function() {
            return this.each(function() {
                tagInjector($(this), ' ', 'word', ' ');
            });
        },

        lettersWithTags : function() {
            return this.each(function() {
                tagInjector($(this), '', 'char', '');
            });

        },

        words : function() {

            return this.each(function() {
                injector($(this), ' ', 'word', ' ');
            });

        },

        lines : function() {

            return this.each(function() {
                var r = "eefec303079ad17405c889e092e105b0";
                // Because it's hard to split a <br/> tag consistently across browsers,
                // (*ahem* IE *ahem*), we replaces all <br/> instances with an md5 hash
                // (of the word "split").  If you're trying to use this plugin on that
                // md5 hash string, it will fail because you're being ridiculous.
                injector($(this).children("br").replaceWith(r).end(), r, 'line', '');
            });

        }
    };

    $.fn.lettering = function( method ) {
        // Method calling logic
        if ( method && methods[method] ) {
            return methods[ method ].apply( this, [].slice.call( arguments, 1 ));
        } else if ( method === 'letters' || ! method ) {
            return methods.init.apply( this, [].slice.call( arguments, 0 ) ); // always pass an array
        }
        $.error( 'Method '  +   method  +  ' does not exist on jQuery.lettering' );
        return this;
    };

})(jQuery);