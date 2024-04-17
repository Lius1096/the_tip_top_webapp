import React, { useEffect, useState } from "react";

const InputCodeComponent = (props: any) => {
  const [value, setValue] = useState('');

  const handleInputChange = (event: any) => {
    const filteredValue = event.target.value.replace(/[^A-Za-z0-9]/g, "");
    const truncatedValue = filteredValue.slice(0, 10);

    // Ajouter un tiret et un espace entre les groupes, sauf pour le dernier groupe
    const formattedCode = truncatedValue.match(/.{1,3}/g)?.join(" - ") || "";

    if (props.callBack) {
      props.callBack(filteredValue)
    }
    setValue(formattedCode);
  };
  return (
    <div className="flex flex-col gap-[10px] items-start w-full">
      <label
        htmlFor=""
        className={`text-text font-bold text-base ${props.color}`}
      >
       
        {props.label}
        <span className="text-third">{props.required ? " *" : ""}</span>
      </label>
      <input
        type="text"
        className="xl:py-[5px] px-[10px] bg-first rounded-[10px] text-center uppercase mx-auto border-2 border-second placeholder:opacity-50 xl:text-2xl 2xl:text-5xl text-white outline-none text-lg"
        placeholder="XXX - XXX - XXX - X"
        onChange={handleInputChange} value={value}
        maxLength={19}
      />
    </div>
  );
};

export default InputCodeComponent;
