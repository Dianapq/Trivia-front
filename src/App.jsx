import TriviaGame from './components/TriviaGame'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-indigo-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700 mb-6 mt-4">
        Trivia con IA
      </h1>
      <TriviaGame />
      <p className="text-center text-purple-600 font-medium text-sm mt-8">
        Desarrollado con ❤️ para UNICATOLICA 2025
      </p>
    </div>
  );
}

export default App;


