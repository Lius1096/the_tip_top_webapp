import React, { useEffect, useState } from 'react'

const InputContactComponent = (props: any) => {

 
  return (
    <div className='flex flex-col gap-y-2 xl:gap-y-[10px] items-start w-full'>
      <label htmlFor=""
        className={`text-text font-bold lg:text-base text-lg  
         ${props.color}`}> {props.label}
        <span className='text-third'>{props.required ? ' *' : ''}</span></label>
      <input type={props.type}
        disabled={props.disable}
        className={`${props.bg ? props.bg : "bg-first"} ${props.inputColor ? props.inputColor : "text-white"} disabled:opacity-50 py-4 px-6 lg:py-2 lg:px-4 lg:text-base rounded-md xl:py-[10px] xl:px-[20px]  xl:rounded-[10px] focus:border-2 focus:border-second placeholder:opacity-80 placeholder:font-bold outline-none w-full text-lg xl:text-base`}
        placeholder={props.placeholder}
        name={props.name}
        onChange={(e) => props.callBack(e.target.value)} value={props.value} />

    </div>
  )
}

export default InputContactComponent
