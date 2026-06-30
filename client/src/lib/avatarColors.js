export const AVATAR_COLORS = [
  "red", "orange", "yellow", "lime", "emerald", "teal",
  "cyan", "sky", "blue", "indigo", "violet", "purple", "pink", "rose",
]

export const AVATAR_COLOR_CLASSES = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  lime: "bg-lime-500",
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  cyan: "bg-cyan-500",
  sky: "bg-sky-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  rose: "bg-rose-500",
}

export function getAvatarColorClass(colorName) {
  return AVATAR_COLOR_CLASSES[colorName] || "bg-slate-400"
}