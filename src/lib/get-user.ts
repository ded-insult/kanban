import { User } from "@/domain/user";
import { useCallback, useReducer } from "react";

interface GetMeState {
  process: {
    loading: boolean;
    error: string | null;
  };
  user: User | null;
}

const initialState: GetMeState = {
  process: {
    loading: false,
    error: null,
  },
  user: null,
};

type GetMeAction =
  | {
      name: "startLoad";
    }
  | {
      name: "setUser";
      payload: User;
    }
  | {
      name: "setError";
      payload: string;
    };

const getMeReducer = (state: GetMeState, action: GetMeAction): GetMeState => {
  switch (action.name) {
    case "startLoad":
      return {
        process: {
          loading: true,
          error: null,
        },
        user: null,
      };
    case "setError":
      return {
        ...state,
        process: {
          ...state.process,
          loading: false,
          error: action.payload,
        },
      };
    case "setUser":
      return {
        process: {
          ...state.process,
          loading: false,
          error: null,
        },
        user: action.payload,
      };
    default:
      return state;
  }
};

export const useGetMeApi = () => {
  const [getMeState, dispatch] = useReducer(getMeReducer, initialState);

  const loadMe = useCallback(async () => {
    dispatch({ name: "startLoad" });
    try {
      //   TODO: Сделать получение пользователя
      //   const response = await fetch(`${VITE_BACKEND_URL}/users/get-user`);
      await new Promise((res) =>
        setTimeout(() => {
          res(null);
        }, 500)
      );

      // if (!response.ok) {
      //   throw new Error("UserApi error");
      // }

      //   TODO: Сделать получение пользователя
      //   const responseJson = await response.json();
      const responseJson: User = { name: "test user" };

      dispatch({ name: "setUser", payload: responseJson });
    } catch (err: unknown) {
      dispatch({
        name: "setError",
        payload:
          err instanceof Error
            ? err.message
            : "Ошибка при получении пользователя",
      });
    }
  }, []);

  return {
    getMeState,
    loadMe,
  };
};
