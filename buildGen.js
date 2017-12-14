const fs = require('fs');
const { Vec3 } = require('vec3');

const DEFAULT_BLOCKMAP = {
    '+': {id: 5, meta: 3},
    '~': {id: 5, meta: 3},
    '|': {id: 5, meta: 3},
}
const DEFAULT_PLACEMENT_VEC = new Vec3(0, 1, 0);

/*
    yield build objects
    tcoord: target coord
    scoord: standing coord
    place: placement vector Vec3(0, 1, 0) for on top of
    block: {id, meta} block type
*/
function* buildGen(mapFile, starting_vec, height, char2blockMap){
    if(char2blockMap == undefined){
        char2blockMap = DEFAULT_BLOCKMAP;
    }
    const map = fs.readFileSync(mapFile, 'ascii').split('\n');
    for(let i = 0; i < map.length; i++){
        for(let j = 0; j < map[i].length; j++){
            const key = map[i].charAt(j);
            if(!(key in char2blockMap)){
                continue;
            }
            for(let k=0; k < height; k++){
                yield {
                    tcoord: starting_vec.offset(j, k, i),
                    scoord: starting_vec.offset(j, 0, i+1),
                    place: DEFAULT_PLACEMENT_VEC,
                    block: char2blockMap[key]
                }
            }
        }
    }

}

exports.buildGen = buildGen;

/*
const bg = buildGen('./map1.txt', new Vec3(0, 0, 0), 1);
for(let i=0; i< 10; i++){
    console.log(bg.next());
}
*/
