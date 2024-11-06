import Phaser from 'phaser';
import { Globals, ResultData, currentGameData, initData } from "./Globals";
import { gameConfig } from './appconfig';
import { UiContainer } from './UiContainer';
import { Easing, Tween } from "@tweenjs/tween.js"; // If using TWEEN for animations
import SoundManager from './SoundManager';
import Disconnection from './Disconnection';
export class Slots extends Phaser.GameObjects.Container {
    slotMask: Phaser.GameObjects.Graphics;
    SoundManager: SoundManager
    slotSymbols: any[][] = [];
    moveSlots: boolean = false;
    uiContainer!: UiContainer;
    // winingMusic!: Phaser.Sound.BaseSound
    resultCallBack: () => void;
    slotFrame!: Phaser.GameObjects.Sprite;
    private maskWidth: number;
    private maskHeight: number;
    private symbolKeys: string[];
    private symbolWidth: number;
    private symbolHeight: number;
    private spacingX: number;
    private spacingY: number;
    private reelContainers: Phaser.GameObjects.Container[] = [];
    private reelTweens: Phaser.Tweens.Tween[] = []; // Array for reel tweens
    private connectionTimeout!: Phaser.Time.TimerEvent;
    constructor(scene: Phaser.Scene, uiContainer: UiContainer, callback: () => void, SoundManager : SoundManager) {
        super(scene);
        this.resultCallBack = callback;
        const totalReels = 4;
        this.uiContainer = uiContainer;
        this.SoundManager = SoundManager
        this.slotMask = new Phaser.GameObjects.Graphics(scene);
        
        this.maskWidth = gameConfig.scale.width / 1.2;
        this.maskHeight = 470;
        this.slotMask.fillStyle(0xffffff, 1);
        this.slotMask.fillRoundedRect(0, 0, this.maskWidth, this.maskHeight, 20);
        // mask Position set
        this.slotMask.setPosition(
            gameConfig.scale.width / 6.5,
            gameConfig.scale.height / 3.4
        );
        // Filter and pick symbol keys based on the criteria
        this.symbolKeys = this.getFilteredSymbolKeys();
        
        // Assume all symbols have the same width and height
        const exampleSymbol = new Phaser.GameObjects.Sprite(scene, 0, 0, this.getRandomSymbolKey());
        this.symbolWidth = exampleSymbol.displayWidth/ 4;
        this.symbolHeight = exampleSymbol.displayHeight/4;
        this.spacingX = 345; // Add some spacing
        this.spacingY = 260; // Add some spacing
        const startPos = {
            x: gameConfig.scale.width / 4.2,
            y: gameConfig.scale.height / 2.5 
        };

         // Create separate mask for 4th reel
         const fourthReelMask = new Phaser.GameObjects.Graphics(scene);
         const fourthReelMaskHeight = 360; // Adjust this value as needed
         fourthReelMask.fillStyle(0xffffff, 1);
         fourthReelMask.fillRoundedRect(0, 0, this.maskWidth / 4, fourthReelMaskHeight, 20);
         fourthReelMask.setPosition(
             gameConfig.scale.width / 6.5 + (this.spacingX * 3), // Adjust position for 4th reel
             gameConfig.scale.height * 0.348
         );

        const totalSymbol = 7;
        const visibleSymbol = 3;
        const startIndex = 1;
        const initialYOffset = (totalSymbol - startIndex - visibleSymbol) * this.spacingY;
        for (let i = 0; i < totalReels; i++) { // 5 columns
            const reelContainer = new Phaser.GameObjects.Container(scene);
            this.reelContainers.push(reelContainer); // Store the container for future use
            
            this.slotSymbols[i] = [];
            for (let j = 0; j < 64; j++) {
                let symbolKey = this.getRandomSymbolKey(); // Get a random symbol key
                let slot = new Symbols(scene, symbolKey, { x: i, y: j }, reelContainer);
                let symbolScale 
                if(i == 3){
                    slot.symbol.setMask(new Phaser.Display.Masks.GeometryMask(scene, fourthReelMask));
                    this.spacingX = 360;
                    this.spacingY = 220;
                    symbolScale = 0.75;
                    slot.symbol.setPosition(
                        startPos.x + i * this.spacingX,
                        startPos.y + j * this.spacingY + 20
                    ); 
                }else{
                    slot.symbol.setMask(new Phaser.Display.Masks.GeometryMask(scene, this.slotMask));
                    symbolScale = 0.9
                    slot.symbol.setPosition(
                        startPos.x + i * this.spacingX,
                        startPos.y + j * this.spacingY
                    );
                }
                
                slot.symbol.setScale(symbolScale)
                slot.startX = slot.symbol.x;
                slot.startY = slot.symbol.y;
                this.slotSymbols[i].push(slot);                
                reelContainer.add(slot.symbol)
            }
            reelContainer.height = this.slotSymbols[i].length * this.spacingY; 
            reelContainer.setPosition(reelContainer.x, -initialYOffset);
            this.add(reelContainer); 
        }
    }

    getFilteredSymbolKeys(): string[] {
        // Filter symbols based on the pattern
        const allSprites = Globals.resources;
        const filteredSprites = Object.keys(allSprites).filter(spriteName => {
            const regex = /^slots\d+_\d+$/; // Regex to match "slots<number>_<number>"
            if (regex.test(spriteName)) {
                const [, num1, num2] = spriteName.match(/^slots(\d+)_(\d+)$/) || [];
                const number1 = parseInt(num1, 10);
                const number2 = parseInt(num2, 10);
                // Check if the numbers are within the desired range
                return number1 >= 1 && number1 <= 14 && number2 >= 1 && number2 <= 14;
            }
            return false;
        });

        return filteredSprites;
    }

    getRandomSymbolKey(): string {
        const randomIndex = Phaser.Math.Between(0, this.symbolKeys.length - 1);        
        return this.symbolKeys[randomIndex];
    }

    moveReel() {    
        const initialYOffset = (this.slotSymbols[0][0].totalSymbol - this.slotSymbols[0][0].visibleSymbol - this.slotSymbols[0][0].startIndex) * this.slotSymbols[0][0].spacingY;
        setTimeout(() => {
            for (let i = 0; i < this.reelContainers.length; i++) {
                this.reelContainers[i].setPosition(
                    this.reelContainers[i].x,
                    -initialYOffset // Set the reel's position back to the calculated start position
                );
            }    
        }, 100);
         
        for (let i = 0; i < this.reelContainers.length; i++) {
            for (let j = 0; j < this.reelContainers[i].list.length; j++) {
                setTimeout(() => {
                    this.slotSymbols[i][j].startMoving = true;
                    if (j < 4) this.slotSymbols[i][j].stopAnimation();
                }, 100 * i);
            }
        }
        this.moveSlots = true;
        setTimeout(() => {
            for (let i = 0; i < this.reelContainers.length; i++) {
                this.startReelSpin(i);
            }
        }, 100);

        //Setting the Timer for response wait
        this.connectionTimeout = this.scene.time.addEvent({
            delay: 20000, // 20 seconds (adjust as needed)
            callback: this.showDisconnectionScene,
            callbackScope: this // Important for the 'this' context
        });
    }


    startReelSpin(reelIndex: number) {
        if (this.reelTweens[reelIndex]) {
            this.reelTweens[reelIndex].stop(); 
        }
        const reel = this.reelContainers[reelIndex];
        const spinDistance = currentGameData.turboMode ? (this.spacingY * 13) : this.spacingY * 10; // Adjust this value for desired spin speed 
        // reel.y -= 1;
        this.reelTweens[reelIndex] = this.scene.tweens.add({
            targets: reel,
            y: `+=${spinDistance}`, // Spin relative to current position
            duration: 800, 
            repeat: -1, 
            onComplete: () => {},
        });
    }

    stopReel(reelIndex: number) {
        const reel = this.reelContainers[reelIndex];
        const reelDelay = 300 * (reelIndex + 1);
        // Get the middle row value for this reel
        const middleRowValue = ResultData.gameData.resultSymbols[1][reelIndex];
        let targetY = 0; // default position
        // Only change position if this reel has non-zero value in middle row
        if (middleRowValue !== 0) {
            if (reelIndex === 3) {
                targetY = -100; // Specific spacing for fourth reel
            } else {
                targetY = -120; // Regular spacing for other reels
            }
        }
        this.scene.tweens.add({
            targets: reel,
            y: targetY,
            duration: 800,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                if (this.reelTweens[reelIndex]) {
                    this.reelTweens[reelIndex].stop();
                }
                if (reelIndex === this.reelContainers.length - 1) {
                    this.playWinAnimations();
                    this.moveSlots = false;
                }
            },
            delay: reelDelay
        });
    
        if (this.connectionTimeout) {
            this.connectionTimeout.remove(false);
        }
        
        for (let j = 0; j < this.slotSymbols[reelIndex].length; j++) {
            this.slotSymbols[reelIndex][j].endTween();
        }
    }

    showDisconnectionScene(){
        Globals.SceneHandler?.addScene("Disconnection", Disconnection, true)
    }

    update(time: number, delta: number) {
        if (this.slotSymbols && this.moveSlots) {
            for (let i = 0; i < this.reelContainers.length; i++) {
            }
        }
    }

    
    stopTween() {
        for (let i = 0; i < this.reelContainers.length; i++) { 
            this.stopReel(i);   
        }
    }

    // Function to play win animations
    playWinAnimations() {
        this.resultCallBack(); // Call the result callback
                let y = 0;
                const row = ResultData.gameData.resultSymbols[1];
             
                
                for (let x = 0; x < row.length; x++) {
                    const elementId = row[x];
                    if (elementId !== '0') {
                        if (this.slotSymbols[y] && this.slotSymbols[y][x]) {
                            // this.playSymbolAnimation(x, y, elementId);
                        }
                        // Play win sound for each non-zero symbol
                        this.winMusic("winMusic");
                    } else {
                        // console.log(`Skipping animation for symbol at (${y}, ${x})`);
                    }
                }
    }

    playSymbolAnimation(y: number, x: number, elementId: string) {
        const symbol = this.slotSymbols[y][x];
        // const animationId = `symbol_anim_${elementId}`;
        const animationId = `symbol_anim_${elementId}`;
         // Remove existing animation if it exists
        if (this.scene.anims.exists(animationId)) {
            this.scene.anims.remove(animationId);
        }
        if (!this.scene.anims.exists(animationId)) {
            let textureKeys: string[] = [];
            for (let i = 0; i < 24; i++) {
                const textureKey = `slots${elementId}_${i}`; // Use animationColor here
                if (this.scene.textures.exists(textureKey)) {
                    textureKeys.push(textureKey);
                }
            }
            if (textureKeys.length > 0) {
                this.scene.anims.create({
                    key: animationId,
                    frames: textureKeys.map(key => ({ key })),
                    frameRate: 20,
                    repeat: -1
                });
            }
        }

        if (this.scene.anims.exists(animationId)) {
            symbol.playAnimation(animationId);
        } else {
        }
    }
    // winMusic
    winMusic(key: string){
        this.SoundManager.playSound(key)
    }
}

// @Sybols CLass
class Symbols {
    symbol: Phaser.GameObjects.Sprite;
    startY: number = 0;
    startX: number = 0;
    startMoving: boolean = false;
    index: { x: number; y: number };
    totalSymbol : number = 14;
    visibleSymbol: number = 3;
    startIndex: number = 1;
    spacingY : number = 204;
    initialYOffset : number = 0
    scene: Phaser.Scene;
    private isMobile: boolean;
    reelContainer: Phaser.GameObjects.Container;
    private bouncingTween: Phaser.Tweens.Tween | null = null;

    constructor(scene: Phaser.Scene, symbolKey: string, index: { x: number; y: number }, reelContainer: Phaser.GameObjects.Container) {
        this.scene = scene;
        this.index = index;
        this.reelContainer = reelContainer;
        const updatedSymbolKey = this.updateKeyToZero(symbolKey);
        this.symbol = new Phaser.GameObjects.Sprite(scene, 0, 0, updatedSymbolKey);
        this.symbol.setOrigin(0.5, 0.5);
        this.isMobile = scene.sys.game.device.os.android || scene.sys.game.device.os.iOS;

        const textures: string[] = [];
        for (let i = 0; i < 28; i++) {
            textures.push(`${symbolKey}`);
        }

        this.scene.anims.create({
            key: `${symbolKey}`,
            frames: textures.map((texture) => ({ key: texture })),
            frameRate: 20,
            repeat: -1,
        });
    }

   
    updateKeyToZero(symbolKey: string): string {
        const match = symbolKey.match(/^slots(\d+)_\d+$/);
        if (match) {
            const xValue = match[1];
            return `slots${xValue}_0`;
        } else {
            return symbolKey; // Return the original key if format is incorrect
        }
    }

    playAnimation(animationId: any) {
        this.symbol.play(animationId);
    }

    stopAnimation() {
        this.symbol.anims.stop();
        this.symbol.setFrame(0);
    }

    endTween() {
        if (this.index.y < 3) {
            let textureKeys: string[] = [];
            // Retrieve the elementId based on index
            const elementId = ResultData.gameData.resultSymbols[this.index.y][this.index.x];
                for (let i = 0; i < 24; i++) {
                    const textureKey = `slots${elementId}_${i}`;
                    // Check if the texture exists in cache
                    if (this.scene.textures.exists(textureKey)) {
                        textureKeys.push(textureKey);                        
                    } 
                }
                // Check if we have texture keys to set
                    if (textureKeys.length > 0) {
                    // Create animation with the collected texture keys
                        this.scene.anims.create({
                            key: `symbol_anim_${elementId}`,
                            frames: textureKeys.map(key => ({ key })),
                            frameRate: 20,
                            repeat: -1
                        });
                    // Set the texture to the first key and start the animation
                        this.symbol.setTexture(textureKeys[0]);           
                    }
        }
        // Stop moving and start tweening the sprite's position
        this.scene.time.delayedCall(50, () => { // Example: 50ms delay
            this.startMoving = false; 
        });
    }

  
}
