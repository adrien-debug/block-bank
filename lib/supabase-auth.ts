import { supabaseAdmin } from './supabase/server'
import bcrypt from 'bcryptjs'

// Note: bcryptjs est une implémentation JavaScript de bcrypt
// Elle est asynchrone mais peut être utilisée avec await grâce à promisify

export interface UserData {
  email: string
  password: string
  first_name: string
  last_name: string
  address: string
}

export interface LoginData {
  email: string
  password: string
}

export async function createUser(userData: UserData) {
  try {
    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', userData.email)
      .maybeSingle()

    // Si erreur autre que "not found", c'est un vrai problème
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Erreur vérification utilisateur existant:', checkError)
      return { error: 'Erreur lors de la vérification de l\'email' }
    }

    if (existingUser) {
      return { error: 'Cet email est déjà utilisé' }
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(userData.password, 10)

    // Créer l'utilisateur avec role = 'user' par défaut
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: userData.email,
        password_hash: passwordHash,
        first_name: userData.first_name,
        last_name: userData.last_name,
        address: userData.address,
        role: 'user',
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur création utilisateur:', error)
      return { error: error.message }
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password_hash, ...userWithoutPassword } = data
    return { user: userWithoutPassword }
  } catch (error: any) {
    console.error('Erreur createUser:', error)
    return { error: error.message || 'Erreur lors de la création du compte' }
  }
}

export async function verifyUser(loginData: LoginData) {
  try {
    // Récupérer l'utilisateur
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', loginData.email)
      .single()

    if (error || !user) {
      return { error: 'Email ou mot de passe incorrect' }
    }

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(loginData.password, user.password_hash)
    if (!isValid) {
      return { error: 'Email ou mot de passe incorrect' }
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password_hash, ...userWithoutPassword } = user
    return { user: userWithoutPassword }
  } catch (error: any) {
    console.error('Erreur verifyUser:', error)
    return { error: error.message || 'Erreur lors de la connexion' }
  }
}

export async function getUserById(userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name, address, wallet_address, role, created_at')
      .eq('id', userId)
      .single()

    if (error || !data) {
      return { error: 'Utilisateur non trouvé' }
    }

    return { user: data }
  } catch (error: any) {
    console.error('Erreur getUserById:', error)
    return { error: error.message || 'Erreur lors de la récupération de l\'utilisateur' }
  }
}

export async function updateWalletAddress(userId: string, walletAddress: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ wallet_address: walletAddress })
      .eq('id', userId)
      .select('id, email, first_name, last_name, address, wallet_address, role, created_at')
      .single()

    if (error) {
      return { error: error.message }
    }

    return { user: data }
  } catch (error: any) {
    console.error('Erreur updateWalletAddress:', error)
    return { error: error.message || 'Erreur lors de la mise à jour du wallet' }
  }
}

/**
 * Recherche un utilisateur par son adresse wallet
 */
export async function findUserByWalletAddress(walletAddress: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name, address, wallet_address, role, created_at')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single()

    if (error) {
      // Si l'utilisateur n'existe pas, ce n'est pas une erreur
      if (error.code === 'PGRST116') {
        return { user: null }
      }
      return { error: error.message }
    }

    return { user: data }
  } catch (error: any) {
    console.error('Erreur findUserByWalletAddress:', error)
    return { error: error.message || 'Erreur lors de la recherche de l\'utilisateur' }
  }
}

/**
 * Crée un nouvel utilisateur à partir d'une adresse wallet
 * Utilisé lors de la première connexion via wallet
 */
export async function createUserFromWallet(walletAddress: string) {
  try {
    // Vérifier si un utilisateur avec cette adresse existe déjà
    const existing = await findUserByWalletAddress(walletAddress)
    if (existing.user) {
      return { error: 'Un utilisateur avec cette adresse wallet existe déjà' }
    }

    // Créer un nouvel utilisateur avec role = 'user' par défaut
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        wallet_address: walletAddress.toLowerCase(),
        email: null, // Email peut être ajouté plus tard
        password_hash: '', // Pas de mot de passe pour les utilisateurs wallet-only
        role: 'user',
      })
      .select('id, email, first_name, last_name, address, wallet_address, role, created_at')
      .single()

    if (error) {
      console.error('Erreur création utilisateur wallet:', error)
      return { error: error.message }
    }

    return { user: data }
  } catch (error: any) {
    console.error('Erreur createUserFromWallet:', error)
    return { error: error.message || 'Erreur lors de la création du compte wallet' }
  }
}

