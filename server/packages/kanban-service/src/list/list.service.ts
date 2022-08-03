import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { Board } from 'src/models/board.model';
import { Task } from 'src/models/task.model';
import { List } from 'src/models/list.model';
import { ErrorSanitizer } from 'src/utils/error.utils';
import {
  ICreateList,
  IGetAllList,
  IGetList,
  IUpdateListTitle,
} from './list.dto';
import { Server } from 'socket.io';
import { KanbanService } from 'src/gateway/kanban.service';

@Injectable()
export class ListService {
  public socket: Server = null;
  constructor(
    @InjectModel(List)
    private readonly listModel: ReturnModelType<typeof List>,
    @InjectModel(Board)
    private readonly boardModel: ReturnModelType<typeof Board>,
    @InjectModel(Task)
    private readonly taskModel: ReturnModelType<typeof Task>,
    private kanbanService: KanbanService,
  ) {}

  async getBoard(
    boardId: Types.ObjectId,
  ): Promise<[DocumentType<Board>, Error]> {
    try {
      const board = await this.boardModel.findById(boardId);
      return [board, null];
    } catch (error) {
      return [null, error];
    }
  }
  async createList(listDto: ICreateList) {
    const { boardId, title } = listDto;
    try {
      const List: List = {
        board: boardId,
        title,
        taskIds: [],
      };
      const newList = await this.listModel.create(List);

      const [board, error] = await this.getBoard(boardId);

      if (!board) {
        throw new BadRequestException(ErrorSanitizer(error));
      }

      const newListOrder = Array.from(board.kanbanListOrder);
      newListOrder.push(newList._id);
      await board.set({ kanbanListOrder: newListOrder }).save();
      return { list: newList };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async updateListTitle(listDto: IUpdateListTitle, listId: Types.ObjectId) {
    const { title } = listDto;
    try {
      const listData = await this.listModel.findByIdAndUpdate(
        listId,
        { title },
        { new: true },
      );

      return { data: listData };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async getListDetails(listDto: IGetList) {
    const { listId } = listDto;
    try {
      const result = await this.listModel.findById(listId);
      return { data: result };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async getKanbanBoardLists(listDto: IGetAllList) {
    const { boardId } = listDto;
    try {
      const board = await this.boardModel
        .findOne({ _id: boardId })
        .select('title kanbanListOrder');
      const list = await this.listModel
        .find({ board: boardId })
        .select('taskIds title _id');

      return { list, board };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async deleteList(listDto: { listId: string }) {
    const { listId } = listDto;
    try {
      const removedList = await this.listModel.findByIdAndDelete(listId);

      await this.taskModel.deleteMany({
        _id: {
          $in: removedList.taskIds,
        },
      });

      await this.boardModel.findOneAndUpdate(
        { kanbanListOrder: Types.ObjectId(listId) },
        { $pull: { kanbanListOrder: Types.ObjectId(listId) } },
      );

      return { data: null };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }
}
