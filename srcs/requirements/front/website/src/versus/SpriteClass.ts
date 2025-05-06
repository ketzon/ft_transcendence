import { canvas, c, gravity } from "./constants";

export class Sprite {
    constructor({ position, velocity, color, offset}) {
         this.position = position;
         this.velocity = velocity;
         this.height = 150;
         this.width = 50;
         this.lastKey;
         this.attackBox = {
            position: {x: this.position.x, y: this.position.y},
            offset: offset,
            width: 100,
            height: 50
         };
         this.color = color;
         this.isAtacking;
    }

    draw() {
        //Drawing the player box.
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        //Drawing the player's attack box if he is attacking.
        if (this.isAtacking)
        {
            c.fillStyle = "green";
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }
    }

    update() {
        this.draw();

        // This makes the attack box follow the player x & y position and apply offset for attackbox direction.
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        // Draw the movements.
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        // Check if we are not falling under the map, if so we set velocity to 0.
        if ((this.position.y + this.height) + this.velocity.y >= canvas.height)
        {
            this.velocity.y = 0;
        }
        // If player is not on the ground we will add gravity to make him fall.
        else
        {
            this.velocity.y += gravity;
        }
    }

    //Player will attack on keyboard event, then to reset we use setTimeout so the attack duration is limited.
    attack() {
        this.isAtacking = true;
        setTimeout(() => {
            this.isAtacking = false;
        }, 100);
    }

    // Class attributes
    position: {x: number, y: number} // This will be de spawn position.
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
}
