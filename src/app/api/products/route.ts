import { NextRequest, NextResponse } from 'next/server'
import { getProducts, getProductsByCategory } from '../../../lib/products'
import { PRODUCT_CATEGORIES, ProductCategory } from '../../../types/takeaway'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    if (category) {
      // Validate category
      if (!PRODUCT_CATEGORIES.includes(category as ProductCategory)) {
        return NextResponse.json(
          { success: false, error: 'Invalid category' },
          { status: 400 }
        )
      }

      const products = await getProductsByCategory(category as ProductCategory)
      return NextResponse.json({
        success: true,
        data: products
      })
    }

    // Fetch all products if no category specified
    const products = await getProducts()
    return NextResponse.json({
      success: true,
      data: products
    })

  } catch (error) {
    console.error('Error in products API:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
} 