
function HorizonLine(canvas, spritePos) {
    this.spritePos = spritePos;
    this.canvas = canvas;
    this.canvasCtx = canvas.getContext('2d');
    this.sourceDimensions = {};
    this.dimensions = HorizonLine.dimensions;
    this.sourceXPos = [this.spritePos.x, this.spritePos.x + this.dimensions.WIDTH];
    this.xPos = [];
    this.yPos = 0;
    this.bumpThreshold = 0.5;

    this.setSourceDimensions();
    this.draw();
};

HorizonLine.dimensions = {
    WIDTH: 600,
    HEIGHT: 12,
    YPOS: 127
};

HorizonLine.prototype = {

    setSourceDimensions: function() {

        for (var dimension in HorizonLine.dimensions) {
            if (BASECONFIG.IS_HIDPI) {
                if (dimension != 'YPOS') {
                    this.sourceDimensions[dimension] = HorizonLine.dimensions[dimension] * 2;
                }
            }
            else {
                this.sourceDimensions[dimension] = HorizonLine.dimensions[dimension];
            }
            this.dimensions[dimension] = HorizonLine.dimensions[dimension];
        }

        this.xPos = [0, HorizonLine.dimensions.WIDTH];
        this.yPos = HorizonLine.dimensions.YPOS;
    },

    getRandomType: function() {
        return Math.random() > this.bumpThreshold ? this.dimensions.WIDTH : 0;
    },

    draw: function() {
        this.canvasCtx.drawImage(
            Runner.imageSprite, 
            this.sourceXPos[0],
            this.spritePos.y,
            this.sourceDimensions.WIDTH, 
            this.sourceDimensions.HEIGHT,
            this.xPos[0], 
            this.yPos,
            this.dimensions.WIDTH, 
            this.dimensions.HEIGHT
        );

        this.canvasCtx.drawImage(
            Runner.imageSprite, 
            this.sourceXPos[1],
            this.spritePos.y,
            this.sourceDimensions.WIDTH, 
            this.sourceDimensions.HEIGHT,
            this.xPos[1], 
            this.yPos,
            this.dimensions.WIDTH, 
            this.dimensions.HEIGHT
        );
    },

    updateXPos: function(pos, increment) {
        var line1 = pos;
        var line2 = pos == 0 ? 1 : 0;

        this.xPos[line1] -= increment;
        this.xPos[line2] = this.xPos[line1] + this.dimensions.WIDTH;

        if (this.xPos[line1] <= -this.dimensions.WIDTH) {
            this.xPos[line1] += this.dimensions.WIDTH * 2;
            this.xPos[line2] = this.xPos[line1] - this.dimensions.WIDTH;
            this.sourceXPos[line1] = this.getRandomType() + this.spritePos.x;
        }
    },

    update: function(deltaTime, speed) {
        var increment = Math.floor(speed * (BASECONFIG.FPS / 1000) * deltaTime);
        var updateXPosIndex = (this.xPos[0] <= 0) ? 0 : 1;

        this.updateXPos(updateXPosIndex, increment);
        this.draw();
    },

    reset: function() {
        this.xPos[0] = 0;
        this.xPos[1] = HorizonLine.dimensions.WIDTH;
    }
};