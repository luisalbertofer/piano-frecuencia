import React from "react";

const PianoVisual = ({ onPlayNote }) => {
  return (
    <div className="relative w-fit mx-auto">
      {/* Teclas blancas */}
      <div className="flex relative z-0">
        {notes.filter(n => !n.note.includes("#")).map(({ note, freq, name }) => (
          <div
            key={note}
            onClick={() => onPlayNote(note, freq)}
            className="w-16 h-40 bg-white border border-black cursor-pointer active:bg-gray-200 relative"
          >
            <span className="absolute bottom-1 left-1 text-xs text-gray-500">{note}</span>
            <span className="absolute bottom-1 right-1 text-xs text-gray-500">{name}</span>
          </div>
        ))}
      </div>

      {/* Teclas negras */}
      <div className="absolute top-0 left-0 flex z-10 h-40 pointer-events-none">
        {notes.filter(n => n.note.includes("#")).map(({ note, freq, name }) => (
          <div key={note} className="w-16 relative">
            <div
              onClick={() => onPlayNote(note, freq)}
              className="w-10 h-24 bg-black absolute left-10 -top-0 z-20 cursor-pointer active:bg-gray-700 pointer-events-auto"
            >
              <span className="absolute bottom-1 left-1 text-[10px] text-white">{note}</span>
              <span className="absolute bottom-1 right-1 text-[10px] text-white">{name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PianoVisual;