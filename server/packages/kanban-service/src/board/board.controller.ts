import { IUpdateListOrder, KanbanEvent } from '@kanban2.0/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Types } from 'mongoose';
import { ICreateBoard } from './board.dto';
import { BoardService } from './board.service';

@Controller()
export class BoardController {
  constructor(private boardService: BoardService) {}

  @MessagePattern({ cmd: KanbanEvent.getAllBoards })
  getAllBoards(userId: string) {
    return this.boardService.getAllBoards(userId);
  }

  @MessagePattern({ cmd: KanbanEvent.createBoard })
  createBoard(data: { boardDto: ICreateBoard; userId: string }) {
    return this.boardService.createBoard(
      data.boardDto,
      Types.ObjectId(data.userId),
    );
  }

  @MessagePattern({ cmd: KanbanEvent.getBoard })
  getBoard(boardId: Types.ObjectId) {
    return this.boardService.getBoard({ boardId });
  }

  @MessagePattern({ cmd: KanbanEvent.deleteBoard })
  deleteBoard(boardId: Types.ObjectId) {
    return this.boardService.deleteBoard({ boardId });
  }

  @MessagePattern({ cmd: KanbanEvent.updateListOrder })
  updateListOrder(boardDto: IUpdateListOrder) {
    return this.boardService.updateListOrder(boardDto);
  }
}
