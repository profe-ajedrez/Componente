/**
 * HELPERS GLOBALES
 */

if (isElement == undefined) {
    var isElement = function (o, undefined) {
        'use strict';
        return typeof (( o || {}).innerHTML) === "string";
    };
}

if (getView == undefined) {
    var getView = function(element) {
        var _w = ((element || {}).ownerDocument || {}).defaultView;
        return _w;
    };
}

if (getStyles == undefined) {
    var getStyles = function(element) {
        var _w = (getView(element) || window);
        return _w.getComputedStyle(element);
    };
}

if (capitalizeWord == undefined) {
    var capitalizeWord = function(s) {
        if (typeof s !== 'string') {
            return '';
        }
        return s.charAt(0).toUpperCase() + s.slice(1)
    };
}

if (hasProperty == undefined) {
    var hasProperty = function(obj, prop) {
        if (obj || typeof obj == "object") {
            return (Object.prototype.hasOwnProperty.call(obj, prop));
        }
        return false;
    }
}

/**
 *
 */
var Componente = function(tipo, parentView)  {
    'use strict';

    this.className    = "Componente";
    this._w           = (parentView || window);
    this._d           = this._w.document;
    this.element      = (tipo == undefined ? null : this._d.createElement(tipo));
    this._self        = this;
    this.msgComponent = null;

    this.children     = [];

    this.notReadyMsg   = "La propiedad de tipo Element de este Componente no esta inicializada (es null)";
    this.notReadyTitle = "Excepción Controlada";

};


Componente.prototype.setView = function(view) {
    'use strict';
    this._w = (view || this._w);
};


Componente.prototype.isReady = function() {
    'use strict';
    return isElement(this.element);
};


Componente.prototype.callMsgComponent = function(notReadyMsg, notReadyTitle) {
    'use strict';
    if (this.msgComponent === null) {
        alert(notReadyMsg);
        return;
    }
    this.msgComponent(notReadyMsg, notReadyTitle);

};


Componente.prototype.checkNullity = function() {
    'use strict';
    if (!this.isReady()) {

        this.callMsgComponent(this.notReadyMsg, this.notReadyTitle);
        throw TypeError(this.notReadyMsg);
    }
};




Componente.prototype.setAttribute = function(attributeName, attributeValue) {
    'use strict';
    this.checkNullity();
    this.element.setAttribute(attributeName, attributeValue);
    return this;
};

Componente.prototype.setClassName = function(className) {
    'use strict';
    this.checkNullity();
    this.element.className = className;
    return this;
};

Componente.prototype.addClassName = function(className) {
    'use strict';
    this.checkNullity();
    this.element.className += ' ' + className;
    return this;
};


Componente.prototype.removeClassName = function(className) {
    'use strict';
    this.checkNullity();
    var _c = this.element.className;
    _c     = _c.replace(className, "");
    this.element.className = _c;
    return this;
};


Componente.prototype.addEventListener = function(type, handler, bubble) {
    'use strict';
    this.checkNullity();
    this.element.addEventListener(type, handler, bubble);
    return this;
};



Componente.prototype.appendChild = function(appendedNode) {
    'use strict';
    this.checkNullity();
    if (appendedNode && appendedNode.className && appendedNode.className == "Componente") {
        appendedNode.checkNullity();
        this.children.push(appendedNode);
        this.element.appendChild(appendedNode.element);
        return this;
    }

    if (appendedNode && isElement(appendedNode)) {
        this.element.appendChild(appendedNode);
        return this;
    }

    this.callMsgComponent("Se esperaba parámetro de tipo [Dom] Element al agregarlo al elemento " + this.ElementType, this.notReadyTitle);
    throw new TypeError("Se esperaba parámetro de tipo [Dom] Element");
};


Componente.prototype.blur = function() {
    'use strict';
    this.element.blur();
    return this;
};

Componente.prototype.click = function() {
    'use strict';
    this.element.click();
    return this;
};

Componente.prototype.dispatchEvent = function(event) {
    'use strict';
    this.element.dispatchEvent(event);
    return this;
};

Componente.prototype.getAttribute = function(name) {
    'use strict';
    return this.element.getAttribute( name );
};

Componente.prototype.getElementsByTagName = function( name ) {
    'use strict';
    return this.element.getElementsByTagName( name );
};

Componente.prototype.hasAttribute = function( name ) {
    'use strict';
    return this.element.hasAttribute( name );
};

Componente.prototype.hasChildNodes = function() {
    'use strict';
     return this.element.hasChildNodes();
};


Componente.prototype.insertBefore = function( insertedNode, adjacentNode ) {
    'use strict';
     this.element.insertBefore( insertedNode, adjacentNode );
     return this;
};

Componente.prototype.removeAttribute = function( name ) {
    'use strict';
    this.element.removeAttribute( name );
    return this;
};

Componente.prototype.removeChild = function( removedNode ) {
    'use strict';
    this.element.removeChild( removedNode );
    return this;
};

Componente.prototype.removeEventListener = function( type, handler ) {
   'use strict';
    this.element.removeEventListener( type, handler );
    return this;
};

Componente.prototype.scrollIntoView = function( alignWithTop ) {
   'use strict';
    this.element.scrollIntoView( alignWithTop );
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
Componente.prototype.css = function(property, value) {
   'use strict';
    var _w = getView(this.element);
    var _s = getStyles(this.element);

    if (property && typeof property == "string") {
        property = property.toLowerCase();
        var splited = property.split("-");
        if (splited && splited[1]) {
            property = splited[ 0 ] + capitalizeWord( splited[1] );
        }

        if (_s && hasProperty(_s, property) ) {
            if (value) {
                this.element.style[ property ] = value;
                return this;
            }
            return _s[ property ];
        }
    }
    return this;
};

Componente.prototype.hide = function() {
   'use strict';
    this.displayForm = this.css("display");
    this.css("display", "none");
    return this;
};

Componente.prototype.show = function() {
    'use strict';
    var _v = (this.displayForm || "block");
    this.css("display", _v);
    return this;
};


Componente.prototype.text = function(s) {
    'use strict';
    if (s) {
        if (this.element.childNodes[0] && this.element.childNodes[0].nodeValue) {
            this.element.childNodes[0].nodeValue = s;
        } else {
            this.element.textContent = s;
        }
        return this;
    }
    return this.element.childNodes[0].nodeValue;
};


/**
 *
 * @param {*} window
 * @param {*} undefined
 */
var ComponenteConstructor = function() {
    'use strict';

    this.cmp   = new Componente();
    this._self = this;

    this.msgComponent = alert;
};


ComponenteConstructor.prototype.createElement = function(tipo) {
    'use strict';

    tipo = (tipo || "div");
    this.cmp = new Componente(tipo);
    return this;
};


ComponenteConstructor.prototype.setId = function(id) {
    return this.setAttribute("id", id);
};

ComponenteConstructor.prototype.setClassName = function(classes) {
     this.cmp.setClassName(classes);
     return this;
};


ComponenteConstructor.prototype.addClassName = function(classes) {
    this.cmp.addClassName(classes);
    return this;
};


ComponenteConstructor.prototype.addEventListener = function(type, handler, bubble) {
    this.cmp.addEventListener(type, handler, bubble);
    return this;
};

ComponenteConstructor.prototype.css = function(property, value) {
    this.cmp.css(property, value);
    return this;
};

ComponenteConstructor.prototype.hide = function() {
    this.cmp.css("visibility", "none");
    return this;
};

ComponenteConstructor.prototype.show = function() {
    this.cmp.css("visibility", "");
    return this;
};

ComponenteConstructor.prototype.setText = function(s) {
    this.cmp.text(s);
    return this;
};



/**
 *
 */
ComponenteConstructor.prototype.setAttribute = function(attributeName, attributeValue) {
    'use strict';

    this.cmp.setAttribute(attributeName, attributeValue);
    return this;
};

ComponenteConstructor.prototype.get = function() {
    'use strict';
    return this.cmp;
};
