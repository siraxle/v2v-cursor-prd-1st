# B2B SaaS Sales Training App with ElevenLabs AI

A comprehensive platform for sales professionals to practice and improve their pitch through live, voice-to-voice AI simulations. This application combines real-time audio streaming, conversation analysis, and personalized coaching feedback.

## Features

- Voice-to-voice conversation practice with ElevenLabs AI agents
- Real-time audio streaming with minimal latency
- Detailed performance analysis and feedback using OpenAI GPT-4o
- User management with role-based access (User, Admin, Super Admin)
- Subscription management with Stripe
- Usage tracking and reporting
- Email notifications via Resend

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Vercel Serverless Functions, Node.js, TypeScript
- **Database**: Supabase (PostgreSQL with Row-Level Security)
- **AI Services**: ElevenLabs API, OpenAI GPT-4o
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Email**: Resend

## Getting Started

### Prerequisites

- Node.js v20.2.1 or higher
- npm 8.19.2 or higher
- Git
- Supabase account
- ElevenLabs API key and Agent ID
- OpenAI API key
- Stripe account
- Resend API key

### Setup

1. Clone this repository
```bash
git clone https://github.com/yourusername/sales-ai.git
cd sales-ai
```

2. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

3. Install dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

4. Setup Supabase
```bash
# Initialize Supabase schema and policies
npx @modelcontextprotocol/server-postgres "<your-connection-string>" < infra/supabase/schema.sql
npx @modelcontextprotocol/server-postgres "<your-connection-string>" < infra/supabase/policies.sql
```

5. Run the development server
```bash
cd frontend
npm run dev
```

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
