import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteBoard } from "../hooks/useBoard";

interface IKanbanCard {
  _id: string;
  title: string;
}

const KanbanCard: FC<IKanbanCard> = (res) => {
  const navigate = useNavigate();

  const { deleteBoard, isLoading } = useDeleteBoard();

  const HandleDelete = async (boardId: string) => {
    await deleteBoard(boardId);
  };

  return (
    <div tw="p-3 rounded-md bg-dark-third" key={res._id}>
      <div tw="flex justify-end ">
        <button
          tw="text-3xl rounded-full text-dark-main hover:text-gray-200"
          onClick={() => HandleDelete(res._id)}
        >
          <i className=" bx bxs-x-circle"></i>
        </button>
      </div>
      {isLoading && <h1>Loading....</h1>}
      <button
        tw="w-full h-20 rounded-md hover:text-black hover:bg-gray-200 bg-dark-second text-dark-txt"
        onClick={() => navigate(res._id)}
      >
        {res.title}
      </button>
    </div>
  );
};

export default KanbanCard;
