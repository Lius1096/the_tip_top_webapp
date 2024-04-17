import React from 'react';
import NavBar from '../Home/Header/NavBar';
import Footer from '../Home/Footer';

const PolitiqueDeConfidentialite = () => {
    return (
        <div className="cgu-page overflow-y-auto" style={{ height: '100vh' }}>
            <NavBar />
            <div className="bg-gradient-to-b from-custom-green to-transparent py-8 px-4 overflow-y-8 px-4">
                <div className="container mx-auto">
                    <h1 className="text-xs lg:text-sm font-bold mb-4 text-first">Politique de Confidentialité - Jeu-Concours Thé Tip Top</h1>
                    <p className="text-base leading-relaxed mb-4">
                        Cette Politique de Confidentialité décrit la manière dont Thé Tip Top collecte, utilise et protège les informations personnelles des participants au jeu-concours organisé par Thé Tip Top. En participant à ce jeu-concours, vous acceptez les termes de cette Politique de Confidentialité.
                    </p>

                    <h2 className="text-sm lg:text-base font-bold mb-2 text-first">1. Collecte d'Informations Personnelles</h2>
                    <p className="text-base leading-relaxed mb-4">
                        Thé Tip Top collecte les informations personnelles suivantes lors de votre participation au jeu-concours :
                        - Nom
                        - Prénom
                        - Adresse e-mail
                        - Adresse postale
                        - Numéro de téléphone
                        - Date de naissance

                        Ces informations sont collectées uniquement dans le but d'administrer le jeu-concours, de contacter les gagnants et de livrer les lots.
                    </p>

                    <h2 className="text-sm lg:text-base font-bold mb-2 text-first">2. Utilisation des Informations Personnelles</h2>
                    <p className="text-base leading-relaxed mb-4">
                        Les informations personnelles collectées sont utilisées dans les buts suivants :
                        - Administrer le jeu-concours et déterminer les gagnants
                        - Communiquer avec les participants, notamment pour les informer de leur gain
                        - Livrer les lots aux gagnants
                        - Analyser les statistiques du jeu-concours à des fins internes
                    </p>

                    <h2 className="text-sm lg:text-base font-bold mb-2 text-first">3. Partage d'Informations Personnelles</h2>
                    <p className="text-base leading-relaxed mb-4">
                        Thé Tip Top ne partage pas les informations personnelles des participants avec des tiers, sauf dans les cas suivants :
                        - Lorsque cela est nécessaire pour administrer le jeu-concours et livrer les lots (par exemple, avec des partenaires de livraison)
                        - Lorsque cela est exigé par la loi ou par une autorité gouvernementale compétente
                    </p>

                    {/* Ajoutez les autres sections ici */}

                    <h2 className="text-sm lg:text-base font-bold mb-2 text-first">Date d'entrée en vigueur :</h2>
                    <p className="text-base leading-relaxed mb-4">11 mars 2024</p>

                    <h2 className="text-sm lg:text-base font-bold mb-2 text-first">Dernière mise à jour :</h2>
                    <p className="text-base leading-relaxed mb-4">11 mars 2024</p>

                    <h2 className="text-sm lg:text-base font-bold mb-2 text-first">8. Contact</h2>
                    <p className="text-base leading-relaxed mb-4">
                        Si vous avez des questions ou des préoccupations concernant cette Politique de Confidentialité, veuillez nous contacter à l'adresse suivante : [adresse e-mail ou adresse postale].
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PolitiqueDeConfidentialite;
