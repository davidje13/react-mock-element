const React = require('react');

const mockPropStorage = new WeakMap();

Object.defineProperty(HTMLElement.prototype, 'mockProps', {
  configurable: true,
  get: function get() {
    const props = mockPropStorage.get(this);
    if (!props) {
      throw new Error('Cannot get mockProps of a non-mocked element');
    }
    return props;
  },
});

const mockElement = (tagName) => (props) => {
  const ref = React.useRef();
  React.useLayoutEffect(() => {
    mockPropStorage.set(ref.current, Object.freeze(props));
  }, [ref, props]);

  return React.createElement(tagName, { ref });
};

Object.defineProperty(exports, '__esModule', { value: true });
exports.default = mockElement;

module.exports = Object.assign(exports.default, exports);
exports.default.default = module.exports;
