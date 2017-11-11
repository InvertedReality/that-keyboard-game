// Setup some sound stuff.
// NOTE: Currently loads the WHOLE THING
// import Tone from 'tone';
import PolySynth from 'tone/Tone/instrument/PolySynth';
import Synth from 'tone/Tone/instrument/Synth';

import tunes from './tunes';

const players = {};


function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function rotate(array) {
  array.push(array.shift());
  return array;
}

function getPlayerStuff(playerId) {
  const playerStuff = players[playerId];

  if (!playerStuff) {
    console.warn(`Cannot get player stuff for player "${playerId}"!`);
    return null;
  }

  return playerStuff;
}


export function initSoundStuffForPlayer(playerId) {
  const playerStuff = {};
  players[playerId] = playerStuff;

  // playerStuff.synth = new Tone.PolySynth(2, Tone.Synth);
  playerStuff.synth = new PolySynth(2, Synth);
  playerStuff.synth.toMaster();
  playerStuff.synth.set({
    oscillator: {
      type: 'fatsawtooth',
    },
  });

  playerStuff.tune = sample(tunes);
}

export function pickTune(playerId) {
  const playerStuff = getPlayerStuff(playerId);
  if (!playerStuff) return;

  playerStuff.tune = sample(tunes);
}

export function playNextNote(playerId) {
  const playerStuff = getPlayerStuff(playerId);
  if (!playerStuff) return;

  playerStuff.synth.triggerAttackRelease(playerStuff.tune[0], 0.25);
  rotate(playerStuff.tune);
}
