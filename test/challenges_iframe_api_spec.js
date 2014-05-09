describe(ChallengesIframeApi, function() {
  it('reads the challenges from the attributes', function(done) {
    var challenges = [{prompt: 'Sky?', answers: 'blue', scoring: 'strict'}];

    var iframeApi = new ChallengesIframeApi(function(options) {
      chai.expect(options.challenges).to.deep.equal(challenges);
      done();
    });

    window.postMessage({event: 'attributesChanged', data: {'vs-challenges': challenges}}, '*');
  });

  it('reads the scoring from the learnerState', function(done) {
    var scoring = {responses: ['blue'], scores: [1], totalScore: 1};

    var iframeApi = new ChallengesIframeApi(function(options) {
      chai.expect(options.scoring).to.deep.equal(scoring);
      done();
    });

    window.postMessage({event: 'learnerStateChanged', data: {'vs-scores': scoring}}, '*');
  });
});
