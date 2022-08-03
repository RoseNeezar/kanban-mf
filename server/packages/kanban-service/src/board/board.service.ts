import { BadRequestException, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Board } from 'src/models/board.model';
import { Task } from 'src/models/task.model';
import { List } from 'src/models/list.model';
import { ErrorSanitizer } from 'src/utils/error.utils';
import { mongoId } from 'src/utils/mongo.types';
import {
  ICreateBoard,
  IDeleteBoard,
  IGetBoard,
  IUpdateListOrder,
} from './board.dto';
import { Socket, Server } from 'socket.io';
@Injectable()
export class BoardService {
  public socket: Server = null;
  constructor(
    @InjectModel(List)
    private readonly listModel: ReturnModelType<typeof List>,
    @InjectModel(Board)
    private readonly boardModel: ReturnModelType<typeof Board>,
    @InjectModel(Task)
    private readonly taskModel: ReturnModelType<typeof Task>,
  ) {}

  async getBoard(boardDto: IGetBoard) {
    const { boardId } = boardDto;
    try {
      const result = await this.boardModel.findById(boardId);
      return { details: result };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }
  async getAllBoards(userId: string) {
    try {
      const boards = await this.boardModel
        .find({ userId })
        .select('kanbanListOrder title _id');
      if (boards.length === 0) {
        const emptyBoard: Board = {
          userId,
          title: '',
          kanbanListOrder: [],
        };
        return { boards: [emptyBoard] };
      }
      return { boards };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async createBoard(boardDto: ICreateBoard, userId: mongoId) {
    const { title } = boardDto;

    const existingBoard = await this.boardModel.find({
      title,
    });

    if (existingBoard.length > 0) {
      throw new BadRequestException('Board already existed !');
    }

    try {
      const board = await this.boardModel.create({
        userId,
        title,
        kanbanListOrder: [],
      });
      return { board };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async updateListOrder(boardDto: IUpdateListOrder) {
    const { boardId, newListOrder } = boardDto;
    try {
      if (boardId && newListOrder) {
        const result = await this.boardModel.findByIdAndUpdate(
          boardId,
          { kanbanListOrder: newListOrder },
          { new: true },
        );

        return result;
      }
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }
  async deleteBoard(boardDto: IDeleteBoard) {
    try {
      const { boardId } = boardDto;

      const removeBoardListIds = await this.boardModel.findByIdAndDelete(
        boardId,
      );

      const re = await Promise.all(
        removeBoardListIds.kanbanListOrder.map(async (re) => {
          const removedList = await this.listModel.findByIdAndDelete(re);
          if (removedList.taskIds.length > 0) {
            const result = removedList.taskIds;
            return [...result];
          } else {
            return null;
          }
        }),
      );

      const result = [].concat(...re.filter((re) => !!re));
      await this.taskModel.deleteMany({
        _id: {
          $in: result,
        },
      });

      return { data: null };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }
}
