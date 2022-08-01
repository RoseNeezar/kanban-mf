import { KanbanEvent } from '@kanban2.0/shared';
import { Body, Controller, Delete, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Types } from 'mongoose';
import { ICreateList, IUpdateListTitle } from './list.dto';
import { ListService } from './list.service';

@Controller()
export class ListController {
  constructor(private listService: ListService) {}

  @MessagePattern({ cmd: KanbanEvent.createList })
  createList(@Body() listDto: ICreateList) {
    return this.listService.createList(listDto);
  }

  @MessagePattern({ cmd: KanbanEvent.updateListDetails })
  updateListTitle(listId: Types.ObjectId, listTitle: IUpdateListTitle) {
    return this.listService.updateListTitle(listTitle, listId);
  }

  @MessagePattern({ cmd: KanbanEvent.getListDetails })
  getListDetails(listId: Types.ObjectId) {
    return this.listService.getListDetails({ listId });
  }

  @MessagePattern({ cmd: KanbanEvent.getKanbanBoardLists })
  getKanbanBoardLists(boardId: Types.ObjectId) {
    return this.listService.getKanbanBoardLists({ boardId });
  }

  @MessagePattern({ cmd: KanbanEvent.deleteList })
  deleteList(@Param('listId') listId: string) {
    return this.listService.deleteList({ listId });
  }
}
