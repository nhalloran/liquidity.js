//time constants
var durations = [
    { n: 'INITIAL_PULLBACK', t: 8000 },
    { n: 'SPLIT_TO_DEPTS', t: 6000 },
    { n: 'GROUP_BY_CAT', t: 5000 },
    { n: 'BACK_TO_DEPTS', t: 8000 },
    { n: 'POVERTY', t: 8000 },
    { n: 'PRE_SECURITY', t: 900 },
    { n: 'SECURITY', t: 8000 },
    { n: 'COLOR_CONTRACTS', t: 28000 },
    { n: 'BEHAVIORAL_HEALTH', t: 14000 },
    { n: 'CONSTRACT_NONCONTRACT', t: 8000 },
    { n: 'CONTRACTS_IMPORTANT', t: 20000 },
    { n: 'PROCUREMENT', t: 14000 },
    { n: 'PROFESSIONAL', t: 11000 },
    { n: 'RFP_REVEAL', t: 12000 },
    { n: 'BULBS', t: 8000 },
    { n: 'CURSES', t: 8000 },
    { n: 'PRESCRIPT', t: 8000 },
    { n: 'RESOURSES', t: 8000 }
];

var consts = {
    START: 0
};

var t = consts.START;

durations.forEach(function(dur) {

  consts[dur.n + '_START'] = t;
  consts[dur.n + '_DUR'] = dur.t;
  t += dur.t;
});

module.exports = consts;


//SECURITY_START= POVERTY_START + POVERTY_DUR + PRE_SECURITY_DUR,
