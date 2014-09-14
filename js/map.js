function Map(parameters) {
    this.width = null;
    this.height = null;
    this.content = null;

    this.init(parameters);
}

Map.prototype.inBounds = function(x, y) {
    return (x >= 0 && x < this.width && y >= 0 && y < this.height);
};


Map.prototype.init = function(parameters) {
    this.width = parameters.width;
    this.height = parameters.height;

    return this;
};

Map.prototype.outOfBounds = function(x, y) {
    return (x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1);
};

Map.prototype.setContent = function(newContent) {
    if (newContent.length !== this.width || newContent[0].height !== this.height) {
        return this;
    }



    return this;
};
