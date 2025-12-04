# 🔐 Mot de passe Admin

## Mot de passe par défaut

**Le mot de passe admin par défaut est : `admin`**

---

## Comment ça fonctionne

### Si aucune configuration

Si la variable d'environnement `ADMIN_PASSWORD_HASH` n'est pas définie, le système utilise le mot de passe par défaut : **`admin`**

### Pour changer le mot de passe

1. **Créer un hash bcrypt du nouveau mot de passe** :

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('votre-nouveau-mot-de-passe', 10).then(hash => console.log(hash))"
```

2. **Ajouter dans `.env.local`** :

```bash
ADMIN_PASSWORD_HASH=votre-hash-bcrypt-ici
```

3. **Redémarrer le serveur** :

```bash
npm run dev
```

---

## Connexion

1. Allez sur : **http://localhost:1001/admin/login**
2. Entrez le mot de passe : **`admin`** (par défaut)
3. Cliquez sur "Sign In"

---

## Sécurité

⚠️ **Important** : Changez le mot de passe par défaut en production !

Le mot de passe par défaut `admin` n'est sécurisé que pour le développement local.

---

**Mot de passe actuel :** `admin` (par défaut)


