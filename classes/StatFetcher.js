import fetch from "node-fetch";
import {JSDOM} from "jsdom";

class StatFetcher{
	constructor(groupName){
		this.groupName = groupName;
	}

	/**
	 * Fetches the DOM of the stats page for a group
	 * @returns {JSDOM}
	 */
	async getGroupStatsDOM(){
		const response = await fetch(`https://secure.runescape.com/m=hiscore_oldschool_ironman/group-ironman/view-group?name=${this.groupName}`);
		const body = await response.text();
		const dom = new JSDOM(body);

		return dom;
	}

	/**
	 * Fetches the group's total levels and XP as a string
	 * @return {Promise<string>}
	 */
	async getAllTotals(){
		const date = new Date();
		const formattedDate = date.toLocaleDateString({
			year: 'numeric', month: 'long', day: 'numeric'
		});
		const dom = await this.getGroupStatsDOM();
		const document = dom.window.document;
		const playerRows = document.querySelectorAll(".uc-scroll__table-row--type-player");
		let postContent = `=== OSRS Group Ironman Stats as of ${formattedDate} ===\n`;

		let accumulator = 0;
		for (const playerRow of playerRows){
			const innerRows = playerRow.querySelectorAll(".uc-scroll__table-cell");
			const playerNameRowContainer = innerRows[0];
			const playerNameContainer = playerNameRowContainer.querySelector(".uc-scroll__link");
			const totalLevelRow = innerRows[1];
			const totalXPRow = innerRows[2];
			const playerName = playerNameContainer.textContent.trim();
			const totalLevel = totalLevelRow.textContent.trim();
			const totalXP = totalXPRow.textContent.trim();
			postContent += `${accumulator + 1} **${playerName}**: Total Level: ${totalLevel} | Total XP: ${totalXP}\n`;
			++accumulator;
		}

		return postContent;
	}

	/**
	 * Fetches the group's total levels and XP as a string
	 * @param {int} groupIronmanPlayerIndex
	 * @return {Promise<string>}
	 */
	async getPlayerTotals(groupIronmanPlayerIndex){
		const date = new Date();
		const formattedDate = date.toLocaleDateString({
			year: 'numeric', month: 'long', day: 'numeric'
		});
		const dom = await this.getGroupStatsDOM();
		const document = dom.window.document;
		const playerRows = document.querySelectorAll(".uc-scroll__table-row--type-player");
		let postContent = null;

		for (let playerRowIndex in playerRows){
			// Type cast to int
			playerRowIndex = parseInt(playerRowIndex);

			// +1 because user-land uses indices out of 1 and not 0 like in code
			if ((playerRowIndex + 1) === groupIronmanPlayerIndex){
				// Get all of the skills
				const playerRow = playerRows[playerRowIndex];

				// Get the player's name
				const innerRows = playerRow.querySelectorAll(".uc-scroll__table-cell");
				const playerNameRowContainer = innerRows[0];
				const playerNameContainer = playerNameRowContainer.querySelector(".uc-scroll__link");
				const playerName = playerNameContainer.textContent.trim();
				postContent = `=== ${playerName}'s Stats as of ${formattedDate} ===\n`;
				postContent += `**Skill** | **Level** | **Experience**\n`;

				let lastTableRow = playerRow;
				const skillTableRows = [];
				const skills = []; // Inner tables with "skillName", "skillLevel", and "skillXP" as keys
				while (lastTableRow.nextElementSibling){
					const nextTableRow = lastTableRow.nextElementSibling;
					if (nextTableRow.classList.contains("uc-scroll__table-row--type-player")){
						// Hit another player row, stop here
						break;
					}else{
						skillTableRows.push(nextTableRow);
					}
					lastTableRow = nextTableRow;
				}

				for (/** @type {HTMLTableRowElement} */ const tableRow of skillTableRows){
					const innerRows = tableRow.querySelectorAll(".uc-scroll__table-cell");
					const skillName = innerRows[0].textContent.trim();
					const skillLevel = innerRows[1].textContent.trim();
					const skillXP = innerRows[2].textContent.trim();
					skills.push({
						skillName: skillName,
						skillLevel: skillLevel,
						skillXP: skillXP
					});
				}

				// Sort descending by skill levels
				skills.sort((a,b) => {
					// Handle when skill levels are the same
					if (a.skillLevel === b.skillLevel){
						return a.skillXP < b.skillXP ? 1 : -1;
					}else{
						return a.skillLevel < b.skillLevel ? 1 : -1;
					}
				});

				for (const skillData of skills){
					// OSRS Hiscores handles the number formatting for us
					//const formattedExperience = String(skillData.skillXP).replace(/(.)(?=(\d{3})+$)/g,'$1,')
					postContent += `${skillData.skillName} | ${skillData.skillLevel} | ${skillData.skillXP}\n`;
				}

				// Finished
				break;
			}
		}

		if (postContent === null){
			postContent = `No player in the group with index ${groupIronmanPlayerIndex}.`;
		}

		return postContent;
	}
}

export default new StatFetcher("Budget Taps");