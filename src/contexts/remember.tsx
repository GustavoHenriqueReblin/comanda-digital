import React, { createContext, useContext } from "react";

interface RememberContextProps {
    setProductSelectedIds: React.Dispatch<React.SetStateAction<[number] | []>>;
    setCategoryExpandedIds: React.Dispatch<React.SetStateAction<[number] | []>>;
};

export const RememberContext = createContext<RememberContextProps>({
    setProductSelectedIds: () => {},
    setCategoryExpandedIds: () => {},
});
  
export const useRememberContext = () => {
    const context = useContext(RememberContext);
    if (!context) {
        throw new Error(
            "useRememberContext deve ser usado dentro de um RememberProvider"
        );
    }
    return context;
};