import {
  ICreatetask,
  IGetAlltask,
  IUpdateListOrder,
  IUpdatetask,
  KanbanEvent,
} from '@kanban2.0/shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Authorization } from './decorators/authorization.decorator';

type IboardId = Pick<IUpdateListOrder, 'boardId'>['boardId'];

@Controller('api/tasks')
export class TaskController {
  constructor(
    @Inject('KANBAN_SERVICE') private readonly kanbanService: ClientProxy,
  ) {}

  @Post('/')
  createtask(@Body() taskDto: ICreatetask) {
    return this.kanbanService.send({ cmd: KanbanEvent.createTask }, taskDto);
  }

  @Post('/getalltask')
  getAlltask(@Body() taskDto: IGetAlltask) {
    return this.kanbanService.send({ cmd: KanbanEvent.getAllTask }, taskDto);
  }

  @Post('/task/:taskId')
  updatetask(@Param('taskId') taskId: IboardId, @Body() taskDto: IUpdatetask) {
    return this.kanbanService.send(
      { cmd: KanbanEvent.updateTask },
      { taskDto, taskId },
    );
  }

  @Get('/task/:taskId')
  gettask(@Param('taskId') taskId: IboardId) {
    return this.kanbanService.send({ cmd: KanbanEvent.getTaskDetails }, taskId);
  }

  @Delete('/task/:taskId')
  deletetask(@Param('taskId') taskId: string) {
    return this.kanbanService.send({ cmd: KanbanEvent.deleteTask }, taskId);
  }

  @Get('/list/:listId')
  @Authorization(true)
  getListDetails(@Param('listId') listId: IboardId) {
    return this.kanbanService.send({ cmd: KanbanEvent.getListDetails }, listId);
  }
}
