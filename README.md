# Word Matching Game

A fun and interactive word matching game built with Next.js and React, where players can connect English words with their French translations using arrows.

🎮 [Play the Game](https://cascade-debt-ierv.vercel.app/)

## Features

- Interactive word matching interface
- Visual connection of words using arrows
- Real-time feedback on matches
- Modern, responsive design
- Built with accessibility in mind

## Tech Stack

- [Next.js 15.3](https://nextjs.org/) - React framework with server-side rendering
- [React 19](https://react.dev/) - UI library
- [@xyflow/react](https://reactflow.dev/) - Flow visualization library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Jest](https://jestjs.io/) - Testing framework

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

### Installation

#### Quick Setup (Recommended)

Run the following command to install dependencies and start the development server in one go:

```bash
npm run setup
```

#### Manual Setup

1. Clone the repository:

```bash
git clone <your-repository-url>
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Development

### Available Scripts

- `npm run dev` - Starts the development server with Turbopack
- `npm run build` - Creates a production build
- `npm run start` - Runs the production server
- `npm run test` - Runs the test suite
- `npm run test:watch` - Runs tests in watch mode
- `npm run lint` - Runs ESLint for code quality

### Project Structure

cascade-debt/
├── src/
│ ├── app/ # Next.js app router pages
│ ├── components/ # React components
│ └── styles/ # Global styles
├── public/ # Static assets
└── tests/ # Test files

## Testing

The project uses Jest and React Testing Library for testing. Run the tests with:

```bash
npm run test
```

## Deployment

The project is deployed on [Vercel](https://vercel.com). Any push to the main branch will trigger an automatic deployment.

Live demo: [https://cascade-debt-ierv.vercel.app/](https://cascade-debt-ierv.vercel.app/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
