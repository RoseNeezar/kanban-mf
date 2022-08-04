import queryApi from "@api/queryApi";
import { allTaskKey, currentBoardKey } from "@api/queryKey";
import { useMutation, useQuery, useQueryClient } from "react-query";
import produce from "immer";
import { IAllTasks, IGetAllListFromBoard } from "@store/types/kanban.types";

export const useGetBoardList = (boardId: string) => {
  const { data, isLoading } = useQuery(currentBoardKey, () =>
    queryApi.listService.getBoardList(boardId).then((re) => re)
  );

  const { data: Tasks, isLoading: TaskLoading } = useQuery(
    allTaskKey,

    () =>
      queryApi.taskService
        .getAllTaskFromList(data!.board.kanbanListOrder)
        .then((re) => re),
    {
      enabled: !!data && data?.board.kanbanListOrder.length > 0,
    }
  );

  return {
    currentBoard: data,
    allTask: Tasks,
    isLoading: TaskLoading,
  };
};

export const useCreateList = () => {
  const cache = useQueryClient();

  const { mutateAsync } = useMutation(
    (data: { title: string; boardId: string }) =>
      queryApi.listService.createList(data.title, data.boardId),
    {
      onSuccess: (result) => {
        cache.invalidateQueries(currentBoardKey);
      },
    }
  );
  return {
    createList: mutateAsync,
  };
};

export const useCreateTask = () => {
  const cache = useQueryClient();

  const { mutateAsync } = useMutation(
    (data: { listId: string; title: string }) =>
      queryApi.taskService.createTask(data.listId, data.title),
    {
      onSuccess: (result) => {
        const boat = cache.getQueriesData(currentBoardKey);
        const t = cache.getQueriesData(allTaskKey);
        console.log("ha--", boat, t, result);

        cache.setQueryData(currentBoardKey, (data) => {
          return produce(data, (newData: IGetAllListFromBoard) => {
            newData.list.push({
              _id: result.list._id,
              id: result.list._id,
              taskIds: result.list.taskIds,
              title: result.list.title,
            });
          });
        });

        cache.setQueryData(allTaskKey, (data) => {
          return produce(data, (newData: IAllTasks) => {
            newData.task.push({
              _id: result.task._id,
              id: result.task._id,
              descriptions: "",
              list: result.task.list,
              title: result.task.title,
            });
          });
        });

        const boats = cache.getQueriesData(currentBoardKey);
        const ts = cache.getQueriesData(allTaskKey);
        console.log("ha--1", boats, ts, result);
        cache.invalidateQueries(currentBoardKey);
        cache.invalidateQueries(allTaskKey);
      },
    }
  );
  return {
    createTask: mutateAsync,
  };
};
