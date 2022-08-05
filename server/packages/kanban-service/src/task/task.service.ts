import { BadRequestException, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { Board } from 'src/models/board.model';
import { Task } from 'src/models/task.model';
import { List } from 'src/models/list.model';
import { ErrorSanitizer } from 'src/utils/error.utils';
import {
  ICreatetask,
  IGetAlltask,
  IUpdatetaskDifferentList,
  IUpdatetaskameList,
  IUpdatetask,
} from './task.dto';
import { Server } from 'socket.io';
@Injectable()
export class TaskService {
  public socket: Server = null;
  constructor(
    @InjectModel(List)
    private readonly listModel: ReturnModelType<typeof List>,
    @InjectModel(Board)
    private readonly boardModel: ReturnModelType<typeof Board>,
    @InjectModel(Task)
    private readonly taskModel: ReturnModelType<typeof Task>,
  ) {}

  async createtask(taskDto: ICreatetask) {
    const { listId, title } = taskDto;
    try {
      const task = await this.taskModel.create({
        list: listId,
        title,
        descriptions: '',
        dueDate: null,
      });

      const list = await this.listModel.findById(listId);

      const newtaskIds = Array.from(list.taskIds);
      newtaskIds.push(task._id);
      const newList = await list.set({ taskIds: newtaskIds }).save();

      return { task, list: newList };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async getAlltask(taskDto: IGetAlltask) {
    const { listIds } = taskDto;
    if (!listIds) return { task: [] };
    try {
      if (listIds && listIds[0].length > 0) {
        const taskPromise = listIds.map(
          async (id) =>
            await this.taskModel
              .find({ list: id })
              .select('_id title descriptions dueDate list'),
        );
        let totaltask = await Promise.all(taskPromise);

        return { task: totaltask.flatMap((x) => x.map((r) => r)) };
      }

      return { task: [] };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }
  async gettask(taskId: Types.ObjectId) {
    try {
      const task = await this.taskModel.findById(taskId);
      return task;
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async updatetask(taskDto: IUpdatetask, taskId: Types.ObjectId) {
    const { title, descriptions, dueDate } = taskDto;

    try {
      const task = await this.taskModel.findByIdAndUpdate(
        taskId,
        { title, descriptions, dueDate },
        { new: true },
      );
      return { data: task };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async updatetaskameList(taskDto: IUpdatetaskameList) {
    const { sameListId, sameListtaskIds } = taskDto;
    try {
      const list = await this.listModel.findById(sameListId);
      const toObjectId = sameListtaskIds.map((id) => Types.ObjectId(id));
      const newListOrder = await list.set({ taskIds: toObjectId }).save();
      return { newListOrder };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async updatetaskDifferentList(taskDto: IUpdatetaskDifferentList) {
    const { removedListId, addedListId, addedListtaskIds, removedListtaskIds } =
      taskDto;
    try {
      const removedList = await this.listModel.findById(removedListId);

      const removeListObjectId = removedListtaskIds.map((id) =>
        Types.ObjectId(id),
      );

      removedList.set({ taskIds: removeListObjectId });

      const removeLists = await removedList.save();

      const addedList = await this.listModel.findById(addedListId);

      const addedListObjectId = addedListtaskIds.map((id) =>
        Types.ObjectId(id),
      );

      addedList.set({ taskIds: addedListObjectId });

      const addedLists = await addedList.save();

      return {
        removeLists,
        addedLists,
      };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async deletetask(taskId: string) {
    try {
      await this.taskModel.findByIdAndDelete(taskId);

      await this.listModel.findOneAndUpdate(
        { taskIds: Types.ObjectId(taskId) },
        { $pull: { taskIds: Types.ObjectId(taskId) } },
      );
      return { data: null };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }
}
