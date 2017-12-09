const { Vec3 } = require('vec3');
const mineflayer = require('mineflayer');

const { buildGen } = require('./buildGen');
const { Builder } = require('./builder.js');

const bot = mineflayer.createBot({
      host: "localhost", // optional
      port: 43115,       // optional
      username: "gg", // email and password are required only for
});

bot.on('chat', function(username, message) {
      if (username === bot.username) return;
      bot.chat(message);
});

const bder = new Builder(bot);


bot.once('spawn', () =>{

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

    });


const stepper = (n, it) => {
    let val = it.next().value;
    for(let i=0;i<n;i++){
        val = it.next().value;
    }
    return val;
}
