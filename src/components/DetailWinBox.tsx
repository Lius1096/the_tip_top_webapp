import React from 'react'
import Giveaway from '../Models/Giveaway'

const DetailWinBox = (props: {icon: string, label: string, total: number }) => {
  
  return (
    <div className='flex flex-col gap-[10px] rounded-2xl border p-[10px] bg-[#D4B692]'>
        <div className="flex flex-col gap-[10px]">
            <img src={props.icon} alt="Icon Total des gagnants" className='w-[40px] h-[40px]'/>
            <h4> {props.label} </h4>
            <h5 className='text-first'>{props.total}</h5>

        </div>
      
    </div>
  )
}

export default DetailWinBox
