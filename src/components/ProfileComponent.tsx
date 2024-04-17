import React from 'react'
import UploadFile from './uploadFile'

const ProfileComponent = (props: { profilePicture: string, getFile?: any, size?: string, btnSize?: string, right?: any, bottom?: any, btnWith: string, btnPosition: string }) => {
  return (
    <div className="relative">
      <div className={`flex items-center justify-center ${props.size}  overflow-hidden rounded-full`}>
        <img
          src={props.profilePicture}
          alt="Icon Photo de profil"
          className={`rounded-full w-full`}
        />
      </div>
      {props.getFile ? <div className={`absolute rounded-full -bottom-2  z-50 ${props.btnSize} ${props.btnPosition} `}>
        <UploadFile getFile={props.getFile} />
      </div> : null}
    </div>
  )
}

export default ProfileComponent
