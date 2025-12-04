# 🚀 Guide de Configuration Supabase

Ce guide vous accompagne dans la configuration de Supabase pour remplacer le stockage local.

---

## 📋 Prérequis

1. Un compte Supabase (gratuit sur [supabase.com](https://supabase.com))
2. Un projet Supabase créé
3. Les variables d'environnement configurées

---

## 🔧 Étape 1 : Configuration de la Base de Données

### 1.1 Créer les tables

1. Ouvrir votre projet Supabase
2. Aller dans **SQL Editor**
3. Ouvrir le fichier `scripts/supabase-setup.sql`
4. Copier tout le contenu
5. Coller dans l'éditeur SQL
6. Cliquer sur **Run** (ou `Cmd/Ctrl + Enter`)

✅ Les tables `submissions` et `documents` sont maintenant créées avec les index et triggers.

### 1.2 Vérifier les tables

Dans **Table Editor**, vous devriez voir :
- ✅ `submissions` (table principale)
- ✅ `documents` (table des fichiers)

---

## 📦 Étape 2 : Configuration du Storage

### 2.1 Créer le bucket

1. Aller dans **Storage** dans le menu Supabase
2. Cliquer sur **New bucket**
3. Nommer le bucket : `submissions`
4. Cocher **Public bucket** (optionnel, pour accès direct)
5. Cliquer sur **Create bucket**

✅ Le bucket `submissions` est créé.

### 2.2 Configurer les politiques de sécurité

Les politiques sont déjà définies dans le script SQL, mais vous pouvez les vérifier :

1. Aller dans **Storage** > **Policies**
2. Vérifier que les politiques suivantes existent :
   - ✅ "Public can upload files"
   - ✅ "Public can read files"
   - ✅ "Admin can delete files"

---

## 🔑 Étape 3 : Configuration des Variables d'Environnement

### 3.1 Récupérer les clés API

1. Aller dans **Settings** > **API**
2. Copier les valeurs suivantes :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **SECRET**

### 3.2 Configurer localement

Créer ou mettre à jour `.env.local` :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role
```

⚠️ **IMPORTANT** : Ne jamais commiter `.env.local` ! La clé `SUPABASE_SERVICE_ROLE_KEY` est très sensible.

### 3.3 Configurer sur Vercel (production)

1. Aller dans votre projet Vercel
2. **Settings** > **Environment Variables**
3. Ajouter les 3 variables :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

---

## 🔄 Étape 4 : Migration des Données Existantes

Si vous avez des soumissions existantes dans `storage/submissions/`, vous pouvez les migrer :

### 4.1 Installer tsx (si nécessaire)

```bash
npm install -D tsx
```

### 4.2 Exécuter le script de migration

```bash
npx tsx scripts/migrate-to-supabase.ts
```

Le script va :
- ✅ Lire toutes les soumissions locales
- ✅ Les insérer dans Supabase
- ✅ Uploader tous les fichiers vers Supabase Storage
- ✅ Créer les enregistrements dans la table `documents`

---

## ✅ Étape 5 : Vérification

### 5.1 Tester la création d'une soumission

1. Lancer l'application : `npm run dev`
2. Soumettre une nouvelle demande via le formulaire
3. Vérifier dans Supabase :
   - **Table Editor** > `submissions` : nouvelle entrée
   - **Storage** > `submissions` : nouveaux fichiers

### 5.2 Tester l'interface admin

1. Aller sur `/admin/submissions`
2. Vérifier que les soumissions s'affichent
3. Ouvrir une soumission et vérifier que les fichiers se téléchargent

---

## 🐛 Dépannage

### Erreur : "Missing Supabase environment variables"

➡️ Vérifier que `.env.local` contient bien les 3 variables Supabase.

### Erreur : "relation does not exist"

➡️ Exécuter le script SQL `supabase-setup.sql` dans Supabase SQL Editor.

### Erreur : "bucket not found"

➡️ Créer le bucket `submissions` dans Supabase Storage.

### Erreur : "new row violates row-level security policy"

➡️ Vérifier que les politiques RLS sont bien configurées (voir script SQL).

### Les fichiers ne s'affichent pas

➡️ Vérifier que :
- Les fichiers sont bien uploadés dans le bucket
- Les politiques de storage permettent la lecture
- Les URLs sont correctement générées

---

## 📊 Monitoring

Dans Supabase Dashboard, vous pouvez :

- **Table Editor** : Voir toutes les soumissions
- **Storage** : Voir tous les fichiers uploadés
- **Logs** : Voir les requêtes et erreurs
- **API** : Tester les endpoints directement

---

## 🔒 Sécurité

⚠️ **IMPORTANT** :

1. **Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` côté client**
   - Cette clé bypass toutes les politiques RLS
   - Utiliser uniquement dans les API routes (serveur)

2. **Utiliser `NEXT_PUBLIC_SUPABASE_ANON_KEY` côté client**
   - Cette clé respecte les politiques RLS
   - Sécurisée pour les opérations publiques

3. **Vérifier les politiques RLS**
   - Les données sensibles doivent être protégées
   - Seuls les admins peuvent voir toutes les soumissions

---

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Besoin d'aide ?** Consultez les logs dans Supabase Dashboard ou contactez l'équipe.

