// Store college data
let collegeData = [];

// Load CSV automatically on page load
function loadCSV() {
    Papa.parse('Pune_Colleges_Cutoff.csv', {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            collegeData = results.data.map(row => ({
                name: row['College Name'],
                course: row['Course'],
                cutoff: parseFloat(row['CAP Round 1 Cutoff'])
            })).filter(row => row.name && row.course && !isNaN(row.cutoff));
        collegeData.sort((a, b) => b.cutoff - a.cutoff);
        console.log('Loaded college data:', collegeData);
        }
    });
}

// Find matching colleges based on percentile
function findMatchingColleges(percentile) {
    return collegeData.filter(college => college.cutoff <= percentile)
        .sort((a, b) => b.cutoff - a.cutoff);
}

// Display matching colleges
function displayColleges(colleges) {
    const collegeList = document.getElementById('collegeList');
    collegeList.innerHTML = '';
    
    if (colleges.length === 0) {
        collegeList.innerHTML = '<p>No colleges found matching your percentile.</p>';
        return;
    }
    
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>College Name</th>
                <th>Course</th>
                <th>CAP Round 1 Cutoff</th>
            </tr>
        </thead>
        <tbody>
            ${colleges.map(college => `
                <tr>
                    <td>${college.name}</td>
                    <td>${college.course}</td>
                    <td>${college.cutoff.toFixed(2)}%</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    
    collegeList.appendChild(table);
}

// Handle form submission
// Only allow search after CSV is loaded

document.getElementById('cutoffForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (collegeData.length === 0) {
        alert('College data is not loaded yet. Please wait a moment and try again.');
        return;
    }
    const percentile = parseFloat(document.getElementById('percentile').value);
    
    if (isNaN(percentile) || percentile < 0 || percentile > 100) {
        alert('Please enter a valid percentile between 0 and 100');
        return;
    }
    
    const matchingColleges = findMatchingColleges(percentile);
    displayColleges(matchingColleges);
});

// Load CSV when page loads
window.addEventListener('load', loadCSV); 