import React, { Suspense } from "react";
import CustomBackdrop from '../components/Backdrop/Backdrop';

export default function WaitingComponent(Component: any) {
  const Item = (props: any) => (
    <Suspense fallback={<CustomBackdrop open={true} />}>
      <Component {...props} />
    </Suspense>
  );
  return Item;
}
