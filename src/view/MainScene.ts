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
    stairs!: Phaser.GameObjects.Sprite;
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

        // Initialize UI Container
        this.uiContainer = new UiContainer(this, () => this.onSpinCallBack(), this.soundManager);
        // // Initialize Slots
        this.slot = new Slots(this, this.uiContainer,() => this.onResultCallBack(), this.soundManager);
        // Initialize UI Popups
        this.uiPopups = new UiPopups(this, this.uiContainer, this.soundManager);

        this.mainContainer.add([this.slot, this.uiContainer, this.uiPopups]);

        this.centerLine = new Phaser.GameObjects.Sprite(this, width/1.9, height/1.9, "centerLine").setScale(0.8)
        this,this.mainContainer.add(this.centerLine)

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
        console.log("SpinCall");
        
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
                this.time.delayedCall(2000, () => {
                    if(ResultData.playerData.currentWining > 0){
                        console.log("have won animation run")
                        this.playwinningArrowAnimation();
                    }
                }, [], this);   
                this.uiContainer.currentWiningText.setText(ResultData.playerData.currentWining.toFixed(2));
                currentGameData.currentBalance = ResultData.playerData.Balance;
                let betValue = (initData.gameData.Bets[currentGameData.currentBetIndex]) * 20
                let jackpot = ResultData.gameData.jackpot
                let winAmount = ResultData.gameData.WinAmout;  
                let newBalance = currentGameData.currentBalance 
                this.uiContainer.currentBalanceText.setText(newBalance.toString());
                const freeSpinCount = ResultData.gameData.freeSpinCount;
                // Check if freeSpinCount is greater than 1
                if (freeSpinCount >=1) {
                    this.freeSpinPopup(freeSpinCount, 'freeSpinPopup')
                    this.uiContainer.freeSpininit(freeSpinCount)
                    this.tweens.add({
                        targets: this.uiContainer.freeSpinText,
                        scaleX: 1.3, 
                        scaleY: 1.3, 
                        duration: 800, // Duration of the scale effect
                        yoyo: true, 
                        repeat: -1, 
                        ease: 'Sine.easeInOut' // Easing function
                    });
                } else {
                    // If count is 1 or less, ensure text is scaled normally
                    this.uiContainer.freeSpininit(freeSpinCount)
                }
                if (winAmount >= 10 * betValue && winAmount < 15 * betValue) {
                 // Big Win Popup
                 this.showWinPopup(winAmount, 'bigWinPopup')
                } else if (winAmount >= 15 * betValue && winAmount < 20 * betValue) {
                    // HugeWinPopup
                    this.showWinPopup(winAmount, 'hugeWinPopup')
                } else if (winAmount >= 20 * betValue && winAmount < 25 * betValue) {
                    //MegawinPopup
                    this.showWinPopup(winAmount, 'megaWinPopup')
                } else if(jackpot > 0) {
                   //jackpot Condition
                   this.showWinPopup(winAmount, 'jackpotPopup')
                }
            });
            setTimeout(() => {
                this.slot.stopTween();
            }, 1000);
        }
    }

    /**
     * @method freeSpinPopup
     * @description Displays a popup showing the win amount with an increment animation and different sprites
     * @param freeSpinCount The amount won to display in the popup
     * @param spriteKey The key of the sprite to display in the popup
     */
    freeSpinPopup(freeSpinCount: number, spriteKey: string) {
        
        // Create the popup background
        const inputOverlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x2a1820, 0.95)
        .setOrigin(0, 0)
        .setDepth(9) // Set depth to be below the popup but above game elements
        .setInteractive() // Make it interactive to block all input events
        inputOverlay.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            // Prevent default action on pointerdown to block interaction
            pointer.event.stopPropagation();
        });
        // Create the sprite based on the key provided
        const winSprite = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, spriteKey).setDepth(11);
        if(!this.uiContainer.isAutoSpinning){
        }
        // Create the text object to display win amount
        const freeText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, '0', {
            font: '55px',
            color: '#000000'
        }).setDepth(11).setOrigin(0.5);
        // Tween to animate the text increment from 0 to winAmount
        this.tweens.addCounter({
            from: 0,
            to: freeSpinCount,
            duration: 200, // Duration of the animation in milliseconds
            onUpdate: (tween) => {
                const value = Math.floor(tween.getValue());
                freeText.setText(value.toString());
            },
            onComplete: () => {
                const startButton = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 80, 'freeSpinStartButton').setDepth(11).setScale(0.5, 0.5).setInteractive();
                startButton.on("pointerdown", () => {
                            inputOverlay.destroy();
                            freeText.destroy();
                            winSprite.destroy();
                            startButton.destroy();
                            Globals.Socket?.sendMessage("SPIN", { currentBet: currentGameData.currentBetIndex, currentLines: 20, spins: 1 });
                            currentGameData.currentBalance -= initData.gameData.Bets[currentGameData.currentBetIndex];
                            // this.currentBalanceText.updateLabelText(currentGameData.currentBalance.toFixed(2));
                            this.onSpinCallBack();
                });
                if(this.uiContainer.isAutoSpinning){
                this.time.delayedCall(3000, () => {
                    inputOverlay.destroy();
                    freeText.destroy();
                    winSprite.destroy();
                });
                }
            }
        });
    }

    /**
     * @method showWinPopup
     * @description Displays a popup showing the win amount with an increment animation and different sprites
     * @param winAmount The amount won to display in the popup
     * @param spriteKey The key of the sprite to display in the popup
     */
    showWinPopup(winAmount: number, spriteKey: string) {
        // Create the popup background
        const inputOverlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x2a1820, 0.95)
        .setOrigin(0, 0)
        .setDepth(15) // Set depth to be below the popup but above game elements
        .setInteractive() // Make it interactive to block all input events
        inputOverlay.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            // Prevent default action on pointerdown to block interaction
            pointer.event.stopPropagation();
        });
        let winSprite: any
        if(spriteKey === "jackpotPopup"){
            winSprite = this.add.sprite(this.cameras.main.centerX - 125, this.cameras.main.centerY - 250, spriteKey).setDepth(15);
        }else if(spriteKey === "hugeWinPopup"){
            winSprite = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 120, spriteKey).setDepth(15);
        } else{
            winSprite = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY - 50, spriteKey).setDepth(15);
        }
      
        // Create the text object to display win amount
        const winText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, '0', {
            font: '55px',
            color: '#000000'
        }).setDepth(15).setOrigin(0.5);

        // Tween to animate the text increment from 0 to winAmount
        this.tweens.addCounter({
            from: 0,
            to: winAmount,
            duration: 500, // Duration of the animation in milliseconds
            onUpdate: (tween) => {
                const value = Math.floor(tween.getValue());
                winText.setText(value.toString());
            },
            onComplete: () => {
                // Automatically close the popup after a few seconds
                this.time.delayedCall(4000, () => {
                    inputOverlay.destroy();
                    winText.destroy();
                    winSprite.destroy();
                });
            }
        });
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
        ).setDepth(15).setScale(0.8); // Ensure it's on top
        this.winningLine.play('winningLineAnimation');

        console.log(this.winningLine);
        
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
