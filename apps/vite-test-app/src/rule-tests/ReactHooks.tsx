/**
 * I'm using this file to implement some examples of the rules in the react-hooks plugin.
 *
 * If the rule is working, then I'll disable it. It will be flagged if it stops working.
 */

import { useRef, useState } from "react";

export const ComponentHookFactory = () => {
  // preferring this over react-hooks/component-hook-factories and react-hooks/static-components
  // eslint-disable-next-line react/no-unstable-nested-components
  const Child = () => {
    return <div>Child</div>;
  };

  return <Child />;
};

const Child = () => {
  return <div>Child</div>;
};

// react-hooks/error-boundaries
export const TryCatchParent = () => {
  try {
    // eslint-disable-next-line react-hooks/error-boundaries
    return <Child />; // If this throws, catch won't help
  } catch {
    return <div>Error occurred</div>;
  }
};

// react-hooks/globals
let renderCount = 0;
export const GlobalCounter = () => {
  // TODO: global rule is not working, follow up later
  renderCount++; // Mutating global
  return <div>Count: {renderCount}</div>;
};

// react-hooks/immutability
export const ArrayPushMutation = () => {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    // TODO: this should flag the immutability rule
    items.push(4); // Mutating!
    setItems(items); // Same reference, no re-render
  };

  // eslint-disable-next-line react-hooks/set-state-in-render
  addItem();

  return <div>Items: {items.join(", ")}</div>;
};

// react-hooks/purity
export const PurityExample = () => {
  // eslint-disable-next-line react-hooks/purity
  const id = Math.random(); // Different every render
  return <div key={id}>Content</div>;
};

// react-hooks/refs
export const RefExample = () => {
  const ref = useRef(0);
  // eslint-disable-next-line react-hooks/refs
  const value = ref.current; // Don't read during render
  return <div>{value}</div>;
};
