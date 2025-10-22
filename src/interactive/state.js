const state = {
    transform:{x:0, y:0, k:1, invert:function(location){return [(location[0]-this.x)/this.k, (location[1]-this.y)/this.k]}},
    energy:1/12,
    x:0
}

export default state;