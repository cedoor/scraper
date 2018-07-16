# ![](https://raw.githubusercontent.com/cedoor/scraper/master/resources/icons/32x32.png) Scraper

[![](https://img.shields.io/github/license/cedoor/scraper.svg?style=flat-square)](https://github.com/cedoor/scraper/blob/dev/LICENSE)
[![](https://img.shields.io/david/cedoor/scraper.svg?style=flat-square)](https://david-dm.org/cedoor/scraper)
[![](https://img.shields.io/david/dev/cedoor/scraper.svg?style=flat-square)](https://david-dm.org/cedoor/scraper?type=dev)
[![](https://img.shields.io/github/downloads/cedoor/scraper/total.svg?style=flat-square)](https://github.com/cedoor/scraper/releases)
[![](https://img.shields.io/travis/cedoor/scraper.svg?style=flat-square)](https://travis-ci.org/cedoor/scraper)

Simple desktop scraper app. You can download the application [here](https://github.com/cedoor/scraper/releases/latest).

With **Scraper** it is possible to load a json file with a specific structure ([x-ray](https://github.com/matthewmueller/x-ray) like) for automated scraping (you can find some examples in the `examples` folder) or simply by inserting the url and the selector directly into the app. 

![Scraper app](https://raw.githubusercontent.com/cedoor/scraper/master/src/images/example.png)

The input file for the result of the image above:

```javascript
{
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
					"selectors": [
						".commit-group > li .commit-title a"
					]
				}
			}
		}
	]
}
```
## Usage

**Scraper** get an input json file divided mainly into two parts:
1. header: with the information you want to make visible in the output json,
2. websites: a list of website configurations used for scraping.

In the website configuration you can pass custom parameters (as `name` above) and you have to pass the configuration fields:
* url of the website,
* scope of the selectors (optional),
* selectors of the page,
* additional options as (at the moment):
    * pagination: url with the `next` link,
    * limit: number of pages to scrape.

The selector rules are the same as [x-ray](https://github.com/matthewmueller/x-ray). Below some use cases:

#### Scrape a single selector:

```
{
    "options": {},
    "url": "https://github.com/cedoor/scraper",
    "selectors": ".repository-meta-content .text-gray-dark | trim"
}
```

#### Scrape an attribute:

```
{
    "options": {},
    "url": "https://github.com/cedoor/scraper",
    "selectors": {
        "linkOfCommits": ".commits > a@href"
    }
}
```

#### Scrape innerHTML:

```
{
    "options": {},
    "url": "https://github.com/cedoor/scraper",
    "selectors": {
        "body": "body@html"
    }
}
```

#### Scrape with a scope:

```
{
    "options": {},
    "url": "https://github.com/cedoor/scraper",
    "scope": "body",
    "selectors": {
        "description": ".repository-meta-content .text-gray-dark | trim"
    }
}
```

#### Scrape with collections:

```
{
    "options": {},
    "url": "https://github.com/cedoor/scraper/commits/master",
    "selectors": [
        ".commit-group > li .commit-title a"
    ]
}
```

#### Scrape with pagination:

```
{
    "options": {
        "pagination": "li.next a@href",
        "limit": 78
    },
    "url": "https://icobazaar.com/v2/ico-list",
    "scope": ".icos-list div.ico",
    "selectors": [{
        "name": "h5"
    }]
}
```

#### Crawling to another site:

```
{
    "options": {},
    "url": "https://github.com/cedoor/scraper",
    "selectors": {
        ...
        "lastCommits": {
            "url": ".commits > a@href",
            "selectors": [
                ".commit-group > li .commit-title a"
            ]   
        }
    }
}
```

It is possible to nest sub-sites.

### Filters

In addition there are filters that you can use to improve the values of the selectors:
* trim: `"selector": ".class | trim"` -> Removes whitespace from both ends of a string,
* reverse: `"selector": ".class | reverse"` -> Reverses a string,
* slice: `"selector": ".class | slice:2,3"` -> Extracts a section of a string and returns it as a new string,
* oneSpace: `"selector": ".class | oneSpace"` -> Replaces all spaces with one space,
* toNumber: `"selector": ".class | toNumber"` -> Parses a string and returns a float or an integer,
* getNumber: `"selector": ".class | getNumber"` -> Finds the numbers in a string and returns the i-th.

Other filters will be added later.

## Development

### Clone and install dependencies

```sh
> git clone https://github.com/cedoor/scraper.git
> cd scraper
> npm i
```

### Run electron

```sh
> npm start
```
### Rules

#### Commits

* Use this commit message format (angular style):  

    `[<type>] <subject>`
    `<BLANK LINE>`
    `<body>`

    where `type` must be one of the following:

    - feat: A new feature
    - fix: A bug fix
    - docs: Documentation only changes
    - style: Changes that do not affect the meaning of the code
    - refactor: A code change that neither fixes a bug nor adds a feature
    - test: Adding missing or correcting existing tests
    - chore: Changes to the build process or auxiliary tools and libraries such as documentation generation
    - update: Update of the library version or of the dependencies

and `body` must be should include the motivation for the change and contrast this with previous behavior (do not add body if the commit is trivial). 

* Use the imperative, present tense: "change" not "changed" nor "changes".
* Don't capitalize first letter.
* No dot (.) at the end.

#### Branches

* There is a master branch, used only for release.
* There is a dev branch, used to merge all sub dev branch.
* Avoid long descriptive names for long-lived branches.
* No CamelCase.
* Use grouping tokens (words) at the beginning of your branch names (in a similar way to the `type` of commit).
* Define and use short lead tokens to differentiate branches in a way that is meaningful to your workflow.
* Use slashes to separate parts of your branch names.
* Remove branch after merge if it is not important.

Examples:
    
    git branch -b docs/README
    git branch -b test/one-function
    git branch -b feat/side-bar
    git branch -b style/header

## License
* See [LICENSE](https://github.com/cedoor/scraper/blob/master/LICENSE) file

## Contact
#### Developer
* e-mail : omardesogus9@gmail.com
* github : [@cedoor](https://github.com/cedoor)
* website : https://cedoor.github.io
