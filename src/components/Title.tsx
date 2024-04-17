import React from 'react'

const Title = (props: { title: string, color: string }) => {
  return (
    <div>
      <h1 className={`xl:text-2xl lg:text-lg font-extrabold leading-none ${props.color}`}>
        {props.title}
      </h1>
    </div>
  )
}

export default Title
