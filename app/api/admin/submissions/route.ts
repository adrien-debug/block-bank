import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/utils/adminAuth'
import { listSubmissions } from '@/lib/utils/submissionStorage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Récupérer les paramètres de filtrage
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const assetType = searchParams.get('assetType')
    const userType = searchParams.get('userType')

    // Lister toutes les soumissions
    let submissions = await listSubmissions()

    // Appliquer les filtres
    if (status) {
      submissions = submissions.filter(s => s.status === status)
    }
    if (assetType) {
      submissions = submissions.filter(s => s.assetType === assetType)
    }
    if (userType) {
      submissions = submissions.filter(s => s.userType === userType)
    }

    return NextResponse.json({
      success: true,
      submissions,
      total: submissions.length,
    })
  } catch (error) {
    console.error('Error retrieving submissions:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}

