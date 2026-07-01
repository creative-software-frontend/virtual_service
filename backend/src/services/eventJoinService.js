function validateEventJoin({ event, currentParticipantCount, hasJoined, userBalance }) {
  if (!event) {
    const error = new Error('Event not found');
    error.statusCode = 404;
    throw error;
  }

  if (event.status !== 'active') {
    const error = new Error('This event is not active');
    error.statusCode = 400;
    throw error;
  }

  if (hasJoined) {
    const error = new Error('You have already joined this event');
    error.statusCode = 400;
    throw error;
  }

  const capacity = Number(event.capacity || 0);
  if (capacity > 0 && Number(currentParticipantCount || 0) >= capacity) {
    const error = new Error('This event has reached its capacity limit');
    error.statusCode = 400;
    throw error;
  }

  const fee = Number(event.entry_fee || 0);
  if (fee > 0 && Number(userBalance || 0) < fee) {
    const error = new Error('Insufficient wallet balance.');
    error.statusCode = 400;
    throw error;
  }

  return { allowed: true, fee };
}

module.exports = {
  validateEventJoin,
};
