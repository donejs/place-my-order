/*can-simple-dom@0.2.15#simple-dom/document/node*/
define('can-simple-dom@0.2.15#simple-dom/document/node', [
    'exports',
    'module'
], function (exports, module) {
    'use strict';
    function Node(nodeType, nodeName, nodeValue, ownerDocument) {
        this.nodeType = nodeType;
        this.nodeName = nodeName;
        this.nodeValue = nodeValue;
        this.ownerDocument = ownerDocument;
        this.childNodes = new ChildNodes(this);
        this.parentNode = null;
        this.previousSibling = null;
        this.nextSibling = null;
        this.firstChild = null;
        this.lastChild = null;
    }
    Node.prototype._cloneNode = function () {
        return new Node(this.nodeType, this.nodeName, this.nodeValue, this.ownerDocument);
    };
    Node.prototype.cloneNode = function (deep) {
        var node = this._cloneNode();
        if (deep) {
            var child = this.firstChild, nextChild = child;
            while (nextChild) {
                nextChild = child.nextSibling;
                node.appendChild(child.cloneNode(true));
                child = nextChild;
            }
        }
        return node;
    };
    Node.prototype.appendChild = function (node) {
        if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            insertFragment(node, this, this.lastChild, null);
            return node;
        }
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
        node.parentNode = this;
        var refNode = this.lastChild;
        if (refNode === null) {
            this.firstChild = node;
            this.lastChild = node;
        } else {
            node.previousSibling = refNode;
            refNode.nextSibling = node;
            this.lastChild = node;
        }
        return node;
    };
    function insertFragment(fragment, newParent, before, after) {
        if (!fragment.firstChild) {
            return;
        }
        var firstChild = fragment.firstChild;
        var lastChild = firstChild;
        var node = firstChild;
        firstChild.previousSibling = before;
        if (before) {
            before.nextSibling = firstChild;
        } else {
            newParent.firstChild = firstChild;
        }
        while (node) {
            node.parentNode = newParent;
            lastChild = node;
            node = node.nextSibling;
        }
        lastChild.nextSibling = after;
        if (after) {
            after.previousSibling = lastChild;
        } else {
            newParent.lastChild = lastChild;
        }
        fragment.firstChild = null;
        fragment.lastChild = null;
    }
    Node.prototype.insertBefore = function (node, refNode) {
        if (refNode == null) {
            return this.appendChild(node);
        }
        if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            insertFragment(node, this, refNode ? refNode.previousSibling : null, refNode);
            return node;
        }
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
        node.parentNode = this;
        var previousSibling = refNode.previousSibling;
        if (previousSibling) {
            previousSibling.nextSibling = node;
            node.previousSibling = previousSibling;
        }
        refNode.previousSibling = node;
        node.nextSibling = refNode;
        if (this.firstChild === refNode) {
            this.firstChild = node;
        }
        return node;
    };
    Node.prototype.removeChild = function (refNode) {
        if (this.firstChild === refNode) {
            this.firstChild = refNode.nextSibling;
        }
        if (this.lastChild === refNode) {
            this.lastChild = refNode.previousSibling;
        }
        if (refNode.previousSibling) {
            refNode.previousSibling.nextSibling = refNode.nextSibling;
        }
        if (refNode.nextSibling) {
            refNode.nextSibling.previousSibling = refNode.previousSibling;
        }
        refNode.parentNode = null;
        refNode.nextSibling = null;
        refNode.previousSibling = null;
    };
    Node.prototype.addEventListener = function () {
    };
    Node.prototype.removeEventListner = function () {
    };
    Node.ELEMENT_NODE = 1;
    Node.ATTRIBUTE_NODE = 2;
    Node.TEXT_NODE = 3;
    Node.CDATA_SECTION_NODE = 4;
    Node.ENTITY_REFERENCE_NODE = 5;
    Node.ENTITY_NODE = 6;
    Node.PROCESSING_INSTRUCTION_NODE = 7;
    Node.COMMENT_NODE = 8;
    Node.DOCUMENT_NODE = 9;
    Node.DOCUMENT_TYPE_NODE = 10;
    Node.DOCUMENT_FRAGMENT_NODE = 11;
    Node.NOTATION_NODE = 12;
    function ChildNodes(node) {
        this.node = node;
    }
    ChildNodes.prototype.item = function (index) {
        var child = this.node.firstChild;
        for (var i = 0; child && index !== i; i++) {
            child = child.nextSibling;
        }
        return child;
    };
    module.exports = Node;
});
/*can-simple-dom@0.2.15#simple-dom/document/element*/
define('can-simple-dom@0.2.15#simple-dom/document/element', [
    'exports',
    'module',
    './node'
], function (exports, module, _node) {
    'use strict';
    var _interopRequire = function (obj) {
        return obj && obj.__esModule ? obj['default'] : obj;
    };
    var Node = _interopRequire(_node);
    function Element(tagName, ownerDocument) {
        tagName = tagName.toUpperCase();
        this.nodeConstructor(1, tagName, null, ownerDocument);
        this.style = {};
        this.attributes = [];
        this.tagName = tagName;
    }
    Element.prototype = Object.create(Node.prototype);
    Element.prototype.constructor = Element;
    Element.prototype.nodeConstructor = Node;
    Element.prototype._cloneNode = function () {
        var node = this.ownerDocument.createElement(this.tagName);
        node.attributes = this.attributes.map(function (attr) {
            return {
                name: attr.name,
                value: attr.value,
                specified: attr.specified
            };
        });
        return node;
    };
    Element.prototype.getAttribute = function (_name) {
        var attributes = this.attributes;
        var name = _name.toLowerCase();
        var attr;
        for (var i = 0, l = attributes.length; i < l; i++) {
            attr = attributes[i];
            if (attr.name === name) {
                return attr.value;
            }
        }
        return null;
    };
    Element.prototype.setAttribute = function (_name, value) {
        var attributes = this.attributes;
        var name = _name.toLowerCase();
        var attr;
        for (var i = 0, l = attributes.length; i < l; i++) {
            attr = attributes[i];
            if (attr.name === name) {
                attr.value = value;
                return;
            }
        }
        attributes.push({
            name: name,
            value: value,
            specified: true
        });
        attributes[name] = value;
    };
    Element.prototype.removeAttribute = function (name) {
        var attributes = this.attributes;
        for (var i = 0, l = attributes.length; i < l; i++) {
            var attr = attributes[i];
            if (attr.name === name) {
                attributes.splice(i, 1);
                delete attributes[name];
                return;
            }
        }
    };
    Element.prototype.getElementsByTagName = function (name) {
        name = name.toUpperCase();
        var elements = [];
        var cur = this.firstChild;
        while (cur) {
            if (cur.nodeType === Node.ELEMENT_NODE) {
                if (cur.nodeName === name || name === '*') {
                    elements.push(cur);
                }
                elements.push.apply(elements, cur.getElementsByTagName(name));
            }
            cur = cur.nextSibling;
        }
        return elements;
    };
    Element.prototype.contains = function (child) {
        child = child.parentNode;
        while (child) {
            if (child === this) {
                return true;
            }
            child = child.parentNode;
        }
        return false;
    };
    Element.prototype.getElementById = function (id) {
        var cur = this.firstChild, child;
        while (cur) {
            if (cur.attributes && cur.attributes.length) {
                var attr;
                for (var i = 0, len = cur.attributes.length; i < len; i++) {
                    attr = cur.attributes[i];
                    if (attr.name === 'id' && attr.value === id) {
                        return cur;
                    }
                }
            }
            if (cur.getElementById) {
                child = cur.getElementById(id);
                if (child) {
                    return child;
                }
            }
            cur = cur.nextSibling;
        }
    };
    module.exports = Element;
});
/*can-simple-dom@0.2.15#simple-dom/document/text*/
define('can-simple-dom@0.2.15#simple-dom/document/text', [
    'exports',
    'module',
    './node'
], function (exports, module, _node) {
    'use strict';
    var _interopRequire = function (obj) {
        return obj && obj.__esModule ? obj['default'] : obj;
    };
    var Node = _interopRequire(_node);
    function Text(text, ownerDocument) {
        this.nodeConstructor(3, '#text', text, ownerDocument);
    }
    Text.prototype._cloneNode = function () {
        return this.ownerDocument.createTextNode(this.nodeValue);
    };
    Text.prototype = Object.create(Node.prototype);
    Text.prototype.constructor = Text;
    Text.prototype.nodeConstructor = Node;
    module.exports = Text;
});
/*can-simple-dom@0.2.15#simple-dom/document/comment*/
define('can-simple-dom@0.2.15#simple-dom/document/comment', [
    'exports',
    'module',
    './node'
], function (exports, module, _node) {
    'use strict';
    var _interopRequire = function (obj) {
        return obj && obj.__esModule ? obj['default'] : obj;
    };
    var Node = _interopRequire(_node);
    function Comment(text, ownerDocument) {
        this.nodeConstructor(8, '#comment', text, ownerDocument);
    }
    Comment.prototype._cloneNode = function () {
        return this.ownerDocument.createComment(this.nodeValue);
    };
    Comment.prototype = Object.create(Node.prototype);
    Comment.prototype.constructor = Comment;
    Comment.prototype.nodeConstructor = Node;
    module.exports = Comment;
});
/*can-simple-dom@0.2.15#simple-dom/document/document-fragment*/
define('can-simple-dom@0.2.15#simple-dom/document/document-fragment', [
    'exports',
    'module',
    './node'
], function (exports, module, _node) {
    'use strict';
    var _interopRequire = function (obj) {
        return obj && obj.__esModule ? obj['default'] : obj;
    };
    var Node = _interopRequire(_node);
    function DocumentFragment(ownerDocument) {
        this.nodeConstructor(11, '#document-fragment', null, ownerDocument);
    }
    DocumentFragment.prototype._cloneNode = function () {
        return this.ownerDocument.createDocumentFragment();
    };
    DocumentFragment.prototype = Object.create(Node.prototype);
    DocumentFragment.prototype.constructor = DocumentFragment;
    DocumentFragment.prototype.nodeConstructor = Node;
    module.exports = DocumentFragment;
});
/*micro-location@0.1.4#lib/micro-location*/
define('micro-location@0.1.4#lib/micro-location', [
    'module',
    '@loader'
], function (module, loader) {
    loader.get('@@global-helpers').prepareGlobal(module.id, []);
    var define = loader.global.define;
    var require = loader.global.require;
    var source = '/**\n * https://github.com/cho45/micro-location.js\n * (c) cho45 http://cho45.github.com/mit-license\n */\n// immutable object, should not assign a value to properties\nfunction Location () { this.init.apply(this, arguments) }\nLocation.prototype = {\n\tinit : function (protocol, host, hostname, port, pathname, search, hash) {\n\t\tthis.protocol  = protocol;\n\t\tthis.host      = host;\n\t\tthis.hostname  = hostname;\n\t\tthis.port      = port || "";\n\t\tthis.pathname  = pathname || "";\n\t\tthis.search    = search || "";\n\t\tthis.hash      = hash || "";\n\t\tif (protocol) {\n\t\t\twith (this) this.href = protocol + \'//\' + host + pathname + search + hash;\n\t\t} else\n\t\tif (host) {\n\t\t\twith (this) this.href = \'//\' + host + pathname + search + hash;\n\t\t} else {\n\t\t\twith (this) this.href = pathname + search + hash;\n\t\t}\n\t},\n\n\tparams : function (name) {\n\t\tif (!this._params) {\n\t\t\tvar params = {};\n\n\t\t\tvar pairs = this.search.substring(1).split(/[;&]/);\n\t\t\tfor (var i = 0, len = pairs.length; i < len; i++) {\n\t\t\t\tif (!pairs[i]) continue;\n\t\t\t\tvar pair = pairs[i].split(/=/);\n\t\t\t\tvar key  = decodeURIComponent(pair[0].replace(/\\+/g, \'%20\'));\n\t\t\t\tvar val  = decodeURIComponent(pair[1].replace(/\\+/g, \'%20\'));\n\n\t\t\t\tif (!params[key]) params[key] = [];\n\t\t\t\tparams[key].push(val);\n\t\t\t}\n\n\t\t\tthis._params = params;\n\t\t}\n\n\t\tswitch (typeof name) {\n\t\t\tcase "undefined": return this._params;\n\t\t\tcase "object"   : return this.build(name);\n\t\t}\n\t\treturn this._params[name] ? this._params[name][0] : null;\n\t},\n\n\tbuild : function (params) {\n\t\tif (!params) params = this._params;\n\n\t\tvar ret = new Location();\n\t\tvar _search = this.search;\n\t\tif (params) {\n\t\t\tvar search = [];\n\t\t\tfor (var key in params) if (params.hasOwnProperty(key)) {\n\t\t\t\tvar val = params[key];\n\t\t\t\tswitch (typeof val) {\n\t\t\t\t\tcase "object":\n\t\t\t\t\t\tfor (var i = 0, len = val.length; i < len; i++) {\n\t\t\t\t\t\t\tsearch.push(encodeURIComponent(key) + \'=\' + encodeURIComponent(val[i]));\n\t\t\t\t\t\t}\n\t\t\t\t\t\tbreak;\n\t\t\t\t\tdefault:\n\t\t\t\t\t\tsearch.push(encodeURIComponent(key) + \'=\' + encodeURIComponent(val));\n\t\t\t\t}\n\t\t\t}\n\t\t\t_search = \'?\' + search.join(\'&\');\n\t\t}\n\n\t\twith (this) ret.init.apply(ret, [\n\t\t\tprotocol,\n\t\t\thost,\n\t\t\thostname,\n\t\t\tport,\n\t\t\tpathname,\n\t\t\t_search,\n\t\t\thash\n\t\t]);\n\t\treturn ret;\n\t}\n};\nLocation.regexp = new RegExp(\'^(?:(https?:)//(([^:/]+)(:[^/]+)?))?([^#?]*)(\\\\?[^#]*)?(#.*)?$\');\nLocation.parse = function (string) {\n\tvar matched = String(string).match(this.regexp);\n\tvar ret = new Location();\n\tret.init.apply(ret, matched.slice(1));\n\treturn ret;\n};\n\nthis.Location = Location;\n';
    loader.global.define = undefined;
    loader.global.module = undefined;
    loader.global.exports = undefined;
    loader.__exec({
        'source': source,
        'address': module.uri
    });
    loader.global.require = require;
    loader.global.define = define;
    return loader.get('@@global-helpers').retrieveGlobal(module.id, false);
});
/*can-simple-dom@0.2.15#simple-dom/extend*/
define('can-simple-dom@0.2.15#simple-dom/extend', [
    'exports',
    'module'
], function (exports, module) {
    'use strict';
    module.exports = function (a, b) {
        for (var p in b) {
            a[p] = b[p];
        }
        return a;
    };
});
/*can-simple-dom@0.2.15#simple-dom/document/anchor-element*/
define('can-simple-dom@0.2.15#simple-dom/document/anchor-element', [
    'exports',
    'module',
    './element',
    'micro-location',
    '../extend'
], function (exports, module, _element, _microLocation, _extend) {
    'use strict';
    var _interopRequire = function (obj) {
        return obj && obj.__esModule ? obj['default'] : obj;
    };
    var Element = _interopRequire(_element);
    var Location = _interopRequire(_microLocation);
    var extend = _interopRequire(_extend);
    function AnchorElement(tagName, ownerDocument) {
        this.elementConstructor(tagName, ownerDocument);
        extend(this, Location.parse(''));
    }
    AnchorElement.prototype = Object.create(Element.prototype);
    AnchorElement.prototype.constructor = AnchorElement;
    AnchorElement.prototype.elementConstructor = Element;
    AnchorElement.prototype.setAttribute = function (_name, value) {
        Element.prototype.setAttribute.apply(this, arguments);
        if (_name.toLowerCase() === 'href') {
            extend(this, Location.parse(value));
        }
    };
    module.exports = AnchorElement;
});
/*can-simple-dom@0.2.15#simple-dom/document*/
define('can-simple-dom@0.2.15#simple-dom/document', [
    'exports',
    'module',
    './document/node',
    './document/element',
    './document/text',
    './document/comment',
    './document/document-fragment',
    './document/anchor-element'
], function (exports, module, _documentNode, _documentElement, _documentText, _documentComment, _documentDocumentFragment, _documentAnchorElement) {
    'use strict';
    var _interopRequire = function (obj) {
        return obj && obj.__esModule ? obj['default'] : obj;
    };
    var Node = _interopRequire(_documentNode);
    var Element = _interopRequire(_documentElement);
    var Text = _interopRequire(_documentText);
    var Comment = _interopRequire(_documentComment);
    var DocumentFragment = _interopRequire(_documentDocumentFragment);
    var AnchorElement = _interopRequire(_documentAnchorElement);
    function Document() {
        this.nodeConstructor(9, '#document', null, this);
        this.documentElement = new Element('html', this);
        this.body = new Element('body', this);
        this.documentElement.appendChild(this.body);
        this.appendChild(this.documentElement);
    }
    Document.prototype = Object.create(Node.prototype);
    Document.prototype.constructor = Document;
    Document.prototype.nodeConstructor = Node;
    var specialElements = { a: AnchorElement };
    Document.prototype.createElement = function (tagName) {
        var Special = specialElements[tagName.toLowerCase()];
        if (Special) {
            return new Special(tagName, this);
        }
        return new Element(tagName, this);
    };
    Document.prototype.createTextNode = function (text) {
        return new Text(text, this);
    };
    Document.prototype.createComment = function (text) {
        return new Comment(text, this);
    };
    Document.prototype.createDocumentFragment = function () {
        return new DocumentFragment(this);
    };
    Document.prototype.getElementsByTagName = function (name) {
        name = name.toUpperCase();
        var elements = [];
        var cur = this.firstChild;
        while (cur) {
            if (cur.nodeType === Node.ELEMENT_NODE) {
                if (cur.nodeName === name || name === '*') {
                    elements.push(cur);
                }
                elements.push.apply(elements, cur.getElementsByTagName(name));
            }
            cur = cur.nextSibling;
        }
        return elements;
    };
    Document.prototype.getElementById = function (id) {
        return Element.prototype.getElementById.apply(this.documentElement, arguments);
    };
    if (Object.defineProperty) {
        Object.defineProperty(Document.prototype, 'currentScript', {
            get: function () {
                var scripts = this.getElementsByTagName('script');
                var first = scripts[scripts.length - 1];
                if (!first) {
                    first = this.createElement('script');
                }
                return first;
            }
        });
    }
    module.exports = Document;
});
/*can-simple-dom@0.2.15#simple-dom/html-parser*/
define('can-simple-dom@0.2.15#simple-dom/html-parser', [
    'exports',
    'module'
], function (exports, module) {
    'use strict';
    function HTMLParser(tokenize, document, voidMap) {
        this.tokenize = tokenize;
        this.document = document;
        this.voidMap = voidMap;
        this.parentStack = [];
    }
    HTMLParser.prototype.isVoid = function (element) {
        return this.voidMap[element.nodeName] === true;
    };
    HTMLParser.prototype.pushElement = function (token) {
        var el = this.document.createElement(token.tagName);
        for (var i = 0; i < token.attributes.length; i++) {
            var attr = token.attributes[i];
            el.setAttribute(attr[0], attr[1]);
        }
        if (this.isVoid(el)) {
            return this.appendChild(el);
        }
        this.parentStack.push(el);
    };
    HTMLParser.prototype.popElement = function (token) {
        var el = this.parentStack.pop();
        if (el.nodeName !== token.tagName.toUpperCase()) {
            throw new Error('unbalanced tag');
        }
        this.appendChild(el);
    };
    HTMLParser.prototype.appendText = function (token) {
        var text = this.document.createTextNode(token.chars);
        this.appendChild(text);
    };
    HTMLParser.prototype.appendComment = function (token) {
        var comment = this.document.createComment(token.chars);
        this.appendChild(comment);
    };
    HTMLParser.prototype.appendChild = function (node) {
        var parentNode = this.parentStack[this.parentStack.length - 1];
        parentNode.appendChild(node);
    };
    HTMLParser.prototype.parse = function (html) {
        var fragment = this.document.createDocumentFragment();
        this.parentStack.push(fragment);
        var tokens = this.tokenize(html);
        for (var i = 0, l = tokens.length; i < l; i++) {
            var token = tokens[i];
            switch (token.type) {
            case 'StartTag':
                this.pushElement(token);
                break;
            case 'EndTag':
                this.popElement(token);
                break;
            case 'Chars':
                this.appendText(token);
                break;
            case 'Comment':
                this.appendComment(token);
                break;
            }
        }
        return this.parentStack.pop();
    };
    module.exports = HTMLParser;
});
/*can-simple-dom@0.2.15#simple-dom/html-serializer*/
define('can-simple-dom@0.2.15#simple-dom/html-serializer', [
    'exports',
    'module'
], function (exports, module) {
    'use strict';
    function HTMLSerializer(voidMap) {
        this.voidMap = voidMap;
    }
    HTMLSerializer.prototype.openTag = function (element) {
        return '<' + element.nodeName.toLowerCase() + this.attributes(element.attributes) + '>';
    };
    HTMLSerializer.prototype.closeTag = function (element) {
        return '</' + element.nodeName.toLowerCase() + '>';
    };
    HTMLSerializer.prototype.isVoid = function (element) {
        return this.voidMap[element.nodeName] === true;
    };
    HTMLSerializer.prototype.attributes = function (namedNodeMap) {
        var buffer = '';
        for (var i = 0, l = namedNodeMap.length; i < l; i++) {
            buffer += this.attr(namedNodeMap[i]);
        }
        return buffer;
    };
    HTMLSerializer.prototype.escapeAttrValue = function (attrValue) {
        return attrValue.replace(/[&"]/g, function (match) {
            switch (match) {
            case '&':
                return '&amp;';
            case '"':
                return '&quot;';
            }
        });
    };
    HTMLSerializer.prototype.attr = function (attr) {
        if (!attr.specified) {
            return '';
        }
        if (attr.value) {
            return ' ' + attr.name + '="' + this.escapeAttrValue(attr.value) + '"';
        }
        return ' ' + attr.name;
    };
    HTMLSerializer.prototype.escapeText = function (textNodeValue) {
        return textNodeValue.replace(/[&<>]/g, function (match) {
            switch (match) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            }
        });
    };
    HTMLSerializer.prototype.text = function (text) {
        var parentNode = text.parentNode;
        if (parentNode && (parentNode.nodeName === 'STYLE' || parentNode.nodeName === 'SCRIPT')) {
            return text.nodeValue;
        }
        return this.escapeText(text.nodeValue);
    };
    HTMLSerializer.prototype.comment = function (comment) {
        return '<!--' + comment.nodeValue + '-->';
    };
    HTMLSerializer.prototype.serialize = function (node) {
        var buffer = '';
        var next;
        switch (node.nodeType) {
        case 1:
            buffer += this.openTag(node);
            break;
        case 3:
            buffer += this.text(node);
            break;
        case 8:
            buffer += this.comment(node);
            break;
        default:
            break;
        }
        next = node.firstChild;
        if (next) {
            buffer += this.serialize(next);
        }
        if (node.nodeType === 1 && !this.isVoid(node)) {
            buffer += this.closeTag(node);
        }
        next = node.nextSibling;
        if (next) {
            buffer += this.serialize(next);
        }
        return buffer;
    };
    module.exports = HTMLSerializer;
});
/*can-simple-dom@0.2.15#simple-dom/void-map*/
define('can-simple-dom@0.2.15#simple-dom/void-map', [
    'exports',
    'module'
], function (exports, module) {
    'use strict';
    module.exports = {
        AREA: true,
        BASE: true,
        BR: true,
        COL: true,
        COMMAND: true,
        EMBED: true,
        HR: true,
        IMG: true,
        INPUT: true,
        KEYGEN: true,
        LINK: true,
        META: true,
        PARAM: true,
        SOURCE: true,
        TRACK: true,
        WBR: true
    };
});
/*can-simple-dom@0.2.15#simple-dom/dom*/
define('can-simple-dom@0.2.15#simple-dom/dom', [
    'exports',
    './document/node',
    './document/element',
    './document',
    './html-parser',
    './html-serializer',
    './void-map'
], function (exports, _documentNode, _documentElement, _document, _htmlParser, _htmlSerializer, _voidMap) {
    'use strict';
    var _interopRequire = function (obj) {
        return obj && obj.__esModule ? obj['default'] : obj;
    };
    var Node = _interopRequire(_documentNode);
    var Element = _interopRequire(_documentElement);
    var Document = _interopRequire(_document);
    var HTMLParser = _interopRequire(_htmlParser);
    var HTMLSerializer = _interopRequire(_htmlSerializer);
    var voidMap = _interopRequire(_voidMap);
    exports.Node = Node;
    exports.Element = Element;
    exports.Document = Document;
    exports.HTMLParser = HTMLParser;
    exports.HTMLSerializer = HTMLSerializer;
    exports.voidMap = voidMap;
    Object.defineProperty(exports, '__esModule', { value: true });
});
/*can-simple-dom@0.2.15#simple-dom*/
define('can-simple-dom@0.2.15#simple-dom', [
    'exports',
    './simple-dom/dom'
], function (exports, _simpleDomDom) {
    'use strict';
    var _interopRequireWildcard = function (obj) {
        return obj && obj.__esModule ? obj : { 'default': obj };
    };
    var _defaults = function (obj, defaults) {
        var keys = Object.getOwnPropertyNames(defaults);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = Object.getOwnPropertyDescriptor(defaults, key);
            if (value && value.configurable && obj[key] === undefined) {
                Object.defineProperty(obj, key, value);
            }
        }
        return obj;
    };
    var SimpleDOM = _simpleDomDom;
    if (typeof window !== 'undefined') {
        window.SimpleDOM = SimpleDOM;
    }
    _defaults(exports, _interopRequireWildcard(_simpleDomDom));
    Object.defineProperty(exports, '__esModule', { value: true });
});
/*can@2.3.0-pre.3#util/vdom/build_fragment/make_parser*/
define('can@2.3.0-pre.3#util/vdom/build_fragment/make_parser', [
    'can/view/parser/parser',
    'can-simple-dom/can-simple-dom'
], function (canParser, simpleDOM) {
    return function (document) {
        return new simpleDOM.HTMLParser(function (string) {
            var tokens = [];
            var currentTag, currentAttr;
            canParser(string, {
                start: function (tagName, unary) {
                    currentTag = {
                        type: 'StartTag',
                        attributes: [],
                        tagName: tagName
                    };
                },
                end: function (tagName, unary) {
                    tokens.push(currentTag);
                    currentTag = undefined;
                },
                close: function (tagName) {
                    tokens.push({
                        type: 'EndTag',
                        tagName: tagName
                    });
                },
                attrStart: function (attrName) {
                    currentAttr = [
                        attrName,
                        ''
                    ];
                    currentTag.attributes.push(currentAttr);
                },
                attrEnd: function (attrName) {
                },
                attrValue: function (value) {
                    currentAttr[1] += value;
                },
                chars: function (value) {
                    tokens.push({
                        type: 'Chars',
                        chars: value
                    });
                },
                comment: function (value) {
                    tokens.push({
                        type: 'Comment',
                        chars: value
                    });
                },
                special: function (value) {
                },
                done: function () {
                }
            });
            return tokens;
        }, document, simpleDOM.voidMap);
    };
});
/*can@2.3.0-pre.3#util/vdom/vdom*/
define('can@2.3.0-pre.3#util/vdom/vdom', [
    'can/util/can',
    'can-simple-dom/can-simple-dom',
    './build_fragment/make_parser'
], function (can, simpleDOM, makeParser) {
    var document = new simpleDOM.Document();
    var serializer = new simpleDOM.HTMLSerializer(simpleDOM.voidMap);
    var parser = makeParser(document);
    if (Object.defineProperty) {
        var descriptor = function (outerHtml) {
            return {
                get: function () {
                    return serializer.serialize(outerHtml ? this : this.firstChild);
                },
                set: function (html) {
                    var cur = this.firstChild;
                    while (cur) {
                        this.removeChild(cur);
                        cur = this.firstChild;
                    }
                    if ('' + html) {
                        var frag = parser.parse('' + html);
                        this.appendChild(frag);
                    }
                }
            };
        };
        Object.defineProperty(simpleDOM.Element.prototype, 'innerHTML', descriptor());
        Object.defineProperty(simpleDOM.Element.prototype, 'outerHTML', descriptor(true));
    }
    var global = can.global;
    global.document = document;
    global.window = global;
    global.addEventListener = function () {
    };
    global.removeEventListener = function () {
    };
    global.location = {
        href: '',
        protocol: '',
        host: '',
        hostname: '',
        port: '',
        pathname: '',
        search: '',
        hash: ''
    };
    global.history = {
        pushState: can.k,
        replaceState: can.k
    };
});