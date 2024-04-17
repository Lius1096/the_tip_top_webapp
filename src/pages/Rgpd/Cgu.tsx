import React from 'react';
import NavBar from '../Home/Header/NavBar';
import Footer from '../Home/Footer';

const Cgu = () => {
    return (
        <div className="cgu-page overflow-y-auto" style={{ height: '100vh' }}>
            <NavBar />
            <div className="bg-gradient-to-b from-custom-green to-transparent py-8 px-4 overflow-y-8 px-4">
                <div className="container mx-auto">
                    <h1 className="text-xs lg:text-sm font-bold mb-4 text-first">Conditions Générales d'Utilisation - Jeu-Concours Thé Tip Top</h1>
                    <p className="text-xs lg:text-base leading-relaxed mb-4">
                        Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du jeu-concours organisé par Thé Tip Top. En participant à ce jeu-concours, vous acceptez expressément d'être lié par ces CGU. Si vous n'acceptez pas ces CGU, veuillez ne pas participer au jeu-concours.
                    </p>

                    <h2 className="text-sm lg:text-base font-bold mb-2 text-first">1. Présentation du Jeu-Concours</h2>
                    <p className="text-xs lg:text-base leading-relaxed mb-4">
                        Le jeu-concours organisé par Thé Tip Top vise à célébrer l'ouverture de leur 10ème boutique à Nice et à attirer l'attention de nouveaux clients sur leurs produits. Le jeu-concours consiste en un tirage au sort où 100% des participants gagnent un lot. Les participants peuvent obtenir un ticket de participation en effectuant un achat d'une valeur supérieure à 49€ dans l'une des boutiques participantes.
                    </p>

                    <h2 className="text-sm lg:text-base font-bold mb-2 text-first">2. Modalités de Participation</h2>
                    <p className="text-xs lg:text-base leading-relaxed mb-4">
                        Pour participer au jeu-concours, les participants doivent posséder un ticket de caisse ou une facture d'achat d'une valeur supérieure à 49€, sur laquelle est imprimé un code à 10 caractères. Ce code permet de participer au tirage au sort. Chaque participant peut utiliser son code pour participer une seule fois au jeu-concours.
                    </p>

                    <h2 className="text-sm lg:text-base font-bold mb-2 text-first">3. Répartition des Gains</h2>
                    <p className="text-xs lg:text-base leading-relaxed mb-4">
                        Sur les tickets de caisse distribués, les gains sont répartis comme suit :
                        - 60% des tickets offrent un infuseur à thé
                        - 20% des tickets offrent une boîte de 100g de thé détox ou d'infusion
                        - 10% des tickets offrent une boîte de 100g de thé signature
                        - 6% des tickets offrent un coffret découverte d'une valeur de 39€
                        - 4% des tickets offrent un coffret découverte d'une valeur de 69€
                    </p>

                    <h2 className="text-sm lg:text-base font-bold mb-2 text-first">4. Durée du Jeu-Concours</h2>
                    <p className="text-xs lg:text-base leading-relaxed mb-4">
                        Le jeu-concours aura lieu sur une période de 30 jours, durant lesquels 500 000 tickets maximums pourront être distribués. Les participants auront 30 jours supplémentaires à compter de la date de clôture du jeu pour réclamer leur lot.
                    </p>

                    <h2 className="text-sm lg:text-base font-bold mb-2 text-first">5. Tirage au Sort du Gros Lot</h2>
                    <p className="text-xs lg:text-base leading-relaxed mb-4">
                        À l'issue du jeu-concours, un tirage au sort sera effectué parmi tous les participants pour déterminer le gagnant d'un an de thé d'une valeur de 360€. Chaque participant a une seule chance de gagner, et le nombre de participations n'augmente pas ses chances de remporter le gros lot.
                    </p>

                    <h2 className="text-sm lg:text-base font-bold mb-2 text-first">6. Modalités de Réclamation des Lots</h2>
                    <p className="text-xs lg:text-base leading-relaxed mb-4">
                        Les participants peuvent réclamer leur lot en magasin ou en ligne, en utilisant le code présent sur leur ticket de caisse. Les modalités précises de réclamation seront indiquées sur le site du jeu-concours.
                    </p>

                    <h2 className="text-sm lg:text-base font-bold mb-2 text-first">7. Collecte et Utilisation des Données Personnelles</h2>
                    <p className="text-xs lg:text-base leading-relaxed mb-4">
                        En participant au jeu-concours, vous consentez à ce que vos données personnelles soient collectées et utilisées par Thé Tip Top à des fins d'administration du jeu-concours et de communication marketing, conformément à notre Politique de Confidentialité.
                    </p>

                    <h2 className="text-sm lg:text-base font-bold mb-2 text-first">8. Suspension ou Annulation du Jeu-Concours</h2>
                    <p className="text-xs lg:text-base leading-relaxed mb-4">
                        Thé Tip Top se réserve le droit de suspendre, modifier ou annuler le jeu-concours à tout moment, sans préavis et à sa seule discrétion, en cas de circonstances imprévues ou de force majeure. Thé Tip Top décline toute responsabilité en cas de perte ou de dommage résultant de ces actions.
                    </p>

                    <h2 className="text-sm lg:text-base font-bold mb-2 text-first">9. Règlement des Litiges</h2>
                    <p className="text-xs lg:text-base leading-relaxed mb-4">
                        En cas de litige, les présentes CGU seront régies et interprétées conformément aux lois en vigueur dans [indiquer le pays ou la juridiction], et tout litige sera soumis à la compétence exclusive des tribunaux de [indiquer la ville ou la région].
                    </p>

                    <h2 className="text-sm lg:text-base font-bold mb-2 text-first">10. Contact</h2>
                    <p className="text-xs lg:text-base leading-relaxed mb-4">
                        Pour toute question ou préoccupation concernant ce jeu-concours, veuillez nous contacter à l'adresse suivante : [adresse e-mail ou adresse postale].
                    </p>

                    <h2 className="text-sm lg:text-base font-bold mb-2 text-first">Date d'entrée en vigueur :</h2>
                    <p className="text-xs lg:text-base leading-relaxed mb-4">11 mars 2024</p>

                    <h2 className="text-sm lg:text-base font-bold mb-2 text-first">Dernière mise à jour :</h2>
                    <p className="text-xs lg:text-base leading-relaxed mb-4">11 mars 2024</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Cgu;
