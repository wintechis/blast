const soundl1 = new Audio('sounds/long/smb_stage_clear.wav');
const soundl2 = new Audio('sounds/long/Crowd_3.mp3');
const soundl3 = new Audio('sounds/long/Fanfare-sound.mp3');
const soundl4 = new Audio('sounds/long/Trumpet-sound.mp3');
const soundl5 = new Audio('sounds/long/zeldas-melee.mp3');
const soundl6 = new Audio('sounds/long/asdfasdfasdfsdafasdf_1.mp3');
const sounds1 = new Audio('sounds/short/Mario-coin-sound.mp3');
const sounds2 = new Audio('sounds/short/Mario-jump-sound.mp3');
const sounds3 = new Audio('sounds/short/Plop.mp3');
const sounds4 = new Audio('sounds/short/Boing-sound-effect.mp3');
const sounds5 = new Audio('sounds/short/Jump.mp3');
const sounds6 = new Audio('sounds/short/Pew.mp3');
const sounds7 = new Audio('sounds/short/Clown-horn-once-beep.mp3');
const sounds8 = new Audio('sounds/short/env_bird_kakko.mp3');
const sounds9 = new Audio('sounds/short/zelda-oot-heyaaaah.mp3');
const sounds10 = new Audio('sounds/short/yahaha.mp3');
const sounds11 = new Audio('sounds/short/ssbb_crowd_gasp3_1.mp3');
const sounds12 = new Audio('sounds/short/magic_immune.mp3');
const sounddraw1 = new Audio('sounds/long/smb_bowserfalls.wav');
const sounddraw2 = new Audio('sounds/long/wilhelm.wav');
const sounddraw3 = new Audio('sounds/long/zelda-mm-goron-caindo.mp3');
const sounddraw4 = new Audio('sounds/long/boss-dies.mp3');

const soundsCheerful = [soundl1, soundl2, soundl3, soundl4, soundl5, soundl6];
const soundsSad = [
  sounddraw1,
  sounddraw2,
  sounddraw2,
  sounddraw4,
  sounddraw3,
  sounddraw4,
];
const soundsNotifiers = [
  sounds1,
  sounds2,
  sounds3,
  sounds4,
  sounds5,
  sounds6,
  sounds7,
  sounds8,
  sounds9,
  sounds10,
  sounds11,
  sounds12,
];

/**
 * Play a random audio file.
 * @param {string[]} category An Array of soundfile names
 */
function playRandomSoundFromCategory(category) {
  let soundArray;
  switch (category) {
    case 'happy':
      soundArray = soundsCheerful;
      break;
    case 'sad':
      soundArray = soundsSad;
      break;
    case 'notifier':
      soundArray = soundsNotifiers;
      break;
  }

  const index = (Math.random() * soundArray.length) | 0;

  soundArray[index].play();
}
