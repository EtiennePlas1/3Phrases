# 3Phrases
Developpement d'une Dapp stockant des définitions de concepts

Utilisation de :

Truffle 
Web3 js
Ganache
Solidity
lite-server
JS/html/CSS (bootstrap)

Projet visant à stocker des définitions courtes dans la blockchain et à permettre aux utilisateurs ayant un portefeuille de voter pour les définitions qu'ils pensent les plus pertinentes.

-----
Travail effectué :

- developpement du smart contract de vote et de stockage des définitions
- automatisation des tests
- developpement de l'ihm 

Travail en cours :

Ajout de sections dans l'ihm pour une meilleure visibilité 

A faire :

Création d'une cryptomonnaie pour :

- récompenser les créateurs de définitions qui totalisent le plus de votes
- récompenser les utilisateurs qui ont voté pour la meilleure définition

-----

Tester l'application :

- installer npm et node js
- installer <a href="https://metamask.io/">metamask</a>
- cloner le repository dans un de vos dossiers
- dans une console lancez la commande <code>npm install</code> dans votre dossier pour installer les dépendances
- lancez ensuite <code>truffle develop</code> 
- copiez le mnemonic ex : speak city pelican marriage jump again topic paper cattle discover elder satisfy 
- puis lancez <code>migrate</code>

vous avez initialisé un environnement de test et migré les contrats sur la blockchain, il faut maintenant configurer metamask pour qu'il pointe sur votre environnement de test.

- cliquez sur l'extension chrome metamask que vous avez installé
- cliquez sur "importer à partir de la phrase seed du compte"
- collez le mnemonic copié précedemment et renseignez un mot de passe
- en haut à droite, cliquez sur la liste déroulante des réseaux puis selectionnez "rpc personnalisé"
- notre environnement de test est à l'adresse : http://127.0.0.1:9545/, renseignez la dans la fenêtre "Nouvelle URL de RPC"
- choisissez un nom pour votre réseau et validez

Pour lancer l'application il suffit de lancer la commande <code>npm run dev</code> en ligne de commande dans le dossier où se trouve l'application.

-----

Fonctionnalités : 

- ajouter des définitions dans la blockchain
- voter pour une définition
- affichage automatique des définitions
