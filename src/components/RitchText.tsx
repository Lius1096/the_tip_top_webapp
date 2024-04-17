import React, { useState } from "react";

const RitchText = (props: any) => {

  return (
    <div className="flex flex-col gap-[10px] items-start">
      <label htmlFor="" className="text-lg font-bold text-text lg:text-base">
        {" "}
        {props.label}
        <span className="text-third">{props.required ? " *" : ""}</span>
      </label>
      <textarea
        id=""
        rows={5}
        className="py-4 lg:px-4 lg:py-2 px-8 bg-first rounded-[10px] border-2 border-second placeholder:opacity-80 placeholder:font-bold text-white resize-none outline-none w-full text-lg lg:text-base"
        placeholder={props.placeholder}
        value={props.value}
        name={props.name}
        onChange={(e) => props.callBack(e.target.value)}
      />
    </div>
  );
};

export default RitchText;
