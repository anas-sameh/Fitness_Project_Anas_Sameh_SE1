// ========== COURSE DETAILS PAGE HANDLER ==========

document.addEventListener('DOMContentLoaded', function() {
  const courseDataStr = localStorage.getItem('selectedCourse');
  
  if (courseDataStr) {
    const courseData = JSON.parse(courseDataStr);
    displayCourseDetails(courseData);
  }
});

function displayCourseDetails(courseData) {
  const elements = {
    price: document.getElementById('coursePrice'),
    instructor: document.getElementById('courseInstructor'),
    duration: document.getElementById('courseDuration'),
    lectures: document.getElementById('courseLectures'),
    image: document.getElementById('courseImage'),
    title: document.getElementById('courseTitle'),
    author: document.getElementById('courseAuthor')
  };
  
  if (elements.price) elements.price.textContent = `$${courseData.price}`;
  if (elements.instructor) elements.instructor.textContent = courseData.author;
  if (elements.duration) elements.duration.textContent = `${courseData.duration} hr`;
  if (elements.lectures) elements.lectures.textContent = courseData.lessons;
  if (elements.image && courseData.image) {
    elements.image.src = courseData.image;
    elements.image.alt = courseData.title;
  }
  if (elements.title) elements.title.textContent = courseData.title;
  if (elements.author) elements.author.textContent = `By ${courseData.author}`;
}

