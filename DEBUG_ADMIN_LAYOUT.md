# 🔧 Documentation de débogage - app/admin/layout.tsx

## 📋 Problème identifié

**Erreur récurrente :** 
```
app/admin/layout.tsx (111:13) @ AdminLayout
> 111 |   useEffect(() => {
      |             ^
```

L'erreur persiste malgré plusieurs tentatives de correction. Le problème semble lié à l'utilisation de `window` dans un `useEffect` dans un composant Next.js avec App Router.

## ✅ Ce qui a été tenté (sans succès)

1. **Vérification `typeof window !== 'undefined'`** - Ajout de vérifications dans le `useEffect`
2. **Utilisation de `useLayoutEffect`** - Tentative de résoudre les problèmes d'hydratation
3. **Utilisation de `useCallback`** - Tentative de mémoriser la fonction `handleResize`
4. **Ajout d'un state `isMounted`** - Pour éviter les problèmes d'hydratation
5. **Simplification du code** - Retour à un `useEffect` basique

**Résultat :** Aucune de ces approches n'a résolu l'erreur de manière définitive.

## 🎯 État actuel du code

**Fichier :** `app/admin/layout.tsx`

**Lignes problématiques :** 110-131

```typescript
// Sur desktop, le menu est toujours ouvert
useEffect(() => {
  const handleResize = () => {
    const mobile = window.innerWidth <= 768
    setIsMobile(mobile)
    if (!mobile) {
      setIsMenuOpen(true)
    }
  }
  
  handleResize()
  setIsMounted(true)
  window.addEventListener('resize', handleResize)
  
  return () => {
    window.removeEventListener('resize', handleResize)
  }
}, [])
```

## 🔍 Analyse du problème

Le composant est marqué `'use client'` donc il devrait s'exécuter uniquement côté client. Cependant, l'erreur persiste, ce qui suggère :

1. **Problème de règles ESLint/React Hooks** - Peut-être une règle stricte qui détecte un problème
2. **Problème d'hydratation Next.js** - Même avec `'use client'`, Next.js peut pré-rendre le composant
3. **Problème de dépendances manquantes** - Les setters `setIsMobile`, `setIsMenuOpen`, `setIsMounted` ne sont pas dans les dépendances (mais c'est normal, les setters sont stables)

## 💡 Solutions à essayer (par ordre de priorité)

### Solution 1 : Hook personnalisé séparé (RECOMMANDÉ)

Créer un hook personnalisé dans `hooks/useWindowSize.ts` :

```typescript
'use client'

import { useState, useEffect } from 'react'

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
      setIsMobile(window.innerWidth <= 768)
    }

    setIsMounted(true)
    handleResize()
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { windowSize, isMobile, isMounted }
}
```

Puis dans `app/admin/layout.tsx` :

```typescript
import { useWindowSize } from '@/hooks/useWindowSize'

// Dans le composant :
const { isMobile, isMounted } = useWindowSize()

// Supprimer le useEffect problématique
```

### Solution 2 : Utiliser CSS Media Queries (ALTERNATIVE)

Au lieu de JavaScript, utiliser CSS pour gérer le responsive :

```css
/* Dans styles/admin-marketing.css */
@media (max-width: 768px) {
  .admin-dashboard .dashboard-content {
    margin-left: 0 !important;
  }
}
```

Et simplifier le code :

```typescript
// Supprimer complètement le useEffect et les states isMobile/isMounted
// Utiliser directement CSS pour le responsive
```

### Solution 3 : Utiliser un composant wrapper client

Créer `components/admin/ClientOnly.tsx` :

```typescript
'use client'

import { useEffect, useState } from 'react'

export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}
```

Puis wrapper la partie problématique :

```typescript
<ClientOnly>
  {/* Code qui utilise window */}
</ClientOnly>
```

### Solution 4 : Désactiver la règle ESLint (DERNIER RECOURS)

Si c'est uniquement un problème de linting :

```typescript
useEffect(() => {
  // ... code ...
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])
```

## 📝 Structure recommandée pour le code final

```typescript
'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
// ... autres imports

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  
  // States
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  
  // Utiliser le hook personnalisé au lieu du useEffect problématique
  const { isMobile, isMounted } = useWindowSize() // OU utiliser CSS

  // useEffect pour l'authentification (celui-ci fonctionne)
  useEffect(() => {
    // ... code auth ...
  }, [pathname, router])

  // ... reste du code ...
  
  return (
    <div className="dashboard admin-dashboard">
      {/* ... */}
      <div className="dashboard-content" style={{
        marginLeft: isMounted && !isMobile && isMenuOpen ? 'var(--sidebar-width)' : '0',
        // OU utiliser CSS uniquement
      }}>
        {/* ... */}
      </div>
    </div>
  )
}
```

## 🚨 Points d'attention

1. **Ne pas utiliser `window` directement dans le corps du composant** - Toujours dans un `useEffect` ou hook
2. **Vérifier que le composant est bien `'use client'`** - C'est déjà le cas
3. **Les setters de useState sont stables** - Pas besoin de les mettre dans les dépendances
4. **Next.js peut pré-rendre même avec `'use client'`** - D'où l'importance de vérifier `window`

## 🔗 Fichiers à modifier

1. `app/admin/layout.tsx` - Fichier principal à corriger
2. `hooks/useWindowSize.ts` - À créer si Solution 1 choisie
3. `styles/admin-marketing.css` - À modifier si Solution 2 choisie
4. `components/admin/ClientOnly.tsx` - À créer si Solution 3 choisie

## ✅ Checklist de vérification

- [ ] L'erreur disparaît dans la console/terminal
- [ ] Le serveur compile sans erreur (`npm run build`)
- [ ] Le responsive fonctionne (menu se ferme/ouvre sur mobile)
- [ ] Pas d'erreurs dans la console du navigateur
- [ ] Le hot-reload fonctionne correctement

## 📞 Informations supplémentaires

- **Next.js version :** ^14.0.0
- **React version :** ^18.2.0
- **Port du serveur :** 1001
- **Commande de démarrage :** `npm run dev`

---

**Dernière mise à jour :** 4 décembre 2025
**Statut :** ⚠️ Problème non résolu - Solutions proposées ci-dessus

