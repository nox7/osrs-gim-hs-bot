// Require the necessary discord.js classes
import fetch from "node-fetch";
import StatFetcher from "./classes/StatFetcher.js";
import {JSDOM} from "jsdom";

(async () => {
	const { Client, Intents } = await import('discord.js');
	const dotenv = await import('dotenv');
	const jsdom = await import("jsdom");

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
				const statsAsText = await StatFetcher.getStatsAsString();
				const message = `${author} Here you are, \n${statsAsText}`;
				ironOSRSChannel.send(message);
			}
		}
	});

	// Login to Discord with your client's token
	client.login(process.env.DISCORD_TOKEN);
})();