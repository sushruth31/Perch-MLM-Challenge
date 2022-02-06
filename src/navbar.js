import { useContext, useEffect } from "react";
import useStore from "./store";
import { ListItemText, List, ListItem, ListItemButton, Button, ListItemIcon } from "@mui/material";
import { BsFillBookmarkFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const { plans, setNewItemLevels, newItemLevels } = useStore();
  const nav = useNavigate();

  function PlanListItem({ name, onClick }) {
    return (
      <ListItem onClick={onClick} disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <BsFillBookmarkFill />
          </ListItemIcon>
          <ListItemText primary={name} />
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <div className="fixed w-[300px] bg-gray-200 top-0 left-0 h-screen p-[10px]">
      <div className="font-bold">Your Plans:</div>
      <List>
        {plans.length > 0 &&
          plans.map(({ name }) => (
            <PlanListItem
              onClick={() => {
                setNewItemLevels(plans.find(({ name: setName }) => setName === name).levels);
                nav(`/edit?name=${name}`, { replace: true });
              }}
              key={name}
              name={name}
            />
          ))}
      </List>
      <div className="w-[100%] flex items-center justify-center mt-[20px]">
        <Button variant="contained" onClick={() => nav("/create")}>
          Create New Plan
        </Button>
      </div>
    </div>
  );
}
