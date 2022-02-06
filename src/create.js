import { useRef, useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import Modal from "./modal";
import CreateModal from "./newlevelmodal";
import useStore from "./store";
import List from "@mui/material/List";
import useTimeout from "./useTimeout";
import {
  Box,
  Fab,
  ListItemText,
  ListItemIcon,
  ListItem,
  ListItemAvatar,
  Avatar,
  Typography,
  Button,
  Divider,
  Alert,
} from "@mui/material";
import { MdClose } from "react-icons/md";
import NavBar from "./navbar";
import { useLocation, useSearchParams } from "react-router-dom";
import areObjectsEqual from "./objectsequal";

export default function Create() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { newItemLevels, setNewItemLevels, setPlans, itemNotFound, plans } = useStore();
  const [isSaved, setIsSaved] = useState(false);
  const planNameRef = useRef();
  const location = useLocation();
  const pathname = location.pathname;
  const createOrEdit = pathname.replace("/", "");
  const [urlParams] = useSearchParams();
  const planName = urlParams.get("name");
  const [itemLevelCopy, setItemLevelCopy] = useState(newItemLevels);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    if (alert) setAlert(false);
    if (pathname.includes("create")) {
      setNewItemLevels([]);
      if (planNameRef?.current) planNameRef.current.value = "";
    }
    setItemLevelCopy(newItemLevels);
  }, [location]);

  useEffect(() => {
    if (createOrEdit === "edit" && planNameRef?.current?.value) planNameRef.current.value = planName;
  }, [newItemLevels]);

  useTimeout(
    () => {
      if (isSaved) setIsSaved(false);
    },
    1000,
    [isSaved]
  );

  const saveLevelsToPlan = () => {
    if (alert) setAlert(false);
    if (createOrEdit === "create") {
      //ensure we have a plan name and that there is not another plan with the same name
      const planNameVal = planNameRef?.current?.value;
      if (!planNameVal) {
        setAlert("No plan name!");
        return;
      }
      if (plans.some(({ name }) => name === planNameVal)) {
        setAlert("Plan name already exists!");
        return;
      }
      setPlans(prevState => [...prevState, { levels: newItemLevels, name: planNameVal }]);
    } else {
      setPlans(prevState =>
        prevState.map(plan => {
          if (plan.name === planName) {
            return {
              name: planName,
              levels: newItemLevels,
            };
          } else {
            return plan;
          }
        })
      );
    }
    setNewItemLevels([]);
    setIsSaved(true);
    planNameRef.current.value = "";
  };

  function LevelListItem({ idx, tiers }) {
    return (
      <>
        <ListItem onClick={() => setIsModalOpen({ edit: idx + 1 })} className="hover:bg-slate-200" alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={String(idx + 1)} src="/static/images/avatar/1.jpg" />
          </ListItemAvatar>
          <ListItemText
            primary={`Level ${idx + 1}`}
            secondary={
              <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                {`Number of Tiers: ${tiers?.length}`}
              </Typography>
            }
          />
          <ListItemIcon
            onClick={e => {
              e.stopPropagation();
              setNewItemLevels(prevState => prevState.filter((_, i) => i !== idx));
            }}>
            <MdClose className="text-2xl mt-[5px]" />
          </ListItemIcon>
        </ListItem>
      </>
    );
  }

  const getDisabledVal = () => {
    if (createOrEdit === "create") {
      return false;
    } else {
      return areObjectsEqual(newItemLevels, itemLevelCopy);
    }
  };

  //render a not found page if the item id from the url cannot be located

  if (itemNotFound)
    return (
      <>
        <NavBar />
        <div>Item not found!</div>
      </>
    );

  return (
    <>
      <NavBar />
      {isModalOpen && (
        <Modal
          modalComponent={
            <CreateModal level={isModalOpen.edit || null} setIsModalOpen={isModalOpen => setIsModalOpen(isModalOpen)} />
          }
          onClick={() => {
            setIsModalOpen(false);
            if (isSaved) setIsSaved(false);
          }}
        />
      )}
      <div className="w-screen ml-[300px] flex justify-center">
        <div className="flex flex-col w-[90%] items-center rounded-xl bg-gray-300 ">
          <div className="flex">
            <div className="font-bold mb-[50px] mt-[10px] ml-[15px]">
              {createOrEdit === "create" ? "Create a new Plan" : "Edit Plan"}
            </div>
          </div>
          <div className="w-[300px]">
            <input
              placeholder={createOrEdit === "create" ? "Plan Name" : planName}
              disabled={createOrEdit === "edit"}
              ref={planNameRef}
              className="form-control"
              label="Plan Name"
            />
          </div>
          <Box className="flex items-center mt-[30px]">
            <div className="mr-[20px]">Add new Level</div>
            <Fab onClick={() => setIsModalOpen(true)} color="secondary" aria-label="add">
              <FaPlus></FaPlus>
            </Fab>
          </Box>

          <Box className="bg-slate-100 mt-[50px] w-[600px] rounded-xl cursor-pointer mb-[20px]">
            <List>
              {newItemLevels?.length > 0 ? (
                newItemLevels.map((el, idx) => (
                  <>
                    <LevelListItem key={idx} {...el} idx={idx} />
                    {idx !== newItemLevels.length - 1 && <Divider />}
                  </>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No Levels Have Been Added Yet"></ListItemText>
                </ListItem>
              )}
            </List>
          </Box>
          {isSaved && <Typography>Plan Saved!</Typography>}
          {newItemLevels?.length > 0 && (
            <>
              {!isSaved && (
                <Button disabled={getDisabledVal()} onClick={saveLevelsToPlan} variant="contained">
                  {createOrEdit === "create" ? "Submit Plan" : "Save Plan"}
                </Button>
              )}
              {alert && (
                <Alert className="mt-[20px]" severity="error">
                  {alert}
                </Alert>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
