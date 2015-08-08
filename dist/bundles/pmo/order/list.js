/*pmo/order/list.component/template*/
define('pmo/order/list.component/template', [
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
            'tokenType': 'special',
            'args': ['title']
        },
        {
            'tokenType': 'close',
            'args': ['h4']
        },
        {
            'tokenType': 'special',
            'args': ['#if orders.isPending']
        },
        {
            'tokenType': 'chars',
            'args': ['\n     ']
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
            'args': ['#each orders.value']
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
            'args': ['order ']
        },
        {
            'tokenType': 'special',
            'args': ['status']
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
            'args': ['\n        ']
        },
        {
            'tokenType': 'start',
            'args': [
                'address',
                false
            ]
        },
        {
            'tokenType': 'end',
            'args': [
                'address',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
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
                'br',
                true
            ]
        },
        {
            'tokenType': 'end',
            'args': [
                'br',
                true
            ]
        },
        {
            'tokenType': 'special',
            'args': ['address']
        },
        {
            'tokenType': 'chars',
            'args': [' ']
        },
        {
            'tokenType': 'start',
            'args': [
                'br',
                true
            ]
        },
        {
            'tokenType': 'end',
            'args': [
                'br',
                true
            ]
        },
        {
            'tokenType': 'special',
            'args': ['phone']
        },
        {
            'tokenType': 'chars',
            'args': ['\n        ']
        },
        {
            'tokenType': 'close',
            'args': ['address']
        },
        {
            'tokenType': 'chars',
            'args': ['\n\n        ']
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
            'args': ['items']
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
            'args': ['\n          ']
        },
        {
            'tokenType': 'start',
            'args': [
                'ul',
                false
            ]
        },
        {
            'tokenType': 'end',
            'args': [
                'ul',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['\n            ']
        },
        {
            'tokenType': 'special',
            'args': ['#each items']
        },
        {
            'tokenType': 'start',
            'args': [
                'li',
                false
            ]
        },
        {
            'tokenType': 'end',
            'args': [
                'li',
                false
            ]
        },
        {
            'tokenType': 'special',
            'args': ['name']
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
            'args': ['\n          ']
        },
        {
            'tokenType': 'close',
            'args': ['ul']
        },
        {
            'tokenType': 'chars',
            'args': ['\n        ']
        },
        {
            'tokenType': 'close',
            'args': ['div']
        },
        {
            'tokenType': 'chars',
            'args': ['\n\n        ']
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
            'args': ['total']
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
            'args': ['$']
        },
        {
            'tokenType': 'special',
            'args': ['total']
        },
        {
            'tokenType': 'close',
            'args': ['div']
        },
        {
            'tokenType': 'chars',
            'args': ['\n\n        ']
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
            'args': ['actions']
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
            'tokenType': 'special',
            'args': ['#eq status \'new\'']
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
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
            'args': ['New Order!']
        },
        {
            'tokenType': 'close',
            'args': ['span']
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
            'tokenType': 'attrStart',
            'args': ['class']
        },
        {
            'tokenType': 'attrValue',
            'args': ['action']
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
            'args': ['\n            Mark as:\n            ']
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
            'args': ['can-click']
        },
        {
            'tokenType': 'attrValue',
            'args': ['{markAs \'preparing\'}']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['can-click']
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
            'args': ['\n              Preparing\n            ']
        },
        {
            'tokenType': 'close',
            'args': ['a']
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
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
            'args': ['\n']
        },
        {
            'tokenType': 'special',
            'args': ['#eq status \'preparing\'']
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
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
            'args': ['Preparing']
        },
        {
            'tokenType': 'close',
            'args': ['span']
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
            'tokenType': 'attrStart',
            'args': ['class']
        },
        {
            'tokenType': 'attrValue',
            'args': ['action']
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
            'args': ['\n            Mark as:\n            ']
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
            'args': ['can-click']
        },
        {
            'tokenType': 'attrValue',
            'args': ['{markAs \'delivery\'}']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['can-click']
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
            'args': ['\n              Out for delivery\n            ']
        },
        {
            'tokenType': 'close',
            'args': ['a']
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
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
            'args': ['\n']
        },
        {
            'tokenType': 'special',
            'args': ['#eq status \'delivery\'']
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
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
            'args': ['Out for delivery']
        },
        {
            'tokenType': 'close',
            'args': ['span']
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
            'tokenType': 'attrStart',
            'args': ['class']
        },
        {
            'tokenType': 'attrValue',
            'args': ['action']
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
            'args': ['\n            Mark as:\n            ']
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
            'args': ['can-click']
        },
        {
            'tokenType': 'attrValue',
            'args': ['{markAs \'delivered\'}']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['can-click']
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
            'args': ['\n              Delivered\n            ']
        },
        {
            'tokenType': 'close',
            'args': ['a']
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
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
            'args': ['\n']
        },
        {
            'tokenType': 'special',
            'args': ['#eq status \'delivered\'']
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
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
            'args': ['Delivered']
        },
        {
            'tokenType': 'close',
            'args': ['span']
        },
        {
            'tokenType': 'special',
            'args': ['/eq']
        },
        {
            'tokenType': 'chars',
            'args': ['\n\n          ']
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
            'args': ['action']
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
            'args': ['\n            ']
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
            'args': ['can-click']
        },
        {
            'tokenType': 'attrValue',
            'args': ['{destroy}']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['can-click']
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
            'args': ['Delete']
        },
        {
            'tokenType': 'close',
            'args': ['a']
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
        },
        {
            'tokenType': 'close',
            'args': ['p']
        },
        {
            'tokenType': 'chars',
            'args': ['\n        ']
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
            'tokenType': 'close',
            'args': ['div']
        },
        {
            'tokenType': 'special',
            'args': ['/each']
        },
        {
            'tokenType': 'chars',
            'args': ['\n']
        },
        {
            'tokenType': 'special',
            'args': ['^if orders.value.length']
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
            'args': ['order empty']
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
            'tokenType': 'special',
            'args': ['emptyMessage']
        },
        {
            'tokenType': 'close',
            'args': ['div']
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
            'tokenType': 'special',
            'args': ['/if']
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
/*pmo/order/list.component!done-component@0.1.0#component*/
define('pmo/order/list.component!done-component@0.1.0#component', [
    'can/component/component',
    'pmo/order/list.component/template'
], function (Component, template) {
    var __interop = function (m) {
        if (m && m['default']) {
            return m['default'];
        } else if (m)
            return m;
    };
    var viewModel = __interop(typeof viewModel !== 'undefined' ? viewModel : undefined);
    var ComponentConstructor = Component.extend({
            tag: 'pmo-order-list',
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