import test from 'node:test';
import assert from 'node:assert/strict';

import {
  WEBRTC_ACTIONS,
  isWebRTCAction,
  getMediaConfig,
  buildSessionPayload,
} from '../webrtcSignaling.js';

test('isWebRTCAction returns true for supported actions', () => {
  assert.equal(isWebRTCAction(WEBRTC_ACTIONS.OFFER), true);
  assert.equal(isWebRTCAction(WEBRTC_ACTIONS.ANSWER), true);
  assert.equal(isWebRTCAction(WEBRTC_ACTIONS.ICE_CANDIDATE), true);
  assert.equal(isWebRTCAction(WEBRTC_ACTIONS.HANGUP), true);
});

test('isWebRTCAction returns false for unknown actions', () => {
  assert.equal(isWebRTCAction('typing'), false);
  assert.equal(isWebRTCAction(''), false);
  assert.equal(isWebRTCAction(undefined), false);
});

test('getMediaConfig sets video based on call type', () => {
  assert.deepEqual(getMediaConfig('audio'), { audio: true, video: false });
  assert.deepEqual(getMediaConfig('video'), { audio: true, video: true });
});

test('buildSessionPayload builds expected payload envelope', () => {
  const payload = buildSessionPayload({
    action: WEBRTC_ACTIONS.OFFER,
    senderId: 'doc-1',
    senderName: 'Doctor One',
    consultationId: 'abc-123',
    callType: 'video',
    sdp: { type: 'offer', sdp: 'v=0' },
  });

  assert.equal(payload.action, WEBRTC_ACTIONS.OFFER);
  assert.equal(payload.origin, 'user');
  assert.equal(payload.sender_id, 'doc-1');
  assert.equal(payload.room_id, 'labtraca-abc-123');
  assert.equal(payload.call_type, 'video');
  assert.deepEqual(payload.sdp, { type: 'offer', sdp: 'v=0' });
  assert.ok(typeof payload.timestamp === 'string' && payload.timestamp.length > 0);
});
