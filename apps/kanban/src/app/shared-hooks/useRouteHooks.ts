import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useRouteHooks = (authStore: any) => {
  const { pathname } = useLocation();
  const { showSidebar } = authStore();
  const kanbanRoute = "/kanban";
  const boardRoute = "/board";

  useEffect(() => {
    if (pathname.includes(boardRoute)) {
      showSidebar(false);
      return;
    }
    showSidebar(true);
  }, [pathname]);
  return null;
};

export default useRouteHooks;
