import React from "react";
import { instrumentTranslations } from "../data/instrumentTranslations";

const InstrumentSelector = ({ instrumentos, instrumentoActual, setInstrumentoActual }) => {

  return (
    <div className="mb-6 flex items-center gap-4">
      <label htmlFor="instrumento" className="text-lg font-medium">
        🎼 Instrumento:
      </label>
      <select
        id="instrumento"
        value={instrumentoActual}
        onChange={(e) => setInstrumentoActual(e.target.value)}
        className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
      {instrumentos.map((i) => (
        <option key={i} value={i}>
          {instrumentTranslations[i] || i}
        </option>
      ))}
      </select>
    </div>
  );
};

export default InstrumentSelector;
