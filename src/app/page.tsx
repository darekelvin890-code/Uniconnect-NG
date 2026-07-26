export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">UniConnect NG</h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with students, share resources, and grow together across Nigerian Universities
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            Join Now
          </button>
          <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50">
            Login
          </button>
        </div>
      </div>
    </main>
  )
          }
