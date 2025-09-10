export default function TestStylesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 Tailwind CSS Test Page
          </h1>
          <p className="text-xl text-gray-600">
            Проверяем что стили работают правильно
          </p>
        </div>

        {/* Test Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 ml-4">
                Градиенты и цвета
              </h3>
            </div>
            <p className="text-gray-600">
              Этот компонент тестирует градиенты, цвета, тени и скругления углов.
            </p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Hover Test
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold ml-4">
                Анимации и эффекты  
              </h3>
            </div>
            <p className="mb-4 opacity-90">
              Проверяем анимации, прозрачность и интерактивные эффекты.
            </p>
            <div className="animate-pulse bg-white bg-opacity-20 rounded-lg p-3 text-center">
              Animated Element
            </div>
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Адаптивная сетка</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="w-16 h-16 bg-indigo-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-bold">{num}</span>
                </div>
                <p className="text-gray-700">Элемент {num}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Если вы видите стили, Tailwind CSS работает!
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <a 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Вернуться на главную
          </a>
        </div>
      </div>
    </div>
  );
}
