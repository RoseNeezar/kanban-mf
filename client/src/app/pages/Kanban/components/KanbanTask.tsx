import styled from "@emotion/styled";
import { ITask } from "@store/types/kanban.types";
import { FC } from "react";
import { Draggable } from "react-beautiful-dnd";

const Container = styled.div<{ isDragging: boolean }>`
  background-color: ${(props) =>
    props.isDragging ? `rgba(99, 102, 241, 1)` : "white"};
  color: ${(props) => (props.isDragging ? `white` : "black")};
`;

interface IKanbanTaskComp {
  task: ITask;
  index: number;
}

const KanbanTask: FC<IKanbanTaskComp> = ({ index, task }) => {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <Container
          tw="font-semibold rounded-md p-2 mb-2"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {task.title}
        </Container>
      )}
    </Draggable>
  );
};

export default KanbanTask;
