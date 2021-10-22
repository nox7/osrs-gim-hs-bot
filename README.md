# Old School Runescape Group Ironman Stats Fetcher Discord Bot
Open-source Discord bot written in NodeJS to fetch your Group Ironman totals and individual level statistics.

## Requirements
* Have NodeJS v16 or higher installed.
* Install the dependencies with `npm install` ran from the project root
* Add a dotenv file (.env) to the project root with DISCORD_TOKEN as a key and your bot token as a value
* Run the Discord bot with `node bot.js`

## Commands
* ?help
* ?stats
* ?stats NUMBER_HERE (e.g., ?stats 5)

The stats with an optional NUMBER_HERE is the index of the player from the ?stats command. Not exactly the number your player is in the group iron. Jagex seems to have them ordered randomly in the group hiscores.