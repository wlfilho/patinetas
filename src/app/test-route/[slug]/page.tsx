export const dynamic = 'force-dynamic'

interface TestRouteProps {
  params: Promise<{ slug: string }>
}

export default async function TestRoute({ params }: TestRouteProps) {
  const { slug } = await params
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Test Route Working!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Slug: <strong>{slug}</strong>
        </p>
        <p className="text-sm text-gray-500">
          This is a simple test to verify dynamic routes work in production.
        </p>
      </div>
    </div>
  )
}
