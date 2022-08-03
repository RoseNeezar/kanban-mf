import { Types } from 'mongoose';

interface Itask {
  title: string;
  listId: Types.ObjectId;
  taskId: Types.ObjectId;
  sameListId: Types.ObjectId;
  sameListtaskIds: string[];
  removedListId: Types.ObjectId;
  addedListId: Types.ObjectId;
  removedListtaskIds: string[];
  addedListtaskIds: string[];
  listIds: string[];
  descriptions: string;
  dueDate: Date;
}

export type ICreatetask = Pick<Itask, 'listId' | 'title'>;
export type IGetAlltask = Pick<Itask, 'listIds'>;
export type IUpdatetask = Pick<Itask, 'title' | 'descriptions' | 'dueDate'>;
export type IUpdatetaskameList = Pick<Itask, 'sameListId' | 'sameListtaskIds'>;
export type IUpdatetaskDifferentList = Pick<
  Itask,
  'removedListId' | 'addedListId' | 'removedListtaskIds' | 'addedListtaskIds'
>;
export type IDeletetask = Pick<Itask, 'taskId'>;
