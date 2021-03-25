const Discord = require('discord.js');
const fetch = require('node-fetch');
const Canvas = require('canvas');

module.exports = {
	name: 'pokemon',
	description: 'Get information about a pokemon',
	aliases: ['poke'],
	execute(message, args) {
        let url = 'https://pokeapi.co/api/v2/pokemon/' + args;
        let settings = { method: "Get"};
        fetch(url, settings)
            .then(res => res.json())
            .then(async (json) => {
                const [hp, att, def, spA, spD, spe] = [json.stats[0].base_stat, json.stats[1].base_stat, json.stats[2].base_stat, json.stats[3].base_stat, json.stats[4].base_stat, json.stats[5].base_stat]
                const bst = hp + att + def + spA + spD + spe;
                
                const canvas = Canvas.createCanvas(768,192);
                const ctx = canvas.getContext('2d');
                const backSprite = await Canvas.loadImage(json.sprites.back_default);
                const frontSprite = await Canvas.loadImage(json.sprites.front_default);
                const backShinySprite = await Canvas.loadImage(json.sprites.back_shiny);
                const frontShinySprite = await Canvas.loadImage(json.sprites.front_shiny); 
                ctx.drawImage(backSprite, 0, 0, 192, 192);
                ctx.drawImage(frontSprite, 192, 0, 192, 192);
                ctx.drawImage(backShinySprite, 384, 0, 192, 192);
                ctx.drawImage(frontShinySprite, 576, 0, 192, 192);
                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'all-sprites.png');
                
                const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(json.name.charAt(0).toUpperCase() + json.name.slice(1))
                .setURL('https://bulbapedia.bulbagarden.net/wiki/' + args + '_(Pok%C3%A9mon)')
                .setDescription("Total Base Stats: " + bst)
                .setThumbnail()
                .addFields(
                    { name: 'HP', value: hp, inline: true },
                    { name: 'Attack', value: att, inline: true },
                    { name: 'Defense', value: def, inline: true },
                    { name: 'Special Attack', value: spA, inline: true },
                    { name: 'Special Defense', value: spD, inline: true },
                    { name: 'Speed', value: spe, inline: true },
                )
                .setTimestamp()
                .setFooter('Good choice!', 'https://i.imgur.com/BTMwRqa.jpg');

                message.channel.send(embed)
                message.channel.send(attachment);
            })
        
	},
};