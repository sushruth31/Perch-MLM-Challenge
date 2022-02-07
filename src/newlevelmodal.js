import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import useStore from "./store";
import { TextField, Box, Fab, Alert } from "@mui/material";
import { MdClose } from "react-icons/md";
import areObjectsEqual from "./objectsequal";

export default function CreateModal({ setIsModalOpen, level }) {
  const levelIdx = level - 1;
  const editOrCreate = level ? "edit" : "create";
  const { newItemLevels, setNewItemLevels } = useStore();
  const [isTierBeingAdded, setIsTierBeingAdded] = useState(false);
  const [tempTiers, setTempTiers] = useState(
    editOrCreate === "create" ? [] : newItemLevels.find((_, i) => i === levelIdx).tiers
  );
  const [alert, setAlert] = useState(false);

  const alertRef = useRef();

  const tierRefs = useRef([]);

  const error = mssg => {
    //add the refs array to the state so we dont lose it
    const refsArr = tierRefs.current;
    setTempTiers(refsArr.map(obj => ({ from: obj?.from?.value, rate: obj?.rate?.value })));

    setAlert(mssg);
  };

  useEffect(() => {
    if (alert) setAlert(false);
  }, [isTierBeingAdded]);

  useEffect(() => {
    if (alert) alertRef.current.scrollIntoView({ behavior: "smooth" });
  }, [alert]);

  const saveTiersToLevel = () => {
    let preventSubmit = false;
    const refsArr = tierRefs.current;

    for (let i = 0; i < refsArr.length; i++) {
      //check to make sure all values are positive
      //check if all rate values are between 1 and 100

      if (
        Object.values(refsArr)
          .map(obj => ({ from: obj?.from?.value, rate: obj?.rate?.value }))
          .some(({ from, rate }) => Number(from) <= 0 || Number(rate) > 100)
      ) {
        error("Values must be within appropriate range");
        return;
      }

      //check from rules to make sure it is greater than the previous tier value and return from function if not
      const val1 = Number(refsArr?.[i]?.from?.value);
      const val2 = Number(refsArr?.[i + 1]?.from?.value);
      if (val1 > 0 && val2 > 0 && val1 >= val2) {
        error("Invalid Setup! - Please Try Again");
        return;
      }
    }

    const editedLevelTiers = refsArr.map(el => ({
      from: Number(el?.from?.value),
      rate: Number(el?.rate?.value),
    }));

    if (editOrCreate === "create") {
      setNewItemLevels(prevState => [...prevState, { tiers: editedLevelTiers }]);
    } else {
      try {
        setNewItemLevels(prevState => {
          const newState = prevState.map((el, idx) => (idx === levelIdx ? { tiers: editedLevelTiers } : el));

          //check if any edits were made with deep recursive object compare function
          if (areObjectsEqual(prevState, newState)) {
            preventSubmit = true;
            return prevState;
          }
          return newState;
        });
        //should handle the case when user is editing levels, removes a tier then saves. a bit hacky but does the job
      } catch (err) {
        //console.log(err);
        setNewItemLevels(prevState => prevState.map((el, i) => (i === levelIdx ? { tiers: tempTiers } : el)));
      }
    }

    if (preventSubmit) {
      error("You must make an edit to save!");
      return;
    }
    setIsModalOpen(false);
  };

  function TierForm({ from, rate, i, isFromMap }) {
    const [tempTier, setTempTier] = useState(tempTiers.find((_, idx) => idx === i));
    const [localAlert, setLocalAlert] = useState(null);

    const handleChange = ({ target }) => {
      setTempTier(prevState => ({
        ...prevState,
        [target.name]: Number(target.value),
      }));
    };

    const sendError = mssg => {
      setTempTier(tempTier);
      setLocalAlert(mssg);
    };

    return (
      <div className="flex flex-col items-center mt-[20px]">
        <div className="flex justify-end items-center">
          <div className="font-bold">{i === undefined ? `New Tier: ${tempTiers.length + 1}` : `Tier ${i + 1}`}</div>
          {isFromMap && (
            <MdClose
              onClick={() => setTempTiers(prevState => prevState.filter((_, idx) => idx !== i))}
              className="ml-[80px] text-2xl cursor-pointer"
            />
          )}
        </div>
        <div className="flex items-center mb-[20px] mt-[20px]">
          <div className="mb-[20px] mr-[5px]">$</div>
          <TextField
            inputRef={node => {
              tierRefs.current[i] = {};
              tierRefs.current[i].from = node;
            }}
            type="number"
            label="From"
            name="from"
            min="0"
            onChange={handleChange}
            placeholder="From"
            defaultValue={from}
          />
        </div>
        <div className="flex items-center mb-[20px]">
          <div className="mr-[5px]">%</div>
          <TextField
            inputRef={node => {
              tierRefs.current[i].rate = node;
            }}
            min="0"
            type="number"
            name="rate"
            onChange={handleChange}
            placeholder="Rate"
            defaultValue={rate}
            label="Rate"
          />
        </div>

        {!isFromMap && (
          <>
            <button
              onClick={() => {
                //check if values are null or invalid
                if (
                  Object.values(tempTier).length < 2 ||
                  !Object.entries(tempTier).every(([key, val]) => {
                    if (key === "rate" && val > 100) {
                      return false;
                    }
                    if (val <= 0) {
                      return false;
                    }
                    return true;
                  })
                ) {
                  //set state so we dont lose values
                  sendError("Invalid Values - Please Try again");
                  return;
                }
                //also check if from value is larger than previous tier
                const prevTierFromVal = [...tempTiers].pop()?.from;
                if (tempTier?.from <= prevTierFromVal) {
                  {
                    sendError("From value must be higher than previous tier");
                    return;
                  }
                }

                setTempTiers(prevState => [...prevState, tempTier]);
                setIsTierBeingAdded(false);
              }}
              className="btn btn-primary my-[20px]">
              Add
            </button>
            {alert && isFromMap && (
              <Alert ref={alertRef} className="mb-[20px]" severity="error">
                {alert}
              </Alert>
            )}
            {localAlert && !isFromMap && (
              <Alert className="mb-[20px]" severity="error">
                {localAlert}
              </Alert>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center mb-[20px]">
        {editOrCreate === "create" ? `New Level ${newItemLevels.length + 1} details:` : `Edit Level ${level}`}
      </div>
      <div className="mr-[20px] flex items-center">
        {isTierBeingAdded ? (
          <button onClick={() => setIsTierBeingAdded(p => !p)}>Cancel</button>
        ) : (
          <>
            <Box className="flex items-center">
              <div className="mr-[20px]">Add new Tier</div>
              <Fab size="small" onClick={() => setIsTierBeingAdded(p => !p)} color="primary" aria-label="add">
                <FaPlus></FaPlus>
              </Fab>
            </Box>
          </>
        )}
      </div>
      {isTierBeingAdded && <TierForm />}
      {!isTierBeingAdded && tempTiers.length > 0 && (
        <>
          {tempTiers.map((tier, i) => (
            <>
              <TierForm isFromMap key={i} {...tier} i={i} />
              {i !== tempTiers.length - 1 && <div className="h-[1px] w-[100%] bg-gray-300"></div>}
            </>
          ))}
          <button onClick={saveTiersToLevel} className="btn btn-primary my-[20px]">
            Save Changes
          </button>
          {alert && (
            <Alert ref={alertRef} className="mb-[20px]" severity="error">
              {alert}
            </Alert>
          )}
        </>
      )}
    </div>
  );
}
