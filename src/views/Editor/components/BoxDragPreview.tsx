import React, { memo } from 'react'

const styles = {
  opacity: 0.6,
};

const BoxDragPreview: React.FC = memo(({ children }) => {
  return (
    <div style={styles}>
      {children}
    </div>
  )
});

BoxDragPreview.displayName = 'BoxDragPreview';

export default BoxDragPreview
