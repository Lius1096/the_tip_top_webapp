import React, { useEffect, useState } from "react";
import Select from "react-select";

interface DataOption{
  value: string,
  label: string
}
const SimpleSelectComponent = (props: any) => {
  const [value, setValue] = useState<any>();
  const [options, setOptions] = useState<DataOption[]>([]);

  useEffect(() => {
    if (props.options) {
      setOptions(props.options);
    }
    if (props.value) {
      const option = options.filter((option) =>{
        return option.label === props.value
      })
      if (option) {
        setValue(option[0])
      }
    }
  }, [options]);
  useEffect(() => {
    if (props.callBack && value) {
      props.callBack(value.label);
    }
  }, [value]);
  return (
    <div className="flex flex-col xl:gap-[10px] gap-2 items-start w-full">
      <label
        htmlFor=""
        className={`text-text font-bold xl:text-base 
             ${props.color}`}
      >
        {props.label}
        <span className="text-third">{props.required ? " *" : ""}</span>
      </label>
      <div className="w-full">
        <Select
          options={options}
          onChange={(option) => setValue(option)}
          value={value}
          styles={{
            input: (provided) => ({
              ...provided,
              color: "white",
            }),
            singleValue: (provided) => ({
              ...provided,
              color: "white",
            }),
            option: (provided, state) => ({
              ...provided,
              ":hover": {
                backgroundColor: state.isSelected ? "#58694B" :"rgba(88,105,75,0.5)",
                color: !state.isSelected ? "#58694B" : "white"
              },
              backgroundColor: state.isSelected ? "#58694B" : "white",
              color: !state.isSelected ? "#58694B" : "white"
            }),
            control: (provided, state) => ({
              ...provided,
              backgroundColor: "#58694B",
              padding: "5px 10px",
              borderRadius: "10px",
              ":hover": {
                borderColor: "#8E8925",
                boxShadow: "0 0 0 1px #8E8925 !important",
              },
              borderColor: state.isFocused ? "#8E8925" : "transparant",
              boxShadow: state.isFocused ? "0 0 0 1px #8E8925 !important" : "none",
            }),
            placeholder: (provided) => ({
              ...provided,
              color: "rgba(217,217,217,0.5)",
            }),
          }}
        />
      </div>
    </div>
  );
};

export default SimpleSelectComponent;
