import create from "zustand";
import { combineAndImmer } from "./types/combine-Immer";
import { IList, ISortKanban, ITask } from "./types/kanban.types";

export const useKanbanStore = create(
  combineAndImmer(
    {
      kanbanTask: [] as ITask[] | undefined,
      kanbanLists: [] as IList[] | undefined,
      kanbanListsOrder: [] as string[] | undefined,
    },
    (set, get) => ({
      sortKanban: (data: ISortKanban) => {},
    })
  )
);
