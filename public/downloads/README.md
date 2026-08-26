Place le fichier `sms-gateway.apk` (généré via `eas build --profile preview --platform android`)
directement dans ce dossier, avec exactement ce nom : `sms-gateway.apk`.

Vite sert tout le contenu de `/public` tel quel à la racine du site : une fois déployé,
ce fichier sera donc accessible à `https://ton-domaine.com/downloads/sms-gateway.apk`,
sur le MÊME domaine que le site — condition nécessaire pour que le téléchargement
se termine correctement sur mobile (voir explication dans le patch fix-apk-download-mobile).
