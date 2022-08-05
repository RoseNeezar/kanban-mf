import { IList, ITask } from "@store/types/kanban.types";
import { useSocketStore } from "@store/useSocket.store";
import useSocket from "@store/websockets/websockets";
import React, { FC, useEffect } from "react";
import { DragDropContext, DragUpdate, Droppable } from "react-beautiful-dnd";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import KanbanCreateList from "./components/KanbanCreateBtn";
import KanbanList from "./components/KanbanList";
import { useGetBoardList, useGetTasks } from "./hooks/useList";
import { sortKanban } from "./hooks/useSortKanban";

const Kanban: FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  useSocket(boardId as string);
  const { currentBoard, allTask, isLoading } = useGetBoardList(
    boardId as string
  );
  const { socket } = useSocketStore();

  const cache = useQueryClient();

  const onDragEnd = (result: DragUpdate) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    sortKanban({
      cache,
      socket,
      boardId: currentBoard?.board._id,
      type: type as "task" | "list",
      dragIndexStart: source.index,
      dragIndexEnd: destination.index,
      dragableID: draggableId,
      dropIdStart: source.droppableId,
      dropIdEnd: destination.droppableId,
    });
  };

  return (
    <div tw="flex flex-row  overflow-scroll bg-dark-main relative h-screen">
      {/* {!isLoading ? ( */}
      <div tw="">
        <div tw="absolute top-0 z-10 text-dark-txt text-3xl font-bold left-0 right-0 mx-auto text-center ">
          <h1>{currentBoard?.board.title}</h1>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="list"
          >
            {(provided) => (
              <div
                tw="grid justify-start  grid-flow-col gap-2 py-10 overflow-auto grid-rows-min mt-10"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {currentBoard?.board.kanbanListOrder.map((columnId, index) => {
                  const column = currentBoard.list.find(
                    (x) => x._id === columnId
                  ) as IList;

                  const tasks = column?.taskIds.map((taskId) =>
                    allTask?.task.find((x) => x._id === taskId)
                  ) as ITask[];

                  return (
                    <KanbanList
                      key={column?._id}
                      list={column}
                      tasks={tasks}
                      index={index}
                    />
                  );
                })}
                {provided.placeholder}
                <KanbanCreateList dataId={boardId as string} action="list" />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      {/* ) : (
        <h1
          style={{
            fontSize: 50,
            backgroundColor: "green",
          }}
        >
          Loading....
        </h1>
      )} */}
    </div>
  );
};

export default Kanban;
