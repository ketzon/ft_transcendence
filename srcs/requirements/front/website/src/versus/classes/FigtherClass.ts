import { canvas, c, gravity } from "../constants";
import { Sprite } from "./SpriteClass";

// Fighter herite de Sprite (methodes et attributs), fighter overwrite les attributs / methodes si elles sont redefinies ici.
export class Figther extends Sprite {
    constructor({ position, velocity, color, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}, sprites, attackBox = { offset: {}, width: undefined, height: undefined}}) {
         super({ //super calls the constructor of the parent (here its Sprite)
            position,
            imageSrc,
            scale,
            framesMax,
            offset,
         })
         this.velocity = velocity;
         this.height = 150;
         this.width = 50;
         this.lastKey;
         this.attackBox = {
            position: {x: this.position.x, y: this.position.y},
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
         };
         this.color = color;
         this.isAtacking;
         this.health = 100;

         this.framesCurrent = 0;
         this.framesElapsed = 0;
         this.framesHold = 10;

         this.sprites = sprites;
         // This will create a image file for our different states.
         for (const sprite in this.sprites)
        {
            sprites[sprite].image = new Image(); // This create a new variable Img in the object
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    update() {
        this.draw();
        this.animateFrame();

        // This makes the attack box follow the player x & y position and apply offset for attackbox direction.
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        // This will draw the attackBox and player hitbox
        // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // Draw the movements.
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        // Check if we are not falling under the map, if so we set velocity to 0.
        if ((this.position.y + this.height) + this.velocity.y >= canvas.height - 96)
        {
            this.velocity.y = 0;
            this.position.y = 330; // this is to force position on the ground to prevent a switching sprite glitch between fall/idle
        }
        // If player is not on the ground we will add gravity to make him fall.
        else
        {
            this.velocity.y += gravity;
        }
    }

    //Player will attack on keyboard event, then to reset we use setTimeout so the attack duration is limited.
    attack() {
        this.switchSprite("attack1");
        this.isAtacking = true;
    }

    //This makes easier to swap between different sprites and set the right framesMax of the sprite.
    switchSprite(sprite) {

        // We use this so other sprites do not overwrite the attack
        // Then they can overwrite it when the animaion is complete, it make the attack animation stop
        if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1)
        {
            return;
        }
        switch (sprite)
        {
            case "idle":
                if (this.image !== this.sprites.idle.image)
                {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "run":
                if (this.image !== this.sprites.run.image)
                {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "jump":
                if (this.image !== this.sprites.jump.image)
                {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "fall":
                if (this.image !== this.sprites.fall.image)
                {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "attack1":
                if (this.image !== this.sprites.attack1.image)
                {
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.framesCurrent = 0;
                }
                break;
        }
    }

    // Class attributes
    velocity: {x: number, y: number} // This is what will be changed when we press key.
    height: number; // Default height of a player.
    width: number; // Default width of a player.
    lastKey: string; // Last Key pressed by player.
    attackBox: {// The player attack box.
        position: {x: number, y: number}, // Position of the attack box (will follow the player in update function).
        offset: {x: number, y: number}, // Will draw the attack box based on the offset direction.
        width: number, // Width of the attack hitbox.
        height: number // Height of the attack hitbbox.
    };
    color: string // Player color.
    isAtacking: boolean; // Value changing when player hits attack key.
    health: number; // Player HP.
    sprites; // We will store sprites img and framesMax of our different imgs.
}
