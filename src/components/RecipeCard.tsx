import React from 'react'
import HomeButton from './HomeButton'
import { useNavigate } from 'react-router-dom'

const RecipeCard = (props: { icon: any, title: string, text: string }) => {
  const navigate = useNavigate()
  return (
    <div className='flex  flex-col gap-y-4 xl:gap-y-[30px] items-center p-4 xl:p-[35px] border-2 border-first rounded-2xl text-text transition-transform duration-300 transform hover:scale-110'
      style={{
        background:
          "linear-gradient(315.1deg, rgba(142, 137, 37, 0.29) 2.29%, rgba(255, 255, 255, 0) 84.19%)",
      }}>
      <img src={props.icon} alt="Icon Prendre une tasse de Thé" className='xl:w-[137px] w-1/4 lg:w-1/2' />
      <h4 className='text-xl font-extrabold drop-shadow-lg text-first'> {props.title} </h4>

      <p className='text-base font-semibold text-center 2xl:text-lg text-text'> {props.text} </p>
      <div className="" onClick={()=> navigate('/client/register')}>
        <HomeButton
          title="Jouer"
          bg="bg-first register_btn"
          color="text-white"
          fontSize="text-xl 2xl:text-lg lg:text-base"
        />
      </div>
    </div>
  )
}

export default RecipeCard
