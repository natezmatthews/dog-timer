function isOdd(num: number): boolean {
  return (num % 2) === 1
}

export default function makeAPlan(
  personalBest: number,
  numRewardsPerVolley: number,
  lowBound: number,
  noise: number,
  floor: number,
) {
  const tbrs = []
  for (let index = 1; index <= numRewardsPerVolley; index++) {
    const percentThroughRound = index / numRewardsPerVolley;
    const percentOfPersonalBest = percentThroughRound * personalBest;
    const noiseLess = isOdd(index) ? percentOfPersonalBest : (percentOfPersonalBest * lowBound);
    const noised = noiseLess + (Math.random() - 0.5) * noise;
    const notBelow = noised > floor ? noised : floor;
    tbrs.push(notBelow)
  }
  return tbrs;
}