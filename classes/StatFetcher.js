import fetch from "node-fetch";
import {JSDOM} from "jsdom";

class StatFetcher{
	constructor(groupName){
		this.groupName = groupName;
	}

	/**
	 * Fetches the group stats as a string
	 */
	async getStatsAsString(){
		const date = new Date();
		const formattedDate = date.toLocaleDateString({
			year: 'numeric', month: 'long', day: 'numeric'
		});
		const response = await fetch(`https://secure.runescape.com/m=hiscore_oldschool_ironman/group-ironman/view-group?name=${this.groupName}`);
		const body = await response.text();
		const dom = new JSDOM(body);
		const document = dom.window.document;
		const playerRows = document.querySelectorAll(".uc-scroll__table-row--type-player");
		let postContent = `=== OSRS Group Ironman Stats as of ${formattedDate} ===\n`;
		for (const playerRow of playerRows){
			const innerRows = playerRow.querySelectorAll(".uc-scroll__table-cell");
			const playerNameRowContainer = innerRows[0];
			const playerNameContainer = playerNameRowContainer.querySelector(".uc-scroll__link");
			const totalLevelRow = innerRows[1];
			const totalXPRow = innerRows[2];
			const playerName = playerNameContainer.textContent.trim();
			const totalLevel = totalLevelRow.textContent.trim();
			const totalXP = totalXPRow.textContent.trim();
			postContent += `**${playerName}**: Total Level: ${totalLevel} | Total XP: ${totalXP}\n`;
		}

		return postContent;
	}
}

export default new StatFetcher("Budget Taps");