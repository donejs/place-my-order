/*can@2.3.0-pre.3#util/domless/domless*/
define('can@2.3.0-pre.3#util/domless/domless', [], function(){ return {}; });
/*can@2.3.0-pre.3#util/array/makeArray*/
define('can@2.3.0-pre.3#util/array/makeArray', [], function(){ return {}; });
/*pmo/order/history.component/template*/
define('pmo/order/history.component/template', [
    'can/view/stache/stache',
    'can/component/component',
    'pmo/models/order'
], function (stache) {
    return stache([
        {
            'tokenType': 'chars',
            'args': ['\n    ']
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
            'args': ['pmo/models/order']
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
            'args': ['\n\n    ']
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
            'args': ['order-history']
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
            'args': ['order header']
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
            'args': ['Name / Address / Phone']
        },
        {
            'tokenType': 'close',
            'args': ['address']
        },
        {
            'tokenType': 'chars',
            'args': ['\n        ']
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
            'args': ['Order']
        },
        {
            'tokenType': 'close',
            'args': ['div']
        },
        {
            'tokenType': 'chars',
            'args': ['\n        ']
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
            'args': ['Total']
        },
        {
            'tokenType': 'close',
            'args': ['div']
        },
        {
            'tokenType': 'chars',
            'args': ['\n        ']
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
            'tokenType': 'chars',
            'args': ['Action']
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
            'tokenType': 'chars',
            'args': ['\n\n      ']
        },
        {
            'tokenType': 'start',
            'args': [
                'can-import',
                false
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['from']
        },
        {
            'tokenType': 'attrValue',
            'args': ['pmo/order/list.component!']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['from']
        },
        {
            'tokenType': 'attrStart',
            'args': ['can-tag']
        },
        {
            'tokenType': 'attrValue',
            'args': ['pmo-loading']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['can-tag']
        },
        {
            'tokenType': 'end',
            'args': [
                'can-import',
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
                'order-model',
                false
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['getList']
        },
        {
            'tokenType': 'attrValue',
            'args': ['{status=\'new\'}']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['getList']
        },
        {
            'tokenType': 'end',
            'args': [
                'order-model',
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
                'pmo-order-list',
                false
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['orders']
        },
        {
            'tokenType': 'attrValue',
            'args': ['{.}']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['orders']
        },
        {
            'tokenType': 'attrStart',
            'args': ['status']
        },
        {
            'tokenType': 'attrValue',
            'args': ['new']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['status']
        },
        {
            'tokenType': 'attrStart',
            'args': ['title']
        },
        {
            'tokenType': 'attrValue',
            'args': ['New Orders']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['title']
        },
        {
            'tokenType': 'attrStart',
            'args': ['empty-message']
        },
        {
            'tokenType': 'attrValue',
            'args': ['No new orders']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['empty-message']
        },
        {
            'tokenType': 'end',
            'args': [
                'pmo-order-list',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
        },
        {
            'tokenType': 'close',
            'args': ['pmo-order-list']
        },
        {
            'tokenType': 'chars',
            'args': ['\n        ']
        },
        {
            'tokenType': 'close',
            'args': ['order-model']
        },
        {
            'tokenType': 'chars',
            'args': ['\n\n        ']
        },
        {
            'tokenType': 'start',
            'args': [
                'order-model',
                false
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['getList']
        },
        {
            'tokenType': 'attrValue',
            'args': ['{status=\'preparing\'}']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['getList']
        },
        {
            'tokenType': 'end',
            'args': [
                'order-model',
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
                'pmo-order-list',
                false
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['orders']
        },
        {
            'tokenType': 'attrValue',
            'args': ['{.}']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['orders']
        },
        {
            'tokenType': 'attrStart',
            'args': ['status']
        },
        {
            'tokenType': 'attrValue',
            'args': ['preparing']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['status']
        },
        {
            'tokenType': 'attrStart',
            'args': ['title']
        },
        {
            'tokenType': 'attrValue',
            'args': ['Preparing']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['title']
        },
        {
            'tokenType': 'attrStart',
            'args': ['empty-message']
        },
        {
            'tokenType': 'attrValue',
            'args': ['No orders preparing']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['empty-message']
        },
        {
            'tokenType': 'end',
            'args': [
                'pmo-order-list',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
        },
        {
            'tokenType': 'close',
            'args': ['pmo-order-list']
        },
        {
            'tokenType': 'chars',
            'args': ['\n        ']
        },
        {
            'tokenType': 'close',
            'args': ['order-model']
        },
        {
            'tokenType': 'chars',
            'args': ['\n\n        ']
        },
        {
            'tokenType': 'start',
            'args': [
                'order-model',
                false
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['getList']
        },
        {
            'tokenType': 'attrValue',
            'args': ['{status=\'delivery\'}']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['getList']
        },
        {
            'tokenType': 'end',
            'args': [
                'order-model',
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
                'pmo-order-list',
                false
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['orders']
        },
        {
            'tokenType': 'attrValue',
            'args': ['{.}']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['orders']
        },
        {
            'tokenType': 'attrStart',
            'args': ['status']
        },
        {
            'tokenType': 'attrValue',
            'args': ['delivery']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['status']
        },
        {
            'tokenType': 'attrStart',
            'args': ['title']
        },
        {
            'tokenType': 'attrValue',
            'args': ['In delivery']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['title']
        },
        {
            'tokenType': 'attrStart',
            'args': ['empty-message']
        },
        {
            'tokenType': 'attrValue',
            'args': ['No orders in delivery']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['empty-message']
        },
        {
            'tokenType': 'end',
            'args': [
                'pmo-order-list',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
        },
        {
            'tokenType': 'close',
            'args': ['pmo-order-list']
        },
        {
            'tokenType': 'chars',
            'args': ['\n        ']
        },
        {
            'tokenType': 'close',
            'args': ['order-model']
        },
        {
            'tokenType': 'chars',
            'args': ['\n\n        ']
        },
        {
            'tokenType': 'start',
            'args': [
                'order-model',
                false
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['getList']
        },
        {
            'tokenType': 'attrValue',
            'args': ['{status=\'delivered\'}']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['getList']
        },
        {
            'tokenType': 'end',
            'args': [
                'order-model',
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
                'pmo-order-list',
                false
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['orders']
        },
        {
            'tokenType': 'attrValue',
            'args': ['{.}']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['orders']
        },
        {
            'tokenType': 'attrStart',
            'args': ['status']
        },
        {
            'tokenType': 'attrValue',
            'args': ['delivered']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['status']
        },
        {
            'tokenType': 'attrStart',
            'args': ['title']
        },
        {
            'tokenType': 'attrValue',
            'args': ['Delivered']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['title']
        },
        {
            'tokenType': 'attrStart',
            'args': ['empty-message']
        },
        {
            'tokenType': 'attrValue',
            'args': ['No delivered orders']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['empty-message']
        },
        {
            'tokenType': 'end',
            'args': [
                'pmo-order-list',
                false
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
        },
        {
            'tokenType': 'close',
            'args': ['pmo-order-list']
        },
        {
            'tokenType': 'chars',
            'args': ['\n        ']
        },
        {
            'tokenType': 'close',
            'args': ['order-model']
        },
        {
            'tokenType': 'chars',
            'args': ['\n      ']
        },
        {
            'tokenType': 'close',
            'args': ['can-import']
        },
        {
            'tokenType': 'chars',
            'args': ['\n\n    ']
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
/*pmo/order/history.component!done-component@0.1.0#component*/
define('pmo/order/history.component!done-component@0.1.0#component', [
    'can/component/component',
    'pmo/order/history.component/template'
], function (Component, template) {
    var __interop = function (m) {
        if (m && m['default']) {
            return m['default'];
        } else if (m)
            return m;
    };
    var viewModel = __interop(typeof viewModel !== 'undefined' ? viewModel : undefined);
    var ComponentConstructor = Component.extend({
            tag: 'pmo-order-history',
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
/*done-component@0.1.0#component*/
define('done-component@0.1.0#component', [], function(){ return {}; });