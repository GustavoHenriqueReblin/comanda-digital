import { Product } from "../types/types";
import React, { createContext, useContext } from "react";

interface RememberContextProps {
    setProductsSelected: React.Dispatch<React.SetStateAction<Product[] | []>>;
    setCategoryExpandedIds: React.Dispatch<React.SetStateAction<[number] | []>>;
    resetProducts: boolean,
    setResetProducts: React.Dispatch<React.SetStateAction<boolean>>;
};

export const RememberContext = createContext<RememberContextProps>({
    setProductsSelected: () => {},
    setCategoryExpandedIds: () => {},
    resetProducts: false,
    setResetProducts: () => {},
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