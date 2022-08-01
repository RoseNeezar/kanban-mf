import { KanbanEvent } from '@kanban2.0/shared';
import { Body, Controller, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Types } from 'mongoose';
import {
  ICreatetask,
  IGetAlltask,
  IUpdatetask,
  IUpdatetaskameList,
  IUpdatetaskDifferentList,
} from './task.dto';
import { TaskService } from './task.service';

@Controller('api/task')
export class taskController {
  constructor(private taskervice: TaskService) {}

  @MessagePattern({ cmd: KanbanEvent.createTask })
  createtask(taskDto: ICreatetask) {
    return this.taskervice.createtask(taskDto);
  }

  @MessagePattern({ cmd: KanbanEvent.getAllTask })
  getAlltask(taskDto: IGetAlltask) {
    return this.taskervice.getAlltask(taskDto);
  }

  @MessagePattern({ cmd: KanbanEvent.updateTask })
  updatetask(data: { taskId: Types.ObjectId; taskDto: IUpdatetask }) {
    return this.taskervice.updatetask(data.taskDto, data.taskId);
  }

  @MessagePattern({ cmd: KanbanEvent.getTaskDetails })
  gettask(taskId: Types.ObjectId) {
    return this.taskervice.gettask(taskId);
  }

  @Post('/reorder/samelist')
  updatetaskameList(@Body() taskDto: IUpdatetaskameList) {
    return this.taskervice.updatetaskameList(taskDto);
  }

  @Post('/reorder/differentlist')
  updatetaskDifferentList(@Body() taskDto: IUpdatetaskDifferentList) {
    return this.taskervice.updatetaskDifferentList(taskDto);
  }

  @MessagePattern({ cmd: KanbanEvent.deleteTask })
  deletetask(taskId: string) {
    return this.taskervice.deletetask(taskId);
  }
}
