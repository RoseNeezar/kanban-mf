import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  closestCenter,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  useSensors,
  useSensor,
  MouseSensor,
  DndContext,
  MeasuringStrategy,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
  DragOverEvent,
  Active,
  Over,
  CollisionDetection,
  Collision,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import update from "immutability-helper";
import List from "./components/List";
import Task from "./components/Task";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useGetBoardList } from "../pages/Kanban/hooks/useList";
import { useSocketStore } from "../store/useSocket.store";
import useSocket from "../store/websockets/websockets";
import { IAllTasks } from "../store/types/kanban.types";
import KanbanCreateList from "../pages/Kanban/components/KanbanCreateBtn";

const Kanban = () => {
  const { boardId } = useParams<{ boardId: string }>();
  useSocket(boardId as string);
  const { currentBoard, allTask, isLoading } = useGetBoardList(
    boardId as string
  );
  const { socket } = useSocketStore();

  const cache = useQueryClient();

  const [tasks, setTasks] = useState<IAllTasks>();
  const [list, setList] = useState<Record<UniqueIdentifier, string[]>>({});
  const [listOrder, setListOrder] = useState<UniqueIdentifier[]>([]);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const isSortingContainer = activeId ? listOrder.includes(activeId) : false;
  console.log("==currentBoard", { currentBoard, allTask, listOrder });

  useEffect(() => {
    if (allTask) {
      setTasks(allTask);
      let cols = {} as Record<string, string[]>;
      let cols1 = {} as Record<string, string[]>;
      currentBoard?.board.kanbanListOrder.forEach((x) => {
        cols1["column-" + x] = [];
      });

      allTask?.task.forEach((x) => {
        if (!("column-" + x.list in cols1)) {
          cols1["column-" + x.list] = [];
        }
        cols1["column-" + x.list]?.push("task-" + x.id);
      });

      setList(cols1);
      setListOrder(Object.keys(cols1));
    }
  }, [allTask, currentBoard]);

  const moveBetweenContainers = useCallback(
    (
      activeContainer: UniqueIdentifier,
      overContainer: UniqueIdentifier,
      active: Active,
      over: Over,
      overId: UniqueIdentifier
    ) => {
      const activeItems = list[activeContainer];
      const overItems = list[overContainer];
      const overIndex = overItems?.indexOf(overId as string);
      const activeIndex = activeItems?.indexOf(active.id as string);

      let newIndex;

      if (overId in list) {
        newIndex = overItems!.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect?.current?.translated &&
          active.rect?.current?.translated.top >=
            over.rect?.top + over.rect?.height;

        const modifier = isBelowOverItem ? 1 : 0;

        newIndex =
          overIndex && overIndex >= 0
            ? overIndex + modifier
            : overItems && overItems.length + 1;
      }
      recentlyMovedToNewContainer.current = true;

      setList(
        update(list, {
          [activeContainer]: {
            $splice: [[activeIndex, 1]],
          },
          [overContainer]: {
            $splice: [[newIndex, 0, active.id]],
          },
        } as any)
      );
    },
    [list]
  );

  /**
   * Custom collision detection strategy optimized for multiple containers
   *
   * - First, find any droppable containers intersecting with the pointer.
   * - If there are none, find intersecting containers with the active draggable.
   * - If there are no intersecting containers, return the last matched intersection
   *
   */
  const collisionDetectionStrategy = useCallback<CollisionDetection>(
    (args) => {
      if (activeId && activeId in list) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in list
          ),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, "id");

      if (overId !== null) {
        if (overId in list) {
          const containerItems = list[overId];

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems && containerItems.length > 0) {
            // Return the closest droppable within that container
            overId =
              closestCenter({
                ...args,
                droppableContainers: args.droppableContainers.filter(
                  (container) =>
                    container.id !== overId &&
                    containerItems.includes(container.id as string)
                ),
              })[0]?.id || null;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }] as Collision[];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, list]
  );

  const [clonedItems, setClonedItems] = useState<Record<
    UniqueIdentifier,
    string[]
  > | null>(null);
  const sensors = useSensors(useSensor(MouseSensor));

  const findContainer = (id: UniqueIdentifier) => {
    if (id in list) return id;
    return listOrder.find((key) => list[key]?.includes(id as string));
  };

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id);
    setClonedItems(list);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    const overId = over?.id;

    if (!overId || active.id in list) return;

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id);

    if (!overContainer || !activeContainer) return;

    if (activeContainer !== overContainer) {
      moveBetweenContainers(
        activeContainer,
        overContainer,
        active,
        over,
        overId
      );
    }
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.id in list && over?.id) {
      setListOrder((containers) => {
        const activeIndex = containers.indexOf(active.id);
        const overIndex = containers.indexOf(over.id);

        return arrayMove(containers, activeIndex, overIndex);
      });
    }

    const activeContainer = findContainer(active.id);

    if (!activeContainer) {
      setActiveId(null);
      return;
    }

    const overContainer = findContainer(over.id);

    if (overContainer) {
      const activeIndex = list[activeContainer]?.indexOf(active.id as string);
      const overIndex = list[overContainer]?.indexOf(over.id as string);

      if (activeIndex !== overIndex) {
        setList((items) => ({
          ...items,
          [overContainer]: arrayMove(
            items[overContainer]!,
            activeIndex!,
            overIndex!
          ),
        }));
      }
    }

    setActiveId(null);
  }

  const handleDragCancel = () => {
    if (clonedItems) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      setList(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [list]);

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.WhileDragging,
          },
        }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div tw="flex flex-row p-10">
          <SortableContext
            items={listOrder}
            strategy={horizontalListSortingStrategy}
          >
            {tasks &&
              listOrder.map((containerId) => {
                return (
                  <List
                    id={containerId}
                    key={containerId}
                    items={list[containerId]!}
                    name={
                      currentBoard?.list.filter(
                        (c) => "column-" + c.id === containerId
                      )[0]!.title!
                    }
                    data={tasks}
                    isSortingContainer={isSortingContainer}
                  />
                );
              })}
            <KanbanCreateList dataId={boardId as string} action="list" />
          </SortableContext>
        </div>
        {createPortal(
          <DragOverlay
            adjustScale={false}
            dropAnimation={{
              duration: 75,
            }}
          >
            {activeId && tasks ? (
              listOrder.includes(activeId) ? (
                <List
                  id={activeId}
                  items={list[activeId]!}
                  name={
                    currentBoard?.list.filter(
                      (c) => "column-" + c.id === activeId
                    )[0]!.title!
                  }
                  data={tasks}
                  dragOverlay
                />
              ) : (
                <Task
                  id={activeId}
                  item={
                    tasks?.task.filter((d) => "task-" + d.id === activeId)[0]
                  }
                  dragOverlay
                />
              )
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default Kanban;
