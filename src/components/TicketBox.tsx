import React from 'react'

const TicketBox = (props: {text: string, index: number, icon: any}) => {
  return (
    <div className="flex flex-col xl:p-[20px] xl:gap-[10px] xl:rounded-2xl p-2 rounded-md" style={{background: "linear-gradient(232deg, rgba(142, 137, 37, 0.29) -13.02%, rgba(255, 226, 229, 0.00) 100%)"}}>
        <div className="flex items-center justify-between">
        <h4 className={`xl:text-xl font-bold text-first `}> {props.text} </h4>
        <img src={props.icon} alt="Icon Tickets Code" />
        </div>
        <h5 className="text-xl font-bold xl:text-3xl text-first">{props.index}</h5>
      
    </div>
  )
}

export default TicketBox
