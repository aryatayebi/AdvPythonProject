const {epl_teams_abrv, epl_teams_display_names, nba_teams_display_names} = require('./team_names.js');

exports.getEnglandDays = function (number_of_days) {

  var today = new Date()

  Date.prototype.addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      date.setHours(date.getHours() - 5); // English Date
      var new_day = date.getFullYear()+ "-"+ (date.getMonth()+1) + "-" + date.getDate()
      return new_day;
  }

  api_days = []

  var prev_days = 1

  // changes made to get previous days
  if (number_of_days < 0) {
    number_of_days = number_of_days * -1
    prev_days = -1
  }

  for (var i = 0; i < number_of_days; i++){
    api_days.push(today.addDays(i*prev_days))
  }

  return api_days

}

exports.getUSDays = function (number_of_days) {

  var today = new Date()

  Date.prototype.addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      date.setHours(date.getHours() - 10); // US Date
      var new_day = date.getFullYear()+ "-"+ (date.getMonth()+1) + "-" + date.getDate()
      return new_day;
  }

  api_days = []

  var prev_days = 1

  // changes made to get previous days
  if (number_of_days < 0) {
    number_of_days = number_of_days * -1
    prev_days = -1
  }

  for (var i = 0; i < number_of_days; i++){
    api_days.push(today.addDays(i*prev_days))
  }

  return api_days

}


exports.getGameIDandTeams = function (home, away, gameTime, tag) {
  var dt = new Date(gameTime)
  var id = ''
  var homeTeam = home
  var awayTeam = away

  year = dt.getFullYear()
  month = dt.getMonth()+1
  day = dt.getDate()

  if (tag == 'EPL') {
    id = epl_teams_abrv[home]+epl_teams_abrv[away]+month+day+year
    homeTeam = epl_teams_display_names[home]
    awayTeam = epl_teams_display_names[away]
  }
  if (tag == 'NBA'){
    id = home+away+month+day+year
    homeTeam = nba_teams_display_names[home]
    awayTeam = nba_teams_display_names[away]
  }

  return {homeTeam, awayTeam, id}

}
