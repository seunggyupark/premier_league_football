import { data } from "./data";

// A win = 3 points
// A draw = 1 point
// A defeat = 0 points

// Clean, well structured.
// Validate my output, result and data structure

// Calculate points and goal difference at the end.

interface TeamStats {
  rank: Number;
  teamName: String;
  wins: Number;
  draws: Number;
  losses: Number;
  goalsFor: Number;
  goalsAgainst: Number;
  goalDifference: Number;
  points: Number;
}

const premierLeagueTable: TeamStats[] = [];

// data.rounds.forEach(matchDay => {
//   matchDay.matches.forEach(match => {
//   })
// })
