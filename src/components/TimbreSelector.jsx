import React from "react";

const TimbreSelector = ({ timbre, setTimbre, volume, setVolume, duration, setDuration, disabled = false }) => {
  return (
    <div className="w-full max-w-md mb-4">
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="timbre" className="text-lg font-medium">Timbre:</label>
        <select
          id="timbre"
          value={timbre}
          onChange={(e) => setTimbre(e.target.value)}
          disabled={disabled}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="sine">Sinusoidal</option>
          <option value="square">Cuadrada</option>
          <option value="triangle">Triangular</option>
          <option value="sawtooth">Diente de sierra</option>
          <option value="real">Piano real (muestras)</option>
        </select>
        {timbre === "real" && (
          <p className="mt-2 text-sm text-blue-700 italic">
            Estás usando muestras reales de piano 🎹. Mejora la precisión auditiva al reproducir sonidos auténticos.
          </p>
        )}
      </div>

      {setVolume && (
        <div className="mb-4">
          <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-1">
            Volumen: <span className="font-bold">{volume} dB</span>
          </label>
          <input
            id="volume"
            type="range"
            min="-60"
            max="0"
            step="1"
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      )}

      {setDuration && timbre !== "real" && (
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Duración: <span className="font-bold">{parseFloat(duration).toFixed(1)}s</span>
          </label>
          <input
            id="duration"
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            disabled={disabled}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      )}
    </div>
  );
};

export default TimbreSelector;