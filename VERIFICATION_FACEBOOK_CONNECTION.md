# ✅ Vérification - Connexion Compte Facebook

## 🔍 Checklist de Vérification

### 1. Variables d'Environnement Requises

Vérifiez que ces variables sont dans `.env.local` :

```env
# Supabase (OBLIGATOIRE)
NEXT_PUBLIC_SUPABASE_URL=https://ipamfhfzflprptchlaei.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

# Admin (OBLIGATOIRE)
ADMIN_EMAIL=admin@block-bank.com
ADMIN_PASSWORD_HASH=...

# Email (OBLIGATOIRE pour emails)
RESEND_API_KEY=re_...

# Database (OBLIGATOIRE pour créer les tables)
DATABASE_URL=postgresql://postgres:...@db.ipamfhfzflprptchlaei.supabase.co:5432/postgres
```

### 2. Table Supabase

La table `marketing_social_accounts` doit exister.

**Vérification :**
```bash
npm run verify:marketing
```

**Si la table n'existe pas :**
```bash
npm run create:marketing:tables
```

### 3. Authentification Admin

Vous devez être connecté en admin pour sauvegarder le compte.

**Vérification :**
1. Allez sur : http://localhost:1001/admin/login
2. Connectez-vous avec le mot de passe : `admin`
3. Vous devriez être redirigé vers `/admin/dashboard`

### 4. Serveur Actif

Le serveur doit être en cours d'exécution.

**Vérification :**
```bash
# Vérifier que le serveur tourne
lsof -ti:1001

# Ou vérifier l'URL
curl http://localhost:1001
```

---

## 📋 Étapes pour Connecter le Compte Facebook

### Étape 1 : Vérifier la Configuration

```bash
# Vérifier toutes les variables
npm run check:all

# Vérifier spécifiquement le marketing
npm run verify:marketing
```

### Étape 2 : Se Connecter en Admin

1. Ouvrez : http://localhost:1001/admin/login
2. Entrez le mot de passe : `admin`
3. Cliquez sur "Sign In"

### Étape 3 : Accéder au Marketing

1. Dans le menu admin, cliquez sur **Marketing**
2. Ou allez directement : http://localhost:1001/admin/marketing
3. Vous devriez voir l'onglet **Overview**

### Étape 4 : Connecter Facebook

1. Dans l'onglet **Overview**, trouvez la carte **Facebook**
2. Cliquez sur **"Connect Account"**
3. Remplissez le formulaire :
   - **Username** : `@BlockBank` (ou `BlockBank` sans @)
   - **URL** : `https://www.facebook.com/people/Block-Bank/61584596674036/`
   - **Status** : `connected`
   - **Followers** : (optionnel, laissez vide ou entrez le nombre)
4. Cliquez sur **Save**

### Étape 5 : Vérifier la Sauvegarde

Après avoir cliqué sur "Save" :
- ✅ Si succès : Le modal se ferme et la carte Facebook montre "Connected" (vert)
- ❌ Si erreur : Un message d'erreur s'affiche

**Erreurs possibles :**
- "Unauthorized" → Vous n'êtes pas connecté en admin
- "Table does not exist" → Exécutez `npm run create:marketing:tables`
- "Database connection error" → Vérifiez les variables Supabase

---

## 🔧 Dépannage

### Erreur : "Unauthorized"

**Solution :**
1. Vérifiez que vous êtes connecté : http://localhost:1001/admin/login
2. Le cookie de session doit être présent
3. Si le problème persiste, reconnectez-vous

### Erreur : "Table does not exist"

**Solution :**
```bash
# Créer les tables
npm run create:marketing:tables

# Vérifier
npm run verify:marketing
```

### Erreur : "Database connection error"

**Solution :**
1. Vérifiez `.env.local` contient :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
2. Vérifiez que Supabase est accessible
3. Redémarrez le serveur : `npm run dev`

---

## ✅ Vérification Finale

Après avoir connecté le compte :

1. **Dans l'admin Marketing > Overview**
   - La carte Facebook doit montrer "Connected" (badge vert)
   - L'URL doit être visible
   - Le bouton doit dire "Open Platform"

2. **Dans la base de données**
   ```bash
   # Vérifier via l'API
   curl http://localhost:1001/api/admin/marketing/accounts \
     -H "Cookie: admin_session=..." \
     | jq '.accounts[] | select(.network=="facebook")'
   ```

3. **Test de l'URL**
   - Cliquez sur "Open Platform" dans la carte Facebook
   - Cela devrait ouvrir : https://www.facebook.com/people/Block-Bank/61584596674036/

---

## 📝 Informations du Compte Facebook

- **Network** : `facebook`
- **Username** : `@BlockBank` ou `BlockBank`
- **URL** : `https://www.facebook.com/people/Block-Bank/61584596674036/`
- **Status** : `connected`
- **ID Facebook** : `61584596674036`

---

## 🎯 Résumé

**Pour que la connexion fonctionne, vous devez avoir :**

1. ✅ Variables d'environnement configurées (Supabase, Admin, Email)
2. ✅ Table `marketing_social_accounts` créée dans Supabase
3. ✅ Serveur actif sur le port 1001
4. ✅ Session admin active (connecté via `/admin/login`)
5. ✅ Formulaire rempli correctement dans l'interface

**Si tout est configuré, la connexion devrait fonctionner sans problème !**

---

**Dernière vérification :** Configuration complète pour la connexion Facebook


