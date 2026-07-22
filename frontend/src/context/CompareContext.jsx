import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
const CompareContext = createContext();
export const CompareProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const toggle = (product) =>
    setItems((current) => {
      if (current.some((item) => item._id === product._id))
        return current.filter((item) => item._id !== product._id);
      if (current.length >= 3) {
        toast.error("You can compare up to three products.");
        return current;
      }
      toast.success("Added to comparison");
      return [...current, product];
    });
  return (
    <CompareContext.Provider
      value={{ items, toggle, clear: () => setItems([]) }}
    >
      {children}
    </CompareContext.Provider>
  );
};
export const useCompare = () => useContext(CompareContext);
