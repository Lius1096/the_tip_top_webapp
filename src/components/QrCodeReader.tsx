import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

const QrCodeReader = (props:any) => {
    const [enabled, setEnabled] = useState(true)
    const getResult = (value: string)=>{
        props.callBack(JSON.parse(value))
        setEnabled(false)
    }
    return (
        <Scanner
            onResult={(text, result) => getResult(text)}
            onError={(error) => console.log(error?.message)}
            enabled = {enabled}
            
        />
    );
};

export default QrCodeReader;