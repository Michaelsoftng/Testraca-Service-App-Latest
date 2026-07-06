export const WEBRTC_ACTIONS = {
  OFFER: 'webrtc_offer',
  ANSWER: 'webrtc_answer',
  ICE_CANDIDATE: 'webrtc_ice_candidate',
  HANGUP: 'webrtc_hangup',
};

const WEBRTC_ACTION_SET = new Set(Object.values(WEBRTC_ACTIONS));

export function isWebRTCAction(action) {
  return WEBRTC_ACTION_SET.has(String(action || '').trim());
}

export function getMediaConfig(callType) {
  return {
    audio: true,
    video: callType === 'video',
  };
}

/**
 * @param {Object} params
 * @param {string} params.action
 * @param {string} params.senderId
 * @param {string} [params.senderName]
 * @param {string} params.consultationId
 * @param {'audio'|'video'} params.callType
 * @param {any} [params.sdp]
 * @param {any} [params.candidate]
 * @param {string} [params.reason]
 */
export function buildSessionPayload(params = {}) {
  const {
    action,
    senderId,
    senderName,
    consultationId,
    callType,
    sdp,
    candidate,
    reason,
  } = params;

  return {
    action,
    origin: 'user',
    sender_id: senderId,
    sender_name: senderName || '',
    room_id: `labtraca-${consultationId}`,
    call_type: callType,
    sdp,
    candidate,
    reason,
    timestamp: new Date().toISOString(),
  };
}
