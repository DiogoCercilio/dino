
function Horizon(canvas, spritePos, dimensions, gapCoefficient) {
    this.canvas = canvas;
    this.canvasCtx = this.canvas.getContext('2d');
    this.config = Horizon.config;
    this.dimensions = dimensions;
    this.gapCoefficient = gapCoefficient;
    this.obstacles = [];
    this.obstacleHistory = [];
    this.horizonOffsets = [0, 0];
    this.cloudFrequency = this.config.CLOUD_FREQUENCY;
    this.spritePos = spritePos;
    this.nightMode = null;
    this.clouds = [];
    this.cloudSpeed = this.config.BG_CLOUD_SPEED;
    this.horizonLine = null;
    this.init();
};

Horizon.config = {
    BG_CLOUD_SPEED: 0.2,
    BUMPY_THRESHOLD: .3,
    CLOUD_FREQUENCY: .5,
    HORIZON_HEIGHT: 16,
    MAX_CLOUDS: 6
};

Horizon.prototype = {
    init: function() {
        this.addCloud();
        this.horizonLine = new HorizonLine(this.canvas, this.spritePos.HORIZON);
        this.nightMode = new NightMode(this.canvas, this.spritePos.MOON, this.dimensions.WIDTH);
    },

    update: function(deltaTime, currentSpeed, updateObstacles, showNightMode) {
        this.runningTime += deltaTime;
        this.horizonLine.update(deltaTime, currentSpeed);
        this.nightMode.update(showNightMode);
        this.updateClouds(deltaTime, currentSpeed);

        if (updateObstacles) {
            this.updateObstacles(deltaTime, currentSpeed);
        }
    },

    updateClouds: function(deltaTime, speed) {
        var cloudSpeed = this.cloudSpeed / 1000 * deltaTime * speed;
        var numClouds = this.clouds.length;

        if (numClouds) {
            for (var i = numClouds - 1; i >= 0; i--) {
                this.clouds[i].update(cloudSpeed);
            }

            var lastCloud = this.clouds[numClouds - 1];

            if (numClouds < this.config.MAX_CLOUDS &&
                (this.dimensions.WIDTH - lastCloud.xPos) > lastCloud.cloudGap &&
                this.cloudFrequency > Math.random()
            ) {
                this.addCloud();
            }

            this.clouds = this.clouds.filter(function(obj) {
                return !obj.remove;
            });
        } 
        else {
            this.addCloud();
        }
    },

    updateObstacles: function(deltaTime, currentSpeed) {
        var updatedObstacles = this.obstacles.slice(0);
        var obstacle;
        var i;

        for (i = 0; i < this.obstacles.length; i++) {
            obstacle = this.obstacles[i];
            obstacle.update(deltaTime, currentSpeed);

            if (obstacle.remove) {
                updatedObstacles.shift();
            }
        }

        this.obstacles = updatedObstacles;

        if (this.obstacles.length > 0) {
            var lastObstacle = this.obstacles[this.obstacles.length - 1];

            if (lastObstacle && !lastObstacle.followingObstacleCreated && lastObstacle.isVisible() && (lastObstacle.xPos + lastObstacle.width + lastObstacle.gap) < this.dimensions.WIDTH) {
                this.addNewObstacle(currentSpeed);
                lastObstacle.followingObstacleCreated = true;
            }
        } 
        else {
            this.addNewObstacle(currentSpeed);
        }
    },

    removeFirstObstacle: function() {
        this.obstacles.shift();
    },

    addNewObstacle: function(currentSpeed) {
        var obstacleTypeIndex = getRandomNum(0, Obstacle.types.length - 1);
        var obstacleType = Obstacle.types[obstacleTypeIndex];

        if (this.duplicateObstacleCheck(obstacleType.type) || currentSpeed < obstacleType.minSpeed) {
            this.addNewObstacle(currentSpeed);
        } 
        else {
            var obstacleSpritePos = this.spritePos[obstacleType.type];
            var newObstacle = new Obstacle(this.canvasCtx, obstacleType, obstacleSpritePos, this.dimensions, this.gapCoefficient, currentSpeed, obstacleType.width);

            this.obstacles.push(newObstacle);
            this.obstacleHistory.unshift(obstacleType.type);

            if (this.obstacleHistory.length > 1) {
                this.obstacleHistory.splice(Runner.config.MAX_OBSTACLE_DUPLICATION);
            }
        }
    },

    duplicateObstacleCheck: function(nextObstacleType) {
        var duplicateCount = 0;

        for (var i = 0; i < this.obstacleHistory.length; i++) {
            duplicateCount = (this.obstacleHistory[i] == nextObstacleType) ? duplicateCount + 1 : 0;
        }
        
        return duplicateCount >= Runner.config.MAX_OBSTACLE_DUPLICATION;
    },

    reset: function() {
        this.obstacles = [];
        this.horizonLine.reset();
        this.nightMode.reset();
    },

    resize: function(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    },

    addCloud: function() {
        this.clouds.push(new Cloud(this.canvas, this.spritePos.CLOUD, this.dimensions.WIDTH));
    }
};