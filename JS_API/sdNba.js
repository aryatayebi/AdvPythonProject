const fdClientModule = require('fantasydata-node-client');
const datesAndInfo = require('./helperFunctions/datesAndInfo.js');
const getUSDays = datesAndInfo.getUSDays;
const getGameIDandTeams = datesAndInfo.getGameIDandTeams;
const oddsFunc = require('./helperFunctions/getNbaBookOdds.js');
const getNbaBookOdds = oddsFunc.getNbaBookOdds;
const outcomes = require('./helperFunctions/getOutcomes.js');
const getNbaOutcomes = outcomes.getNbaOutcomes;



const keys = {
    'NBAv3OddsClient':'	b658e20594374f44874274b9cbcb926e',
    'NBAv3ScoresClient':'	f375be3d4d484c20894a73e1fca3df6a',
};
const FantasyDataClient = new fdClientModule(keys);

exports.getNBAGames = async() => {

  days_grabbed = getUSDays(2)
  gameData = []

  for (var days = 0; days < days_grabbed.length; days++) {

    // set today to ET
    let today = new Date()
    //today.setHours( today.getHours() - 4 )

    console.log(days_grabbed[days])

    // calling API
    await FantasyDataClient.NBAv3OddsClient.getPreGameOddsByDatePromise(days_grabbed[days])
        .then((resp) => {
            data = JSON.parse(resp)

            //console.log(today)
            var results = []

            // loop through games
            for (var i = 0; i < data.length; i++) {
              game = data[i]
              let gameTime = new Date(game.DateTime)
              gameTime.setHours(gameTime.getHours()+4);

              if (game.Status != 'Scheduled') {
                continue;
              }

              // if game has started
              if (today - gameTime > 0 || game.Status == 'InProgress') {
                continue
              }

              const {homeTeam, awayTeam, id} = getGameIDandTeams(game.HomeTeamName,game.AwayTeamName,game.DateTime, 'NBA')
              const {cleanedBooks, consensus_book, consensus} = getNbaBookOdds(game.PregameOdds)
              gameData.push (
              {
                homeTeam: homeTeam,
                homeOdds: consensus_book.homeOdds,
                homeSpread: consensus_book.homeSpread,
                homeSpreadOdds: consensus_book.homeSpreadOdds,
                awayTeam: awayTeam,
                awayOdds: consensus_book.awayOdds,
                awaySpread: consensus_book.awaySpread,
                awaySpreadOdds: consensus_book.awaySpreadOdds,
                over: consensus_book.over,
                overOdds: consensus_book.overOdds,
                under: consensus_book.under,
                underOdds: consensus_book.underOdds,
                sport: 'nba',
                sbId: game.GameId,
                dateTime: gameTime.toISOString(),
                id: id,
                gameState: "open",
                consensus: consensus,
                bookOdds: cleanedBooks,
              });

            }

        })

        .catch((err) => {
            // handle errors
        });
      }
    return (gameData)

}

exports.getNBAResults = async() => {

  gameData = []
  days_grabbed = getUSDays(-2)

  // loop through days
  for (var days = 0; days < days_grabbed.length; days++) {

    await FantasyDataClient.NBAv3ScoresClient.getGamesByDatePromise(days_grabbed[days])
        .then((resp) => {
            data = JSON.parse(resp)

            // looping through games
            for (var i = 0; i < data.length; i++) {
              game = data[i]
              const {homeTeam, awayTeam, id} = getGameIDandTeams(game.HomeTeam,game.AwayTeam,game.DateTime, 'NBA')

              // if game has not completed
              if (game.Status == 'InProgress' || game.Status == 'Scheduled') {
                continue
              }

              // game completed
              else if (game.Status == 'Final' || game.Status == 'F/OT') {

                const {homeOutcome, awayOutcome, home_diff, away_diff, total} = getNbaOutcomes(game.HomeTeamScore, game.AwayTeamScore)
                gameData.push({
                  homeTeam: homeTeam,
                  homeOutcome: homeOutcome,
                  homeDiff: home_diff,
                  awayTeam: awayTeam,
                  awayOutcome: awayOutcome,
                  awayDiff: away_diff,
                  total: total,
                  score: game.HomeTeamScore.toString()+'-'+game.AwayTeamScore.toString(),
                  sport: 'nba',
                  sbId: game.GameID,
                  dateTime: game.DateTime,
                  id: id,
                  gameState: game.Status,

                })

              }

              // game postponed, delayed, cancelled, forfeit, other
              else {
                gameData.push({
                  homeTeam: homeTeam,
                  awayTeam: awayTeam,
                  id: id,
                  sbId: game.GameID,
                  gameState: 'Postponed/Cancelled'
                })
              }


            }

        })

        .catch((err) => {
            // handle errors
        });

  }

  return gameData

}
