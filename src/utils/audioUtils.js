export function clasificarFrecuencia(freq) {
  if (freq <= 125) return "muy grave";
  if (freq <= 250) return "grave";
  if (freq <= 500) return "medio-bajo";
  if (freq <= 2000) return "medio-alto";
  if (freq <= 4000) return "agudo";
  if (freq <= 8000) return "muy agudo";
  return "ultra-agudo";
}

export function getColor(rango) {
  switch (rango) {
    case "muy grave": return "text-gray-700";
    case "grave": return "text-green-600";
    case "medio-bajo": return "text-yellow-600";
    case "medio-alto": return "text-orange-600";
    case "agudo": return "text-red-500";
    case "muy agudo": return "text-purple-500";
    case "ultra-agudo": return "text-blue-600";
    default: return "text-black";
  }
}
