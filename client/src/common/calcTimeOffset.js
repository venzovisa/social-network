const calcTimeOffset = (createdOn) => {
  const ms = Date.now() - new Date(createdOn).getTime();
  let s = ms / 1000;
  let hours = Math.floor(s / 3600);
  const d = Math.floor(hours / 24);
  let h = hours - d * 24;
  const m = Math.floor((s - d * 3600 * 24 - h * 3600) / 60);
  s = Math.floor(s - h * 3600 - m * 60);

  if (hours > 72) {
    return <p>Създадено на {new Date(createdOn).toLocaleDateString()} </p>;
  }

  if (m < 1 && h === 0 && d === 0) {
    return <p>Създадено току-що! </p>;
  }

  if (h < 1 && d < 1) {
    return (
      <p>
        Създадено преди {m} минут{m === 1 ? "a" : "и"}{" "}
      </p>
    );
  }

  if (d < 1 && h >= 1) {
    return (
      <p>
        Създадено преди {h} час{h > 1 ? "a" : ""}
      </p>
    );
  }

  if (d < 2 && d >= 1) {
    return <p>Създадено преди {d} ден</p>;
  }

  if (d <= 3 && d >= 2) {
    return <p>Създадено преди {d} дни</p>;
  }
};

export default calcTimeOffset;
