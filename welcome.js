// Display user info and handle percentile/college search
let collegeData = [];

// Generate or retrieve application ID
function getOrCreateAppId() {
    let appId = localStorage.getItem('applicationId');
    if (!appId) {
        appId = 'IN' + Math.floor(10000000 + Math.random() * 90000000);
        localStorage.setItem('applicationId', appId);
    }
    return appId;
}

function displayUserInfo() {
    const regData = JSON.parse(localStorage.getItem('userRegistration'));
    const appId = getOrCreateAppId();
    if (!regData) {
        document.getElementById('userInfoCard').innerHTML = '<p style="color:red;">No registration data found. Please register first.</p>';
        document.getElementById('percentileForm').style.display = 'none';
        return;
    }
    document.getElementById('userInfoCard').innerHTML = `
        <h2>Welcome, ${regData.name}!</h2>
        <div class="info-details">
            <p><strong>Application ID:</strong> <span class="app-id">${appId}</span></p>
            <p><strong>Password:</strong> <span class="password">${regData.password}</span></p>
        </div>
    `;
}

function getSelectedCollegeTypes() {
    const checkboxes = document.querySelectorAll('input[name="collegeType"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

function getSelectedCourses() {
    const checkboxes = document.querySelectorAll('input[name="courseFilter"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

function getSelectedUniversityType() {
    const selectedRadio = document.querySelector('input[name="universityType"]:checked');
    return selectedRadio ? selectedRadio.value : 'SPPU';
}

function loadCSV() {
    Papa.parse('Pune_Colleges_Cutoff.csv', {
        download: true,
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: function(results) {
            console.log('Raw CSV data:', results.data);
            collegeData = results.data.map(row => ({
                code: row['college code'],
                name: row['College Name'],
                course: row['Course'],
                type: row['College Type'],
                university: row['University'] || 'SPPU', // Default to SPPU if not specified
                cutoffs: {
                    OPEN: parseFloat(row['OPEN']),
                    OBC: parseFloat(row['OBC']),
                    SC: parseFloat(row['SC']),
                    ST: parseFloat(row['ST']),
                    NT: parseFloat(row['NT'])
                }
            })).filter(row => row.name && row.course);
            console.log('Processed college data:', collegeData);
        }
    });
}

function findMatchingColleges(percentile, category) {
    const selectedTypes = getSelectedCollegeTypes();
    const selectedCourses = getSelectedCourses();
    const universityType = getSelectedUniversityType();
    console.log('Searching with:', { percentile, category, selectedCourses, selectedTypes, universityType });
    
    return collegeData.filter(college => {
        const cutoff = college.cutoffs[category];
        const courseMatch = selectedCourses.includes(college.course);
        const typeMatch = selectedTypes.includes(college.type);
        const universityMatch = college.university === universityType;
        const matches = !isNaN(cutoff) && cutoff <= percentile && courseMatch && typeMatch && universityMatch;
        console.log('College:', college.name, 'Cutoff:', cutoff, 'Type:', college.type, 'Course:', college.course, 'University:', college.university, 'Matches:', matches);
        return matches;
    }).sort((a, b) => b.cutoffs[category] - a.cutoffs[category]);
}

function displayColleges(colleges, category) {
    const collegeList = document.getElementById('collegeList');
    collegeList.innerHTML = '';
    if (colleges.length === 0) {
        collegeList.innerHTML = '<p>No colleges found matching your percentile and category.</p>';
        return;
    }
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>College Code</th>
                <th>College Name</th>
                <th>Course</th>
                <th>${category} Cutoff</th>
            </tr>
        </thead>
        <tbody>
            ${colleges.map(college => `
                <tr>
                    <td>${college.code || 'N/A'}</td>
                    <td>${college.name}</td>
                    <td>${college.course}</td>
                    <td>${college.cutoffs[category] !== undefined && !isNaN(college.cutoffs[category]) ? college.cutoffs[category].toFixed(2) + '%' : 'N/A'}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    collegeList.appendChild(table);
}

document.getElementById('percentileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (collegeData.length === 0) {
        alert('College data is not loaded yet. Please wait a moment and try again.');
        return;
    }
    const percentile = parseFloat(document.getElementById('percentile').value);
    const category = document.getElementById('category').value;
    console.log('Form submission:', { percentile, category });
    
    if (!category) {
        alert('Please select a category.');
        return;
    }
    if (isNaN(percentile) || percentile < 0 || percentile > 100) {
        alert('Please enter a valid percentile between 0 and 100');
        return;
    }
    displayColleges(findMatchingColleges(percentile, category), category);
});

window.addEventListener('load', () => {
    displayUserInfo();
    loadCSV();
}); 