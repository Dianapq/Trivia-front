import { useState } from 'react';
import axios from 'axios';

const temasDisponibles = ['Historia', 'Ciencia', 'Geografía', 'Arte', 'Deportes'];

const TriviaGame = () => {
  const [tema, setTema] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [seleccionada, setSeleccionada] = useState(null);
  const [terminado, setTerminado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const iniciarTrivia = async (temaSeleccionado) => {
    setTema(temaSeleccionado);
    setCargando(true);
    setError(null);
    try {
      const res = await axios.post('https://trivia-backend-five.vercel.app/api/chat/trivia', {
        tema: temaSeleccionado
      });

      const trivia = res.data.trivia;

      if (!Array.isArray(trivia) || trivia.length === 0) {
        throw new Error('No se recibieron preguntas válidas');
      }

      setPreguntas(trivia);
    } catch (error) {
      console.error('Error al cargar trivia:', error);
      setError('Ocurrió un problema al cargar la trivia. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  const responder = (opcion) => {
    if (!preguntas[preguntaActual]) return;

    setSeleccionada(opcion);
    const correcta = preguntas[preguntaActual].respuesta_correcta;
    if (opcion === correcta) {
      setPuntaje((prev) => prev + 1);
    }

    setTimeout(() => {
      if (preguntaActual + 1 < preguntas.length) {
        setPreguntaActual((prev) => prev + 1);
        setSeleccionada(null);
      } else {
        setTerminado(true);
      }
    }, 1000);
  };

  const reiniciar = () => {
    setTema(null);
    setPreguntas([]);
    setPreguntaActual(0);
    setPuntaje(0);
    setSeleccionada(null);
    setTerminado(false);
    setError(null);
  };

  if (cargando) return <p className="text-purple-700 text-lg">⏳ Cargando preguntas...</p>;

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p className="mb-4">{error}</p>
        <button onClick={reiniciar} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
          Volver a intentar
        </button>
      </div>
    );
  }

  if (!tema) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Elige un tema:</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {temasDisponibles.map((t, i) => (
            <button
              key={i}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
              onClick={() => iniciarTrivia(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (terminado) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600">🎉 ¡Trivia completada!</h2>
        <p className="mt-2 text-lg">Tu puntaje: <strong>{puntaje} / {preguntas.length}</strong></p>
        <button
          onClick={reiniciar}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Jugar otra vez
        </button>
      </div>
    );
  }

  const pregunta = preguntas[preguntaActual];

  if (!pregunta) {
    return (
      <div className="text-center text-red-600">
        <p>No se pudo cargar esta pregunta.</p>
        <button onClick={reiniciar} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
          Volver a empezar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-2 text-indigo-800">
        Pregunta {preguntaActual + 1} de {preguntas.length}
      </h2>
      <p className="mb-4 font-medium">{pregunta.pregunta}</p>
      <div className="grid gap-3">
        {Object.entries(pregunta.opciones).map(([letra, texto]) => (
          <button
            key={letra}
            disabled={!!seleccionada}
            className={`
              px-4 py-2 rounded-md border transition-all
              ${seleccionada === letra
                ? letra === pregunta.respuesta_correcta
                  ? 'bg-green-200 border-green-500'
                  : 'bg-red-200 border-red-500'
                : 'hover:bg-purple-100 border-purple-300'}
            `}
            onClick={() => responder(letra)}
          >
            <strong>{letra}.</strong> {texto}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TriviaGame;
