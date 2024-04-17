import React from 'react'


const GiveAwayCard = (props: {icon:any, title: string,total: number}) => {
  return (
  <div className='flex xl:p-[25px] p-4 border border-first rounded-2xl gap-x-3 transition-transform duration-300 transform hover:scale-110 items-center'>
    <img src={props.icon} className='h-9 xl:h-auto' alt="Icon Total des Tickets" />
    <div className="flex flex-col xl:gap-y-[10px] items-start ">
        <h4 className='text-xl font-bold text-first'> {props.title} </h4>
        <h4 className='font-semibold text-center 2xl:text-lg text-base text-text'>{props.total} tickets</h4>
    </div>

  </div>
  )
}

export default GiveAwayCard
