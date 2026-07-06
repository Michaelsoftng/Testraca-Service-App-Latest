import { useCallback, useMemo, useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import {
  WEBRTC_ACTIONS,
  buildSessionPayload,
  getMediaConfig,
  isWebRTCAction,
} from './webrtcSignaling';

let webrtcLib: any = null;
try {
  webrtcLib = require('react-native-webrtc');
} catch (error) {
  webrtcLib = null;
}

type CallType = 'audio' | 'video';

type SessionSender = (payload: any) => void;

const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useWebRTCCall = ({
  consultationId,
  senderId,
  senderName,
  sendSession,
}: {
  consultationId: string;
  senderId: string;
  senderName: string;
  sendSession: SessionSender;
}) => {
  const peerRef = useRef<any>(null);
  const localStreamRef = useRef<any>(null);
  const remoteStreamRef = useRef<any>(null);
  const remotePendingCandidatesRef = useRef<any[]>([]);

  const [callType, setCallType] = useState<CallType | null>(null);
  const [callState, setCallState] = useState<'idle' | 'calling' | 'ringing' | 'in_call'>('idle');
  const [localStreamURL, setLocalStreamURL] = useState<string | null>(null);
  const [remoteStreamURL, setRemoteStreamURL] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [webrtcAvailable] = useState(!!webrtcLib);

  const ensurePermissions = useCallback(async (type: CallType) => {
    if (Platform.OS !== 'android') {
      return true;
    }

    const permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
    if (type === 'video') {
      permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
    }

    const result = await PermissionsAndroid.requestMultiple(permissions);
    return permissions.every((permission) => result[permission] === PermissionsAndroid.RESULTS.GRANTED);
  }, []);

  const resetCallState = useCallback(() => {
    setCallState('idle');
    setCallType(null);
    setLocalStreamURL(null);
    setRemoteStreamURL(null);
    setIsMuted(false);
    setIsCameraEnabled(true);
  }, []);

  const cleanupMedia = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track: any) => track.stop());
      localStreamRef.current = null;
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track: any) => track.stop());
      remoteStreamRef.current = null;
    }

    if (peerRef.current) {
      peerRef.current.onicecandidate = null;
      peerRef.current.ontrack = null;
      peerRef.current.close();
      peerRef.current = null;
    }

    remotePendingCandidatesRef.current = [];
  }, []);

  const ensurePeer = useCallback(async (type: CallType) => {
    if (!webrtcLib) {
      throw new Error('react-native-webrtc is not installed.');
    }

    if (peerRef.current) {
      return peerRef.current;
    }

    const {
      RTCPeerConnection,
      mediaDevices,
      RTCIceCandidate,
    } = webrtcLib;

    const granted = await ensurePermissions(type);
    if (!granted) {
      throw new Error('Required media permissions were not granted.');
    }

    const mediaConfig = getMediaConfig(type);
    localStreamRef.current = await mediaDevices.getUserMedia(mediaConfig);
    setLocalStreamURL(localStreamRef.current?.toURL?.() ?? null);

    const pc = new RTCPeerConnection(iceServers);

    localStreamRef.current.getTracks().forEach((track: any) => {
      pc.addTrack(track, localStreamRef.current);
    });

    pc.ontrack = (event: any) => {
      const [remoteStream] = event.streams || [];
      if (remoteStream) {
        remoteStreamRef.current = remoteStream;
        setRemoteStreamURL(remoteStream.toURL());
      }
    };

    pc.onicecandidate = (event: any) => {
      if (!event.candidate) return;
      sendSession(
        buildSessionPayload({
          action: WEBRTC_ACTIONS.ICE_CANDIDATE,
          senderId,
          senderName,
          consultationId,
          callType: type,
          candidate: event.candidate,
        })
      );
    };

    peerRef.current = pc;

    // If remote candidates arrived before remote description, apply now.
    if (remotePendingCandidatesRef.current.length > 0) {
      for (const candidate of remotePendingCandidatesRef.current) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
      remotePendingCandidatesRef.current = [];
    }

    return pc;
  }, [consultationId, ensurePermissions, sendSession, senderId, senderName]);

  const startCall = useCallback(async (type: CallType) => {
    if (!webrtcLib) {
      throw new Error('react-native-webrtc is not installed.');
    }

    setCallType(type);
    setCallState('calling');

    const { RTCSessionDescription } = webrtcLib;
    const pc = await ensurePeer(type);
    const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: type === 'video' });
    await pc.setLocalDescription(new RTCSessionDescription(offer));

    sendSession(
      buildSessionPayload({
        action: WEBRTC_ACTIONS.OFFER,
        senderId,
        senderName,
        consultationId,
        callType: type,
        sdp: offer,
      })
    );
  }, [consultationId, ensurePeer, sendSession, senderId, senderName]);

  const acceptOffer = useCallback(async (payload: any) => {
    if (!webrtcLib) {
      throw new Error('react-native-webrtc is not installed.');
    }

    const type: CallType = payload?.call_type === 'video' ? 'video' : 'audio';
    setCallType(type);
    setCallState('ringing');

    const { RTCSessionDescription } = webrtcLib;
    const pc = await ensurePeer(type);

    if (payload?.sdp) {
      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
    }

    const answer = await pc.createAnswer({ offerToReceiveAudio: true, offerToReceiveVideo: type === 'video' });
    await pc.setLocalDescription(new RTCSessionDescription(answer));

    sendSession(
      buildSessionPayload({
        action: WEBRTC_ACTIONS.ANSWER,
        senderId,
        senderName,
        consultationId,
        callType: type,
        sdp: answer,
      })
    );

    setCallState('in_call');
  }, [consultationId, ensurePeer, sendSession, senderId, senderName]);

  const applyAnswer = useCallback(async (payload: any) => {
    if (!webrtcLib || !peerRef.current || !payload?.sdp) {
      return;
    }

    const { RTCSessionDescription } = webrtcLib;
    await peerRef.current.setRemoteDescription(new RTCSessionDescription(payload.sdp));
    setCallState('in_call');
  }, []);

  const addIceCandidate = useCallback(async (payload: any) => {
    if (!webrtcLib || !payload?.candidate) {
      return;
    }

    const { RTCIceCandidate } = webrtcLib;
    if (peerRef.current && peerRef.current.remoteDescription) {
      await peerRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
      return;
    }

    remotePendingCandidatesRef.current.push(payload.candidate);
  }, []);

  const endCall = useCallback((sendHangup = true) => {
    if (sendHangup) {
      sendSession(
        buildSessionPayload({
          action: WEBRTC_ACTIONS.HANGUP,
          senderId,
          senderName,
          consultationId,
          callType: callType || 'audio',
          reason: 'Call ended',
        })
      );
    }

    cleanupMedia();
    resetCallState();
  }, [callType, cleanupMedia, consultationId, resetCallState, sendSession, senderId, senderName]);

  const toggleMute = useCallback(() => {
    if (!localStreamRef.current) return;
    const next = !isMuted;
    localStreamRef.current.getAudioTracks().forEach((track: any) => {
      track.enabled = !next;
    });
    setIsMuted(next);
  }, [isMuted]);

  const toggleCamera = useCallback(() => {
    if (!localStreamRef.current || callType !== 'video') return;
    const next = !isCameraEnabled;
    localStreamRef.current.getVideoTracks().forEach((track: any) => {
      track.enabled = next;
    });
    setIsCameraEnabled(next);
  }, [callType, isCameraEnabled]);

  const handleSessionSignal = useCallback(async (payload: any, currentUserId: string) => {
    const action = payload?.action;
    if (!isWebRTCAction(action)) {
      return;
    }

    // Ignore self-reflected signaling envelopes to avoid duplicate handling.
    if (String(payload?.sender_id || '') === String(currentUserId || '')) {
      return;
    }

    if (action === WEBRTC_ACTIONS.OFFER) {
      await acceptOffer(payload);
      return;
    }

    if (action === WEBRTC_ACTIONS.ANSWER) {
      await applyAnswer(payload);
      return;
    }

    if (action === WEBRTC_ACTIONS.ICE_CANDIDATE) {
      await addIceCandidate(payload);
      return;
    }

    if (action === WEBRTC_ACTIONS.HANGUP) {
      endCall(false);
    }
  }, [acceptOffer, addIceCandidate, applyAnswer, endCall]);

  const RTCView = useMemo(() => webrtcLib?.RTCView, []);

  return {
    webrtcAvailable,
    callType,
    callState,
    localStreamURL,
    remoteStreamURL,
    isMuted,
    isCameraEnabled,
    RTCView,
    startCall,
    endCall,
    toggleMute,
    toggleCamera,
    handleSessionSignal,
  };
};
