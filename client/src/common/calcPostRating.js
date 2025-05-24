import { REACTION_WEIGHT } from "./constants.ts";

const calcPostRating = (likes) => {
  const grouped = likes.reduce((state, r) => {
    if (state.has(r.reaction)) {
      state.set(r.reaction, state.get(r.reaction) + 1);
    } else {
      state.set(r.reaction, 1);
    }

    return state;
  }, new Map());

  let rating = 0;

  for (const [reaction, count] of grouped.entries()) {
    rating += REACTION_WEIGHT[String(reaction)] * count;
  }

  return rating;
};

export default calcPostRating;
