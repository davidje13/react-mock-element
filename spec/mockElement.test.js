const mockElement = require('../index');
const React = require('react');
const {render, fireEvent, cleanup} = require('react-testing-library');
const MockableComponent = require('./MockableComponent');

jest.mock('./MockableComponent', () => mockElement('mock-module'));

const WrappingComponent = ({Child}) => {
  const [val, setVal] = React.useState(1);

  return React.createElement(
    'div',
    {},
    React.createElement(Child, {prop1: {complex: 'object'}, dynamicProp: val}),
    React.createElement('button', {onClick: () => setVal(val + 1)})
  );
};

const MockChild = mockElement('mock-child');

describe('mockElement', () => {
  it('returns a valid React component with the given tag name', () => {
    const {container} = render(React.createElement(MockChild));
    const [childDOM] = container.childNodes;
    expect(childDOM.tagName.toLowerCase()).toEqual('mock-child');
  });

  it('is compatible with jest.mock for modules', () => {
    const {container} = render(React.createElement(MockableComponent));
    const [childDOM] = container.childNodes;
    expect(childDOM.tagName.toLowerCase()).toEqual('mock-module');
  });
});

describe('mockProps', () => {
  it('captures parameters', () => {
    const wrapper = React.createElement(WrappingComponent, {Child: MockChild});
    const {container} = render(wrapper);

    const childDOM = container.querySelector('mock-child');
    expect(childDOM.mockProps).toEqual({
      prop1: {complex: 'object'},
      dynamicProp: 1,
    });
  });

  it('updates if values change', () => {
    const wrapper = React.createElement(WrappingComponent, {Child: MockChild});
    const {container} = render(wrapper);

    const childDOM = container.querySelector('mock-child');
    expect(childDOM.mockProps.dynamicProp).toEqual(1);

    fireEvent.click(container.querySelector('button'));
    expect(childDOM.mockProps.dynamicProp).toEqual(2);
  });

  it('throws if called on a non-mocked object', () => {
    const {container} = render(React.createElement('div'));

    expect(() => container.mockProps).toThrow();
  });
});

afterEach(cleanup);
