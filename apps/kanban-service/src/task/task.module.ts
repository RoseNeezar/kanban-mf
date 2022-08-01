import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Board } from 'src/models/board.model';
import { List } from 'src/models/list.model';
import { Task } from 'src/models/task.model';
import { taskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [TypegooseModule.forFeature([List, Board, Task])],
  controllers: [taskController],
  providers: [TaskService],
})
export class taskModule {}
