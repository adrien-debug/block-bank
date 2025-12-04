# 🔑 Variables d'Environnement Vercel - Block Bank

## Variables Supabase (OBLIGATOIRES)

Copiez-collez ces variables exactement dans Vercel Dashboard > Settings > Environment Variables

### Production, Preview, Development

```
NEXT_PUBLIC_SUPABASE_URL=https://ipamfhfzflprptchlaei.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwYW1maGZ6ZmxwcnB0Y2hsYWVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MjU1MTIsImV4cCI6MjA4MDQwMTUxMn0.PcBz9dNKIxqfBB6qZL-MEXZwNksPrmRd4NiqMl_DqIM
```

```
SUPABASE_SERVICE_ROLE_KEY=sb_secret_bwOb94DH5xVC05YNV_loOQ_HmdblB94
```

---

## Instructions pour Vercel

1. **Aller sur** : https://vercel.com/adrien-nejkovics-projects/block-bank/settings/environment-variables

2. **Pour chaque variable** :
   - Cliquer sur "Add New"
   - Coller le **nom** de la variable (ex: `NEXT_PUBLIC_SUPABASE_URL`)
   - Coller la **valeur** correspondante
   - Sélectionner les environnements : **Production**, **Preview**, **Development**
   - Cliquer sur "Save"

3. **Répéter pour les 3 variables Supabase**

4. **Après avoir ajouté toutes les variables**, redéployer :
   - Aller dans "Deployments"
   - Cliquer sur "Redeploy" sur le dernier déploiement

---

## Variables Optionnelles (si nécessaire)

### Admin Authentication (si vous utilisez l'admin)

```
ADMIN_PASSWORD_HASH=votre-hash-bcrypt-ici
ADMIN_SESSION_SECRET=votre-secret-session-ici
```

### Google Drive (si utilisé)

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=votre-email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
GOOGLE_DRIVE_FOLDER_ID=votre-folder-id
```

---

## ⚠️ Important

- Ne jamais commiter ces valeurs dans Git
- Les variables `NEXT_PUBLIC_*` sont accessibles côté client
- La variable `SUPABASE_SERVICE_ROLE_KEY` est très sensible - ne jamais l'exposer publiquement
- Après avoir ajouté les variables, **redéployer** le projet pour qu'elles prennent effet

