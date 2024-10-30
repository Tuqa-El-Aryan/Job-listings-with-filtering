// empty array to store job data fetched from the data.json file.
let jobData = [];

// A Set to hold the active filters. 
const filters = new Set();



// this function fetches the job data from data.json 
// and assigns it to jobData.
// then calls the renderJobListings() function 
// to display the data on the page 
async function fetchData() {
    try {
      const response = await fetch('./data.json');
      const data = await response.json();
      jobData = data;
      renderJobListings(jobData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


// this function creates a single job listing element for each job
// using innerHTML
function createJobListing(job) {
    const jobBox = document.createElement('div');
    jobBox.classList.add('job-box');
    if (job.new) {
      jobBox.classList.add('new');
    }
    if (job.featured) {
      jobBox.classList.add('featured');
    }
    
    jobBox.innerHTML = `
      <div class="job-logo">
        <img src="${job.logo}" alt="${job.company} logo">
      </div>
      <div class="job-details">
        <div class="company-info">
          <span class="company">${job.company}</span>
          ${job.new ? '<span class="new-tag">NEW!</span>' : ''}
          ${job.featured ? '<span class="featured-tag">FEATURED</span>' : ''}
        </div>
        <h2 class="position">${job.position}</h2>
        <div class="job-meta">
          <span class="posted-at">${job.postedAt}</span>.
          <span class="contract">${job.contract}</span>.
          <span class="location">${job.location}</span>
        </div>
        <hr>
      </div>
       <div class="job-tags">
      <button class="tag">${job.role}</button>
      <button class="tag">${job.level}</button>
      ${job.languages.map(language => `<button class="tag">${language}</button>`).join('')}
      ${job.tools.map(tool => `<button class="tag">${tool}</button>`).join('')}
    </div>
    `;
    
    return jobBox;
  }
  
// this function displays the job listing on the page 
// by 1- clearing out any existing HTML content within the jobListingsSection
//    2- doing a loop on all job data and calling the createJobListing function
//       to create the reqired HTML elements for each job  
function renderJobListings(data) {
    const jobListingsSection = document.getElementById('job-listings');
    jobListingsSection.innerHTML = '';
    data.forEach(job => {
      const jobListing = createJobListing(job);
      jobListingsSection.appendChild(jobListing);
    });
  }
  
// this function updates the diisplay of the active filters
// and controls the visibility of the filter box by 
// 1- clearing any existing filters 
// 2- chicking for active filters , if there is non it hides the filter box
// 3- looping through each item in the filters set, creating a div element 
//    for each filter and adding it to filtersDiv, inside each filter div
//    a small x icon is added to remove the filter 
// 4- then adding eventlistner to each x icon when clicking on it , it removes 
//    the filter from the filters Set then calls the updateFilters() to refresh
//    and then calls the filterJobs() function  
function updateFilters() {
    const filterBox = document.getElementById('filter-box');
    const filtersDiv = document.getElementById('filters');
    filtersDiv.innerHTML = '';
  
    if (filters.size === 0) {
      filterBox.classList.add('hidden');
    } else {
      filterBox.classList.remove('hidden');
      filters.forEach(filter => {
        const filterElement = document.createElement('div');
        filterElement.classList.add('filter');
        filterElement.innerHTML = `
          ${filter} <div class="remove-filter">&times;</div>
        `;
        filterElement.querySelector('.remove-filter').addEventListener('click', () => {
          filters.delete(filter);
          updateFilters();
          filterJobs();
        });
        filtersDiv.appendChild(filterElement);
      });
    }
  }


  // this function filters job listings based on active filters in the filters set.
  // it filter the jobs according to the job's role, level, languages and tools
  // then checks if the current job listing matches all active filters
  function filterJobs() {
    const filteredData = jobData.filter(job => {
    
      const roleMatch = filters.has(job.role);
      const levelMatch = filters.has(job.level);
      const languagesMatch = job.languages.some(lang => filters.has(lang));
      const toolsMatch = job.tools.some(tool => filters.has(tool));
  
      const filterMatches = [...filters].every(filter => {
        return job.role === filter ||
               job.level === filter ||
               job.languages.includes(filter) ||
               job.tools.includes(filter);
      });
  
      return filterMatches;
    });
    renderJobListings(filteredData);
  }


  
  document.addEventListener('DOMContentLoaded', () => {
    fetchData();
  
    document.getElementById('job-listings').addEventListener('click', (event) => {
      if (event.target.classList.contains('tag')) {
        const filter = event.target.textContent;
        if (!filters.has(filter)) {
          filters.add(filter);
        }
        updateFilters();
        filterJobs();
      }
    });
  
    document.getElementById('clear-filters').addEventListener('click', () => {
      filters.clear();
      updateFilters();
      renderJobListings(jobData);
    });
  });
  
