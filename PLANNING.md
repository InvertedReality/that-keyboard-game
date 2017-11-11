# that-piano-game: Planning

Overalls layout:
- Suspenders should be nice and wide to discribute the weight of all the junk in the pockets
- Also should have lots of pockets, need to be able to hold lots of junk
- TODO: Determine material
  - Typical brownish canvasy material is always good
  - But denim is fashionable
  - Maybe we can intercut the two?  Or would that be too ugly?

Over all layout:
- Original had a column layout, so we should do that.
  - Given 2 player, we'll be fine doing that.
- I think `FGHJ` is good for the inputs, just to be annoying.
  - On second thought, `ASDF` for player 1, `KL;'` for player 2.  Local 2 player!  Hope your keyboard supports that many simulpresses.
- Won't bother with demo stuff for now.
- If I can, add obnoxious combo animations.

Some values to start with:
- Play time: 60 seconds
- Penalty time: 2 seconds


## Play Flow

- Enter.
- Initialize players.
- Wait for player to decide to begin.
- Player is initialized:
  - New set of keys, timer set to maximum amount of time.
  - Waits for player to hit first key.
- Player hits first key:
  - Timer starts decrementing.
- Player continues hitting keys.
- Player misses key:
  - Player is blocked from hitting more keys for a small time, while the key flashes red.
  - Timer continues decrementing.
- Once Timer ticks past 0, Play ends.
  - Player is shown their score.

State model:
- Per player:
  - `state: 'idle' | 'playing' | 'done'`
    - `'idle'`: Show demo stuff.
    - `'playing'`: Human is playing.
    - `'done'`: Post-mortem.
  - `keys: [{ id, key }]`: Array of piano keys to show.
  - `blockedKey: ?number`: What key, if any, the player hit when messing up.
  - `blockedTimerId: ?id`: Id of the block timer.
  - `timeLeftTimerId: ?id`: Id of the Time Left timer.
  - `timeLeft: number`: How much time the Player has left.
    - NOTE: This is present only because we actually show the player how much time they have left.
  - `keysScored: number`: How many keys has the player gotten.

Actions:
- _Initialize Player_: Reset a Player to an initial state.
  - Basically just an alias to the _Idle Player_ action.
- _Idle Player_: Set a Player into the `idle` player-state.
- _Begin Player Play_:
  - Set Player into the `playing` player-state.
  - Set `timeLeft` to max time.
- _Hit Key_: A Player hits a key:
  - If the Player's `blockedTimeLeft` is non-0, do nothing.
  - If `timerRunning` is false, start Timer:
    - On tick, Timer dispatches _Update Player Time Left_.
    - On end, Timer dispatches _End Player Play_.
  - If the Key so hit is not the Current Key, _Block Player_.
  - Otherwise, _Advance Player_.
- _Block Player_: A Player is Blocked due to a given Key:
  - Set the `blockedKey` to the given key.
  - Set a Block Timer to _Unblock Player_, setting `blockedTimerId` to its id.
- _Unblock Player_: A Player is Unblocked:
  - Set `blockedKey` to null.
  - Null out `blockedTimerId`.
- _Advance Player_: A Player advances to the next key:
  - Rotate a new key on to `keys`.
- _End Player Play_:
  - _Unblock Player_.
  - Set a Player into the `done` player-state.
  - Set timerRunning to `false`.
  - Set Timer to _Initialize Player_.
