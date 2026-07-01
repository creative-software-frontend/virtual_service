const test = require('node:test');
const assert = require('node:assert/strict');
const { validateEventJoin } = require('../src/services/eventJoinService');

test('allows free events without balance checks', () => {
  const result = validateEventJoin({
    event: { status: 'active', capacity: 10, entry_fee: 0 },
    currentParticipantCount: 2,
    hasJoined: false,
    userBalance: 0,
  });

  assert.equal(result.allowed, true);
  assert.equal(result.fee, 0);
});

test('blocks paid events when the user balance is too low', () => {
  assert.throws(() => {
    validateEventJoin({
      event: { status: 'active', capacity: 10, entry_fee: 150 },
      currentParticipantCount: 2,
      hasJoined: false,
      userBalance: 100,
    });
  }, /Insufficient wallet balance/);
});

test('allows paid events when the user balance is sufficient', () => {
  const result = validateEventJoin({
    event: { status: 'active', capacity: 10, entry_fee: 150 },
    currentParticipantCount: 2,
    hasJoined: false,
    userBalance: 200,
  });

  assert.equal(result.allowed, true);
  assert.equal(result.fee, 150);
});
