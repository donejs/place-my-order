/*bit-tabs@0.1.0-pre.1#util*/
define('bit-tabs@0.1.0-pre.1#util', function (require, exports, module) {
    module.exports = { name: 'util' };
});
/*bit-tabs@0.1.0-pre.1#tabs.stache!can@2.3.0-pre.3#view/stache/system*/
define('bit-tabs@0.1.0-pre.1#tabs.stache!can@2.3.0-pre.3#view/stache/system', [
    'module',
    'can/view/stache/stache'
], function (module, stache) {
    var renderer = stache([
            {
                'tokenType': 'start',
                'args': [
                    'ul',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'special',
                'args': ['tabsClass']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'end',
                'args': [
                    'ul',
                    false
                ]
            },
            {
                'tokenType': 'special',
                'args': ['#panels']
            },
            {
                'tokenType': 'chars',
                'args': ['\n    ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'li',
                    false
                ]
            },
            {
                'tokenType': 'special',
                'args': ['#isActive']
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['active']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'special',
                'args': ['/isActive']
            },
            {
                'tokenType': 'attrStart',
                'args': ['can-click']
            },
            {
                'tokenType': 'attrValue',
                'args': ['makeActive']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['can-click']
            },
            {
                'tokenType': 'end',
                'args': [
                    'li',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n\t\t  ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'a',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['href']
            },
            {
                'tokenType': 'attrValue',
                'args': ['javascript://']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['href']
            },
            {
                'tokenType': 'end',
                'args': [
                    'a',
                    false
                ]
            },
            {
                'tokenType': 'special',
                'args': ['title']
            },
            {
                'tokenType': 'close',
                'args': ['a']
            },
            {
                'tokenType': 'chars',
                'args': ['\n\t']
            },
            {
                'tokenType': 'close',
                'args': ['li']
            },
            {
                'tokenType': 'special',
                'args': ['/panels']
            },
            {
                'tokenType': 'chars',
                'args': ['\n']
            },
            {
                'tokenType': 'close',
                'args': ['ul']
            },
            {
                'tokenType': 'chars',
                'args': ['\n']
            },
            {
                'tokenType': 'start',
                'args': [
                    'content',
                    false
                ]
            },
            {
                'tokenType': 'end',
                'args': [
                    'content',
                    false
                ]
            },
            {
                'tokenType': 'close',
                'args': ['content']
            },
            {
                'tokenType': 'chars',
                'args': ['\n']
            },
            {
                'tokenType': 'done',
                'args': []
            }
        ]);
    return function (scope, options) {
        var moduleOptions = { module: module };
        return renderer(scope, options ? options.add(moduleOptions) : moduleOptions);
    };
});
/*bit-tabs@0.1.0-pre.1#panel.stache!can@2.3.0-pre.3#view/stache/system*/
define('bit-tabs@0.1.0-pre.1#panel.stache!can@2.3.0-pre.3#view/stache/system', [
    'module',
    'can/view/stache/stache'
], function (module, stache) {
    var renderer = stache([
            {
                'tokenType': 'special',
                'args': ['#if active']
            },
            {
                'tokenType': 'start',
                'args': [
                    'content',
                    false
                ]
            },
            {
                'tokenType': 'end',
                'args': [
                    'content',
                    false
                ]
            },
            {
                'tokenType': 'close',
                'args': ['content']
            },
            {
                'tokenType': 'special',
                'args': ['/if']
            },
            {
                'tokenType': 'done',
                'args': []
            }
        ]);
    return function (scope, options) {
        var moduleOptions = { module: module };
        return renderer(scope, options ? options.add(moduleOptions) : moduleOptions);
    };
});
/*bit-tabs@0.1.0-pre.1#bit-tabs*/
define('bit-tabs@0.1.0-pre.1#bit-tabs', [
    'exports',
    'can',
    'can/view/stache/',
    './util',
    './tabs.stache!',
    './panel.stache!',
    './tabs.less!'
], function (exports, _can, _canViewStache, _util, _tabsStache, _panelStache, _tabsLess) {
    'use strict';
    var _interopRequire = function (obj) {
        return obj && obj.__esModule ? obj['default'] : obj;
    };
    var can = _interopRequire(_can);
    var stache = _interopRequire(_canViewStache);
    var util = _interopRequire(_util);
    var tabsStache = _interopRequire(_tabsStache);
    var panelStache = _interopRequire(_panelStache);
    var BitPanelVM = exports.BitPanelVM = can.Map.extend({ active: false });
    can.Component.extend({
        tag: 'bit-panel',
        template: panelStache,
        scope: BitPanelVM,
        events: {
            inserted: function () {
                this.element.parent().scope().addPanel(this.scope);
            },
            removed: function () {
                this.element.parent().scope().removePanel(this.scope);
            }
        }
    });
    var BitTabsVM = exports.BitTabsVM = can.Map.extend({
            panels: [],
            tabsClass: '',
            addPanel: function (panel) {
                if (this.attr('panels').length === 0) {
                    this.makeActive(panel);
                }
                this.attr('panels').push(panel);
            },
            removePanel: function (panel) {
                var panels = this.attr('panels');
                can.batch.start();
                panels.splice(panels.indexOf(panel), 1);
                if (panel === this.attr('active')) {
                    if (panels.length) {
                        this.makeActive(panels[0]);
                    } else {
                        this.removeAttr('active');
                    }
                }
                can.batch.stop();
            },
            makeActive: function (panel) {
                this.attr('active', panel);
                this.attr('panels').each(function (panel) {
                    panel.attr('active', false);
                });
                panel.attr('active', true);
            },
            isActive: function (panel) {
                return this.attr('active') === panel;
            }
        });
    can.Component.extend({
        tag: 'bit-tabs',
        template: tabsStache,
        scope: BitTabsVM
    });
    Object.defineProperty(exports, '__esModule', { value: true });
});
/*pmo/order/details.component/template*/
define('pmo/order/details.component/template', [
    'can/view/stache/stache',
    'can/component/component'
], function (stache) {
    return stache([
        {
            'tokenType': 'special',
            'args': ['#order']
        },
        {
            'tokenType': 'chars',
            'args': ['\n      ']
        },
        {
            'tokenType': 'start',
            'args': [
                'h3',
                false
            ]
        },
        {
            'tokenType': 'end',
            'args': [
                'h3',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['Thanks for your order ']
        },
        {
            'tokenType': 'special',
            'args': ['name']
        },
        {
            'tokenType': 'chars',
            'args': ['!']
        },
        {
            'tokenType': 'close',
            'args': ['h3']
        },
        {
            'tokenType': 'chars',
            'args': ['\n      ']
        },
        {
            'tokenType': 'start',
            'args': [
                'div',
                false
            ]
        },
        {
            'tokenType': 'end',
            'args': [
                'div',
                false
            ]
        },
        {
            'tokenType': 'start',
            'args': [
                'label',
                false
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['class']
        },
        {
            'tokenType': 'attrValue',
            'args': ['control-label']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['class']
        },
        {
            'tokenType': 'end',
            'args': [
                'label',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['Confirmation Number: ']
        },
        {
            'tokenType': 'special',
            'args': ['_id']
        },
        {
            'tokenType': 'close',
            'args': ['label']
        },
        {
            'tokenType': 'close',
            'args': ['div']
        },
        {
            'tokenType': 'chars',
            'args': ['\n\n      ']
        },
        {
            'tokenType': 'start',
            'args': [
                'h4',
                false
            ]
        },
        {
            'tokenType': 'end',
            'args': [
                'h4',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['Items ordered:']
        },
        {
            'tokenType': 'close',
            'args': ['h4']
        },
        {
            'tokenType': 'chars',
            'args': ['\n      ']
        },
        {
            'tokenType': 'start',
            'args': [
                'ul',
                false
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['class']
        },
        {
            'tokenType': 'attrValue',
            'args': ['list-group panel']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['class']
        },
        {
            'tokenType': 'end',
            'args': [
                'ul',
                false
            ]
        },
        {
            'tokenType': 'special',
            'args': ['#each items']
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
        },
        {
            'tokenType': 'start',
            'args': [
                'li',
                false
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['class']
        },
        {
            'tokenType': 'attrValue',
            'args': ['list-group-item']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['class']
        },
        {
            'tokenType': 'end',
            'args': [
                'li',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['\n            ']
        },
        {
            'tokenType': 'start',
            'args': [
                'label',
                false
            ]
        },
        {
            'tokenType': 'end',
            'args': [
                'label',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['\n              ']
        },
        {
            'tokenType': 'special',
            'args': ['name']
        },
        {
            'tokenType': 'chars',
            'args': [' ']
        },
        {
            'tokenType': 'start',
            'args': [
                'span',
                false
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['class']
        },
        {
            'tokenType': 'attrValue',
            'args': ['badge']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['class']
        },
        {
            'tokenType': 'end',
            'args': [
                'span',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['$']
        },
        {
            'tokenType': 'special',
            'args': ['price']
        },
        {
            'tokenType': 'close',
            'args': ['span']
        },
        {
            'tokenType': 'chars',
            'args': ['\n            ']
        },
        {
            'tokenType': 'close',
            'args': ['label']
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
        },
        {
            'tokenType': 'close',
            'args': ['li']
        },
        {
            'tokenType': 'special',
            'args': ['/each']
        },
        {
            'tokenType': 'chars',
            'args': ['\n\n        ']
        },
        {
            'tokenType': 'start',
            'args': [
                'li',
                false
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['class']
        },
        {
            'tokenType': 'attrValue',
            'args': ['list-group-item']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['class']
        },
        {
            'tokenType': 'end',
            'args': [
                'li',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
        },
        {
            'tokenType': 'start',
            'args': [
                'label',
                false
            ]
        },
        {
            'tokenType': 'end',
            'args': [
                'label',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['Total ']
        },
        {
            'tokenType': 'start',
            'args': [
                'span',
                false
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['class']
        },
        {
            'tokenType': 'attrValue',
            'args': ['badge']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['class']
        },
        {
            'tokenType': 'end',
            'args': [
                'span',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['$']
        },
        {
            'tokenType': 'special',
            'args': ['total']
        },
        {
            'tokenType': 'close',
            'args': ['span']
        },
        {
            'tokenType': 'close',
            'args': ['label']
        },
        {
            'tokenType': 'chars',
            'args': ['\n        ']
        },
        {
            'tokenType': 'close',
            'args': ['li']
        },
        {
            'tokenType': 'chars',
            'args': ['\n      ']
        },
        {
            'tokenType': 'close',
            'args': ['ul']
        },
        {
            'tokenType': 'chars',
            'args': ['\n\n      ']
        },
        {
            'tokenType': 'start',
            'args': [
                'div',
                false
            ]
        },
        {
            'tokenType': 'end',
            'args': [
                'div',
                false
            ]
        },
        {
            'tokenType': 'start',
            'args': [
                'label',
                false
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['class']
        },
        {
            'tokenType': 'attrValue',
            'args': ['control-label']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['class']
        },
        {
            'tokenType': 'end',
            'args': [
                'label',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['Phone: ']
        },
        {
            'tokenType': 'special',
            'args': ['phone']
        },
        {
            'tokenType': 'close',
            'args': ['label']
        },
        {
            'tokenType': 'close',
            'args': ['div']
        },
        {
            'tokenType': 'chars',
            'args': ['\n      ']
        },
        {
            'tokenType': 'start',
            'args': [
                'div',
                false
            ]
        },
        {
            'tokenType': 'end',
            'args': [
                'div',
                false
            ]
        },
        {
            'tokenType': 'start',
            'args': [
                'label',
                false
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['class']
        },
        {
            'tokenType': 'attrValue',
            'args': ['control-label']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['class']
        },
        {
            'tokenType': 'end',
            'args': [
                'label',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['Address: ']
        },
        {
            'tokenType': 'special',
            'args': ['address']
        },
        {
            'tokenType': 'close',
            'args': ['label']
        },
        {
            'tokenType': 'close',
            'args': ['div']
        },
        {
            'tokenType': 'special',
            'args': ['/order']
        },
        {
            'tokenType': 'chars',
            'args': ['\n  ']
        },
        {
            'tokenType': 'done',
            'args': []
        }
    ]);
});
/*pmo/order/details.component!done-component@0.1.0#component*/
define('pmo/order/details.component!done-component@0.1.0#component', [
    'can/component/component',
    'pmo/order/details.component/template'
], function (Component, template) {
    var __interop = function (m) {
        if (m && m['default']) {
            return m['default'];
        } else if (m)
            return m;
    };
    var viewModel = __interop(typeof viewModel !== 'undefined' ? viewModel : undefined);
    var ComponentConstructor = Component.extend({
            tag: 'pmo-order-details',
            template: __interop(typeof template !== 'undefined' ? template : undefined),
            viewModel: viewModel,
            events: __interop(typeof events !== 'undefined' ? events : undefined),
            helpers: __interop(typeof helpers !== 'undefined' ? helpers : undefined)
        });
    return {
        Component: ComponentConstructor,
        ViewModel: ComponentConstructor.Map,
        viewModel: viewModel
    };
});
/*pmo/order/phone/phone.component/template*/
define('pmo/order/phone/phone.component/template', [
    'can/view/stache/stache',
    'can/component/component'
], function (stache) {
    return stache([
        {
            'tokenType': 'chars',
            'args': ['\n    ']
        },
        {
            'tokenType': 'start',
            'args': [
                'div',
                false
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['class']
        },
        {
            'tokenType': 'attrValue',
            'args': ['form-group']
        },
        {
            'tokenType': 'special',
            'args': ['#if error']
        },
        {
            'tokenType': 'attrValue',
            'args': [' has-error']
        },
        {
            'tokenType': 'special',
            'args': ['/if']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['class']
        },
        {
            'tokenType': 'end',
            'args': [
                'div',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['\n      ']
        },
        {
            'tokenType': 'start',
            'args': [
                'label',
                false
            ]
        },
        {
            'tokenType': 'end',
            'args': [
                'label',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['Phone:']
        },
        {
            'tokenType': 'close',
            'args': ['label']
        },
        {
            'tokenType': 'chars',
            'args': ['\n      ']
        },
        {
            'tokenType': 'start',
            'args': [
                'input',
                true
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['name']
        },
        {
            'tokenType': 'attrValue',
            'args': ['phone']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['name']
        },
        {
            'tokenType': 'attrStart',
            'args': ['type']
        },
        {
            'tokenType': 'attrValue',
            'args': ['text']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['type']
        },
        {
            'tokenType': 'attrStart',
            'args': ['can-keyup']
        },
        {
            'tokenType': 'attrValue',
            'args': ['{setPhoneValue @element.val}']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['can-keyup']
        },
        {
            'tokenType': 'end',
            'args': [
                'input',
                true
            ]
        },
        {
            'tokenType': 'special',
            'args': ['#if error']
        },
        {
            'tokenType': 'chars',
            'args': ['\n        ']
        },
        {
            'tokenType': 'special',
            'args': ['#eq order.phone \'911\'']
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
        },
        {
            'tokenType': 'start',
            'args': [
                'p',
                false
            ]
        },
        {
            'tokenType': 'end',
            'args': [
                'p',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['That\'s not your real number :-(']
        },
        {
            'tokenType': 'close',
            'args': ['p']
        },
        {
            'tokenType': 'chars',
            'args': ['        ']
        },
        {
            'tokenType': 'special',
            'args': ['else']
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
        },
        {
            'tokenType': 'start',
            'args': [
                'p',
                false
            ]
        },
        {
            'tokenType': 'end',
            'args': [
                'p',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['Please enter a phone number in the format 555-555-5555']
        },
        {
            'tokenType': 'close',
            'args': ['p']
        },
        {
            'tokenType': 'special',
            'args': ['/eq']
        },
        {
            'tokenType': 'chars',
            'args': ['\n      ']
        },
        {
            'tokenType': 'special',
            'args': ['/if']
        },
        {
            'tokenType': 'chars',
            'args': ['\n    ']
        },
        {
            'tokenType': 'close',
            'args': ['div']
        },
        {
            'tokenType': 'chars',
            'args': ['\n  ']
        },
        {
            'tokenType': 'done',
            'args': []
        }
    ]);
});
/*pmo/order/phone/phone.component/view-model*/
define('pmo/order/phone/phone.component/view-model', [
    'exports',
    'module',
    'can/map/'
], function (exports, module, _canMap) {
    'use strict';
    var _interopRequire = function (obj) {
        return obj && obj.__esModule ? obj['default'] : obj;
    };
    var Map = _interopRequire(_canMap);
    module.exports = Map.extend({
        error: function () {
            if (!this.attr('order')) {
                return false;
            }
            var phone = this.attr('order').attr('phone');
            return phone && (!/^(\d|-)*$/.test(phone) || phone === '911');
        },
        setPhoneValue: function (val) {
            this.attr('order').attr('phone', val);
        }
    });
});
/*pmo/order/phone/phone.component!done-component@0.1.0#component*/
define('pmo/order/phone/phone.component!done-component@0.1.0#component', [
    'can/component/component',
    'pmo/order/phone/phone.component/template',
    'pmo/order/phone/phone.component/view-model',
    'pmo/order/phone/phone.component/style.css'
], function (Component, template, viewModel) {
    var __interop = function (m) {
        if (m && m['default']) {
            return m['default'];
        } else if (m)
            return m;
    };
    var viewModel = __interop(typeof viewModel !== 'undefined' ? viewModel : undefined);
    var ComponentConstructor = Component.extend({
            tag: 'pmo-order-phone',
            template: __interop(typeof template !== 'undefined' ? template : undefined),
            viewModel: viewModel,
            events: __interop(typeof events !== 'undefined' ? events : undefined),
            helpers: __interop(typeof helpers !== 'undefined' ? helpers : undefined)
        });
    return {
        Component: ComponentConstructor,
        ViewModel: ComponentConstructor.Map,
        viewModel: viewModel
    };
});
/*pmo/order/new/new.stache!can@2.3.0-pre.3#view/stache/system*/
define('pmo/order/new/new.stache!can@2.3.0-pre.3#view/stache/system', [
    'module',
    'can/view/stache/stache',
    'bit-tabs',
    'pmo/order/details.component!',
    'pmo/order/phone/phone.component!'
], function (module, stache) {
    var renderer = stache([
            {
                'tokenType': 'start',
                'args': [
                    'can-import',
                    true
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['from']
            },
            {
                'tokenType': 'attrValue',
                'args': ['bit-tabs']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['from']
            },
            {
                'tokenType': 'end',
                'args': [
                    'can-import',
                    true
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n']
            },
            {
                'tokenType': 'start',
                'args': [
                    'can-import',
                    true
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['from']
            },
            {
                'tokenType': 'attrValue',
                'args': ['pmo/order/details.component!']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['from']
            },
            {
                'tokenType': 'end',
                'args': [
                    'can-import',
                    true
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n']
            },
            {
                'tokenType': 'start',
                'args': [
                    'can-import',
                    true
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['from']
            },
            {
                'tokenType': 'attrValue',
                'args': ['pmo/order/phone/phone.component!']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['from']
            },
            {
                'tokenType': 'end',
                'args': [
                    'can-import',
                    true
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n\n']
            },
            {
                'tokenType': 'start',
                'args': [
                    'div',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['order-form']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'end',
                'args': [
                    'div',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n  ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'restaurant-model',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['get']
            },
            {
                'tokenType': 'attrValue',
                'args': ['{ _id=slug }']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['get']
            },
            {
                'tokenType': 'attrStart',
                'args': ['[restaurant]']
            },
            {
                'tokenType': 'attrValue',
                'args': ['{value}']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['[restaurant]']
            },
            {
                'tokenType': 'end',
                'args': [
                    'restaurant-model',
                    false
                ]
            },
            {
                'tokenType': 'special',
                'args': ['#if isPending']
            },
            {
                'tokenType': 'chars',
                'args': ['\n      ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'div',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['loading']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'end',
                'args': [
                    'div',
                    false
                ]
            },
            {
                'tokenType': 'close',
                'args': ['div']
            },
            {
                'tokenType': 'chars',
                'args': ['    ']
            },
            {
                'tokenType': 'special',
                'args': ['else']
            },
            {
                'tokenType': 'chars',
                'args': ['\n      ']
            },
            {
                'tokenType': 'special',
                'args': ['#value']
            },
            {
                'tokenType': 'special',
                'args': ['#if saveStatus.isResolved']
            },
            {
                'tokenType': 'chars',
                'args': ['\n          ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'pmo-order-details',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['order']
            },
            {
                'tokenType': 'attrValue',
                'args': ['{saveStatus.value}']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['order']
            },
            {
                'tokenType': 'end',
                'args': [
                    'pmo-order-details',
                    false
                ]
            },
            {
                'tokenType': 'close',
                'args': ['pmo-order-details']
            },
            {
                'tokenType': 'chars',
                'args': ['\n          ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'p',
                    false
                ]
            },
            {
                'tokenType': 'end',
                'args': [
                    'p',
                    false
                ]
            },
            {
                'tokenType': 'start',
                'args': [
                    'a',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['href']
            },
            {
                'tokenType': 'attrValue',
                'args': ['javascript://']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['href']
            },
            {
                'tokenType': 'attrStart',
                'args': ['(click)']
            },
            {
                'tokenType': 'attrValue',
                'args': ['{startNewOrder}']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['(click)']
            },
            {
                'tokenType': 'end',
                'args': [
                    'a',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['Place another order']
            },
            {
                'tokenType': 'close',
                'args': ['a']
            },
            {
                'tokenType': 'close',
                'args': ['p']
            },
            {
                'tokenType': 'chars',
                'args': ['        ']
            },
            {
                'tokenType': 'special',
                'args': ['else']
            },
            {
                'tokenType': 'chars',
                'args': ['\n          ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'h3',
                    false
                ]
            },
            {
                'tokenType': 'end',
                'args': [
                    'h3',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['Order from ']
            },
            {
                'tokenType': 'special',
                'args': ['name']
            },
            {
                'tokenType': 'close',
                'args': ['h3']
            },
            {
                'tokenType': 'chars',
                'args': ['\n\n          ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'form',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['(submit)']
            },
            {
                'tokenType': 'attrValue',
                'args': ['placeOrder']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['(submit)']
            },
            {
                'tokenType': 'end',
                'args': [
                    'form',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n            ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'bit-tabs',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['tabs-class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['nav nav-tabs']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['tabs-class']
            },
            {
                'tokenType': 'end',
                'args': [
                    'bit-tabs',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n              ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'p',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['info ']
            },
            {
                'tokenType': 'special',
                'args': ['^if order.items.length']
            },
            {
                'tokenType': 'attrValue',
                'args': ['text-error']
            },
            {
                'tokenType': 'special',
                'args': ['else']
            },
            {
                'tokenType': 'attrValue',
                'args': ['text-success']
            },
            {
                'tokenType': 'special',
                'args': ['/if']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'end',
                'args': [
                    'p',
                    false
                ]
            },
            {
                'tokenType': 'special',
                'args': ['^if order.items.length']
            },
            {
                'tokenType': 'chars',
                'args': ['\n                  Please choose an item                ']
            },
            {
                'tokenType': 'special',
                'args': ['else']
            },
            {
                'tokenType': 'chars',
                'args': ['\n                  ']
            },
            {
                'tokenType': 'special',
                'args': ['order.items.length']
            },
            {
                'tokenType': 'chars',
                'args': [' selected']
            },
            {
                'tokenType': 'special',
                'args': ['/if']
            },
            {
                'tokenType': 'chars',
                'args': ['\n              ']
            },
            {
                'tokenType': 'close',
                'args': ['p']
            },
            {
                'tokenType': 'chars',
                'args': ['\n              ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'bit-panel',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['title']
            },
            {
                'tokenType': 'attrValue',
                'args': ['Lunch menu']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['title']
            },
            {
                'tokenType': 'end',
                'args': [
                    'bit-panel',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n                ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'ul',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['list-group']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'end',
                'args': [
                    'ul',
                    false
                ]
            },
            {
                'tokenType': 'special',
                'args': ['#each menu.lunch']
            },
            {
                'tokenType': 'chars',
                'args': ['\n                    ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'li',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['list-group-item']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'end',
                'args': [
                    'li',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n                      ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'label',
                    false
                ]
            },
            {
                'tokenType': 'end',
                'args': [
                    'label',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n                        ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'input',
                    true
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['type']
            },
            {
                'tokenType': 'attrValue',
                'args': ['checkbox']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['type']
            },
            {
                'tokenType': 'attrStart',
                'args': ['(change)']
            },
            {
                'tokenType': 'attrValue',
                'args': ['{order.items.toggle this}']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['(change)']
            },
            {
                'tokenType': 'special',
                'args': ['#if order.items.has']
            },
            {
                'tokenType': 'attrStart',
                'args': ['checked']
            },
            {
                'tokenType': 'attrValue',
                'args': ['checked']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['checked']
            },
            {
                'tokenType': 'special',
                'args': ['/if']
            },
            {
                'tokenType': 'end',
                'args': [
                    'input',
                    true
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n                        ']
            },
            {
                'tokenType': 'special',
                'args': ['name']
            },
            {
                'tokenType': 'chars',
                'args': [' ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'span',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['badge']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'end',
                'args': [
                    'span',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['$']
            },
            {
                'tokenType': 'special',
                'args': ['price']
            },
            {
                'tokenType': 'close',
                'args': ['span']
            },
            {
                'tokenType': 'chars',
                'args': ['\n                      ']
            },
            {
                'tokenType': 'close',
                'args': ['label']
            },
            {
                'tokenType': 'chars',
                'args': ['\n                    ']
            },
            {
                'tokenType': 'close',
                'args': ['li']
            },
            {
                'tokenType': 'special',
                'args': ['/each']
            },
            {
                'tokenType': 'chars',
                'args': ['\n                ']
            },
            {
                'tokenType': 'close',
                'args': ['ul']
            },
            {
                'tokenType': 'chars',
                'args': ['\n              ']
            },
            {
                'tokenType': 'close',
                'args': ['bit-panel']
            },
            {
                'tokenType': 'chars',
                'args': ['\n              ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'bit-panel',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['title']
            },
            {
                'tokenType': 'attrValue',
                'args': ['Dinner menu']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['title']
            },
            {
                'tokenType': 'end',
                'args': [
                    'bit-panel',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n                ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'ul',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['list-group']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'end',
                'args': [
                    'ul',
                    false
                ]
            },
            {
                'tokenType': 'special',
                'args': ['#each menu.dinner']
            },
            {
                'tokenType': 'chars',
                'args': ['\n                    ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'li',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['list-group-item']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'end',
                'args': [
                    'li',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n                      ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'label',
                    false
                ]
            },
            {
                'tokenType': 'end',
                'args': [
                    'label',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n                        ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'input',
                    true
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['type']
            },
            {
                'tokenType': 'attrValue',
                'args': ['checkbox']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['type']
            },
            {
                'tokenType': 'attrStart',
                'args': ['(change)']
            },
            {
                'tokenType': 'attrValue',
                'args': ['{order.items.toggle this}']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['(change)']
            },
            {
                'tokenType': 'special',
                'args': ['#if order.items.has']
            },
            {
                'tokenType': 'attrStart',
                'args': ['checked']
            },
            {
                'tokenType': 'attrValue',
                'args': ['checked']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['checked']
            },
            {
                'tokenType': 'special',
                'args': ['/if']
            },
            {
                'tokenType': 'end',
                'args': [
                    'input',
                    true
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n                        ']
            },
            {
                'tokenType': 'special',
                'args': ['name']
            },
            {
                'tokenType': 'chars',
                'args': [' ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'span',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['badge']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'end',
                'args': [
                    'span',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['$']
            },
            {
                'tokenType': 'special',
                'args': ['price']
            },
            {
                'tokenType': 'close',
                'args': ['span']
            },
            {
                'tokenType': 'chars',
                'args': ['\n                      ']
            },
            {
                'tokenType': 'close',
                'args': ['label']
            },
            {
                'tokenType': 'chars',
                'args': ['\n                    ']
            },
            {
                'tokenType': 'close',
                'args': ['li']
            },
            {
                'tokenType': 'special',
                'args': ['/each']
            },
            {
                'tokenType': 'chars',
                'args': ['\n                ']
            },
            {
                'tokenType': 'close',
                'args': ['ul']
            },
            {
                'tokenType': 'chars',
                'args': ['\n              ']
            },
            {
                'tokenType': 'close',
                'args': ['bit-panel']
            },
            {
                'tokenType': 'chars',
                'args': ['\n            ']
            },
            {
                'tokenType': 'close',
                'args': ['bit-tabs']
            },
            {
                'tokenType': 'chars',
                'args': ['\n\n            ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'div',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['form-group']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'end',
                'args': [
                    'div',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n              ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'label',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['control-label']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'end',
                'args': [
                    'label',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['Name:']
            },
            {
                'tokenType': 'close',
                'args': ['label']
            },
            {
                'tokenType': 'chars',
                'args': ['\n              ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'input',
                    true
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['name']
            },
            {
                'tokenType': 'attrValue',
                'args': ['name']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['name']
            },
            {
                'tokenType': 'attrStart',
                'args': ['type']
            },
            {
                'tokenType': 'attrValue',
                'args': ['text']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['type']
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['form-control']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'attrStart',
                'args': ['can-value']
            },
            {
                'tokenType': 'attrValue',
                'args': ['{order.name}']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['can-value']
            },
            {
                'tokenType': 'end',
                'args': [
                    'input',
                    true
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n              ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'p',
                    false
                ]
            },
            {
                'tokenType': 'end',
                'args': [
                    'p',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['Please enter your name.']
            },
            {
                'tokenType': 'close',
                'args': ['p']
            },
            {
                'tokenType': 'chars',
                'args': ['\n            ']
            },
            {
                'tokenType': 'close',
                'args': ['div']
            },
            {
                'tokenType': 'chars',
                'args': ['\n              ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'div',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['form-group']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'end',
                'args': [
                    'div',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n              ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'label',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['control-label']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'end',
                'args': [
                    'label',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['Address:']
            },
            {
                'tokenType': 'close',
                'args': ['label']
            },
            {
                'tokenType': 'chars',
                'args': ['\n              ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'input',
                    true
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['name']
            },
            {
                'tokenType': 'attrValue',
                'args': ['address']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['name']
            },
            {
                'tokenType': 'attrStart',
                'args': ['type']
            },
            {
                'tokenType': 'attrValue',
                'args': ['text']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['type']
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['form-control']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'attrStart',
                'args': ['can-value']
            },
            {
                'tokenType': 'attrValue',
                'args': ['{order.address}']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['can-value']
            },
            {
                'tokenType': 'end',
                'args': [
                    'input',
                    true
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n              ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'p',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['help-text']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'end',
                'args': [
                    'p',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['Please enter your address.']
            },
            {
                'tokenType': 'close',
                'args': ['p']
            },
            {
                'tokenType': 'chars',
                'args': ['\n            ']
            },
            {
                'tokenType': 'close',
                'args': ['div']
            },
            {
                'tokenType': 'chars',
                'args': ['\n            ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'pmo-order-phone',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['order']
            },
            {
                'tokenType': 'attrValue',
                'args': ['{order}']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['order']
            },
            {
                'tokenType': 'end',
                'args': [
                    'pmo-order-phone',
                    false
                ]
            },
            {
                'tokenType': 'close',
                'args': ['pmo-order-phone']
            },
            {
                'tokenType': 'chars',
                'args': ['\n            ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'div',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['submit']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'end',
                'args': [
                    'div',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['\n              ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'h4',
                    false
                ]
            },
            {
                'tokenType': 'end',
                'args': [
                    'h4',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['Total: $']
            },
            {
                'tokenType': 'special',
                'args': ['order.total']
            },
            {
                'tokenType': 'close',
                'args': ['h4']
            },
            {
                'tokenType': 'special',
                'args': ['#if saveStatus.isPending']
            },
            {
                'tokenType': 'chars',
                'args': ['\n                ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'div',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['loading']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'end',
                'args': [
                    'div',
                    false
                ]
            },
            {
                'tokenType': 'close',
                'args': ['div']
            },
            {
                'tokenType': 'chars',
                'args': ['              ']
            },
            {
                'tokenType': 'special',
                'args': ['else']
            },
            {
                'tokenType': 'chars',
                'args': ['\n                ']
            },
            {
                'tokenType': 'start',
                'args': [
                    'button',
                    false
                ]
            },
            {
                'tokenType': 'attrStart',
                'args': ['type']
            },
            {
                'tokenType': 'attrValue',
                'args': ['submit']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['type']
            },
            {
                'tokenType': 'special',
                'args': ['^if canPlaceOrder']
            },
            {
                'tokenType': 'attrStart',
                'args': ['disabled']
            },
            {
                'tokenType': 'attrValue',
                'args': ['disabled']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['disabled']
            },
            {
                'tokenType': 'special',
                'args': ['/if']
            },
            {
                'tokenType': 'attrStart',
                'args': ['class']
            },
            {
                'tokenType': 'attrValue',
                'args': ['btn']
            },
            {
                'tokenType': 'attrEnd',
                'args': ['class']
            },
            {
                'tokenType': 'end',
                'args': [
                    'button',
                    false
                ]
            },
            {
                'tokenType': 'chars',
                'args': ['Place My Order!']
            },
            {
                'tokenType': 'close',
                'args': ['button']
            },
            {
                'tokenType': 'special',
                'args': ['/if']
            },
            {
                'tokenType': 'chars',
                'args': ['\n            ']
            },
            {
                'tokenType': 'close',
                'args': ['div']
            },
            {
                'tokenType': 'chars',
                'args': ['\n          ']
            },
            {
                'tokenType': 'close',
                'args': ['form']
            },
            {
                'tokenType': 'special',
                'args': ['/if']
            },
            {
                'tokenType': 'chars',
                'args': ['\n      ']
            },
            {
                'tokenType': 'special',
                'args': ['/value']
            },
            {
                'tokenType': 'special',
                'args': ['/if']
            },
            {
                'tokenType': 'chars',
                'args': ['\n  ']
            },
            {
                'tokenType': 'close',
                'args': ['restaurant-model']
            },
            {
                'tokenType': 'chars',
                'args': ['\n']
            },
            {
                'tokenType': 'close',
                'args': ['div']
            },
            {
                'tokenType': 'chars',
                'args': ['\n']
            },
            {
                'tokenType': 'done',
                'args': []
            }
        ]);
    return function (scope, options) {
        var moduleOptions = { module: module };
        return renderer(scope, options ? options.add(moduleOptions) : moduleOptions);
    };
});
/*pmo/order/new/new*/
define('pmo/order/new/new', [
    'exports',
    'can/component/component',
    'can/map/',
    'can/map/define/',
    './new.stache!',
    'pmo/models/restaurant',
    'pmo/models/order'
], function (exports, _canComponentComponent, _canMap, _canMapDefine, _newStache, _pmoModelsRestaurant, _pmoModelsOrder) {
    'use strict';
    var _interopRequire = function (obj) {
        return obj && obj.__esModule ? obj['default'] : obj;
    };
    var Component = _interopRequire(_canComponentComponent);
    var Map = _interopRequire(_canMap);
    var template = _interopRequire(_newStache);
    var Restaurant = _interopRequire(_pmoModelsRestaurant);
    var Order = _interopRequire(_pmoModelsOrder);
    var ViewModel = exports.ViewModel = Map.extend({
            define: {
                slug: { type: 'string' },
                order: { Value: Order },
                saveStatus: { Value: Object },
                canPlaceOrder: {
                    get: function get() {
                        return !!this.attr('order.items.length');
                    }
                }
            },
            placeOrder: function placeOrder() {
                var order = this.attr('order');
                order.attr('restaurant', this.attr('restaurant._id'));
                this.attr('saveStatus', order.save());
                return false;
            },
            startNewOrder: function () {
                this.attr('order', new Order());
                this.attr('saveStatus', null);
                return false;
            }
        });
    exports['default'] = Component.extend({
        tag: 'pmo-order-new',
        viewModel: ViewModel,
        template: template
    });
    Object.defineProperty(exports, '__esModule', { value: true });
});
/*done-css@1.1.3#css*/
define('done-css@1.1.3#css', function (require, exports, module) {
    var loader = require('@loader');
    var register = loader.has('asset-register') ? loader.get('asset-register')['default'] : function () {
        };
    function getExistingAsset(load) {
        var s = typeof jQuery !== 'undefined' ? jQuery : document.querySelectorAll.bind(document);
        var val = s('[asset-id=\'' + load.name + '\']');
        return val && val[0];
    }
    var isNode = typeof process === 'object' && {}.toString.call(process) === '[object process]';
    var isProduction = loader.envMap && loader.envMap.production || loader.env === 'production';
    if (isProduction) {
        exports.fetch = function (load) {
            var cssFile = load.address;
            var link;
            if (isNode) {
                var path = loader._nodeRequire('path');
                cssFile = path.relative(loader.baseURL, cssFile);
                var href = '/' + cssFile;
                if (loader.renderingLoader) {
                    var baseURL = loader.renderingLoader.baseURL;
                    if (baseURL.indexOf('http') === 0) {
                        href = baseURL + cssFile.replace('dist/', '');
                    }
                }
                link = document.createElement('link');
                link.setAttribute('rel', 'stylesheet');
                link.setAttribute('href', href);
                register(load.name, 'css', function () {
                    return link.cloneNode(true);
                });
            } else {
                if (typeof document !== 'undefined') {
                    link = getExistingAsset(load);
                    if (!link) {
                        link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = cssFile;
                        document.head.appendChild(link);
                    }
                }
            }
            return '';
        };
    } else {
        exports.instantiate = function (load) {
            var loader = this;
            load.metadata.deps = [];
            load.metadata.execute = function () {
                var source = load.source + '/*# sourceURL=' + load.address + ' */';
                source = source.replace(/url\(['"]?([^'"\)]*)['"]?\)/g, function (whole, part) {
                    return 'url(' + steal.joinURIs(load.address, part) + ')';
                });
                if (load.source && typeof document !== 'undefined') {
                    var doc = document.head ? document : document.getElementsByTagName ? document : document.documentElement;
                    var head = doc.head || doc.getElementsByTagName('head')[0];
                    if (!head) {
                        var docEl = doc.documentElement || doc;
                        head = document.createElement('head');
                        docEl.insertBefore(head, docEl.firstChild);
                    }
                    var style = getExistingAsset(load);
                    if (!style) {
                        style = document.createElement('style');
                        style.type = 'text/css';
                        if (style.styleSheet) {
                            style.styleSheet.cssText = source;
                        } else {
                            style.appendChild(document.createTextNode(source));
                        }
                        head.appendChild(style);
                    }
                    if (loader.has('live-reload')) {
                        var cssReload = loader.import('live-reload', { name: '$css' });
                        Promise.resolve(cssReload).then(function (reload) {
                            loader.import(load.name).then(function () {
                                reload.once(load.name, function () {
                                    head.removeChild(style);
                                });
                            });
                        });
                    }
                    register(load.name, 'css', function () {
                        return style.cloneNode(true);
                    });
                }
                return System.newModule({ source: source });
            };
            load.metadata.format = 'css';
        };
    }
    exports.buildType = 'css';
    exports.includeInBuild = true;
});