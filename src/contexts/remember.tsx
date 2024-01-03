import React, { createContext, useContext } from "react";

interface RememberContextProps {
    setProductSelectedIds: React.Dispatch<React.SetStateAction<[number] | null>>;
    setCategoryExpandedIds: React.Dispatch<React.SetStateAction<[number] | null>>;
};

export const RememberContext = createContext<RememberContextProps | null>(
    null
);
  
export const useRememberContext = () => {
    const context = useContext(RememberContext);
    if (!context) {
        throw new Error(
            "useRememberContext deve ser usado dentro de um RememberProvider"
        );
    }
    return context;
};