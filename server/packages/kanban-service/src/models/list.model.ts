import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Board } from './board.model';
import { Task } from './task.model';

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class List {
  @prop({ required: [true, 'missing title!'] })
  title: string;

  @prop({
    ref: 'Task',
  })
  taskIds: Ref<Task>[];

  @prop({
    ref: 'Board',
  })
  board: Ref<Board>;
}
