import queryString from "query-string";
import { ajax } from "rxjs/ajax";

const baseURL = "http://localhost:3030/api/kanban";

const requestRxjs = {
  get: <T>(url: string) =>
    ajax<T>({
      url: `${baseURL}${url}`,
      method: "GET",
      withCredentials: true,
    }),
  post: <T>(url: string, body?: {}) =>
    ajax<T>({
      url: `${baseURL}${url}`,
      method: "POST",
      withCredentials: true,
      body,
    }),
  put: <T>(url: string, body?: {}) =>
    ajax<T>({
      url: `${baseURL}${url}`,
      method: "PUT",
      withCredentials: true,
      body,
    }),
  del: <T>(url: string) =>
    ajax<T>({
      url: `${baseURL}${url}`,
      method: "DELETE",
      withCredentials: true,
    }),
};

const boardService = {
  createBoard: (data: { boardTitle: string }) =>
    requestRxjs.post<any>(queryString.stringifyUrl({ url: "" }), {
      title: data.boardTitle,
    }),
  getAllBoards: () =>
    requestRxjs.get<void>(queryString.stringifyUrl({ url: `/all` })),
  getBoard: (boardId: string) =>
    requestRxjs.get<any>(
      queryString.stringifyUrl({
        url: `/${boardId}`,
      })
    ),
  deleteBoard: (boardId: string) =>
    requestRxjs.del<any>(
      queryString.stringifyUrl({
        url: `/${boardId}`,
      })
    ),
};

const agent = {
  boardService,
};

export default agent;
