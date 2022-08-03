import { currentBoardKey } from "@api/queryKey";
import { IGetAllListFromBoard, ISortKanban } from "@store/types/kanban.types";
import produce from "immer";

export const sortKanban = (data: ISortKanban) => {
  const {
    boardId,
    dragableID,
    dropIdEnd,
    dropIdStart,
    dragIndexEnd,
    dragIndexStart,
    type,
    cache,
    socket,
  } = data;

  const currentboard =
    cache.getQueryData<IGetAllListFromBoard>(currentBoardKey);

  //move list
  if (type === "list") {
    const currentboard =
      cache.getQueryData<IGetAllListFromBoard>(currentBoardKey);

    let newColumnOrder = [...currentboard!.board.kanbanListOrder];

    newColumnOrder!.splice(dragIndexStart, 1);
    //@ts-ignore
    newColumnOrder!.splice(dragIndexEnd, 0, dragableID);

    cache.setQueryData(currentBoardKey, (data) => {
      return produce(data, (newData: IGetAllListFromBoard) => {
        newData.board.kanbanListOrder = newColumnOrder as [];
      });
    });

    const data = {
      boardId,
      newListOrder: newColumnOrder,
    };
    socket?.emit("update-list-order", data, (res: any) => {
      console.log("result---?", res);
    });
    return;
  }

  const listStart = currentboard?.list?.find((x) => x._id === dropIdStart);

  const listEnd = currentboard?.list?.find((x) => x._id === dropIdEnd);

  //move task in same list
  if (dropIdStart === dropIdEnd) {
    const newTaskIds = [...listStart!.taskIds];
    newTaskIds.splice(dragIndexStart, 1);
    newTaskIds.splice(dragIndexEnd, 0, dragableID);

    cache.setQueryData(currentBoardKey, (data) => {
      return produce(data, (newData: IGetAllListFromBoard) => {
        newData.list.find((x) => x._id === dropIdStart)!.taskIds =
          newTaskIds as [];
      });
    });
    const data = {
      sameListId: currentboard?.list.find((x) => x._id === dropIdStart)?._id,
      sameListtaskIds: newTaskIds,
    };
    socket?.emit("reorder-card-samelist", data, (res: any) => {
      console.log("reorder-card-samelist---", res);
    });
    return;
  }

  // move task from one list to another
  const homeTaskIds = [...listStart!.taskIds];

  homeTaskIds.splice(dragIndexStart, 1);

  const foreignTaskIds = [...listEnd!.taskIds];

  foreignTaskIds.splice(dragIndexEnd, 0, dragableID);

  cache.setQueryData(currentBoardKey, (data) => {
    return produce(data, (newData: IGetAllListFromBoard) => {
      newData.list.find((x) => x._id === dropIdStart)!.taskIds =
        homeTaskIds as [];
      newData.list.find((x) => x._id === dropIdEnd)!.taskIds =
        foreignTaskIds as [];
    });
  });

  const updateOrderData = {
    removedListId: currentboard?.list.find((x) => x._id === dropIdStart)?._id,
    addedListId: currentboard?.list.find((x) => x._id === dropIdEnd)?._id,
    removedListtaskIds: homeTaskIds,
    addedListtaskIds: foreignTaskIds,
  };
  socket?.emit("reorder-card-differentlist", updateOrderData);
};
