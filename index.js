const { Vec3 } = require('vec3');
const mineflayer = require('mineflayer');

const { buildGen } = require('./buildGen');
const { Builder } = require('./builder.js');

const bot = mineflayer.createBot({
    host: "localhost", // optional
    port: 34851,       // optional
    username: "gg", // email and password are required only for
});

bot.on('chat', function(username, message) {
    if (username === bot.username) return;
    bot.chat(message);
});

const bder = new Builder(bot);


bot.once('spawn', () =>{
    //build();

    bot.chat('/tp c');
    setTimeout(command_builder, 1000);
});

/*
 * normal build mode
*/
const build = () =>{
    const pos = bot.players.c.entity.position.clone();
    console.log('starting at', pos);
    const bg = buildGen('./map1.txt', pos, 2);

    if(bder.free){
        bder.on('complete', ()=>{
            const nxt = bg.next()
            if(nxt.done){
                console.log("completed");
                return
            }
            bder.build(nxt.value);
        });

        bder.build(bg.next().value);
    }
}

/*
 * build using command. (bot need to be op)
 */
const command_builder = () =>{

    const pos = bot.players.c.entity.position.offset(1, 0, 0);
    console.log('starting at', pos);
    const bg = buildGen('./map3.txt', pos, 5);
    const block_type = 'minecraft:planks';

    for(let obj of bg){
       const tc = obj.tcoord;
       const cmd = "/setblock " + tc.x + " " + tc.y + " " + tc.z + " " + block_type;
       bot.chat(cmd);
    }
}
