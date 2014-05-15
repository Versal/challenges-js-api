
var calculate = function(strategy, answer, response) {
  var scorer = window.ScoringStrategies[strategy];
  if (!scorer) throw new Error('Unknown scorer: ' + strategy);

  return scorer(answer, response);
};

var scorer = function(strategy) {
  return function(responses, answers) {

    // TODO track me!!!
    if (!_.isArray(responses)) throw new Error('responses argument must be an array');
    if (responses.length !== answers.length) throw new Error('responses argument must have same length as answers');

    var scores = [];
    var totalScore = 0;
    for (var i=0; i<answers.length; i++) {
      scores[i] = calculate(strategy, answers[i], responses[i]);
      totalScore += scores[i];
    }

    return {responses: responses, scores: scores, totalScore: totalScore};
  }
};

// TEMP (:
window.ChallengesApi = window.ChallengesApi || {
  strict: scorer('strict'),
  partial: scorer('partial'),
  subset: scorer('subset'),
  range: scorer('range')
}
