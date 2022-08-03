import { Types } from 'mongoose';

interface IBoard {
  boardId: Types.ObjectId;
  title: string;
  newListOrder: Types.ObjectId[];
}

export type IGetBoard = Pick<IBoard, 'boardId'>;
export type ICreateBoard = Pick<IBoard, 'title'>;
export type IUpdateListOrder = Pick<IBoard, 'boardId' | 'newListOrder'>;
export type IDeleteBoard = Pick<IBoard, 'boardId'>;
