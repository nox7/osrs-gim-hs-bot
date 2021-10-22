import StatFetcher from "./../classes/StatFetcher.js";

(async () => {
	console.log(await StatFetcher.getPlayerTotals(5));
})();