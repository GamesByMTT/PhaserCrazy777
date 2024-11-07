import { Scene, GameObjects, Scale } from 'phaser';
import { Slots } from '../scripts/Slots';
import { UiContainer } from '../scripts/UiContainer';
import { LineGenerator, Lines } from '../scripts/Lines';
import { UiPopups } from '../scripts/UiPopup';
import LineSymbols from '../scripts/LineSymbols';
import { Globals, ResultData, currentGameData, initData } from '../scripts/Globals';
import { gameConfig } from '../scripts/appconfig';
import BonusScene from './BonusScene';
import SoundManager from '../scripts/SoundManager';

export default class MainScene extends Scene {
    slot!: Slots;
    Background!: Phaser.GameObjects.Sprite
    slotFrame!: Phaser.GameObjects.Sprite;
    fristFrameBg!: Phaser.GameObjects.Sprite;
    seconOuterFrame!: Phaser.GameObjects.Sprite;
    reelBg!: Phaser.GameObjects.Sprite;
    ReelFrame!: Phaser.GameObjects.Sprite;
    smallBoxx!: Phaser.GameObjects.Sprite;
    SmallBoxxReel!: Phaser.GameObjects.Sprite;
    goldenBar!: Phaser.GameObjects.Sprite; 
    centerLine!: Phaser.GameObjects.Sprite;
    triangleanim1!: Phaser.GameObjects.Sprite
    triangleanim2!: Phaser.GameObjects.Sprite
    triangleanim3!: Phaser.GameObjects.Sprite;
    triangleanim4!: Phaser.GameObjects.Sprite;
    triangleanim5!: Phaser.GameObjects.Sprite;
    triangleanim6!: Phaser.GameObjects.Sprite;
    redBox!: Phaser.GameObjects.Sprite;
    redSmallBox!: Phaser.GameObjects.Sprite;
    lineGenerator!: LineGenerator;
    soundManager!: SoundManager
    uiContainer!: UiContainer;
    uiPopups!: UiPopups;
    lineSymbols!: LineSymbols
    onSpinSound!: Phaser.Sound.BaseSound
    logo!: Phaser.GameObjects.Sprite
    WheelawardText!: Phaser.GameObjects.Sprite
    private mainContainer!: Phaser.GameObjects.Container;
    private winningLine: Phaser.GameObjects.Sprite | null = null;
    private freeSpinInterval: NodeJS.Timeout | null = null;

    constructor() {
        super({ key: 'MainScene' });
    }
    /**
     * @method create method used to create scene and add graphics respective to the x and y coordinates
     */
    create() {
        console.log("MainScene Create");
        
        // Set up the background
        const { width, height } = this.cameras.main;
        // Initialize main container
        const bbgOverLay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0xffffff, 0.25).setOrigin(0)
        this.mainContainer = this.add.container();
        this.soundManager = new SoundManager(this)
       
        this.Background = new Phaser.GameObjects.Sprite(this, width/2, height/2, "Background")
        this.mainContainer.add(this.Background)
      
        this.logo = new Phaser.GameObjects.Sprite(this, width * 0.1, height/2 - 400, "gamelogo").setScale(0.7)
        this.fristFrameBg = new Phaser.GameObjects.Sprite(this, width/1.9, height/2, "fristFrameBg").setDisplaySize(1500, 550)
        this.seconOuterFrame = new Phaser.GameObjects.Sprite(this, width/1.9, height/1.96, "seconOuterFrame").setDisplaySize(1500, 520);
        this.redBox = new Phaser.GameObjects.Sprite(this, width/1.7, height/7, "redBox").setScale(0.8)
        this.redSmallBox = new Phaser.GameObjects.Sprite(this, width/1.26, height/7, "redSmallBox").setDisplaySize(493, 275)
        this.reelBg = new Phaser.GameObjects.Sprite(this, width/2.4, height/1.95, "reelBg").setDisplaySize(1050, 520)
        this.ReelFrame = new Phaser.GameObjects.Sprite(this, width/2.405, height/1.945, "ReelFrame").setDisplaySize(1100, 520);
        this.smallBoxx = new Phaser.GameObjects.Sprite(this, width/1.255, height/1.95, "smallBoxx").setDisplaySize(400, 410)
        this.SmallBoxxReel = new Phaser.GameObjects.Sprite(this, width/1.26, height/ 1.9, "SmallBoxxReel").setDisplaySize(400, 430),
        this.goldenBar = new Phaser.GameObjects.Sprite(this, width/1.255, height/1.9, "goldenBar").setDisplaySize(380, 380);
        this.centerLine = new Phaser.GameObjects.Sprite(this, width/1.9, height/1.9, "centerLine").setScale(0.8)
        this.WheelawardText = new Phaser.GameObjects.Sprite(this, width * 0.795, height * 0.26, "Wheelaward").setScale(0.7)
        const traingleFrame: Phaser.Types.Animations.AnimationFrame[] = [];
        for (let i = 0; i < 48; i++) {
            traingleFrame.push({ key: `Triangle${i}` });
        }
        this.anims.create({
            key: 'Traingle',
            frames: traingleFrame,
            frameRate: 60, // Adjust as needed
            repeat: -1 // Play only once
        });
        this.triangleanim1 = new Phaser.GameObjects.Sprite(this, width/1.37, height/3.25, "Trainagle0").setScale(0.8);
        this.triangleanim2 = new Phaser.GameObjects.Sprite(this, width/1.245, height/3.25, "Trainagle0").setScale(0.8);
        this.triangleanim3 = new Phaser.GameObjects.Sprite(this, width/1.14, height/3.25, "Trainagle0").setScale(0.8);
        this.triangleanim4 = new Phaser.GameObjects.Sprite(this, width/1.37, height/1.395, "Trainagle0").setScale(0.8).setAngle(180);
        this.triangleanim5 = new Phaser.GameObjects.Sprite(this, width/1.245, height/1.395, "Trainagle0").setScale(0.8).setAngle(180);
        this.triangleanim6 = new Phaser.GameObjects.Sprite(this, width/1.14, height/1.395, "Trainagle0").setScale(0.8).setAngle(180);
        this.triangleanim1.play("Traingle")
        this.triangleanim2.play("Traingle")
        this.triangleanim3.play("Traingle")
        this.triangleanim4.play("Traingle")
        this.triangleanim5.play("Traingle")
        this.triangleanim6.play("Traingle")
        this.mainContainer.add([this.logo, this.reelBg, this.SmallBoxxReel,this.ReelFrame, this.seconOuterFrame,  this.redBox, this.redSmallBox, this.fristFrameBg, this.WheelawardText, this.goldenBar, this.smallBoxx, this.triangleanim1, this.triangleanim2, this.triangleanim3, this.triangleanim4, this.triangleanim5, this.triangleanim6])
        this.soundManager.playSound("backgroundMusic")
        // // Initialize Slots
        this.slot = new Slots(this, this.uiContainer,() => this.onResultCallBack(), this.soundManager);
        this.mainContainer.add(this.slot)
        this.centerLine = new Phaser.GameObjects.Sprite(this, width/1.9, height/1.9, "centerLine").setScale(0.8)
        this,this.mainContainer.add(this.centerLine)
        // Initialize UI Container
        this.uiContainer = new UiContainer(this, () => this.onSpinCallBack(), this.soundManager);
        // Initialize UI Popups
        this.uiPopups = new UiPopups(this, this.uiContainer, this.soundManager);
        this.mainContainer.add([ this.uiContainer, this.uiPopups]);
        this.setupFocusBlurEvents()
    }

    update(time: number, delta: number) {
        this.slot.update(time, delta);
    }

    /**
     * @method onResultCallBack Change Sprite and Lines
     * @description update the spirte of Spin Button after reel spin and emit Lines number to show the line after wiining
     */
    onResultCallBack() {
        const onSpinMusic = "onSpin"
        this.uiContainer.onSpin(false);
        this.soundManager.stopSound(onSpinMusic)
        // this.lineGenerator.showLines(ResultData.gameData.linesToEmit);
    }
    /**
     * @method onSpinCallBack Move reel
     * @description on spin button click moves the reel on Seen and hide the lines if there are any
     */
    onSpinCallBack() {
        const onSpinMusic = "onSpin"
        this.soundManager.playSound(onSpinMusic)
        this.slot.moveReel();
        
        if(this.winningLine?.active){
            this.winningLine.stop();
            this.winningLine.destroy();
        }
    }

    onAutoSpinStop(){
        this.uiContainer.onSpin(false);
        this.uiContainer.spinBtn
    }

    /**
     * @method recievedMessage called from MyEmitter
     * @param msgType ResultData
     * @param msgParams any
     * @description this method is used to update the value of textlabels like Balance, winAmount freeSpin which we are reciving after every spin
     */
    recievedMessage(msgType: string, msgParams: any) {
        if (msgType === 'ResultData') {
            this.time.delayedCall(3500, () => {    
                if(ResultData.playerData.currentWining > 0){
                    this.playwinningArrowAnimation();
                }if(ResultData.gameData.isFreeSpin){
                    this.reelBg.setTexture("blueReelBg");
                    this.SmallBoxxReel.setTexture("goldenRespin");
                }else{
                    this.reelBg.setTexture("reelBg");
                    this.SmallBoxxReel.setTexture("SmallBoxxReel");
                }
                if(ResultData.gameData.isFreeSpin){
                    this.reelBg.setTexture("blueReelBg");
                    this.SmallBoxxReel.setTexture("goldenRespin");
    
                    // Start free spins if not already running
                    if (!this.freeSpinInterval && ResultData.gameData.freeSpinCount > 0) {
                        this.startFreeSpins();
                        this.uiContainer.onSpin(true);
                    }
                } else {
                    this.reelBg.setTexture("reelBg");
                    this.SmallBoxxReel.setTexture("SmallBoxxReel");
                }
                this.uiContainer.currentWiningText.setText(ResultData.playerData.currentWining.toFixed(2));
                currentGameData.currentBalance = ResultData.playerData.Balance;
                let newBalance = currentGameData.currentBalance 
                this.uiContainer.currentBalanceText.setText(newBalance.toString());
            });
            setTimeout(() => {
                this.slot.stopTween();
            }, 1000);
        }
    }

    private startFreeSpins() {
        console.log("Starting Free Spins Sequence");
        // Clear any existing interval
        if (this.freeSpinInterval) {
            clearInterval(this.freeSpinInterval);
        }
        // Set interval for free spins
        this.freeSpinInterval = setInterval(() => {
            if (ResultData.gameData.freeSpinCount > 0) {
                console.log(`Free Spin triggered. Remaining: ${ResultData.gameData.freeSpinCount}`);
                this.onSpinCallBack();
                ResultData.gameData.freeSpinCount--;
                setTimeout(() => {
                    this.slot.stopTween();
                }, 1000);
            } else {
                // End free spins
                this.endFreeSpins();
            }
        }, 6000); // Adjust timing as needed (6 seconds between spins)
    }
    
    private endFreeSpins() {
        console.log("Ending Free Spins Sequence");
        
        // Clear the interval
        if (this.freeSpinInterval) {
            clearInterval(this.freeSpinInterval);
            this.freeSpinInterval = null;
        }
        // Reset free spin state
        ResultData.gameData.isFreeSpin = false;
        this.reelBg.setTexture("reelBg");
        this.SmallBoxxReel.setTexture("SmallBoxxReel");
        this.uiContainer.onSpin(false);
        // Any additional cleanup or end-of-free-spins logic
        this.handleFreeSpinsEnd();
    }
    
    private handleFreeSpinsEnd() {
        console.log("Free spins completed");
        // Add any additional end-of-free-spins logic here
    }

    // Winning Animatiom over Symbol lineGlow
    playwinningArrowAnimation() {
        const respinFrames: Phaser.Types.Animations.AnimationFrame[] = [];
        for (let i = 0; i < 24; i++) {
            respinFrames.push({ key: `lineBar${i}` });
        }
        this.anims.create({
            key: 'winningLineAnimation',
            frames: respinFrames,
            frameRate: 24, // Adjust as needed
            repeat: -1 // Play only once
        });
        this.winningLine = this.add.sprite(
            this.cameras.main.width / 1.9,
            this.cameras.main.height / 1.9,
            `lineBar0` // Initial frame
        ).setDepth(5).setScale(0.8); // Ensure it's on top
        this.winningLine.play('winningLineAnimation');
    }

    private setupFocusBlurEvents() {
        window.addEventListener('blur', () => {
                this.soundManager.stopSound('backgroundMusic');
        });

        window.addEventListener('focus', () => {
            if(currentGameData.musicMode){
                this.soundManager.playSound('backgroundMusic');
            }
        });
    }
}
