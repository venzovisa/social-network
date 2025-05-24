const calcTimeOffset = (createdOn: string): string | undefined => {
  const ms = Date.now() - new Date(createdOn).getTime();
  let s = ms / 1000;
  let hours = Math.floor(s / 3600);
  const d = Math.floor(hours / 24);
  let h = hours - d * 24;
  const m = Math.floor((s - d * 3600 * 24 - h * 3600) / 60);
  s = Math.floor(s - h * 3600 - m * 60);

  if (hours > 72) {
    return `Създадено на ${new Date(createdOn).toLocaleDateString()}`;
  }

  if (m < 1 && h === 0 && d === 0) {
    return `Създадено току-що!`;
  }

  if (h < 1 && d < 1) {
    return `Създадено преди ${m} минут${m === 1 ? "a" : "и"}`;
  }

  if (d < 1 && h >= 1) {
    return `Създадено преди ${h} час${h > 1 ? "a" : ""}`;
  }

  if (d < 2 && d >= 1) {
    return `Създадено преди ${d} ден`;
  }

  if (d <= 3 && d >= 2) {
    return `Създадено преди ${d} дни`;
  }
};

export default calcTimeOffset;
