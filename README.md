## Le projet Billed
Dans le contexte, Billed est une entreprise qui produit des solutions Saas destinées aux équipes de ressources humaines. Dans ce projet, il s'agit de la partie frontend d'une application permettant de `gérer des notes de frais`. D'une part, il y a une interface pour les employés qui leur permet d'avoir un historique de leurs notes de frais, et de créer de nouvelles notes de frais. D'autre part, il y a une interface pour les administrateurs qui leur permet de valider ou de refuser ou de mettre en attente les notes de frais des employés. `Je dois fiabiliser la partie frontend par la correction de bugs et la réalisation de tests`.


## L'architecture du projet :
Ce projet, dit frontend, est connecté à un service API backend que vous devez aussi lancer en local.

Le projet backend se trouve ici: https://github.com/charlenry/Billed-app-FR-Back

Pour le lancer, ouvrir une invite de commande dans le dossier du backend et taper : `npm install` puis `npm run run:dev`. L'api est accessible sur le port 5678 en local, c'est à dire `http://localhost:5678`. Si vous êtes sous Windows et qu'il y a le message d'erreur "NODE_ENV is not recognized as an internal or external command", veuillez lancer la commande `npm install -g win-node-env`. Puis relancer `npm run run:dev`.

## Organiser son espace de travail :
Pour une bonne organization, vous pouvez créer un dossier Billed-app dans lequel vous allez cloner le projet backend et par la suite, le projet frontend:

Clonez le projet backend dans le dossier Billed-app :
```
$ git clone https://github.com/charlenry/Billed-app-FR-Back.git
```

```
Billed-app/
   - Billed-app-FR-Back
```

Clonez le projet frontend dans le dossier Billed-app :
```
$ git clone https://github.com/charlenry/CharlesHenriSaintMars_9_18082022.git
```

```
Billed-app/
   - Billed-app-FR-Back
   - CharlesHenriSaintMars_9_18082022
```
Renommez le dossier `CharlesHenriSaintMars_9_18082022` en `Billed-app-FR-Front`.
Une version plus récente du backend se trouve dans le dossier `Back-End` du frontend. Vous pouvez décompresser le fichier `Billed-app-FR-Back.7z` qui s'y trouve. Puis remplacez le dossier `Billed-app-FR-Back` par le dossier décompressé.

En fin de compte, vous devriez avoir la structure de dossiers suivante :
```
Billed-app/
   - Billed-app-FR-Back
   - Billed-app-FR-Frontend
```

## Comment lancer l'application en local ?

### étape 1 - Lancer le backend :

Suivez les indications dans le README du projet backend.

### étape 2 - Lancer le frontend :

Allez au repo cloné :
```
$ cd Billed-app-FR-Front
```

Installez les packages npm (décrits dans `package.json`) :
```
$ npm install
```

Installez live-server pour lancer un serveur local :
```
$ npm install -g live-server
```

Lancez l'application :
```
$ live-server
```

Puis allez à l'adresse : `http://127.0.0.1:8080/`


## Comment lancer tous les tests en local avec Jest ?

```
$ npm run test
```

## Comment lancer un seul test ?

Installez jest-cli :

```
$npm i -g jest-cli
$jest src/__tests__/your_test_file.js
```

## Comment voir la couverture de test ?

`http://127.0.0.1:8080/coverage/lcov-report/`

## Comptes et utilisateurs :

Vous pouvez vous connecter en utilisant les comptes:

### administrateur : 
```
utilisateur : admin@test.tld 
mot de passe : admin
```
### employé :
```
utilisateur : employee@test.tld
mot de passe : employee
```
