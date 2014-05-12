var strategies = {
  strict: function(prompt, response) {
    return _.isEqual(prompt, response) ? 1 : 0;
  },

  partial: function(prompt, response) {
    if (!_.isArray(prompt)) throw new Error('`prompt` argument must be an array for the `partial` scoring strategy)');
    if (!_.isArray(response)) throw new Error('`response` argument must be an array for the `partial` scoring strategy');
    if (prompt.length === 0) return 0;

    good = _.select(_.zip(prompt, response), function(zip){
      return _.isEqual(zip[0], zip[1]);
    });
    return good.length / prompt.length;
  },

  subset: function(prompt, response) {
    if (!_.isArray(prompt)) throw new Error('`prompt` argument must be an array for the `subset` scoring strategy)');
    if (!_.isArray(response)) throw new Error('`response` argument must be an array for the `subset` scoring strategy');
    if (prompt.length === 0) return 0;

    common = _.filter(response, function(responseAnswer) {
      return _.some(prompt, function(promptAnswer) {
        _.isEqual(responseAnswer, promptAnswer);
      });
    });

    return common.length / prompt.length;
  },

  range: function(prompt, response) {
    if (!_.isArray(prompt)) throw new Error('`prompt` argument must be an array for the `range` scoring strategy');
    if (prompt.length !== 2) throw new Error('`prompt` argument must be an array of two numbers for the `range` scoring strategy');
    if (!_.isNumber(response)) throw new Error('`response` argument must be a number for the `range` scoring strategy');

    var start = prompt[0];
    var end = prompt[1];

    return (start <= response && response <= end) ? 1 : 0;
  }
};

var calculate = function(strategy, answer, response) {
  var scorer = strategies[strategy];
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

window.ChallengesApi = {
  strict: scorer('strict'),
  partial: scorer('partial'),
  subset: scorer('subset'),
  range: scorer('range')
}
