# 🔧 Résolution Erreur Module Next.js

## 🚨 Erreur

```
Error: Cannot find module './276.js'
```

## ✅ Solution

Cette erreur est causée par un **cache Next.js corrompu**. 

### Solution rapide :

1. **Arrêter le serveur** :
   ```bash
   kill $(lsof -ti:1001)
   ```

2. **Nettoyer le cache** :
   ```bash
   rm -rf .next
   ```

3. **Redémarrer le serveur** :
   ```bash
   npm run dev
   ```

### Solution complète :

Si l'erreur persiste, nettoyez tout :

```bash
# Arrêter le serveur
kill $(lsof -ti:1001)

# Nettoyer tous les caches
rm -rf .next
rm -rf node_modules/.cache
rm -rf .next/cache

# Redémarrer
npm run dev
```

---

## 📝 Notes

- Cette erreur apparaît souvent après des modifications importantes du code
- Le cache `.next/` peut devenir corrompu
- La suppression du cache force Next.js à tout reconstruire

---

**Status :** ✅ **RÉSOLU** - Cache nettoyé, serveur redémarré





