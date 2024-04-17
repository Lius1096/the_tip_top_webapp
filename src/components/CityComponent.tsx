import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const CityComponent = (props: any) => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    if (props.callBack && value) {
      if (value.value) props.callBack(value.value.terms[0].value);
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-[10px] items-start w-full">
      <label
        htmlFor=""
        className={`text-text font-bold text-base 
           ${props.color}`}
      >
        {props.label}
        <span className="text-third">{props.required ? " *" : ""}</span>
      </label>
      <div className="w-full">
        <GooglePlacesAutocomplete
          apiKey="AIzaSyANSjx8ZFHJequpxZ4vyxnXLyTqv90mI2U"
          autocompletionRequest={{
            types: ["(cities)"],
            componentRestrictions: { country: "fr" },
          }}
          selectProps={{
            onChange: (option) => setValue(option),
            placeholder: props.value ? props.value : "Paris" ,
            defaultInputValue: props.value ? props.value : undefined,
            styles: {
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
                  backgroundColor: state.isSelected
                    ? "#58694B"
                    : "rgba(88,105,75,0.5)",
                  color: !state.isSelected ? "#58694B" : "white",
                },
                backgroundColor: state.isSelected ? "#58694B" : "white",
                color: !state.isSelected ? "#58694B" : "white",
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
                boxShadow: state.isFocused
                  ? "0 0 0 1px #8E8925 !important"
                  : "none",
              }),

              placeholder: (provided) => ({
                ...provided,
                color:props.value ? "white" : "#ffffff50",
              }),
            },
          }}
        />
      </div>
    </div>
  );
};

export default CityComponent;
