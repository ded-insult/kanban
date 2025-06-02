import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { User } from "../page";

interface BoardContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  selectedSprintId: string | null;
  setSelectedSprintId: (id: string | null) => void;
  selectedColumnId: string | null;
  setSelectedColumnId: (id: string | null) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider = ({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);

  const values = useMemo(
    () => ({
      user,
      setUser,
      selectedSprintId,
      setSelectedSprintId,
      selectedColumnId,
      setSelectedColumnId,
    }),
    [user, selectedSprintId, selectedColumnId]
  );

  return (
    <BoardContext.Provider value={values}>{children}</BoardContext.Provider>
  );
};

export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoardContext must be used within a BoardProvider");
  }
  return context;
};
