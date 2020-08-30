# React mockElement

Mock element for capturing props in tests. Provides a middle-ground
towards enzyme's `shallow` unit tests when using
[react-testing-library](https://github.com/testing-library/react-testing-library)
(but can be used with any testing library which renders to a DOM).

The intended use is to mock out specific children of a component under
test which have important properties or are otherwise difficult to
mock. This should not be used to mock every child component.

## Install dependency

```bash
npm install --save-dev react-mock-element
```

## Usage with react-testing-library + Jest

```javascript
// code under test (MyComponent.jsx)

import React from 'react';

export default ({Child}) => {
  return (
    <div>
      foobar
      <Child p1="a" />
    </div>
  );
};


// test (MyComponent.test.jsx)

import React from 'react';
import {render, cleanup} from 'react-testing-library';
import mockElement from 'react-mock-element';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('creates a child element with a property', () => {
    const MyMockElement = mockElement('some-tag-name');

    const {container} = render(<MyComponent Child={MyMockElement} />);

    const child = container.querySelector('some-tag-name');
    expect(child.mockProps.p1).toEqual('a');
  });
});

afterEach(cleanup);
```

This is also compatible with Jest module mocking:

```javascript
// code under test (MyComponent.jsx)

import React from 'react';
import ChildComponent from './ChildComponent';

export default () => {
  return (
    <div>
      foobar
      <ChildComponent p1="a" />
    </div>
  );
};


// test (MyComponent.test.jsx)

import React from 'react';
import {render, cleanup} from 'react-testing-library';
import mockElement from 'react-mock-element';
import MyComponent from './MyComponent';

jest.mock('./ChildComponent', () => mockElement('mock-child'));

describe('MyComponent', () => {
  it('creates a ChildComponent element with a property', () => {
    const {container} = render(<MyComponent />);

    const child = container.querySelector('mock-child');
    expect(child.mockProps.p1).toEqual('a');
  });
});

afterEach(cleanup);
```

## API

`mockElement(tagName)`: returns a React component which renders a tag
with the given tag name (a naming convention such as `mock-something`
is recommended but not required). Note that as this function name
begins with `mock`, it can be used by hoisted `jest.mock` calls in
tests (see second demo above).

`element.mockProps`: added to the `HTMLElement` prototype. This
provides access to the props passed to an element. This is read-only.
