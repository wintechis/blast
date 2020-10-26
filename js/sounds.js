var soundl1 = new Audio("sounds/long/smb_stage_clear.wav");
var soundl2 = new Audio("sounds/long/Crowd_3.mp3");
var soundl3 = new Audio("sounds/long/Fanfare-sound.mp3");
var soundl4 = new Audio("sounds/long/Trumpet-sound.mp3");
var soundl5 = new Audio("sounds/long/zeldas-melee.mp3");
var soundl6 = new Audio("sounds/long/asdfasdfasdfsdafasdf_1.mp3");
var sounds1 = new Audio("sounds/short/Mario-coin-sound.mp3");
var sounds2 = new Audio("sounds/short/Mario-jump-sound.mp3");
var sounds3 = new Audio("sounds/short/Plop.mp3");
var sounds4 = new Audio("sounds/short/Boing-sound-effect.mp3");
var sounds5 = new Audio("sounds/short/Jump.mp3");
var sounds6 = new Audio("sounds/short/Pew.mp3");
var sounds7 = new Audio("sounds/short/Clown-horn-once-beep.mp3");
var sounds8 = new Audio("sounds/short/env_bird_kakko.mp3");
var sounds9 = new Audio("sounds/short/zelda-oot-heyaaaah.mp3");
var sounds10 = new Audio("sounds/short/yahaha.mp3");
var sounds11 = new Audio("sounds/short/ssbb_crowd_gasp3_1.mp3");
var sounds12 = new Audio("sounds/short/magic_immune.mp3");
var sounddraw1 = new Audio ("sounds/long/smb_bowserfalls.wav");
var sounddraw2 = new Audio ("sounds/long/wilhelm.wav");
var sounddraw3 = new Audio ("sounds/long/zelda-mm-goron-caindo.mp3");
var sounddraw4 = new Audio ("sounds/long/boss-dies.mp3");


var soundsCheerful = [soundl1, soundl2, soundl3, soundl4, soundl5, soundl6];
var soundsSad = [sounddraw1, sounddraw2, sounddraw2, sounddraw4, sounddraw3, sounddraw4];
var soundsNotifiers = [sounds1, sounds2, sounds3, sounds4, sounds5, sounds6, sounds7, sounds8, sounds9, sounds10, sounds11, sounds12];

function playRandomSoundFromCategory(category){
    var soundArray;
    switch (category) {
        case "happy":
            soundArray = soundsCheerful;
            break;
        case "sad":
            soundArray = soundsSad;
            break;
        case "notifier":
            soundArray = soundsNotifiers;
            break;
    }

    var index = Math.random() * soundArray.length | 0;

    soundArray[index].play();

}