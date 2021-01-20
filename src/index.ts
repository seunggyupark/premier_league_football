import { data as leagueData } from "./data";

// A win = 3 points
// A draw = 1 point
// A defeat = 0 points

// GOALS:
// Result is a sorted array by points, tie breakers are
//  goalDifference, then goalsFor.
// Clean, well structured.
// Validate my output, result, and data structure
// Calculate points and goal difference at the end

interface TeamStats {
  rank: number;
  teamName: string;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

interface leagueJSON {
  name: string;
  rounds: {
    name: string;
    matches: {
      date: string;
      team1: string;
      team2: string;
      score: {
        ft: number[];
      };
    }[];
  }[];
}

// Searched the object to see if team exists, creates the team if it does not.
function addTeams(
  team1: string,
  team2: string,
  leagueObject: { [key: string]: TeamStats }
) {
  const statTemplate = {
    rank: -1,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0
  };
  if (!leagueObject[team1])
    leagueObject[team1] = { ...statTemplate, teamName: team1 };
  if (!leagueObject[team2])
    leagueObject[team2] = { ...statTemplate, teamName: team2 };
}

// Updates the stats of the teams based on each match
function updateTeamStats(
  team1: string,
  team2: string,
  score: { ft: number[] },
  leagueObject: { [key: string]: TeamStats }
) {
  if (score.ft[0] > score.ft[1]) {
    // Team A won
    leagueObject[team1].wins++;
    leagueObject[team2].losses++;
  } else if (score.ft[0] < score.ft[1]) {
    // Team B won
    leagueObject[team2].wins++;
    leagueObject[team1].losses++;
  } else {
    // Draw
    leagueObject[team2].draws++;
    leagueObject[team1].draws++;
  }

  // Add the goalsFor and goalsAgainst to the total for each team
  leagueObject[team1].goalsFor += score.ft[0];
  leagueObject[team2].goalsAgainst += score.ft[0];
  leagueObject[team2].goalsFor += score.ft[1];
  leagueObject[team1].goalsAgainst += score.ft[1];
}

// Tiebreaker comparison
function comparePoints(a: TeamStats, b: TeamStats) {
  return (
    b.points - a.points ||
    b.goalDifference - a.goalDifference ||
    b.goalsFor - a.goalsFor
  );
}

// Goes through every team to update final scores -- goalDifference and points
function updateFinalScores(leagueObject: { [key: string]: TeamStats }) {
  for (const property in leagueObject) {
    const { wins, draws, goalsFor, goalsAgainst } = leagueObject[property];
    const points: number = wins * 3 + draws;
    leagueObject[property].goalDifference = goalsFor - goalsAgainst;
    leagueObject[property].points = points;
  }
}

// Sorts leagueObject with tiebreakers
function sortLeagueObjects(leagueObject: { [key: string]: TeamStats }) {
  const sortedLeague: TeamStats[] = Object.values(leagueObject).sort((a, b) =>
    comparePoints(a, b)
  );
  // Adds the ranks to each team
  for (let i = 0; i < sortedLeague.length; i++) sortedLeague[i].rank = i + 1;
  return sortedLeague;
}

// Goes through every match to update team stats
// Then console logs the final sorted array
function parseLeagueData(data: leagueJSON) {
  const premierLeagueObject: { [key: string]: TeamStats } = {};
  data.rounds.forEach((matchDay) => {
    matchDay.matches.forEach((match) => {
      addTeams(match.team1, match.team2, premierLeagueObject);
      updateTeamStats(
        match.team1,
        match.team2,
        match.score,
        premierLeagueObject
      );
    });
  });
  updateFinalScores(premierLeagueObject);
  const sortedLeague: TeamStats[] = sortLeagueObjects(premierLeagueObject);
  console.log(sortedLeague);
}

parseLeagueData(leagueData);

// Types and resulting data structure is checked via TypeScript
// Testing is locatined in /test/test.ts

export {
  addTeams,
  sortLeagueObjects,
  updateFinalScores,
  comparePoints,
  TeamStats,
  leagueJSON
};
