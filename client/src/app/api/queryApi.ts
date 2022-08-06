import { ILogin, IRegister } from "@store/types/auth.types";
import {
  ICreateList,
  IUpdateList,
  ICreateBoard,
  IGetAllBoards,
  IGetAllListFromBoard,
  IAllTasks,
  ITask,
  IUpdateTask,
  ICreateTask,
} from "@store/types/kanban.types";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = process.env.API_URL + "/api";

axios.interceptors.request.use((config) => {
  // const token = store.commonStore.token;
  // if (token) config.headers.Authorization = `Bearer ${token}`
  return config;
});

axios.interceptors.response.use(undefined, (error: AxiosError) => {
  const { data, status, config, headers } = error.response!;
  switch (status) {
    case 400:
      if (data.error || data.errors) {
        console.log(data);
        if (data.message.includes("token")) return;
        toast.error(data.message);
      }
      break;
    case 401:
      if (
        status === 401 &&
        headers["www-authenticate"]?.startsWith('Bearer error="invalid_token"')
      ) {
        toast.error("Session expired - please login again");
      }
      break;
    case 500:
      toast.error(data.message);

      break;
  }
  return Promise.reject(error);
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string, params?: any) =>
    axios
      .get<T>(url, {
        params,
        withCredentials: true,
      })
      .then(responseBody),
  post: <T>(url: string, body?: {}) =>
    axios.post<T>(url, body, { withCredentials: true }).then(responseBody),
  put: <T>(url: string, body: {}) =>
    axios
      .put<T>(url, body, {
        withCredentials: true,
      })
      .then(responseBody),
  del: <T>(url: string) =>
    axios
      .delete<T>(url, {
        withCredentials: true,
      })
      .then(responseBody),
};

const boardService = {
  createBoard: (data: { boardTitle: string }) =>
    requests.post<ICreateBoard>(`/kanban`, {
      title: data.boardTitle,
    }),
  getAllBoards: () => requests.get<IGetAllBoards>(`/kanban/all`),
  deleteBoard: (boardId: string) => requests.del<any>(`/kanban/${boardId}`),
};

const listService = {
  getBoardList: (boardId: string) =>
    requests.get<IGetAllListFromBoard>(`/lists/all/${boardId}`),
  createList: (title: string, boardId: string): Promise<ICreateList> =>
    requests.post("/lists", {
      title: title,
      boardId: boardId,
    }),
  updateList: (title: string, listId: string): Promise<IUpdateList> =>
    requests.post(`/lists/${listId}`, { title: title }),
  deleteList: (listId: string): Promise<void> =>
    requests.del(`/lists/list/${listId}`),
};

const taskService = {
  createTask: (listId: string, title: string): Promise<ICreateTask> =>
    requests.post("/tasks", {
      listId: listId,
      title: title,
    }),
  updateTask: (
    title: string,
    descriptions: string,
    cardId: string,
    dueDate?: string
  ): Promise<IUpdateTask> => {
    return requests.post(`/tasks/task/${cardId}`, {
      title,
      descriptions,
      dueDate,
    });
  },
  getTask: (cardId: string): Promise<ITask> => {
    return requests.get(`/tasks/task/${cardId}`);
  },
  getAllTaskFromList: (listIds: string[]): Promise<IAllTasks> =>
    requests.post("/tasks/getalltask", { listIds: listIds }),
  deleteTask: (cardId: string): Promise<any> =>
    requests.del(`/tasks/task/${cardId}`),
};

const authService = {
  login: (data: ILogin) => requests.post<any>(`/auth/login`, data),
  signup: (data: IRegister) => requests.post<any>(`/auth/register`, data),
  getMe: () => requests.get<any>(`/auth/me`),
  logout: () => requests.post<any>(`/auth/logout`),
};

const queryApi = {
  boardService,
  listService,
  taskService,
  authService,
};

export default queryApi;
