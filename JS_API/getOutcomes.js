
exports.getNbaOutcomes = function (homeScore, awayScore) {

  home_diff = homeScore - awayScore
  away_diff = home_diff * -1
  total = homeScore + awayScore
  homeOutcome = 'W'
  awayOutcome = 'L'

  if (home_diff < 0) {
    homeOutcome = 'L'
    awayOutcome = 'W'
  }

  return {homeOutcome, awayOutcome, home_diff, away_diff, total}

}


exports.getSoccerOutcomes = function (homeScore, awayScore) {

  home_diff = homeScore - awayScore
  away_diff = home_diff * -1
  total = homeScore + awayScore
  homeOutcome = 'W'
  awayOutcome = 'L'

  if (home_diff < 0) {
    homeOutcome = 'L'
    awayOutcome = 'W'
  }

  if (home_diff == 0) {
    homeOutcome = 'D'
    awayOutcome = 'D'
  }

  return {homeOutcome, awayOutcome, home_diff, away_diff, total}

}
