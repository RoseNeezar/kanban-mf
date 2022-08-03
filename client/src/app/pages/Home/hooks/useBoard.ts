import queryApi from "@api/queryApi";
import { boardsKey, currentBoardKey } from "@api/queryKey";
import produce from "immer";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const useGetAllBoard = () => {
  const { data, isLoading } = useQuery(boardsKey, () => {
    return queryApi.boardService.getAllBoards().then((re) => re.boards);
  });

  return { boardList: data, isLoading };
};

export const useDeleteBoard = () => {
  const cache = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (boardId: string) => queryApi.boardService.deleteBoard(boardId),
    {
      onSuccess: (_, item) => {
        cache.setQueryData(boardsKey, (oldData: any) => {
          return oldData.filter((re: any) => re._id !== item);
        });
      },
    }
  );
  return {
    deleteBoard: mutateAsync,
    isLoading,
  };
};

export const useCreateBoard = () => {
  const cache = useQueryClient();

  const { mutateAsync } = useMutation(
    (title: string) =>
      queryApi.boardService.createBoard({
        boardTitle: title,
      }),
    {
      onSuccess: (result) => {
        cache.setQueryData(boardsKey, (data: any) => {
          return produce(data, (newData: any[]) => {
            newData.push(result.board);
          });
        });
      },
    }
  );
  return {
    createBoard: mutateAsync,
  };
};
