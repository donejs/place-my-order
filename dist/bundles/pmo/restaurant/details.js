/*pmo/restaurant/details.component/template*/
define('pmo/restaurant/details.component/template', [
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
            'args': ['      ']
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
            'args': ['restaurant-header']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['class']
        },
        {
            'tokenType': 'attrStart',
            'args': ['style']
        },
        {
            'tokenType': 'attrValue',
            'args': ['background-image: url(']
        },
        {
            'tokenType': 'special',
            'args': ['~ images.banner']
        },
        {
            'tokenType': 'attrValue',
            'args': [');']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['style']
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
            'args': ['background']
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
                'h2',
                false
            ]
        },
        {
            'tokenType': 'end',
            'args': [
                'h2',
                false
            ]
        },
        {
            'tokenType': 'special',
            'args': ['name']
        },
        {
            'tokenType': 'close',
            'args': ['h2']
        },
        {
            'tokenType': 'special',
            'args': ['#address']
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
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
            'args': ['address']
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
            'args': ['\n            ']
        },
        {
            'tokenType': 'special',
            'args': ['street']
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
            'args': ['city']
        },
        {
            'tokenType': 'chars',
            'args': [', ']
        },
        {
            'tokenType': 'special',
            'args': ['state']
        },
        {
            'tokenType': 'chars',
            'args': [' ']
        },
        {
            'tokenType': 'special',
            'args': ['zip']
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
        },
        {
            'tokenType': 'close',
            'args': ['div']
        },
        {
            'tokenType': 'special',
            'args': ['/address']
        },
        {
            'tokenType': 'chars',
            'args': ['\n\n          ']
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
            'args': ['hours-price']
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
            'args': ['\n            $$$']
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
            'tokenType': 'chars',
            'args': ['\n            Hours: M-F 10am-11pm\n            ']
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
            'args': ['open-now']
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
            'args': ['Open Now']
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
            'tokenType': 'close',
            'args': ['div']
        },
        {
            'tokenType': 'chars',
            'args': ['\n\n          ']
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
            'tokenType': 'comment',
            'args': [' one restaurant ']
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
            'tokenType': 'attrStart',
            'args': ['class']
        },
        {
            'tokenType': 'attrValue',
            'args': ['restaurant-content']
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
            'args': ['The best food this side of the Mississippi']
        },
        {
            'tokenType': 'close',
            'args': ['h3']
        },
        {
            'tokenType': 'chars',
            'args': ['\n\n        ']
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
            'args': ['description']
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
            'tokenType': 'start',
            'args': [
                'img',
                true
            ]
        },
        {
            'tokenType': 'attrStart',
            'args': ['src']
        },
        {
            'tokenType': 'special',
            'args': ['~ images.owner']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['src']
        },
        {
            'tokenType': 'end',
            'args': [
                'img',
                true
            ]
        },
        {
            'tokenType': 'chars',
            'args': ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum purus magna, nec pulvinar lacus gravida gravida. Quisque posuere a sapien vel aliquet. Vivamus feugiat sagittis eros, eget elementum mi malesuada ut. Aliquam dapibus diam vehicula dui rutrum condimentum. Donec in nibh fermentum, aliquet neque sed, gravida augue. Nunc convallis pretium felis quis elementum. Etiam vitae nunc magna. Mauris elementum purus id dolor euismod, sit amet aliquam augue consequat. Sed sagittis condimentum pulvinar. Nullam mattis ligula augue. Aliquam vitae lectus nec enim posuere ultricies sed viverra ligula. Sed nec lacus tortors.']
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
            'args': ['order-link']
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
            'args': ['\n          ']
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
            'tokenType': 'attrStart',
            'args': ['can-href']
        },
        {
            'tokenType': 'attrValue',
            'args': ['{ page=\'restaurants\' slug=slug action=\'order\'}']
        },
        {
            'tokenType': 'attrEnd',
            'args': ['can-href']
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
            'args': ['\n            Order from ']
        },
        {
            'tokenType': 'special',
            'args': ['name']
        },
        {
            'tokenType': 'chars',
            'args': ['\n          ']
        },
        {
            'tokenType': 'close',
            'args': ['a']
        },
        {
            'tokenType': 'chars',
            'args': ['\n        ']
        },
        {
            'tokenType': 'close',
            'args': ['p']
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
            'args': ['/value']
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
            'args': ['restaurant-model']
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
/*pmo/restaurant/details.component!done-component@0.1.0#component*/
define('pmo/restaurant/details.component!done-component@0.1.0#component', [
    'can/component/component',
    'pmo/restaurant/details.component/template'
], function (Component, template) {
    var __interop = function (m) {
        if (m && m['default']) {
            return m['default'];
        } else if (m)
            return m;
    };
    var viewModel = __interop(typeof viewModel !== 'undefined' ? viewModel : undefined);
    var ComponentConstructor = Component.extend({
            tag: 'pmo-restaurant-details',
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