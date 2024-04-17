import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
const NotFound = () => {
    const navigate = useNavigate()
    return (
        <div className='flex flex-col items-center justify-center h-screen px-4 gap-y-10 md:px-8'>
            <h1 className='font-extrabold xl:text-9xl text-first text-7xl'> 4🍵4 </h1>
            <div className="flex flex-col items-center text-center gap-y-2">
                <h2 className='text-lg font-semibold xl:text-2xl text-second'>Oops! cette page n'a pas été trouvée</h2>
                <p className='text-sm text-center text-text xl:text-base'>Nous n'avons pas pu retrouver la page demandée <br /> si vous êtes persuadé que cette page existe merci de nous contacter <br /> à l'adresse e-mail: <u>support@dsp5-archi-o22a-15m-g3.site</u></p>

            </div>
            <Button onClick={()=> navigate("/")} variant='contained' className='py-2 text-xs font-semibold rounded-lg xl:text-lg xl:py-3 xl:px-8 bg-first'>Retourner à l'accueil</Button>
        </div>
    );
};

export default NotFound;