
const axios = require('axios');
const fs = require('fs').promises;

const baseURL = 'https://www.naukri.com/code360/api/v3/public_section/all_problems';

async function crawlProblems() {
    try {
        const problems = [];
        let page = 1;
        const count = 10; // number of items per page

        while (true) {
            console.log(`Fetching page ${page}...`);
            
            const params = {
                count,
                page,
                search: '',
                'practice_topic[]': 'Arrays',
                'difficulty[]': ['Easy', 'Medium'],
                attempt_status: 'NOT_ATTEMPTED',
                sort_entity: 'company_count',
                sort_order: 'DESC',
                'except_practice_topic[]': ['Backtracking', 'Bit Manipulation'],
                request_differentiator: Date.now(),
                naukri_request: true
            };
            const response = await axios.get(baseURL, { params });
            console.log(response)
            const data = response.data;

            if (!data.data || data.data.length === 0) {
                break; // No more data to fetch
            }

            console.log(data)
            problems.push(...data.data);
            page++;

            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Save to JSON file
        await fs.writeFile(
            'problems.json', 
            JSON.stringify(problems, null, 2),
            'utf-8'
        );

        console.log(`Successfully crawled ${problems.length} problems`);

    } catch (error) {
        console.log(error)
        console.error('Error crawling data:', error.message);
    }
}

// Run the crawler
crawlProblems();