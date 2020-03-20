import React, { Suspense } from "react";

export default function WaitingComponent(Component: any) {
  const Item = (props: any) => (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
  return Item;
}
