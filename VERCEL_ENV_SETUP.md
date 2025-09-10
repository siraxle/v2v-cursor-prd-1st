# 🔧 Настройка переменных окружения в Vercel

## Шаг 1: Перейти в настройки проекта
1. Откройте https://vercel.com/dashboard
2. Найдите проект **sales-ai-trainer**
3. Перейдите в **Settings** → **Environment Variables**

## Шаг 2: Добавить обязательные переменные

### Supabase (ОБЯЗАТЕЛЬНО)
```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-service-key
```

### ElevenLabs (ОБЯЗАТЕЛЬНО для голоса)
```
ELEVENLABS_API_KEY = your-elevenlabs-api-key
ELEVENLABS_AGENT_ID = your-agent-id
```

### OpenAI (опционально)
```
OPENAI_API_KEY = your-openai-key
OPENAI_MODEL = gpt-4o
```

### Stripe (опционально)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_...
STRIPE_SECRET_KEY = sk_test_...
```

### Resend (опционально)
```
RESEND_API_KEY = re_...
EMAIL_FROM = noreply@yourdomain.com
```

## Шаг 3: Redeploy
После добавления переменных:
1. Вернитесь на вкладку **Deployments** 
2. Нажмите **"Redeploy"** на последнем деплое
3. Или запустите: `vercel --prod`

## 🎯 Текущая ссылка
https://sales-ai-trainer-qjb8dtvai-dzhechkos-projects.vercel.app

После добавления переменных приложение будет полностью функционально!
