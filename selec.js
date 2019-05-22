/**
 * HELPERS GLOBALES
 */

if (isElement == undefined) {
    var isElement = function (o, undefined) {
        'use strict';
        return typeof ((o || {}).innerHTML) === "string";
    };
}

if (getView == undefined) {
    var getView = function (element) {
        var _w = ((element || {}).ownerDocument || {}).defaultView;
        return _w;
    };
}

if (getStyles == undefined) {
    var getStyles = function (element) {
        var _w = (getView(element) || window);
        return _w.getComputedStyle(element);
    };
}

if (capitalizeWord == undefined) {
    var capitalizeWord = function (s) {
        if (typeof s !== 'string') {
            return '';
        }
        return s.charAt(0).toUpperCase() + s.slice(1);
    };
}

if (hasProperty == undefined) {
    var hasProperty = function (obj, prop) {
        if (obj || typeof obj == "object" && (prop && typeof(prop) == "string")) {
            return obj[prop] != undefined; //(Object.prototype.hasOwnProperty.call(obj, prop));
        }
        return false;
    };
}


var __ = (function(window, document, hasProperty, capitalizeWord, getStyles, getView, isElement){
    'use strict';
    

    var _construct = function(selector) {

        if (!selector) {
            return this;;
        }

        if (selector === 'document') {

            this.elems = [document];
        } else if (selector === 'window') {

            this.elems = [window];
        } else {

            this.elems = document.querySelectorAll(selector);
        }
    };

    
    /**
     * Run un callback en cada elemento
     * @param  {Function} callback La función callback que se ejecutará
     */
    _construct.prototype.each = function (callback) {
        if (!callback || typeof callback !== 'function') return;
        for (var i = 0; i < this.elems.length; i++) {
            callback(this.elems[i], i, this.elems);
        }
        return this;
    };


    /**
     * Agrega una clase a elemento(s)
     * @param {String} className la clase a agregar
     */
    _construct.prototype.addClass = function (className) {
        this.each(function (item) {
            var _c = item.className;
            if (_c.indexOf(className) == -1) {
                item.className = _c + " " + className;
            }
        });
        return this;
    };

    /**
     * Remueve una clase a elemento(s)
     * @param {String} className la clase a remover
     */
    _construct.prototype.removeClass = function (className) {
        this.each(function (item) {
            item.className.replace(className, "");
        });
        return this;
    };



    

    /**
     * css
     *
     * Asigna o devuelve el valor de una propiedad css del componente
     *
     * @param String property Nombre dela propiedad css con la que trabajar
     * @param String value    Nuevo valor a asignar a la propiedad
     *
     * @returns Mixed         Si value != undefined returns this, para encadenar método. Si value == undefined, returns valor de getComputedStyle(element)[ property ]
     */
    _construct.prototype.css = function (property, value) {
        var _s, _p;
        var _csss = [];
        
        this.each(function(item, index, items){

            _s = getStyles(item);
            if (property && typeof property == "string") {
                _p = property.toLowerCase();
                var splited = property.split("-");
                if (splited && splited[1]) {
                    _p = splited[0] + capitalizeWord(splited[1]);
                }
    
                if (_s && hasProperty(_s, property)) {
                    if (value) {
                        item.style[property] = value;
                    } else {
                        _csss.push(item.style[property]);
                    }
                } else if (_s && hasProperty(_s, _p)) {
                    if (value) {
                        item.style[_p] = value;  
                    } else {
                        _css.push(item.style[_p]);  
                    }
                }
            }
        });
        
        if (_csss === []) {
            return this;
        }

        if (_csss.length === 1) {
            return _csss[0];
        }

        return this;
    };



    var _instancia = function(selector) {
        return new _construct(selector);
    };



    return _instancia;

})(window, document, hasProperty, capitalizeWord, getStyles, getView, isElement, undefined);



/**
 * Crossbrowser de document.ready basada en jQuery 3 y en los comentarios
 * de Diego Perini  http://javascript.nwbox.com/IEContentLoaded/
 * Esto DEBERÍA funcionar hasta con IE8
 */
var onWindowReady = (function(fn) {

    var w3c = !!document.addEventListener,
        loaded = false,
        toplevel = false,
        fns = [];
    
    if (w3c) {
        document.addEventListener("DOMContentLoaded", contentLoaded, true);
        window.addEventListener("load", ready, false);
    } else {
        document.attachEvent("onreadystatechange", contentLoaded);
        window.attachEvent("onload", ready);
        
        try {
            toplevel = window.frameElement === null;
        } catch(e) {}
        if ( document.documentElement.doScroll && toplevel ) {
            scrollCheck();
        }
    }

    function contentLoaded() {
        (w3c)?
            document.removeEventListener("DOMContentLoaded", contentLoaded, true) :
            document.readyState === "complete" && 
            document.detachEvent("onreadystatechange", contentLoaded);
        ready();
    }
    
    // If IE is used, use the trick by Diego Perini
    // http://javascript.nwbox.com/IEContentLoaded/
    function scrollCheck() {
        if (loaded) {
            return;
        }
        
        try {
            document.documentElement.doScroll("left");
        }
        catch(e) {
            window.setTimeout(arguments.callee, 15);
            return;
        }
        ready();
    }
    
    function ready() {
        if (loaded) {
            return;
        }
        loaded = true;
        
        var len = fns.length,
            i = 0;
            
        for( ; i < len; i++) {
            fns[i].call(document);
        }
    }
    
    return function(fn) {
        
        return (loaded)? 
            fn.call(document):      
            fns.push(fn);
    };
})();






var ElementBuilder = (function (window, document, hasProperty, capitalizeWord, getStyles, getView, isElement) {
    'use strict';

    var _self = this;
    var _element = null;

    var _createElement = function (tipo) {

        tipo = (tipo || "div");
        _element = document.createElement(tipo);
        return _self;
    };

    var _setAttribute = function (attributeName, attributeValue) {
        _element.setAttribute(attributeName, attributeValue);
        return _self;
    };

    var _setId = function (id) {
        return _setAttribute("id", id);
    };

    var _setClassName = function (classes) {
        _element.setClassName(classes);
        return _self;
    };


    var _addClassName = function (classes) {
        var _c = _element.className;
        _setClassName(_c + " " + classes);
        return _self;
    };


    var _addEventListener = function (type, handler, bubble) {
        _element.addEventListener(type, handler, bubble);
        return _self;
    };


    /**
     * css
     *
     * Asigna o devuelve el valor de una propiedad css del componente
     *
     * @param String property Nombre dela propiedad css con la que trabajar
     * @param String value    Nuevo valor a asignar a la propiedad
     *
     * @returns Mixed         Si value != undefined returns this, para encadenar método. Si value == undefined, returns valor de getComputedStyle(element)[ property ]
     */
    var _css = function (property, value) {
        var _s = getStyles(_element);

        if (property && typeof property == "string") {
            property = property.toLowerCase();
            var splited = property.split("-");
            if (splited && splited[1]) {
                property = splited[0] + capitalizeWord(splited[1]);
            }

            if (_s && hasProperty(_s, property)) {
                if (value) {
                    _element.style[property] = value;
                    return _self;
                }
                return _s[property];
            }
        }
        return _self;
    };


    var _text = function (s) {
        if (s) {
            if (_element.childNodes[0] && _element.childNodes[0].nodeValue) {
                _element.childNodes[0].nodeValue = s;
            } else {
                _element.textContent = s;
            }
            return _self;
        }
        return _element.childNodes[0].nodeValue;
    };


    var _get = function () {
        return _element;
    };


    var publicAPI = {};

    publicAPI.createElement    = _createElement;
    publicAPI.setAttribute     = _setAttribute;
    publicAPI.setId            = _setId;
    publicAPI.setClassName     = _setClassName;
    publicAPI.addClassName     = _addClassName;
    publicAPI.addEventListener = _addEventListener;
    publicAPI.css              = _css;
    publicAPI.text             = _text;
    publicAPI.get              = _get;


    return publicAPI;

})(window, document, hasProperty, capitalizeWord, getStyles, getView, isElement, undefined);

