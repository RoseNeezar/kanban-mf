import {
  ICreateBoard,
  IUpdateListOrder,
  IUser,
  KanbanEvent,
} from '@kanban2.0/shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Authorization } from './decorators/authorization.decorator';
import { GetUser } from './decorators/get-user.decorator';

type IboardId = Pick<IUpdateListOrder, 'boardId'>['boardId'];

@Controller('api/kanban')
export class KanbanController {
  constructor(
    @Inject('KANBAN_SERVICE') private readonly kanbanService: ClientProxy,
  ) {}

  @Get('/all')
  @Authorization(true)
  getAllBoards(@GetUser() user: IUser) {
    return this.kanbanService.send({ cmd: KanbanEvent.getAllBoards }, user._id);
  }

  @Post('/')
  @Authorization(true)
  async createBoard(@GetUser() user: IUser, @Body() boardDto: ICreateBoard) {
    return this.kanbanService.send(
      { cmd: KanbanEvent.createBoard },
      { boardDto, userId: user._id },
    );
  }

  @Get('/:boardId')
  @Authorization(true)
  getBoard(@Param('boardId') boardId: IboardId) {
    return this.kanbanService.send({ cmd: KanbanEvent.getBoard }, boardId);
  }

  @Delete('/:boardId')
  @Authorization(true)
  deleteBoard(@Param('boardId') boardId: IboardId) {
    return this.kanbanService.send({ cmd: KanbanEvent.deleteBoard }, boardId);
  }

  @Patch('/')
  updateListOrder(@Body() boardDto: IUpdateListOrder) {
    return this.kanbanService.send(
      { cmd: KanbanEvent.updateListOrder },
      boardDto,
    );
  }
}
