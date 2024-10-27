// The script fetches job data from data.json and displays it on the page, 
// Active filters are managed in a filters set. 
// fetchData() loads job data, and renderJobListings() displays it, 
// createJobListing() build each job element using innerHTML. 
// updateFilters() displays active filters in a filter box 
// filterJobs() filters listings based on selected tags,


let jobData = [];

const filters = new Set();



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
  

  function renderJobListings(data) {
    const jobListingsSection = document.getElementById('job-listings');
    jobListingsSection.innerHTML = '';
    data.forEach(job => {
      const jobListing = createJobListing(job);
      jobListingsSection.appendChild(jobListing);
    });
  }
  

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
          ${filter} <span class="remove-filter">&times;</span>
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
  
