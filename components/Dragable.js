import React from 'react';
import { Draggable } from 'react-draggable';

const DraggableComponent = ({ children, ...props }) => {
  return (
    <Draggable {...props}>
      {children}
    </Draggable>
  );
};

export default DraggableComponent;