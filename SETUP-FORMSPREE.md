# Configuration Formspree pour VNOVA Boutique

## 🎯 Objectif
Configurer Formspree pour recevoir automatiquement les emails de contact à helpdesk@vnova.net

## 📋 Étapes rapides

### 1. Créer un compte Formspree
1. Allez sur [https://formspree.io/](https://formspree.io/)
2. Créez un compte gratuit
3. Confirmez votre email

### 2. Créer un nouveau formulaire
1. Cliquez **"New Form"**
2. Donnez un nom : "VNOVA Contact"
3. Cliquez **"Create Form"**

### 3. Configurer les notifications
1. Dans **"Settings"** > **"Notifications"**
2. Ajoutez votre email : **helpdesk@vnova.net**
3. Activez les notifications par email

### 4. Obtenir l'URL du formulaire
1. Copiez l'URL du formulaire (ex: `https://formspree.io/f/xvqjvqjv`)
2. Remplacez dans `src/Pages/Contact.jsx` :

```javascript
const response = await fetch('https://formspree.io/f/xvqjvqjv', {
```

Par votre vraie URL :

```javascript
const response = await fetch('https://formspree.io/f/VOTRE_ID_FORMULAIRE', {
```

### 5. Test
1. Sauvegardez le fichier
2. Testez le formulaire de contact
3. Vérifiez helpdesk@vnova.net

## ✅ Avantages
- ✅ 50 soumissions gratuites/mois
- ✅ Pas de configuration complexe
- ✅ Emails arrivent directement dans votre boîte
- ✅ Protection anti-spam incluse
- ✅ Fonctionne immédiatement

## 🔒 Sécurité
- Formspree bloque automatiquement le spam
- Vos données restent privées
- Service fiable et sécurisé

## 🆘 Alternative rapide
Si vous voulez tester immédiatement sans configuration, le formulaire utilise actuellement `mailto:` comme fallback.
