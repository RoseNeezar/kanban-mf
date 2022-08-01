import useFormInput from "@shared-hooks/useFormInput";
import useSocket from "@store/websockets/websockets";
import React from "react";
import KanbanCard from "./components/KanbanCard";
import { useCreateBoard, useGetAllBoard } from "./hooks/useBoard";

const Home = () => {
  const { boardList: KanbanBoards, isLoading } = useGetAllBoard();
  const { createBoard } = useCreateBoard();

  useSocket("who");
  const {
    onChangeText,
    resetText,
    fields: { title },
  } = useFormInput({
    title: "",
  });

  const HandleCreateBoard = async () => {
    if (title.length > 0) {
      await createBoard(title);

      resetText();
    }
  };

  return (
    <div tw="bg-dark-main flex flex-col items-center  w-full overflow-hidden ">
      <div tw="flex flex-col items-center ">
        <p tw="text-2xl text-dark-txt">Create Board</p>
        <div tw="flex flex-row items-center">
          <input
            tw="p-2 mt-8 mb-8 rounded-md w-96"
            type="title"
            value={title}
            onChange={onChangeText("title")}
          />
          <button
            onClick={() => HandleCreateBoard()}
            tw="w-20 h-10 ml-4 cursor-pointer hover:bg-dark-second rounded-xl bg-dark-third text-dark-txt"
          >
            Create
          </button>
        </div>
      </div>

      <div tw="grid justify-center w-full grid-flow-row gap-10 overflow-scroll auto-rows-min grid-rows-min grid-cols-fit">
        {!isLoading &&
          KanbanBoards?.filter((fil: any) => fil.title !== "").map(
            (res: any) => <KanbanCard key={res._id} {...res} />
          )}
      </div>
    </div>
  );
};

export default Home;
