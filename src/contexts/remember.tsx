import { Category, Product } from "../types/types";
import React, { createContext, useContext } from "react";

interface RememberContextProps {
    setProductsSelected: React.Dispatch<React.SetStateAction<Product[] | null>>;
    setCategoriesExpanded: React.Dispatch<React.SetStateAction<Category[] | null>>;
    resetProducts: boolean,
    setResetProducts: React.Dispatch<React.SetStateAction<boolean>>;
};

export const RememberContext = createContext<RememberContextProps>({
    setProductsSelected: () => {return null},
    setCategoriesExpanded: () => {return null},
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