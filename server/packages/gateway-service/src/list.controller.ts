import {
  ICreateList,
  IUpdateListOrder,
  IUpdateListTitle,
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

@Controller('api/lists')
export class ListController {
  constructor(
    @Inject('KANBAN_SERVICE') private readonly kanbanService: ClientProxy,
  ) {}

  @Post('/')
  createList(@Body() listDto: ICreateList) {
    return this.kanbanService.send({ cmd: KanbanEvent.createList }, listDto);
  }

  @Post('/:listId')
  updateListTitle(
    @Param('listId') listId: IboardId,
    @Body() listTitle: IUpdateListTitle,
  ) {
    return this.kanbanService.send(
      { cmd: KanbanEvent.updateListDetails },
      { listId, listTitle },
    );
  }

  @Get('/all/:boardId')
  @Authorization(true)
  getKanbanBoardLists(@Param('boardId') boardId: IboardId) {
    return this.kanbanService.send(
      { cmd: KanbanEvent.getKanbanBoardLists },
      boardId,
    );
  }

  @Delete('/list/:listId')
  deleteList(@Param('listId') listId: string) {
    return this.kanbanService.send({ cmd: KanbanEvent.deleteList }, listId);
  }

  @Get('/list/:listId')
  @Authorization(true)
  getListDetails(@Param('listId') listId: IboardId) {
    return this.kanbanService.send({ cmd: KanbanEvent.getListDetails }, listId);
  }
}
