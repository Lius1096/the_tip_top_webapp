import React, { useEffect, useState } from "react";

const InputLabelComponent = (props: any) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    if (props.callBack) {
      props.callBack(value);
    }
  }, [value]);

  useEffect(() => {
    if (props.value !== undefined && props.value !== null) {
      setValue(props.value);
    } else {
      setValue("");
    }
  }, [props.value]);

  return (
    <div className="flex flex-col gap-y-2 xl:gap-y-[10px] items-start w-full">
      <label
        htmlFor=""
        className={`text-text font-bold xl:text-base  text-sm
         ${props.color}`}
      >
        {" "}
        {props.label}
        <span className="text-third">{props.required ? " *" : ""}</span>
      </label>
      <input
        type={props.type}
        step={props.step}
        min={props.min}
        readOnly={props.readOnly ? props.readOnly : false}
        disabled={props.disable}
        className={`${props.bg ? props.bg : "bg-first"} ${
          props.inputColor ? props.inputColor : "text-white"
        } disabled:opacity-50 py-2 px-3 rounded-md xl:py-[10px] xl:px-[20px]  xl:rounded-[10px] focus:border-2 focus:border-second placeholder:opacity-50 outline-none w-full text-sm xl:text-base`}
        placeholder={props.placeholder}
        name={props.name}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
    </div>
  );
};

export default InputLabelComponent;
