import React from "react";

const getColorByOctave = (note) => {
  const octave = note.match(/\d/)[0];
  const colors = {
    "1": "bg-gray-300",
    "2": "bg-yellow-300",
    "3": "bg-orange-300",
    "4": "bg-sky-300",
    "5": "bg-green-300",
    "6": "bg-purple-300",
    "7": "bg-orange-400",
    "8": "bg-pink-400",
  };
  return colors[octave] || "bg-white";
};

const PianoRealVirtual = ({ notes, playNote, currentNote }) => {
  // Notas ordenadas como en un piano físico (de C1 a C8)
  const whiteOrder = ["C", "D", "E", "F", "G", "A", "B"];
  const blackMap = {
    "C": "C#",
    "D": "D#",
    "F": "F#",
    "G": "G#",
    "A": "A#"
  };

  // Agrupar por octava
  const octaves = Array.from({ length: 7 }, (_, i) => i + 1); // 1–7

  return (
    <div className="relative overflow-x-auto py-6 px-4 w-full">
      <div className="relative flex gap-0">
        {octaves.map((octave) => (
          <div key={octave} className="relative">
            {/* Teclas blancas */}
            <div className="flex">
              {whiteOrder.map((noteLetter) => {
                const fullNote = `${noteLetter}${octave}`;
                const noteObj = notes.find(n => n.note === fullNote);
                if (!noteObj) return null;

                const isCurrent = currentNote?.note === fullNote;
                return (
                  <button
                    key={fullNote}
                    onClick={() => playNote(fullNote, noteObj.freq)}
                    className={`relative w-12 h-48 border border-gray-700 rounded-sm text-xs font-bold
                      ${getColorByOctave(fullNote)} ${isCurrent ? "ring-2 ring-yellow-400 scale-105" : ""}
                      flex flex-col justify-end items-center px-1 py-2 transition`}
                    title={`${fullNote} - ${noteObj.name}`}
                  >
                    <div>{fullNote}</div>
                    <div className="text-[10px] mt-1">{noteObj.name}</div>
                  </button>
                );
              })}
            </div>

            {/* Teclas negras */}
            <div className="absolute top-0 left-0 flex pl-6 pr-3 gap-[24px]">
              {whiteOrder.map((noteLetter, i) => {
                const sharp = blackMap[noteLetter];
                if (!sharp) return <div key={i} className="w-12" />;

                const fullSharp = `${sharp}${octave}`;
                const noteObj = notes.find(n => n.note === fullSharp);
                if (!noteObj) return <div key={fullSharp} className="w-12" />;

                const isCurrent = currentNote?.note === fullSharp;

                return (
                  <button
                    key={fullSharp}
                    onClick={() => playNote(fullSharp, noteObj.freq)}
                    className={`absolute w-8 h-32 -ml-4 bg-black text-white z-10
                      border border-gray-800 rounded-sm text-xs font-bold
                      flex flex-col justify-end items-center px-1 py-1
                      ${isCurrent ? "ring-2 ring-yellow-300 scale-105" : ""}`}
                    style={{ marginLeft: `${i * 48 + 36}px` }} // posicionar sobre la tecla blanca
                    title={`${fullSharp} - ${noteObj.name}`}
                  >
                    <div>{fullSharp}</div>
                    <div className="text-[10px]">{noteObj.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PianoRealVirtual;
