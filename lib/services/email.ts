/**
 * Service Email pour Block Bank
 * Configuration et utilitaires pour l'envoi d'emails
 * 
 * Le domaine est configuré via les variables d'environnement :
 * - ADMIN_EMAIL : Email admin (ex: admin@votre-domaine.com)
 * - SUPPORT_EMAIL : Email support (ex: support@votre-domaine.com)
 * - NO_REPLY_EMAIL : Email no-reply (ex: noreply@votre-domaine.com)
 * 
 * Voir GUIDE_EMAIL_ADMIN.md pour la configuration complète
 */

// Valeurs par défaut (seront remplacées par les variables d'environnement)
export const ADMIN_EMAIL = 'admin@block-bank.com'
export const SUPPORT_EMAIL = 'support@block-bank.com'
export const NO_REPLY_EMAIL = 'noreply@block-bank.com'

/**
 * Extrait le domaine depuis une URL ou une variable d'environnement
 */
function getDomainFromUrl(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
  if (appUrl) {
    try {
      const url = new URL(appUrl)
      return url.hostname.replace('www.', '')
    } catch {
      // Si l'URL n'est pas valide, essayer d'extraire le domaine manuellement
      const match = appUrl.match(/(?:https?:\/\/)?(?:www\.)?([^\/]+)/)
      if (match) {
        return match[1]
      }
    }
  }
  return 'block-bank.com' // Domaine par défaut
}

/**
 * Génère une adresse email avec le domaine configuré
 */
function getEmailAddress(localPart: string): string {
  const envEmail = process.env[`${localPart.toUpperCase()}_EMAIL`]
  if (envEmail) {
    return envEmail
  }
  
  // Si pas de variable d'environnement, utiliser le domaine depuis NEXT_PUBLIC_APP_URL
  const domain = getDomainFromUrl()
  return `${localPart}@${domain}`
}

// Exporter les fonctions pour obtenir les emails dynamiquement
export function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL || getEmailAddress('admin')
}

export function getSupportEmail(): string {
  return process.env.SUPPORT_EMAIL || getEmailAddress('support')
}

export function getNoReplyEmail(): string {
  return process.env.NO_REPLY_EMAIL || getEmailAddress('noreply')
}

export interface EmailConfig {
  from: string
  replyTo?: string
  to: string | string[]
  subject: string
  html?: string
  text?: string
}

/**
 * Configuration email depuis les variables d'environnement
 */
export function getEmailConfig() {
  return {
    adminEmail: getAdminEmail(),
    supportEmail: getSupportEmail(),
    noReplyEmail: getNoReplyEmail(),
    // Configuration Resend (recommandé)
    resendApiKey: process.env.RESEND_API_KEY,
    // Configuration SendGrid
    sendGridApiKey: process.env.SENDGRID_API_KEY,
    // Configuration SMTP personnalisé
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    smtpSecure: process.env.SMTP_SECURE === 'true',
    // Configuration AWS SES
    awsSesRegion: process.env.AWS_SES_REGION,
    awsSesAccessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
    awsSesSecretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
  }
}

/**
 * Formate une adresse email avec nom
 */
export function formatEmailAddress(email: string, name?: string): string {
  if (name) {
    return `${name} <${email}>`
  }
  return email
}

/**
 * Vérifie si l'email est valide
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Template d'email pour notifications admin
 */
export function getAdminNotificationTemplate(data: {
  title: string
  message: string
  actionUrl?: string
  actionText?: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Block Bank</h1>
  </div>
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
    <h2 style="color: #1f2937; margin-top: 0;">${data.title}</h2>
    <p style="color: #4b5563; font-size: 16px;">${data.message}</p>
    ${data.actionUrl && data.actionText ? `
    <div style="margin: 30px 0; text-align: center;">
      <a href="${data.actionUrl}" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">${data.actionText}</a>
    </div>
    ` : ''}
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    <p style="color: #6b7280; font-size: 14px; margin: 0;">
      Cet email a été envoyé depuis Block Bank Admin Panel<br>
      <a href="mailto:${getAdminEmail()}" style="color: #667eea;">${getAdminEmail()}</a>
    </p>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Template d'email simple
 */
export function getSimpleEmailTemplate(data: {
  title: string
  content: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${data.title}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
    <h1 style="margin: 0;">Block Bank</h1>
  </div>
  <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px;">
    <h2>${data.title}</h2>
    <div>${data.content}</div>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    <p style="color: #666; font-size: 12px;">
      Block Bank - ${getAdminEmail()}
    </p>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Envoie un email via le service configuré
 * 
 * Priorité des services :
 * 1. Resend (si RESEND_API_KEY est défini) - Recommandé
 * 2. SendGrid (si SENDGRID_API_KEY est défini)
 * 3. AWS SES (si AWS_SES_ACCESS_KEY_ID est défini)
 * 4. SMTP personnalisé (si SMTP_HOST est défini)
 * 5. Mode développement (simulation)
 * 
 * Voir GUIDE_EMAIL_ADMIN.md pour la configuration
 */
export async function sendEmail(config: EmailConfig): Promise<{ success: boolean; error?: string }> {
  const emailConfig = getEmailConfig()
  
  // Mode développement : simulation si aucun service configuré
  if (!emailConfig.resendApiKey && !emailConfig.sendGridApiKey && 
      !emailConfig.awsSesAccessKeyId && !emailConfig.smtpHost && 
      process.env.NODE_ENV === 'development') {
    console.log('📧 [DEV] Email simulé:')
    console.log('   From:', config.from)
    console.log('   To:', Array.isArray(config.to) ? config.to.join(', ') : config.to)
    console.log('   Subject:', config.subject)
    console.log('   Content:', config.text || config.html?.substring(0, 100) + '...')
    return { success: true }
  }
  
  // 1. Resend (Recommandé - Simple et moderne)
  if (emailConfig.resendApiKey) {
    try {
      const resend = await import('resend').catch(() => null)
      if (!resend) {
        return { success: false, error: 'Package resend non installé. Exécutez: npm install resend' }
      }
      
      const resendClient = new resend.Resend(emailConfig.resendApiKey)
      
      const result = await resendClient.emails.send({
        from: config.from,
        to: Array.isArray(config.to) ? config.to : [config.to],
        subject: config.subject,
        html: config.html,
        text: config.text,
        reply_to: config.replyTo,
      })
      
      if (result.error) {
        return { success: false, error: result.error.message || 'Erreur Resend' }
      }
      
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || 'Erreur lors de l\'envoi via Resend' }
    }
  }
  
  // 2. SendGrid
  if (emailConfig.sendGridApiKey) {
    try {
      const sgMail = await import('@sendgrid/mail').catch(() => null)
      if (!sgMail) {
        return { success: false, error: 'Package @sendgrid/mail non installé. Exécutez: npm install @sendgrid/mail' }
      }
      
      sgMail.default.setApiKey(emailConfig.sendGridApiKey)
      
      await sgMail.default.send({
        from: config.from,
        to: Array.isArray(config.to) ? config.to : config.to,
        subject: config.subject,
        html: config.html,
        text: config.text,
        replyTo: config.replyTo,
      })
      
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || 'Erreur lors de l\'envoi via SendGrid' }
    }
  }
  
  // 3. AWS SES
  if (emailConfig.awsSesAccessKeyId && emailConfig.awsSesSecretAccessKey) {
    try {
      const AWS = await import('aws-sdk').catch(() => null)
      if (!AWS) {
        return { success: false, error: 'Package aws-sdk non installé. Exécutez: npm install aws-sdk' }
      }
      
      const ses = new AWS.SES({
        region: emailConfig.awsSesRegion || 'us-east-1',
        accessKeyId: emailConfig.awsSesAccessKeyId,
        secretAccessKey: emailConfig.awsSesSecretAccessKey,
      })
      
      await ses.sendEmail({
        Source: config.from,
        Destination: {
          ToAddresses: Array.isArray(config.to) ? config.to : [config.to],
        },
        Message: {
          Subject: { Data: config.subject },
          Body: {
            Html: config.html ? { Data: config.html } : undefined,
            Text: config.text ? { Data: config.text } : undefined,
          },
        },
        ReplyToAddresses: config.replyTo ? [config.replyTo] : undefined,
      }).promise()
      
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || 'Erreur lors de l\'envoi via AWS SES' }
    }
  }
  
  // 4. SMTP personnalisé (Nodemailer)
  if (emailConfig.smtpHost) {
    try {
      const nodemailer = await import('nodemailer').catch(() => null)
      if (!nodemailer) {
        return { success: false, error: 'Package nodemailer non installé. Exécutez: npm install nodemailer' }
      }
      
      const transporter = nodemailer.default.createTransport({
        host: emailConfig.smtpHost,
        port: emailConfig.smtpPort,
        secure: emailConfig.smtpSecure,
        auth: {
          user: emailConfig.smtpUser,
          pass: emailConfig.smtpPassword,
        },
      })
      
      await transporter.sendMail({
        from: config.from,
        replyTo: config.replyTo,
        to: Array.isArray(config.to) ? config.to.join(', ') : config.to,
        subject: config.subject,
        html: config.html,
        text: config.text,
      })
      
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || 'Erreur lors de l\'envoi via SMTP' }
    }
  }
  
  return { success: false, error: 'Aucun service email configuré. Voir GUIDE_EMAIL_ADMIN.md' }
}

