const fee = require('./feeRemover.js');
const feeRemover = fee.feeRemover;


// helper function: rounds odds to nearest 5
function rounder(odds) {

  if (odds == null) {
    return null
  }

  else {
    return 5*Math.round(odds/5)
  }

}

// takes in pregame books data
// cleans each one by rounding, checks for consensus book as well
// if consensus odds not present last book is taken as consensus
exports.getNbaBookOdds = function (books) {

  var cleanedBooks = []
  var consensus = false
  var consensus_book_array = []

  // looping through each book and grabbing data
  for (var i = 0; i < books.length; i++) {

    const book = books[i]

    // consensus odds
    if (book.Sportsbook == "Consensus") {
      consensus = true
      const true_odds = feeRemover(book.HomeMoneyLine,book.AwayMoneyLine)

      consensus_book_array.push({
        sportsbook: book.Sportsbook,
        sportsbookId: book.SportsbookId,
        updated: book.Updated,
        homeOdds: rounder(true_odds.true_home),
        awayOdds: rounder(true_odds.true_away),
        homeSpread: book.HomePointSpread,
        awaySpread: book.AwayPointSpread,
        homeSpreadOdds: 100,
        awaySpreadOdds: 100,
        over: book.OverUnder,
        under: book.OverUnder,
        overOdds: 100,
        underOdds: 100,
        oddType: 'pregame'
      })

    }

    else {
      cleanedBooks.push({
        sportsbook: book.Sportsbook,
        sportsbookId: book.SportsbookId,
        updated: book.Updated,
        homeOdds: rounder(book.HomeMoneyLine),
        awayOdds: rounder(book.AwayMoneyLine),
        homeSpread: book.HomePointSpread,
        awaySpread: book.AwayPointSpread,
        homeSpreadOdds: rounder(book.HomePointSpreadPayout),
        awaySpreadOdds: rounder(book.AwayPointSpreadPayout),
        over: book.OverUnder,
        under: book.OverUnder,
        overOdds: rounder(book.OverPayout),
        underOdds: rounder(book.UnderPayout),
        oddType: 'pregame'

      })
    }

  } // end loop

  // take first book as consensus
  if (consensus == false) {
    last_book = cleanedBooks.shift()
    const true_odds = feeSoccerRemover(last_book.Home_Odds, last_book.Draw_Odds, last_book.Away_Odds)
    consensus_book_array.push({
      sportsbook: last_book.Sportsbook,
      sportsbookId: last_book.SportsbookId,
      updated: last_book.Updated,
      homeOdds: rounder(true_odds.true_home),
      awayOdds: rounder(true_odds.true_away),
      drawOdds: rounder(true_odds.true_draw),
      homeSpread: last_book.Home_Spread,
      awaySpread: last_book.Away_Spread,
      homeSpreadOdds: 100,
      awaySpreadOdds: 100,
      over: last_book.Over,
      under: last_book.Under,
      overOdds: 100,
      underOdds: 100,
      oddType: 'pregame'
    })
  }

  consensus_book = consensus_book_array[0]

  return {cleanedBooks, consensus_book, consensus}

}
