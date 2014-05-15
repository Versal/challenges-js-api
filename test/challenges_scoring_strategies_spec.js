describe(ScoringStrategies, function() {

  describe('strict', function() {
    it('should score 100% given a match', function() {
      var examples = [
        {
          question: 1,
          answer: 1
        },
        {
          question: 'a',
          answer: 'a'
        },
        {
          question: { a: 123 },
          answer: { a: 123 }
        },
        {
          question: [ 1 ],
          answer: [ 1 ]
        },
        {
          question: [ 'b' ],
          answer: [ 'b' ]
        },
        {
          question: [ { b: 234 } ],
          answer: [ { b: 234 } ]
        }
      ];
      _.each(examples, function(example) {
        var score = ScoringStrategies.strict(example.question, example.answer);
        score.should.eq(1);
      });
    });

    it('should score 0% given a mismatch', function() {
      var examples = [
        {
          question: 1,
          answer: 2
        },
        {
          question: 'a',
          answer: 'b'
        },
        {
          question: { a: 123 },
          answer: { b: 234 }
        },
        {
          question: [ 1 ],
          answer: [ 2 ]
        },
        {
          question: [ 'b' ],
          answer: [ 'c' ]
        },
        {
          question: [ { b: 234 } ],
          answer: [ { b: 345 } ]
        }
      ];
      _.each(examples, function(example) {
        var score = ScoringStrategies.strict(example.question, example.answer);
        score.should.eq(0);
      });
    });
  });

  describe('partial', function() {
    it('should be sensitive to order', function() {
      var score = strategies.partial([1, 2, 3, 4], [4, 3, 2, 1]);
      score.should.eq(0);
    });

    it('should throw an error if the `prompt` value is not an array', function() {
      var badFn = function() {
        strategies.partial(1, [4, 3, 2, 1]);
      };
      badFn.should["throw"](/`prompt` argument must be an array for the `partial` scoring strategy/);
    });

    it('should throw an error if the `response` value is not an array', function() {
      var badFn = function() {
        strategies.partial([1, 2, 3, 4], 2);
      };
      badFn.should["throw"](/`response` argument must be an array for the `partial` scoring strategy/);
    });

    it('should score 100% given a full match', function() {
      var examples = [
        {
          question: [1, 2, 3, 4],
          answer: [1, 2, 3, 4]
        },
        {
          question: [1, 2, 3, 4],
          answer: [1, 2, 3, 4]
        },
        {
          question: ['b', 'c', 'd', 'e'],
          answer: ['b', 'c', 'd', 'e']
        },
        {
          question: [
            { b: 234 },
            { c: 345 },
            { d: 456 },
            { e: 567 }
          ],
          answer: [
            { b: 234 },
            { c: 345 },
            { d: 456 },
            { e: 567 }
          ]
        }
      ];
      _.each(examples, function(example) {
        var score = strategies.partial(example.question, example.answer);
        score.should.eq(1);
      });
    });
    it('should score 50% given half incorrect response', function() {
      var examples = [
        {
          question: [ 1, 2, 3, 4 ],
          answer: [ 1, 2, -3, -4 ]
        },
        {
          question: [ 'b', 'c', 'd', 'e' ],
          answer: [ 'b', 'c', 'D', 'E' ]
        },
        {
          question: [ { b: 234 }, { c: 345 }, { d: 456 }, { e: 567 } ],
          answer: [ { b: 234 }, { c: 345 }, { D: 567 }, { E: 678 } ]
        },
      ]
      _.each(examples, function(example) {
        var score = ScoringStrategies.partial(example.question, example.answer);
        score.should.eq(0.5);
      });
    });
    it('should score 50% given half null response', function() {
      examples = [
        {
          question: [ 1, 2, 3, 4 ],
          answer: [ 1, 2, null, null ]
        },
        {
          question: [ 'b', 'c', 'd', 'e' ],
          answer: [ 'b', 'c', null, null ]
        },
        {
          question: [ { b: 234 }, { c: 345 }, { d: 456 }, { e: 567 } ],
          answer: [ { b: 234 }, { c: 345 }, null, null ]
        }
      ]
      _.each(examples, function(example) {
        var score = ScoringStrategies.partial(example.question, example.answer);
        score.should.eq(0.5);
      });
    });
    it('should score 0% given a full mismatch', function() {
      examples = [
        {
          question: [ 1, 2, 3, 4 ],
          answer: [ 5, 6, 7, 8 ]
        },
        {
          question: [ 'b', 'c', 'd', 'e' ],
          answer: [ 'f', 'g', 'h', 'i' ]
        },
        {
          question: [ { b: 234 }, { c: 345 }, { d: 456 }, { e: 567 } ],
          answer: [ { f: 678 }, { g: 789 }, { h: 891 }, { i: 912 } ]
        }
      ]
      _.each(examples, function(example) {
        var score = ScoringStrategies.partial(example.question, example.answer);
        score.should.eq(0);
      });
    });
  });

  describe('subset', function() {

    it('should throw an error if the `prompt` value is not an array', function() {
      badFn = function() {
        strategies.subset(1, [ 4, 3, 2, 1 ]);
      };
      badFn.should.throw(/`prompt` argument must be an array for the `subset` scoring strategy/);
    });

    it('should throw an error if the `response` value is not an array', function() {
      badFn = function() {
        strategies.subset([ 1, 2, 3, 4 ], 2);
      };
      badFn.should.throw(/`response` argument must be an array for the `subset` scoring strategy/);
    });

    it('should score 100% given a full match', function() {
      examples = [
        {
          question: [ 1, 2, 3, 4 ],
          answer: [ 4, 3, 2, 1 ]
        }
    // IN THE PROCESS OF BEING CONVERTED
    //     // ,
    //     // {
    //     //   question: [ 'b', 'c', 'd', 'e' ],
    //     //   answer: [ 'e', 'd', 'c', 'b' ]
    //     // },
    //     // {
    //     //   question: [ { b: 234 }, { c: 345 }, { d: 456 }, { e: 567 } ],
    //     //   answer: [ { e: 567 }, { d: 456 }, { c: 345 }, { b: 234 } ]
    //     // }
      ]
      _.each(examples, function(example) {
        dump(example.question, example.answer);
        var score = ScoringStrategies.subset(example.question, example.answer);
        score.should.eq(1);
      });
    });
  });
});

// TO BE CONVERTED
//   it 'should score 100% given a full match', ->
//     examples = [
//       question: [ 1, 2, 3, 4 ]
//       answer: [ 4, 3, 2, 1 ]
//     ,
//       question: [ 'b', 'c', 'd', 'e' ]
//       answer: [ 'e', 'd', 'c', 'b' ]
//     ,
//       question: [ { b: 234 }, { c: 345 }, { d: 456 }, { e: 567 } ]
//       answer: [ { e: 567 }, { d: 456 }, { c: 345 }, { b: 234 } ]
//     ]
//     for example in examples
//       score = strategies.subset example.question, example.answer
//       score.should.eq 1
//
//   it 'should score 50% given half incorrect responses', ->
//     examples = [
//       question: [ 1, 2, 3, 4 ]
//       answer: [ -4, -3, 2, 1 ]
//     ,
//       question: [ 'b', 'c', 'd', 'e' ]
//       answer: [ 'b', 'c', 'D', 'E' ]
//     ,
//       question: [ { b: 234 }, { c: 345 }, { d: 456 }, { e: 567 } ]
//       answer: [ { c: 345 }, { b: 234 } ]
//     ]
//     for example in examples
//       score = strategies.subset example.question, example.answer
//       score.should.eq 0.5
//
//   it 'should score 50% given half null responses', ->
//     examples = [
//       question: [ 1, 2, 3, 4 ]
//       answer: [ 2, 1 ]
//     ,
//       question: [ 'b', 'c', 'd', 'e' ]
//       answer: [ 'c', 'b' ]
//     ,
//       question: [ { b: 234 }, { c: 345 }, { d: 456 }, { e: 567 } ]
//       answer: [ { c: 345 }, { b: 234 } ]
//     ]
//     for example in examples
//       score = strategies.subset example.question, example.answer
//       score.should.eq 0.5
//
//   it 'should score 0% given a full mismatch', ->
//     examples = [
//       question: [ 1, 2, 3, 4 ]
//       answer: []
//     ,
//       question: [ 1, 2, 3, 4 ]
//       answer: [ 8, 7, 6, 5 ]
//     ,
//       question: [ 1, 2, 3, 4 ]
//       answer: [ 8, 7 ]
//     ,
//       question: [ 'b', 'c', 'd', 'e' ]
//       answer: [ 'i', 'h', 'g', 'f' ]
//     ,
//       question: [ { b: 234 }, { c: 345 }, { d: 456 }, { e: 567 } ]
//       answer: [ { f: 678 }, { g: 789 }, { h: 891 }, { i: 912 } ]
//     ]
//     for example in examples
//       score = strategies.subset example.question, example.answer
//       score.should.eq 0
//
// describe 'range', ->
//
//   it 'should throw an error if the `prompt` value is not an array', ->
//     badFn = -> strategies.range 1, [ 4, 1 ]
//     badFn.should.throw /`prompt` argument must be an array for the `range` scoring strategy/
//
//   it 'should throw an error if the `prompt` value is not an array of two numbers', ->
//     badFn = -> strategies.range [1], 1
//     badFn.should.throw /`prompt` argument must be an array of two numbers for the `range` scoring strategy/
//
//     badFn = -> strategies.range [1, 2, 3], [ 4, 1 ]
//     badFn.should.throw /`prompt` argument must be an array of two numbers for the `range` scoring strategy/
//
//   it 'should throw an error if the `response` value is not a number', ->
//     badFn = -> strategies.range [5, 2], [ 1, 4 ]
//     badFn.should.throw /`response` argument must be a number for the `range` scoring strategy/
//
//   it 'should score 100% given a number in range', ->
//     examples = [
//       question: [ 1, 3 ]
//       answer: 1
//     ,
//       question: [ 1, 3 ]
//       answer: 2
//     ,
//       question: [ 1, 3 ]
//       answer: 2.5
//     ,
//       question: [ 1, 3 ]
//       answer: 3
//     ]
//     for example in examples
//       score = strategies.range example.question, example.answer
//       score.should.eq 1
//
//   it 'should score 0% given a number outside the range', ->
//     examples = [
//       question: [ 1, 3 ]
//       answer: 0
//     ,
//       question: [ 1, 3 ]
//       answer: 3.1
//     ,
//       question: [ 1, 3 ]
//       answer: 4
//     ]
//     for example in examples
//       score = strategies.range example.question, example.answer
//       score.should.eq 0
