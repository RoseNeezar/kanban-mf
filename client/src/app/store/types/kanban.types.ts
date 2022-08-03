import { QueryClient } from "react-query";
import { Socket } from "socket.io-client";

export interface IKanbanTask {
  id: string;
  title: string;
}

export interface ISortKanban {
  boardId?: string;
  dropIdStart: string;
  dropIdEnd: string;
  dragIndexStart: number;
  dragIndexEnd: number;
  dragableID: string;
  type: "task" | "list";
  cache: QueryClient;
  socket: Socket | null;
}

export interface IKanbanTask {
  _id: string;
  text: string;
}

export interface IKanbanList {
  title: string;
  _id: string;
  tasks?: IKanbanTask[];
}

export interface IEditTask {
  listID: string;
  taskID: string;
}

export interface IGetAllBoards {
  boards: IBoard[];
}

export interface IBoard {
  kanbanListOrder: [];
  _id: string;
  title: string;
  user?: string;
  __v?: number;
}

export interface ICreateBoard {
  board: IBoard;
}

export interface IList {
  taskIds: string[];
  _id: string;
  board?: string;
  title: string;
}

export interface ICreateList {
  message: string;
  list: IList;
}

export interface IGetAllListFromBoard {
  message: string;
  list: IList[];
  board: {
    kanbanListOrder: [];
    _id: string;
    title: string;
  };
}

export interface ITask {
  _id: string;
  title: string;
  dueDate?: Date;
  descriptions: string;
  list: string;
  boardId?: string;
}
export type ICalendarTask = Record<number, ITask[]>;

export interface IAllTasks {
  message: string;
  task: ITask[];
}

export interface ICreateTask {
  message: string;
  task: {
    _id: string;
    title: string;
    list: string;
    __v: 0;
  };
  list: IList;
}

export interface IUpdateTask {
  status: string;
  data: {
    _id: string;
    title: string;
    descriptions: string;
    list: string;
    taskId: string;
  };
}

export interface IUpdateList {
  message: string;
  data: IList;
}

export interface IListInBoard {
  details: {
    kanbanListOrder: [];
    _id: string;
    user: string;
    title: string;
    __v: number;
  };
}

export interface IUpdateListOrder {
  message: string;
  updatedListOrder: [];
}

export interface IUpdateTaskSameList {
  message: string;
  savedList: IList;
}

export interface IUpdateTaskDifferentList {
  message: string;
  removeLists: IList;
  addedLists: IList;
}
