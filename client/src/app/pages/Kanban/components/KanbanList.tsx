import styled from "@emotion/styled";
import { Menu, Transition } from "@headlessui/react";
import { IList, ITask } from "@store/types/kanban.types";
import { FC, Fragment, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TextInputAreaAuto from "react-textarea-autosize";
import KanbanCreateList from "./KanbanCreateBtn";
import KanbanTask from "./KanbanTask";

const TaskList = styled.div<{ isDraggingOver: boolean }>`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) =>
    props.isDraggingOver ? "lightgrey" : "inherit"};
  flex-grow: 1;
`;

interface IKanbanListComp {
  list: IList;
  tasks: ITask[];
  index: number;
}

const KanbanList: FC<IKanbanListComp> = ({ list, index, tasks }) => {
  const [editList, setEditList] = useState(false);
  const [listText, setListText] = useState(list.title);

  return (
    <Draggable draggableId={list._id} index={index}>
      {(provided) => (
        <div
          tw=" w-72 rounded-md "
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div
            tw="relative flex flex-row justify-between bg-dark-third p-2 rounded-t-md items-center"
            {...provided.dragHandleProps}
          >
            {!editList ? (
              <p tw="w-5/6 mb-1 overflow-hidden text-lg overflow-ellipsis text-dark-txt whitespace-nowrap">
                {list.title}
              </p>
            ) : (
              <div tw="z-50 mb-1 overflow-scroll bg-white border-2 border-blue-400 border-solid rounded-md">
                <TextInputAreaAuto
                  autoFocus={true}
                  value={listText}
                  onChange={(e) => setListText(e.target.value)}
                  onKeyDown={(e) => {}}
                  tw="border-none outline-none resize-none"
                />
              </div>
            )}
            <div tw="absolute top-2 z-50 text-right right-3 w-7 ">
              <Menu as="div" tw="relative inline-block text-left">
                <div>
                  <Menu.Button
                    tw="flex items-center justify-center p-1 mx-1 text-xl rounded-full cursor-pointer text-dark-txt hover:bg-gray-300"
                    id="dark-mode-toggle"
                  >
                    <i className="bx bx-dots-vertical-rounded"></i>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items tw="absolute right-0 w-32 mt-2 origin-top-right bg-gray-200 divide-y divide-black rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          tw="flex items-center w-full h-auto px-2 py-2 text-sm rounded-t-sm outline-none hover:bg-dark-second hover:text-dark-txt"
                          onClick={() => setEditList(true)}
                        >
                          Edit
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          tw="flex items-center w-full h-auto px-2 py-2 text-sm rounded-b-sm outline-none hover:bg-dark-second hover:text-dark-txt"
                          onClick={() => {}}
                        >
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
          <Droppable droppableId={list._id} type="task">
            {(provided, snapshot) => (
              <TaskList
                tw="rounded-b-md bg-dark-third"
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {tasks.map((task: ITask, index: any) => (
                  <KanbanTask key={task._id} task={task} index={index} />
                ))}
                {provided.placeholder}
                <KanbanCreateList dataId={list._id} action="task" />
              </TaskList>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanList;
