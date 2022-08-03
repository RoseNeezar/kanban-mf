const initialData = {
  tasks: [
    { id: "task-1", title: "Take out the garbage" },
    { id: "task-2", title: "Watch my favorite show" },
    { id: "task-3", title: "Charge my phone" },
    { id: "task-4", title: "Cook dinner" },
  ],
  columns: [
    {
      id: "column-1",
      title: "To do",
      taskIds: ["task-1", "task-2", "task-3", "task-4"],
    },
    {
      id: "column-2",
      title: "In progress",
      taskIds: [],
    },
  ],
  // Facilitate reordering of the columns
  columnOrder: ["column-1", "column-2"],
};

export type initType = typeof initialData;

export { initialData };
