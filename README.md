
# 🚀 Axion - AI Agentic Sales Voice Agent Platform



## 🌟 Introduction
Axion is an AI-powered agentic sales voice platform that transforms your sales and marketing workflows by handling the workload of over 30 people in seconds. Built with cutting-edge technologies, Axion offers a sleek, modern interface for creating, managing, and testing AI voice agents tailored for sales automation. With type-safe development and fine-tuning capabilities (built with Python and hosted on AWS) coming soon, Axion integrates powerful marketing automation with production-ready voice agents via [Vapi.ai](https://vapi.ai).

## 🔗 Live Preview

Check out the live demo here: [Live Preview](https://axionai.vercel.app/)

## 🎥 Watch the Preview Video on YouTube

See Axion in action: [Watch the Video](https://youtube.com)

## 💻 Tech Stack

- **Next.js 15** – Production-grade React framework
- **TailwindCSS** – Utility-first CSS for modern styling
- **Shadcn UI** – Reusable, customizable components
- **Framer Motion** – Smooth, fluid animations
- **TypeScript** – Type-safe coding
- **Number Flow** – Seamless number animations
- **Voice Synthesis**: ElevenLabs for realistic voices
- **LLMs**: OpenAI GPT-4, GPT-3.5 Turbo, Google Gemini

## 🛠️ Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/duggal1/axion.git
    ```

2. Install dependencies:
    ```bash
    pnpm install
    # or
    npm install
    # or
    yarn install
    ```

3. Run the development server:
    ```bash
    pnpm run dev
    # or
    npm run dev
    # or
    yarn dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_APP_URL=your_app_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
DATABASE_URL=
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
PINECONE_INDEX_NAME=
```

## 🚀 Deploy on Vercel

Deploy Axion effortlessly using the [Vercel Platform](https://vercel.com/new). See the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for details.

## Features

- **AI Sales Voice Agents**: Create and manage voice agents with custom voices, personalities, and sales expertise.
- **Marketing Automation**: Generate content, manage campaigns, and track performance analytics.
- **Voice Sample Preview**: Preview ElevenLabs voice samples before agent creation or editing.
- **Voice Call Testing**: Test agents’ sales performance with real-time calls.
- **Call History**: Monitor call logs and sales analytics.
- **Multiple LLM Support**: Choose GPT-4, GPT-3.5 Turbo, or Google Gemini.
- **Coming Soon**: Type-safe fine-tuning with Python, hosted on AWS.

## Voice Sample Playback

- Available for all ElevenLabs voices
- Accessible in agent creation and detail pages
- Locally stored for optimal performance
- Powered by the reusable `VoicePreview` component

## API Endpoints

### Voice Samples
- `GET /api/vapi/voice-samples`: Retrieve voice sample info
- `POST /api/vapi/voice-samples`: Generate a new voice sample
- `GET /api/vapi/voice-samples/download`: Download or create voice sample files

### Agents
- `GET /api/agents`: List all sales agents
- `POST /api/agents`: Create a new sales agent
- `GET /api/agents/[id]`: Get agent details
- `PATCH /api/agents/[id]`: Update an agent
- `DELETE /api/agents/[id]`: Delete an agent

### Calls
- `GET /api/calls`: List sales call logs
- `POST /api/calls`: Log a new sales call
- `PATCH /api/calls/[callId]`: Update a call log
- `DELETE /api/calls/[callId]`: Delete a call log

## 🤝 Contributing

Contributions are welcome! Submit a Pull Request following these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ☕ Buy Me a Coffee
Enjoy Axion? Support my work!  
[Buy Me a Coffee ☕](https://buymeacoffee.com/duggal1)

---

Built with ❤️ by [Harshit Duggal](https://github.com/duggal1)

---

This version combines the strengths of both platforms into a unified "Axion" identity, focusing on sales automation with voice agents while retaining marketing automation features. It’s concise, modern, and avoids redundancy. Let me know if you’d like further adjustments!