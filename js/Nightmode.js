function NightMode(canvas, spritePos, containerWidth) {
    this.spritePos = spritePos;
    this.canvas = canvas;
    this.canvasCtx = canvas.getContext('2d');
    this.xPos = containerWidth - 50;
    this.yPos = 30;
    this.currentPhase = 0;
    this.opacity = 0;
    this.containerWidth = containerWidth;
    this.stars = [];
    this.drawStars = false;
    this.placeStars();
};

NightMode.config = {
    FADE_SPEED: 0.035,
    HEIGHT: 40,
    MOON_SPEED: 0.25,
    NUM_STARS: 2,
    STAR_SIZE: 9,
    STAR_SPEED: 0.3,
    STAR_MAX_Y: 70,
    WIDTH: 20
};

NightMode.phases = [140, 120, 100, 60, 40, 20, 0];

NightMode.prototype = {
    update: function(activated, delta) {
        if (activated && this.opacity == 0) {
            this.currentPhase++;

            if (this.currentPhase >= NightMode.phases.length) {
                this.currentPhase = 0;
            }
        }

        if (activated && (this.opacity < 1 || this.opacity == 0)) {
            this.opacity += NightMode.config.FADE_SPEED;
        } 
        else if (this.opacity > 0) {
            this.opacity -= NightMode.config.FADE_SPEED;
        }

        if (this.opacity > 0) {
            this.xPos = this.updateXPos(this.xPos, NightMode.config.MOON_SPEED);
    
            if (this.drawStars) {
                for (var i = 0; i < NightMode.config.NUM_STARS; i++) {
                    this.stars[i].x = this.updateXPos(this.stars[i].x,
                        NightMode.config.STAR_SPEED);
                }
            }
    
            this.draw();
        } 
        else {
            this.opacity = 0;
            this.placeStars();
        }
        this.drawStars = true;
    },

    updateXPos: function(currentPos, speed) {
        if (currentPos < -NightMode.config.WIDTH) {
            currentPos = this.containerWidth;
        }
        else {
            currentPos -= speed;
        }
        return currentPos;
    },

    draw: function() {
        var moonSourceWidth = this.currentPhase == 3 ? NightMode.config.WIDTH * 2 : NightMode.config.WIDTH;
        var moonSourceHeight = NightMode.config.HEIGHT;
        var moonSourceX = this.spritePos.x + NightMode.phases[this.currentPhase];
        var moonOutputWidth = moonSourceWidth;
        var starSize = NightMode.config.STAR_SIZE;
        var starSourceX = Runner.spriteDefinition.LDPI.STAR.x;

        if (BASECONFIG.IS_HIDPI) {
            moonSourceWidth *= 2;
            moonSourceHeight *= 2;
            moonSourceX = this.spritePos.x + (NightMode.phases[this.currentPhase] * 2);
            starSize *= 2;
            starSourceX = Runner.spriteDefinition.HDPI.STAR.x;
        }

        this.canvasCtx.save();
        this.canvasCtx.globalAlpha = this.opacity;

        if (this.drawStars) {
            for (var i = 0; i < NightMode.config.NUM_STARS; i++) {
                this.canvasCtx.drawImage(
                    Runner.imageSprite,
                    starSourceX, 
                    this.stars[i].sourceY, 
                    starSize, 
                    starSize,
                    Math.round(this.stars[i].x), 
                    this.stars[i].y,
                    NightMode.config.STAR_SIZE, 
                    NightMode.config.STAR_SIZE
                );
            }
        }

        this.canvasCtx.drawImage(
            Runner.imageSprite, 
            moonSourceX,
            this.spritePos.y, 
            moonSourceWidth, 
            moonSourceHeight,
            Math.round(this.xPos), 
            this.yPos,
            moonOutputWidth, 
            NightMode.config.HEIGHT
        );

        this.canvasCtx.globalAlpha = 1;
        this.canvasCtx.restore();
    },

    placeStars: function() {
        var segmentSize = Math.round(this.containerWidth / NightMode.config.NUM_STARS);

        for (var i = 0; i < NightMode.config.NUM_STARS; i++) {
            this.stars[i] = {};
            this.stars[i].x = getRandomNum(segmentSize * i, segmentSize * (i + 1));
            this.stars[i].y = getRandomNum(0, NightMode.config.STAR_MAX_Y);

            if (BASECONFIG.IS_HIDPI) {
                this.stars[i].sourceY = Runner.spriteDefinition.HDPI.STAR.y + NightMode.config.STAR_SIZE * 2 * i;
            }
            else {
                this.stars[i].sourceY = Runner.spriteDefinition.LDPI.STAR.y + NightMode.config.STAR_SIZE * i;
            }
        }
    },

    reset: function() {
        this.currentPhase = 0;
        this.opacity = 0;
        this.update(false);
    }
};