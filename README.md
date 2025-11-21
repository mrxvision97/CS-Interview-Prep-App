# CS Interview Prep - AI-Powered Interview Coach

A comprehensive, modern web application designed to help computer science students and professionals master technical interviews. Built with React, TypeScript, and OpenAI's latest models.

## ✨ Features

### 🎯 Pre-Built Expert Prompts
No need to craft custom prompts! The app includes professionally designed, detailed prompts for:

- **Data Structures & Algorithms**
  - Algorithm Practice Coach
  - Complexity Analysis Tutor
  - Problem Pattern Recognition

- **System Design**
  - System Design Interview Prep
  - Scalability & Performance
  - Distributed Systems Concepts

- **Behavioral Interviews**
  - STAR Method Coach
  - Leadership Principles Prep
  - Mock Behavioral Interview

- **Frontend Engineering**
  - React Interview Expert
  - JavaScript Fundamentals
  - Frontend System Design
  - CSS & HTML Mastery

- **Backend Engineering**
  - API Design Expert
  - Database Design & SQL
  - Backend Architecture

- **Programming Languages**
  - Python Interview Mastery
  - Java Interview Mastery
  - Go Interview Mastery

- **Specialized Topics**
  - Machine Learning Interviews
  - DevOps & SRE Interviews
  - Security Engineering

- **Career Development**
  - Offer Negotiation Coach
  - Career Growth Strategy
  - Resume & LinkedIn Optimization

### 💬 ChatGPT-Like Interface
- Familiar conversation interface similar to ChatGPT and Claude
- Streaming responses for real-time interaction
- Message history with conversation management
- Beautiful, modern UI with smooth animations

### 🚀 Modern Tech Stack
- **React 18** with TypeScript
- **OpenAI GPT-4o** (latest model)
- **Vite** for fast development
- **Tailwind CSS** for modern styling
- **Lucide React** for beautiful icons

### 🔒 Privacy First
- Your API key is stored locally in your browser
- No backend server - all communication goes directly to OpenAI
- Conversations saved in local storage

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone or download this repository**

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5173`

5. **Add your OpenAI API key**
- Click the Settings button in the sidebar
- Paste your API key
- Choose your preferred model (GPT-4o recommended)
- Save settings

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## 🎨 How to Use

1. **Choose a Topic**: Browse the sidebar and select an interview topic category
2. **Select a Prompt**: Click on a specific prompt that matches your preparation needs
3. **Start Practicing**: The AI coach will guide you with expert-level instruction
4. **Have a Conversation**: Ask questions, practice problems, get feedback
5. **Review History**: All conversations are saved automatically

## 🎓 What Makes This Better?

Unlike generic AI tools, this app provides:

✅ **Expert-Crafted Prompts**: Each prompt is designed by interview experts with deep context
✅ **Role-Specific Guidance**: Tailored for specific CS roles (frontend, backend, ML, etc.)
✅ **Interview Simulation**: Practice real interview scenarios
✅ **Pattern Recognition**: Learn to identify and solve problem patterns
✅ **Comprehensive Coverage**: From algorithms to career negotiation
✅ **Zero Setup Required**: No prompt engineering needed - just start learning

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 📦 Tech Stack Details

- **Frontend Framework**: React 18.3
- **Language**: TypeScript 5.5
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4
- **AI Integration**: OpenAI SDK
- **Icons**: Lucide React

## 🔑 API Key Information

This app requires an OpenAI API key to function. Your key is:
- Stored only in your browser's local storage
- Never sent to any server except OpenAI's API
- Used only for making API calls to OpenAI

**Cost**: OpenAI charges based on token usage. GPT-4o is cost-effective for this use case. Check [OpenAI pricing](https://openai.com/pricing) for details.

## 🎯 Best Practices

1. **Choose the Right Prompt**: Select prompts that match your current preparation stage
2. **Be Specific**: Ask detailed questions to get the most helpful responses
3. **Practice Regularly**: Use different prompts to cover all interview areas
4. **Save Important Conversations**: Review past conversations to reinforce learning
5. **Adjust Temperature**: Lower for focused answers, higher for creative discussions

## 📝 Customization

Want to add your own prompts? Edit `src/prompts.ts`:

```typescript
{
  id: 'your-prompt-id',
  title: 'Your Prompt Title',
  description: 'Brief description',
  icon: '🎯',
  category: 'category-id',
  difficulty: 'Intermediate',
  systemPrompt: 'Your detailed system prompt here...',
  initialMessage: 'First message from AI'
}
```

## 🤝 Contributing

This is a personal interview prep tool, but feel free to fork and customize for your needs!

## 📄 License

MIT License - Feel free to use this for your interview preparation!

## 🙏 Acknowledgments

- OpenAI for their powerful API
- The CS interview community for inspiration
- All the engineers who shared their interview experiences

---

**Good luck with your interviews! 🚀**

Remember: The best way to prepare is consistent practice with expert guidance. This tool brings both together.

