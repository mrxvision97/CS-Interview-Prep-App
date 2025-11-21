import { Sparkles, Target, Rocket } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8 animate-fadeIn">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-float">
              <Sparkles size={48} className="text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-pulse" />
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Welcome to Your Interview Coach
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Master computer science interviews with AI-powered guidance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Target size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Expert Prompts</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pre-built prompts crafted by experts for algorithms, system design, behavioral, and more
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Rocket size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Role-Specific</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tailored guidance for frontend, backend, ML, DevOps, and specialized engineering roles
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Sparkles size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Interactive Learning</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Practice with realistic scenarios and get instant feedback on your responses
            </p>
          </div>
        </div>

        <div className="pt-8">
          <p className="text-gray-600 mb-4">Ready to get started?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-700">
                👈 <span className="font-semibold">Choose a topic</span> from the sidebar to begin your prep
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

