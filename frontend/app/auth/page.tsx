'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bot, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back to home */}
        <div className="mb-8">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад на главную
          </Link>
        </div>

        {/* Auth card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <Bot className="h-10 w-10 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Sales AI Trainer</h1>
          </div>

          {/* Demo notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Демо версия
                </h3>
                <div className="mt-1 text-sm text-yellow-700">
                  Аутентификация находится в разработке. Пока что можете протестировать основной функционал.
                </div>
              </div>
            </div>
          </div>

          {/* Demo actions */}
          <div className="space-y-4">
            <Link
              href="/session"
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              🎙️ Попробовать голосовую тренировку
            </Link>
            
            <Link
              href="/register"
              className="w-full border border-blue-300 text-blue-600 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
            >
              📝 Создать аккаунт (демо)
            </Link>
            
            <Link
              href="/dashboard"
              className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              📊 Посмотреть Dashboard
            </Link>
            
            <Link
              href="/"
              className="w-full text-gray-500 px-4 py-2 rounded-lg hover:text-gray-700 transition-colors flex items-center justify-center"
            >
              ← Вернуться на главную
            </Link>
          </div>

          {/* Development info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Для полной функциональности необходимо настроить:
            </p>
            <ul className="text-xs text-gray-500 mt-2 space-y-1">
              <li>• Supabase аутентификация</li>
              <li>• ElevenLabs API ключи</li>
              <li>• OpenAI интеграция</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
