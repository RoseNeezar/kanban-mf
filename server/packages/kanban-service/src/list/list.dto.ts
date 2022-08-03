import { Types } from 'mongoose';

interface IList {
  title: string;
  boardId: Types.ObjectId;
  listId: Types.ObjectId;
}

export type ICreateList = Pick<IList, 'title' | 'boardId'>;
export type IUpdateListTitle = Pick<IList, 'title'>;
export type IGetList = Pick<IList, 'listId'>;
export type IGetAllList = Pick<IList, 'boardId'>;
export type IDeleteList = Pick<IList, 'listId'>;
