import React from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

// Iconos de Lucide
import {
  Music,
  Target,
  Drum,
  Volume2,
  BarChart2,
  Piano,
} from "lucide-react";

const MainMenuPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          🎧 Rehabilitación Auditiva
        </h1>

        <p className="text-lg text-gray-600 mb-10 text-center max-w-md">
          Practica con juegos diseñados para mejorar tu percepción auditiva:
          altura, rango, ritmo y timbre.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Comparador de Notas */}
          <Link
            to="/comparador"
            title="Escucha dos notas y adivina cuál es más aguda o más grave"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center h-32 transition-transform transform hover:scale-105 duration-200 ease-in-out"
          >
            <div className="flex items-center">
              <Music className="w-6 h-6 mr-2 text-white" />
              <span className="text-xl font-semibold text-white">Comparador de Notas</span>
            </div>
          </Link>

          {/* Rango Auditivo */}
          <Link
            to="/juego-rango"
            title="Adivina si la nota pertenece a un rango grave, medio o agudo"
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center h-32 transition-transform transform hover:scale-105 duration-200 ease-in-out"
          >
            <div className="flex items-center">
              <BarChart2 className="w-6 h-6 mr-2 text-white" />
              <span className="text-xl font-semibold text-white">Rango Auditivo</span>
            </div>
          </Link>

          {/* Juego de Ritmo */}
          <Link
            to="/juego-ritmo"
            title="Escucha patrones rítmicos y repítelos con precisión"
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center h-32 transition-transform transform hover:scale-105 duration-200 ease-in-out"
          >
            <div className="flex items-center">
              <Drum className="w-6 h-6 mr-2 text-white" />
              <span className="text-xl font-semibold text-white">Juego de Ritmo</span>
            </div>
          </Link>

          {/* Reconocimiento de Instrumentos */}
          <Link
            to="/reconocimiento-instrumento"
            title="Escucha un sonido y adivina a qué instrumento pertenece"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center h-32 transition-transform transform hover:scale-105 duration-200 ease-in-out"
          >
            <div className="flex items-center">
              <Volume2 className="w-6 h-6 mr-2 text-white" />
              <span className="text-xl font-semibold text-white">Instrumentos</span>
            </div>
          </Link>

          {/* Piano */}
          <Link
            to="/piano"
            title="Toca notas en un piano virtual para entrenar el oído"
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center h-32 transition-transform transform hover:scale-105 duration-200 ease-in-out"
          >
            <div className="flex items-center">
              <Piano className="w-6 h-6 mr-2 text-white" />
              <span className="text-xl font-semibold text-white">Practica el Piano</span>
            </div>
          </Link>

          {/* Instrumentos Reales */}
          <Link
            to="/piano-real"
            title="Toca instrumentos reales como piano, violín, guitarra, saxofón y más"
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center h-32 transition-transform transform hover:scale-105 duration-200 ease-in-out"
          >
            <div className="flex items-center">
              <Target className="w-6 h-6 mr-2 text-white" />
              <span className="text-xl font-semibold text-white">Instrumentos Reales</span>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            ¡Escucha, juega y mejora tu percepción auditiva!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default MainMenuPage;