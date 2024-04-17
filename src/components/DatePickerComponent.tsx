import React, { useEffect, useState } from "react";
// import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterMoment } from "@mui/x-date-pickers/node/AdapterMoment";
import { DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {Box} from "@mui/material";
import moment, { Moment } from "moment";
import {
  DateValidationError,
  PickersDay,
} from "@mui/x-date-pickers";

const DatePickerComponent = (props: any) => {
  const [cleared, setCleared] = React.useState<boolean>(false);
  const [date, setDate] = useState<Moment>();
  const [errors, setErrors] = useState<DateValidationError>();

  React.useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [cleared]);

  useEffect(() => {
    props.callBack(date);
  }, [date]);

  useEffect(() => {
    if (props.defautValue) {
      setDate(moment(props.defautValue));
    }
  }, []);

  const handleChange = (value: any, error: any) => {
    if (error.validationError) {
      setErrors(error);
    } else {
      setDate(value);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box className=" flex  relative rounded-[30px]">
        <div className="w-full">
          {/* <DemoItem label={props.message}> */}
            <DatePicker
              className="w-full bg-first rounded-[10px]"
              onChange={(value, error) => handleChange(value, error)}
              readOnly={props.readOnly ? props.readOnly : false}
              minDate={props.minDate ? moment(props.minDate) : undefined}
              disableHighlightToday
              value={date}
              slots={
               {
                day: (provided) => (<PickersDay {...provided} 
                  sx={{
                    [`&.Mui-selected`]: {
                      backgroundColor: "#58694B !important",
                      color: "white !important",
                    },
                    [`&`]: {
                      color: "#58694B !important"
                    }
                  }}
                />)
               }
              }
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiInputBase-input.MuiOutlinedInput-input": {
                  color: "white",
                  padding: "11.5px 20px",
                },
                "& .MuiButtonBase-root.MuiIconButton-root": {
                  color: "white",
                },
              }}
            />
          {/* </DemoItem> */}
        </div>
      </Box>
    </LocalizationProvider>
  );
};

export default DatePickerComponent;
