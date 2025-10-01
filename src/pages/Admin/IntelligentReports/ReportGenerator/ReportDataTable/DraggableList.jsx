// DraggableList.jsx
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: 16,
  margin: `0 0 8px 0`,
  background: isDragging ? "#d3f9d8" : "#f1f1f1",
  border: "1px solid #ccc",
  borderRadius: 4,
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "#f0f8ff" : "#fff",
  padding: 8,
  width: 300,
  border: "1px solid #ddd",
  borderRadius: 4,
});

const DraggableList = ({ items = [], onOrderChange }) => {
  const [list, setList] = useState(items);

  

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = reorder(list, result.source.index, result.destination.index);
    setList(reordered);
    if (onOrderChange) onOrderChange(reordered);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {list.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    {item.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableList;
