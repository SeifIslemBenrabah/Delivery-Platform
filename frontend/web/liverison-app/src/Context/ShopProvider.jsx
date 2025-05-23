import { createContext, useState } from "react";

const ShopContext = createContext({});

export const ShopProvider = ({ children }) => {
  const [shopAdd, setShopAdd] = useState({});
  return (
    <ShopContext.Provider value={{ shopAdd, setShopAdd }}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContext;
