import { Button, IconButton } from '@mui/material'
import addCircle from "../Assets/Icons/add-circle.svg"
import React, { useEffect, useState } from 'react'

type AcceptedFileGroup = "image";

function UploadFile(props: any) {
    const [fileGroup, setFileGroup] = useState<AcceptedFileGroup>("image");
    const [file, setFile] = useState<File>();
    const getFileType = (file: File): AcceptedFileGroup => {
        if (file.type.indexOf("image") !== -1) {
            return "image";
        }
        props.getFile(null, true)
        throw new Error("Mauvais format de fichier");
    };

    const prepareFileUpload = (file: File) => {
        setFileGroup(getFileType(file));
        setFile(file);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.currentTarget;
        if (!files || !files[0]) {
            props.getFile(null, true)
            throw new Error("Veuillez sélectionner un fichier");
        }
        prepareFileUpload(files[0]);
    };

    const validateMedia = (fileGroup: AcceptedFileGroup, file: File) => {
      if (fileGroup === "image") {
        props.getFile(file, false)
    }else {
        props.getFile(null, true)
    }
  }

    useEffect(() => {
        if (file) validateMedia(fileGroup, file);
    }, [file, fileGroup]);

    return (
      <IconButton color="primary" aria-label="upload picture" component="label">
      <input hidden accept="image/*" type="file" onChange={onChange} />
     <img src={addCircle} alt="Icon Mettre à jour la photo de profil" />
  </IconButton>
    )
}

export default UploadFile