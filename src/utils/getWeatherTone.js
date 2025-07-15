const getWeatherTone = (city = "", state = "", month = new Date().getMonth()) => {
  const c = city.toLowerCase();
  const s = state.toLowerCase();

  if (s === "fl" || c.includes("miami") || c.includes("orlando")) return "hot and humid";
  if (s === "wa" || c.includes("seattle")) return "cool and misty";
  if (s === "ca") return "mild and breezy";
  if (s === "ny" || s === "nj" || s === "ma") {
    return month >= 5 && month <= 8 ? "warm and muggy" : "chilly and unpredictable";
  }
  if (s === "tx") return "hot and dry";
  if (s === "az" || c.includes("phoenix")) return "desert-level heat";
  if (s === "il" || s === "mn") return month >= 5 && month <= 8 ? "warm and stormy" : "cold and windy";

  return "mild";
};

export default getWeatherTone;

