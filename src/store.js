import { useContext, createContext, useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { createAsset } from "use-asset";
import startingPlan from "./example.json";

export const Store = createContext();

function getData() {
  return new Promise(res => {
    setTimeout(() => res(startingPlan), 1500);
  });
}
const asset = createAsset(async () => {
  return await getData();
});

export function StoreProvider({ children }) {
  const [params] = useSearchParams();
  const planName = params.get("name");

  const [plans, setPlans] = useState(asset.read());
  const location = useLocation();

  const [newItemLevels, setNewItemLevels] = useState(!planName ? [] : plans.find(({ name }) => name === planName)?.levels);

  const [itemNotFound, setItemNotFound] = useState(location.pathname.includes("edit") && planName && !newItemLevels);

  useEffect(() => {
    setItemNotFound(location.pathname.includes("edit") && planName && !newItemLevels);
  }, [location]);

  return (
    <Store.Provider value={{ newItemLevels, setNewItemLevels, plans, setPlans, itemNotFound }}>{children}</Store.Provider>
  );
}

export default function useStore() {
  return useContext(Store);
}
