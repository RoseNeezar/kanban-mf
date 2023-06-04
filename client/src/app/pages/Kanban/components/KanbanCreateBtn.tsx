import React from "react";
import { useCreateList, useCreateTask } from "../hooks/useList";

interface IKanbanCreateList {
  dataId: string;
  action: "list" | "task";
  id?: string;
}

const KanbanCreateList: React.FC<IKanbanCreateList> = ({ dataId, action }) => {
  const [title, setTitle] = React.useState("");
  const [openForm, setOpenForm] = React.useState(false);
  const { createList } = useCreateList();
  const { createTask } = useCreateTask();

  const handleCreateItem = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    try {
      if (e.key === "Enter" && title.length > 0) {
        if (action === "list") {
          await createList({
            title,
            boardId: dataId,
          });
        } else if (action === "task") {
          console.log("=", dataId.split("-")[0]);
          await createTask({
            title,
            listId: dataId.split("-")[1],
          });
        }

        setTitle("");
        setOpenForm(false);
      }
    } catch (error) {}
  };
  return (
    <>
      {openForm ? (
        <div tw="max-h-full p-3 rounded-md h-28 bg-dark-third z-10">
          <input
            placeholder={
              action === "list"
                ? "Enter title for list"
                : "Enter title for card"
            }
            autoFocus
            value={title}
            onKeyDown={(e) => handleCreateItem(e)}
            onChange={(e) => setTitle(e.target.value)}
            tw="p-2 mb-3 border-none rounded-md outline-none resize-none w-60"
          />

          <div tw="flex justify-between ">
            <button
              tw="p-2 text-white bg-green-900 rounded-md"
              onClick={() => {}}
            >
              {action === "list" ? "Enter list" : "Enter card"}
            </button>
            <button
              tw="p-2 text-white bg-red-900 rounded-md"
              onClick={() => setOpenForm(false)}
            >
              cancel
            </button>
          </div>
        </div>
      ) : (
        <div tw="flex items-center justify-center w-64 h-10 min-w-full rounded-md">
          <button
            tw="flex items-center justify-between w-full h-full pl-2 pr-2 rounded-md hover:bg-gray-200 hover:text-black bg-dark-second text-dark-txt text-base"
            onClick={() => setOpenForm(true)}
          >
            {action === "list" ? "Add  list" : "Add  card"}
            <i className="bx bxs-plus-circle" tw="text-xl"></i>
          </button>
        </div>
      )}
    </>
  );
};

export default KanbanCreateList;
