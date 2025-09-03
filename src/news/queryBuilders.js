// Build tight title queries + trusted domains for NewsData.io

export function buildQInTitle(topic, teams = []) {
  const include = {
    Music: ["tour","album","single","playlist","festival","lineup","headliner","tickets"],
    Film:  ["trailer","box office","premiere","opening weekend","festival","streaming"],
    Baseball: ["mlb","playoffs","trade","dl","il","call-up","series","yankees","mets","dodgers","red sox"],
  }[topic] || [];

  const core = [
    `"${topic}"`,
    ...teams.map(t => `"${t}"`),
    ...include.map(t => `"${t}"`)
  ].filter(Boolean);

  return core.length ? core.join(" OR ") : `"${topic}"`;
}

export function domainsForTopic(topic) {
  const map = {
    Music: ["billboard.com","rollingstone.com","pitchfork.com","variety.com"],
    Film:  ["variety.com","hollywoodreporter.com","deadline.com"],
    Baseball: ["mlb.com","espn.com","si.com"],
  };
  return map[topic] || [];
}
