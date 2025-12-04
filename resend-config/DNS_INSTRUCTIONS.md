# Instructions DNS pour Resend - block-bank.com

## 📋 Enregistrements DNS à Ajouter

Une fois que vous avez ajouté le domaine block-bank.com dans Resend, vous devrez ajouter ces enregistrements DNS :

### 1. Enregistrement TXT (Vérification du domaine)
Type: TXT
Name: @
Value: [Valeur fournie par Resend après ajout du domaine]
TTL: 3600 (ou par défaut)

### 2. Enregistrement MX (Réception d'emails)
Type: MX
Name: @
Value: [Valeur fournie par Resend]
Priority: 10
TTL: 3600 (ou par défaut)

### 3. Enregistrement SPF (Optionnel mais recommandé)
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600

### 4. Enregistrement DKIM (Optionnel mais recommandé)
Type: TXT
Name: [Nom fourni par Resend]
Value: [Valeur fourni par Resend]
TTL: 3600

## 🔗 Où Ajouter ces Enregistrements

1. Connectez-vous à votre registraire de domaine (où vous avez acheté block-bank.com)
2. Allez dans la section DNS / Zone DNS
3. Ajoutez les enregistrements ci-dessus
4. Attendez la propagation DNS (5-30 minutes)
5. Retournez dans Resend et cliquez sur "Verify"

## ⚠️ Important

- Les valeurs exactes seront fournies par Resend après l'ajout du domaine
- Ne supprimez pas les enregistrements existants
- La propagation DNS peut prendre jusqu'à 48h (généralement 5-30 minutes)

