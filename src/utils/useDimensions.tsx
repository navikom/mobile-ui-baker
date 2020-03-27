import React from "react";

export default function useDimensions(): [React.RefObject<HTMLElement | null>, DOMRect] {
  const ref = React.createRef<HTMLElement | null>();
  const [dimensions, setDimensions] = React.useState<DOMRect | {}>({});

  React.useLayoutEffect(() => {
    ref.current && setDimensions(ref.current.getBoundingClientRect().toJSON());
  }, [ref.current]);

  return [ref, dimensions as DOMRect];
}
