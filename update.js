const fs = require('fs');

// Read both JSON files
const testData = JSON.parse(fs.readFileSync('./test.json', 'utf8'));
const myProblems = JSON.parse(fs.readFileSync('./backend/my-problems.json', 'utf8'));
console.log(testData)
// Create a map for quick lookup of test problems by name
const testProblemMap = new Map();
testData.forEach(problem => {
    testProblemMap.set(problem.title, problem.topics);
});

// // Update categories in myProblems
myProblems.forEach(problem => {
    const topics = testProblemMap.get(problem.title);
    console.log(topics)
    if (topics) {
        problem.categories = topics;
    }
});

// // Write updated data back to my-problems.json
fs.writeFileSync(
    './backend/my-problems.json',
    JSON.stringify(myProblems, null, 2)
);

console.log('Categories updated successfully');
