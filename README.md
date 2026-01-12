# Interview AI

AI-powered interview practice platform with real-time speech recognition using Sherpa-ONNX.

## Features

- 🔐 **Authentication**: Login/Signup with JWT token management
- 📝 **Interview Setup**: Configure job role, experience level, focus areas, and language
- 🎤 **Real-time Interview**: Voice-based interview with Sherpa-ONNX STT
- 📊 **History & Analytics**: View past interviews and detailed session reports
- 🎨 **Modern UI**: Built with shadcn/ui and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: shadcn/ui, Tailwind CSS
- **State Management**: Zustand
- **Form Validation**: React Hook Form + Zod
- **STT**: Sherpa-ONNX (Web Worker)
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API server running (see API endpoints below)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd interview-ai
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. Add STT models:
   - **Whisper Models (Recommended)**: Place Whisper model files in `public/models/whisper-tiny/`
     - Required files:
       - `{model-name}-encoder.onnx` - Encoder model
       - `{model-name}-decoder.onnx` - Decoder model
       - `{model-name}-tokens.txt` - Token vocabulary file
     - Example structure:
       ```
       public/models/
         whisper-tiny/
           tiny-encoder.onnx
           tiny-decoder.onnx
           tiny-tokens.txt
       ```
   - **Standard Models**: Place model files in `public/models/{language}/`
     - Required files:
       - `model.onnx` - The ONNX model file
       - `tokens.txt` - Token vocabulary file

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
interview-ai/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── dashboard/         # Dashboard and setup pages
│   ├── interview/         # Interview room page
│   └── history/           # History and session detail pages
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── auth/              # Auth components
│   └── layout/            # Layout components
├── lib/
│   ├── api.ts             # API client
│   ├── auth.ts            # Auth utilities
│   ├── audio-processor.ts # Audio processing
│   ├── model-loader.ts    # Model loading
│   ├── sherpa-client.ts   # Sherpa-ONNX client
│   └── validations/       # Zod schemas
├── store/                 # Zustand stores
├── public/
│   ├── models/            # STT model files
│   └── workers/           # Web Workers
└── .husky/               # Git hooks
```

## API Endpoints

The application expects the following backend API endpoints:

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Interview Setup

- `GET /api/interviews/setup` - Get all interview setups
- `POST /api/interviews/setup` - Create new interview setup

### Voice/Interview

- `POST /api/voice/start` - Start interview session
- `POST /api/voice/process` - Process user transcript
- `POST /api/voice/end` - End interview session
- `GET /api/voice/histories/session/:sessionId` - Get session history

### User Interviews

- `GET /api/interviews/user/:userId` - Get user's interview sessions

## Sherpa-ONNX Integration

The application uses Sherpa-ONNX for real-time speech-to-text with Whisper models. The Web Worker (`public/workers/sherpa-worker.js`) is set up to handle Whisper models (encoder + decoder + tokens).

### Current Implementation

The worker is configured for Whisper models but needs actual Sherpa-ONNX integration. To complete the integration:

1. **For Browser (WASM)**:
   - Download Sherpa-ONNX WASM files from [GitHub releases](https://github.com/k2-fsa/sherpa-onnx/releases)
   - Or use CDN: `https://cdn.jsdelivr.net/npm/sherpa-onnx@latest/`
   - Update `public/workers/sherpa-worker.js` to load and initialize WASM module
   - Implement recognizer initialization with Whisper config
   - Implement audio processing and result handling

2. **For Node.js (Server-side)**:
   - The `sherpa-onnx` npm package is already installed
   - Can be used in API routes for server-side processing
   - See `lib/ai-processor/sherpa-onnx-loader.ts` for helper functions

### Model Structure

The app supports:

- **Whisper Models**: `whisper-tiny` (encoder + decoder + tokens)
- **Standard Models**: Single ONNX model + tokens (for backward compatibility)

See `lib/ai-processor/model-loader.ts` for model loading logic.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Code Quality

The project uses:

- **ESLint** for linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **lint-staged** for pre-commit checks

All code is automatically formatted and linted before commits.

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL (default: `http://localhost:3001/api`)

## License

MIT
