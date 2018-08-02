// Create the JSON input editor.
const editor = ace.edit('input', {
  mode: 'ace/mode/json'
})

// Set the inital value.
editor.setValue(`{
	"header": {
		"name": "Scraper repository"
	},
	"websites": [
		{
			"name": "Github",
			"options": {},
			"url": "https://github.com/cedoor/scraper",
			"selectors": {
				"description": ".repository-meta-content .text-gray-dark | trim",
				"commits": ".stats-switcher-wrapper .numbers-summary > li:nth-child(1) .num | trim",
				"branches": ".stats-switcher-wrapper .numbers-summary > li:nth-child(2) .num | trim",
				"releases": ".stats-switcher-wrapper .numbers-summary > li:nth-child(3) .num | trim",
				"contributors": ".stats-switcher-wrapper .numbers-summary > li:nth-child(4) .num | trim",
				"license": ".stats-switcher-wrapper .numbers-summary > li:nth-child(5) a | trim",
				"lastCommits": {
					"url": ".commits > a@href",
					"scope": ".commit-group > li",
					"selectors": [{
						"message": ".message",
						"author": ".commit-author",
						"time": "relative-time"
					}]
				}
			}
		}
	]
}`, 1)