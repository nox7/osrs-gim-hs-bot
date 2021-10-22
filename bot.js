// Require the necessary discord.js classes
import fetch from "node-fetch";
import StatFetcher from "./classes/StatFetcher.js";

(async () => {
	const { Client, Intents } = await import('discord.js');
	const dotenv = await import('dotenv');
	const jsdom = await import("jsdom");

	const playerStatsCheckRegex = /^\?stats (\d)$/;

	dotenv.config();

	// Create a new client instance
	const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
	let ironOSRSChannel = null;

	// When the client is ready, run this code (only once)
	client.once('ready', async () => {
		console.log("Bot is live\n");
		ironOSRSChannel = await client.channels.fetch("897274896588111973");
		console.log("Channels fetched\n");
	});

	client.on("messageCreate", async message => {
		const author = message.author;
		const content = message.content.toLowerCase().trim();
		if (!author.bot){
			if (content === "?stats"){
				ironOSRSChannel.send("Fetching...");
				const statsAsText = await StatFetcher.getAllTotals();
				const message = `${author} Here you are, \n${statsAsText}`;
				ironOSRSChannel.send(message);
			}else if (playerStatsCheckRegex.test(content)){
				const matches = content.match(playerStatsCheckRegex);
				if (matches){
					ironOSRSChannel.send(`One sec, grabbing their stats...`);
					const playerIndex = parseInt(matches[1]);
					const playerStatsAsText = await StatFetcher.getPlayerTotals(playerIndex);
					ironOSRSChannel.send(playerStatsAsText);
				}else{
					ironOSRSChannel.send(`Error processing your stats check request. No valid player index provided.`);
				}
			}else if (content === "?help"){
				ironOSRSChannel.send(`**Comands**\n\`?stats\` - Will fetch the total levels and XP of all the group irons.\n\`?stats NUMBER_HERE\` - Will fetch the skills and experience for an individual player. The number relates to the index from the \`?stats\` command.`);
			}
		}
	});

	// Login to Discord with your client's token
	client.login(process.env.DISCORD_TOKEN);
})();