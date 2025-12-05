# 🔗 Lier la table credit_scores à users

## Problème
La table `credit_scores` doit être liée à la table `users` via une foreign key pour garantir l'intégrité référentielle.

## Solution : Exécuter le script SQL

### Étape 1 : Ouvrir Supabase SQL Editor
1. Allez sur https://supabase.com
2. Sélectionnez votre projet
3. Cliquez sur **SQL Editor** dans le menu de gauche
4. Cliquez sur **New query**

### Étape 2 : Exécuter le script
1. Ouvrez le fichier `scripts/link-credit-scores-table.sql`
2. Copiez tout le contenu
3. Collez-le dans Supabase SQL Editor
4. Cliquez sur **Run** (ou `Ctrl+Enter` / `Cmd+Enter`)

### Étape 3 : Vérifier
Le script va :
- ✅ Créer la table `credit_scores` si elle n'existe pas
- ✅ Créer la foreign key `credit_scores_user_id_fkey` vers `users(id)`
- ✅ Créer les index pour améliorer les performances
- ✅ Créer le trigger pour `updated_at`
- ✅ Configurer RLS (Row Level Security)
- ✅ Afficher le nombre de scores existants

### Étape 4 : Vérification manuelle
Pour vérifier que la liaison fonctionne :

```sql
-- Voir la structure de la table
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'credit_scores'
ORDER BY ordinal_position;

-- Voir les foreign keys
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'credit_scores';

-- Tester une requête avec jointure
SELECT 
  cs.*,
  u.email,
  u.wallet_address
FROM credit_scores cs
JOIN users u ON cs.user_id = u.id
LIMIT 5;
```

## Structure de la relation

```
users (table parent)
  ├─ id (UUID, PRIMARY KEY)
  └─ ...

credit_scores (table enfant)
  ├─ id (UUID, PRIMARY KEY)
  ├─ user_id (UUID, FOREIGN KEY → users.id)
  │   └─ ON DELETE CASCADE (si user supprimé, scores supprimés)
  └─ ...
```

## Avantages de la liaison

1. **Intégrité référentielle** : Impossible d'avoir un score sans utilisateur valide
2. **Cascade delete** : Si un utilisateur est supprimé, ses scores le sont aussi
3. **Requêtes optimisées** : Les index permettent des jointures rapides
4. **Sécurité** : RLS empêche les utilisateurs de voir les scores des autres

## Test dans l'application

Après avoir exécuté le script :
1. Connectez-vous à l'application
2. Allez sur la page Credit Score
3. Cliquez sur "Mettre à jour" pour calculer un score
4. Le score sera sauvegardé dans `credit_scores` lié à votre `user_id`

## Dépannage

Si vous avez une erreur "foreign key constraint fails" :
- Vérifiez que la table `users` existe
- Vérifiez que vous utilisez un `user_id` valide (UUID existant dans `users`)
- Vérifiez que la foreign key a bien été créée avec la requête de vérification ci-dessus
