import AuthRoute from "@pages/Auth/AuthRoute";
import Login from "@pages/Auth/Login.modal";
import Register from "@pages/Auth/Register.modal";
import Kanban from "@pages/Kanban/Kanban.page";
import Landing from "@pages/Landing/Landing.page";
import NotFound from "@pages/NotFound/NotFound";
import { useAuthStore } from "@store/useAuth.store";
import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./app/pages/Home/Home.page";
import KanbanView from "./app/kanban/Kanban.view";
import { tasks, columns } from "./app/kanban/mock";

const App: React.FC<{
  routePrefix: string;
  useRemoteStore?: any;
}> = ({ routePrefix, useRemoteStore }) => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  const { getMe } = useAuthStore();
  useEffect(() => {
    const el = document.querySelector(".overlay");
    // @ts-ignore
    el.style.display = "none";
    getMe();
  }, []);

  // useRouteHooks(useRemoteStore);

  return (
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/landing" element={<Landing />} />

        <Route
          path={`/app/kanban`}
          element={
            <AuthRoute>
              <Home />
            </AuthRoute>
          }
        />

        <Route path={`app/kanban/:boardId`} element={<Kanban />} />
        <Route
          path={`app/kanban2`}
          element={
            <div tw="flex w-full flex-1 bg-red-400">
              <KanbanView Tasks={tasks} List={columns} />
            </div>
          }
        />
        <Route path="/" element={<Navigate replace to={`app/kanban/`} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {state?.backgroundLocation && (
        <Routes>
          <Route
            path="/login"
            element={<Login isOpen={!!state?.backgroundLocation} />}
          />
          <Route
            path="/register"
            element={<Register isOpen={!!state?.backgroundLocation} />}
          />
        </Routes>
      )}
    </React.Suspense>
  );
};

export default App;
