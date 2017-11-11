/* eslint-disable import/prefer-default-export */

/**
 * Global states.
 * - IDLE: Player is not playing.  Show demos, enticements, etc.
 * - PLAYING: Player is playing.  See PlayState.
 * @type {Object}
 */
export const PlayerState = {
  IDLE: 'idle',
  PLAYING: 'playing',
  DONE: 'done',
};

export const Player0Keys = {
  a: 0,
  s: 1,
  d: 2,
  f: 3,
};

export const Player1Keys = {
  k: 0,
  l: 1,
  ';': 2,
  ':': 2,
  '\'': 3,
  '"': 3,
};

export const PLAY_TIME = 20;
