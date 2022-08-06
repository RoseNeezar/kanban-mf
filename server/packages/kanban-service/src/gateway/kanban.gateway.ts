import {
  ICreateList,
  IUpdatetaskameList,
  IUpdatetaskDifferentList,
} from '@kanban2.0/shared';
import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { IUpdateListOrder } from 'src/board/board.dto';
import { BoardService } from 'src/board/board.service';
import { WsAuthGuard } from 'src/guards/ws/ws.auth.guard';
import { ListService } from 'src/list/list.service';
import { TaskService } from 'src/task/task.service';
import { KanbanService } from './kanban.service';

@WebSocketGateway({
  path: '/kanban/socket.io',
  cors: {
    credentials: true,
    origin: process.env.ORIGIN,
  },
  transports: ['polling', 'websocket'],
})
export class KanbanGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(
    private kanbanService: KanbanService,
    private listService: ListService,
    private boardService: BoardService,
    private taskService: TaskService,
  ) {}

  private logger: Logger = new Logger('MessageGateway');

  afterInit(server: Server) {
    this.kanbanService.socket = server;
    this.listService.socket = server;
    this.boardService.socket = server;
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('setup')
  handleMessage(client: Socket, boardId: string) {
    client.join(boardId);
    client.emit('connected');
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('update-list-order')
  handleInBoard(client: Socket, data: any) {
    return this.boardService.updateListOrder(data);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('reorder-card-samelist')
  handleUpdateTaskSameList(client: Socket, data: IUpdatetaskameList) {
    return this.taskService.updatetaskameList(data);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('reorder-card-differentlist')
  handleUpdateTaskDifferentList(
    client: Socket,
    data: IUpdatetaskDifferentList,
  ) {
    return this.taskService.updatetaskDifferentList(data);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: `);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: `);
  }
}
