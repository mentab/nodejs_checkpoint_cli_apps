async function fetchGithubRepositories(searchParams) {
    const url = new URL('https://api.github.com/search/repositories')

    for (const [key, value] of Object.entries(searchParams)) {
        url.searchParams.set(key, value)
    }

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`GitHub API request failed with status ${response.status}`);
    }

    return await response.json();
}

async function getMostStarredGithubRepository() {
    const searchParams = {
        sort: 'stars',
        per_page: 1,
        q: `stars:>=1 ${convertCmdArgsToSearch()}`
    }

    try {
        const mostStarredGithub = await fetchGithubRepositories(searchParams)
    
        if (mostStarredGithub.items.length === 0) {
            throw new Error('No results found')
        } else {
            console.log(`The most starred github project is ${mostStarredGithub.items[0].name}`)
        }
    } catch (error) {
        console.error(error.message);
    }
}

function isDateValid(dateStr) {
  return !isNaN(new Date(dateStr));
}

function convertCmdArgsToSearch() {
    const argLength = process.argv.length;

    if (argLength === 2) {
        return ''
    } else if (argLength === 3) {
        throw new Error('Missing one date argument')
    } else {
        const startDate = process.argv[2];
        const endDate = process.argv[3];
        if (isDateValid(startDate) && isDateValid(endDate)) {
            return `created ${startDate}..${endDate}`
        } else {
            throw new Error('Dates must be in the YYYY-MM-DD format')
        }
    }
}

(async () => {
    await getMostStarredGithubRepository();
})();
