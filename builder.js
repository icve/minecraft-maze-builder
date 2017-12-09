const EventEmitter = require('events');

//position error margin
const PEM = 0.3;

class Builder extends EventEmitter{
    constructor(bot){
        super();
        this.bot = bot;
        this.free = true;
    }

    /* sample build object
     * tcoord: target coord
     * place: target placement vector v(0,1,0) for on top
     * scoord: source/standing coord
     * block: {id, meta} block type and variant
     * event 'complete' is emitted when a build completes
     */
    build(obj){
        this.moveTo(centerOf(obj.scoord)).then(() =>{
            return this.lookAt(obj.tcoord);
        }).then(()=>{
            //equip
            return (new Promise((re, rj) =>{
                //find item
                const inv = this.bot.inventory;
                const item = inv.findInventoryItem(obj.block.id, obj.block.meta);

                console.log('block remaining:', inv.count(obj.block.id, obj.block.meta));
                // handle no item
                if(item == null){
                    console.log("!! no required item");
                    console.log("looking for", obj.block);
                    console.log("has: ", this.bot.inventory.items());
                    this.bot.once('playerCollect', (collector, collected)=>{
                        this.build(obj);
                    })
                return;
                }
                this.bot.equip(item, 'hand', re);
            }))
        }).then(() => {
           // place block
            // ref block
            return ( new Promise((re, rj) => {
                const rb= this.bot.blockAt(obj.tcoord);
                this.bot.placeBlock(rb, obj.place, re);
            }))

        }).then(() =>{
            // emmit complete event
            this.emit('complete');
        }).catch((err)=> {
            console.log("error when building" + err);
        });
    }

    // move to position
    moveTo(pos){
        return (new Promise((resolve, reject) => {
            this.bot.lookAt(pos, false, ()=> {
                this.bot.setControlState('forward', true);
                // function to check stop moving
                const stopper = () => {
                    this.bot.lookAt(pos, false);
                    if (this.bot.entity.position.distanceTo(pos) < PEM){
                        this.bot.setControlState('forward', false);
                        this.bot.removeListener('move', stopper);
                        resolve();
                    }
                };
            this.bot.on('move', stopper);
            });
        }))
    }

    lookAt(pos){
        return (new Promise((resolve, reject) => {
            this.bot.lookAt(pos, false, resolve);
        }
        ))
    }

}

function centerOf(pos){
    return pos.floored().translate(.5, 0, .5);
}
exports.Builder = Builder
