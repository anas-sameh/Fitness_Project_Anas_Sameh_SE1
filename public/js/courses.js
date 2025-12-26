// Courses Search and Filter Handler
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const categoryFilter = document.getElementById('categoryFilter');
  const coursesGrid = document.getElementById('coursesGrid');
  
  // Get all course cards
  const allCourses = Array.from(coursesGrid.querySelectorAll('.course-card'));
  
  // Search function
  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    
    filterCourses(searchTerm, selectedCategory);
  }
  
  // Filter courses based on search and category
  function filterCourses(searchTerm, category) {
    allCourses.forEach(course => {
      const title = course.getAttribute('data-title').toLowerCase();
      const author = course.getAttribute('data-author').toLowerCase();
      const courseCategory = course.getAttribute('data-category');
      
      // Check if matches search term
      const matchesSearch = !searchTerm || 
        title.includes(searchTerm) || 
        author.includes(searchTerm);
      
      // Check if matches category
      const matchesCategory = category === 'all' || courseCategory === category;
      
      // Show or hide course
      if (matchesSearch && matchesCategory) {
        course.style.display = 'block';
      } else {
        course.style.display = 'none';
      }
    });
    
    // Show message if no courses found
    const visibleCourses = allCourses.filter(course => course.style.display !== 'none');
    if (visibleCourses.length === 0) {
      showNoResultsMessage();
    } else {
      hideNoResultsMessage();
    }
  }
  
  // Show no results message
  function showNoResultsMessage() {
    let noResultsMsg = document.getElementById('noResultsMessage');
    if (!noResultsMsg) {
      noResultsMsg = document.createElement('div');
      noResultsMsg.id = 'noResultsMessage';
      noResultsMsg.style.cssText = `
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        color: #666;
      `;
      noResultsMsg.innerHTML = `
        <h3 style="font-size: 24px; margin-bottom: 10px; color: #333;">No courses found</h3>
        <p>Try adjusting your search or filter criteria</p>
      `;
      coursesGrid.appendChild(noResultsMsg);
    }
  }
  
  // Hide no results message
  function hideNoResultsMessage() {
    const noResultsMsg = document.getElementById('noResultsMessage');
    if (noResultsMsg) {
      noResultsMsg.remove();
    }
  }
  
  // Event listeners
  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }
  
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
    
    // Real-time search (optional - uncomment if you want search while typing)
    // searchInput.addEventListener('input', performSearch);
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', performSearch);
  }
});



