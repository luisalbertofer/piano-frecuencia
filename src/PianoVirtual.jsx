const getGroupColor = (note) => {
  if (note.includes("1")) return "bg-gray-300";
  if (note.includes("2")) return "bg-yellow-300";
  if (note.includes("3")) return "bg-orange-300";
  if (note.includes("4")) return "bg-sky-300";
  if (note.includes("5")) return "bg-green-300";
  if (note.includes("6")) return "bg-purple-300";
  if (note.includes("7")) return "bg-orange-400";
  if (note.includes("8")) return "bg-pink-400";
  return "bg-white";
};

const PianoVirtual = ({ notes, playNote, currentNote }) => {
  return (
    <div className="flex justify-center items-end flex-wrap gap-[2px] p-4">
      {notes.map(({ note, freq, name }) => {
        const isSharp = note.includes("#");
        const isCurrent = currentNote?.note === note;

        // Define clases base
        let classes = "h-36 flex flex-col justify-center items-center font-bold text-xs border border-gray-600 rounded transition-transform duration-200 ease-in-out";

        if (isSharp) {
          classes += " bg-black text-white w-8 z-10";
        } else {
          classes += ` ${getGroupColor(note)} text-black w-10`;
        }

        if (isCurrent) {
          classes += " scale-110 ring-2 ring-yellow-400";
        }

        return (
          <button
            key={note}
            onClick={() => playNote(note, freq)}
            className={classes}
            title={`${note} - ${name}`}
          >
            <div>{note}</div>
            <div className="text-[10px] mt-1">{name}</div>
          </button>
        );
      })}
    </div>
  );
};

export default PianoVirtual;
