# ✅ Correction - Caractères Unicode dans les noms de fichiers

## 🐛 Problème

Erreur lors du téléchargement de fichiers avec caractères spéciaux :
```
Cannot convert argument to a ByteString because the character at index 51 
has a value of 8217 which is greater than 255.
```

**Cause :** Les headers HTTP ne supportent que les caractères ASCII (0-255). Les caractères Unicode (comme l'apostrophe courbe ' = 8217) causent l'erreur.

---

## ✅ Solution appliquée

### Normalisation des noms de fichiers

Le système normalise maintenant tous les noms de fichiers pour les headers HTTP :

1. **Remplace les apostrophes Unicode** par apostrophe ASCII (`'`)
2. **Remplace les guillemets Unicode** par guillemets ASCII (`"`)
3. **Normalise les accents** (é → e, à → a, etc.)
4. **Filtre tous les caractères non-ASCII** → remplacés par `_`

**Exemple :**
```
Original : Capture d'écran 2025-11-26 à 11.52.49 PM.png
Nettoyé  : Capture d'ecran 2025-11-26 a 11.52.49 PM.png
```

---

## ✅ Résultat

- ✅ Les fichiers avec caractères spéciaux peuvent être téléchargés
- ✅ Plus d'erreur 500
- ✅ Noms de fichiers normalisés dans les headers HTTP

---

**Status :** ✅ **CORRIGÉ - TESTEZ MAINTENANT**

Rechargez la page admin et testez le téléchargement d'un fichier avec caractères spéciaux.





