import { IError } from "@store/types/error.types";
import { toast } from "react-toastify";

const errorCatcher = (action: IError) => {
  if (!!action.errors && action.errors.length > 0) {
    if (
      action.errors[0].message === "not authenticated" &&
      window.location.pathname !== "/"
    ) {
      window.location.href = "/";
    }
    action.errors.map((err) => {
      toast.error(err.message);
    });
  }
};

export default errorCatcher;
