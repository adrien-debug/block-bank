# 🔧 Guide de dépannage - Problèmes de connexion

## Problème : Erreur 401 ou "Email ou mot de passe incorrect"

### Solution 1 : Créer un compte
Si vous n'avez pas encore de compte, vous devez d'abord vous inscrire :

1. Cliquez sur **"Connecter Wallet"** ou **"Connexion"** dans le header
2. Cliquez sur **"S'inscrire"** en bas de la modal de connexion
3. Remplissez le formulaire avec :
   - Prénom
   - Nom
   - Email
   - Adresse (peut être une adresse wallet ou temporaire comme `0x0000000000000000000000000000000000000000`)
   - Mot de passe (minimum 6 caractères)

### Solution 2 : Connexion via Wallet (sans email)
Si vous préférez ne pas utiliser d'email :

1. Cliquez sur **"Connecter Wallet"**
2. Sélectionnez l'onglet **"Wallet"**
3. Connectez votre MetaMask
4. Un compte sera créé automatiquement avec votre adresse wallet

---

## Problème : Erreur lors de l'inscription - "Erreur de connexion à la base de données"

Cette erreur indique un problème de configuration Supabase.

### Vérifications à faire :

1. **Vérifier le fichier `.env.local`** à la racine du projet :
   ```bash
   cat .env.local | grep SUPABASE
   ```

2. **Variables requises** :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
   ```

3. **Où trouver ces clés** :
   - Allez sur https://supabase.com
   - Sélectionnez votre projet
   - Allez dans **Settings** > **API**
   - Copiez :
     - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

4. **Vérifier que la table `users` existe** :
   - Allez dans **Table Editor** dans Supabase
   - Vérifiez que la table `users` existe avec les colonnes :
     - `id` (UUID, primary key)
     - `email` (text)
     - `password_hash` (text)
     - `first_name` (text)
     - `last_name` (text)
     - `address` (text)
     - `role` (text)
     - `created_at` (timestamp)

5. **Créer la table si elle n'existe pas** :
   - Exécutez le script SQL dans `scripts/create-complete-schema.sql`
   - Ou créez-la manuellement dans Supabase SQL Editor

6. **Redémarrer le serveur** après modification de `.env.local` :
   ```bash
   # Arrêter le serveur (Ctrl+C)
   # Puis redémarrer
   npm run dev
   ```

---

## Problème : Erreur 500 de Supabase

Si vous voyez une erreur HTML avec "500 Internal Server Error" de Cloudflare :

1. **Vérifier que les clés Supabase sont correctes** (voir ci-dessus)
2. **Vérifier que votre projet Supabase est actif** (pas suspendu)
3. **Vérifier les logs Supabase** dans le dashboard pour voir l'erreur exacte
4. **Tester la connexion** :
   ```bash
   curl https://votre-projet.supabase.co/rest/v1/ \
     -H "apikey: votre-service-role-key" \
     -H "Authorization: Bearer votre-service-role-key"
   ```

---

## Solution rapide : Utiliser la connexion Wallet

Si vous avez des problèmes avec l'inscription par email, utilisez la connexion Wallet qui ne nécessite pas de configuration supplémentaire :

1. Installez MetaMask (extension navigateur)
2. Créez ou importez un wallet
3. Cliquez sur **"Connecter Wallet"** dans l'application
4. Sélectionnez l'onglet **"Wallet"**
5. Approuvez la connexion dans MetaMask

Un compte sera créé automatiquement avec votre adresse wallet.

---

## Besoin d'aide ?

Si le problème persiste :
1. Vérifiez les logs du serveur dans le terminal
2. Vérifiez la console du navigateur (F12)
3. Vérifiez les logs Supabase dans le dashboard
