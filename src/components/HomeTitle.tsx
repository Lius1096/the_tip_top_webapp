import React from 'react'


const HomeTitle = (props: {title: string}) => {
    
  return (
    <div>
      <h2 className='text-3xl font-extrabold text-first xl:text-5xl'>{ props.title } </h2>
    </div>
  )
}

export default HomeTitle
