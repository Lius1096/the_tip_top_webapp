import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import logo from "../../Assets/Images/logo.svg"
import TicketCode from '../../Models/TicketCode';
const ClientQrCode = (props:{ticketCode: TicketCode}) => {
    return (
        <QRCodeSVG
            value={JSON.stringify(props.ticketCode)}
            size={158}
            bgColor={"#ffffff"}
            fgColor={"#58694b"}
            level={"M"}
            includeMargin={false}
            imageSettings={{
                src: logo,
                x: undefined,
                y: undefined,
                height: 32,
                width: 38,
                excavate: true,
            }} 
            />
    )
};

export default ClientQrCode;