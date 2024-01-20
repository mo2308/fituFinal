currentIndex = 0;

showSlide(currentIndex);

function showSlide(index) {
  const slides = document.getElementsByClassName('slide');
  if (index >= slides.length) {
    currentIndex = 0;
  } else if (index < 0) {
    currentIndex = slides.length - 1;
  } else {
    currentIndex = index;
  }

  const offset = -currentIndex * 100 + '%';
  slider.style.transform = 'translateX(' + offset + ')';

  updateArrowPositions(currentIndex);
  setTimeout(() => {
    updateTextVisibility(currentIndex);
  }, 1);
}

function nextSlide() {
  showSlide(currentIndex + 1);
}

function prevSlide() {
  showSlide(currentIndex - 1);
}

function updateArrowPositions(index) {
    const prevArrow = document.getElementById('prev');
    const nextArrow = document.getElementById('next');
  
    const currentSlide = document.querySelector('.slide:nth-child(' + (index + 1) + ') img');
    const arrowHeight = prevArrow.offsetHeight;
  
    const imageHeight = currentSlide.offsetHeight;
    const arrowTop = (imageHeight) / 2;
  
    prevArrow.style.top = `calc(${arrowTop}px)`;
    nextArrow.style.top = `calc(${arrowTop}px)`;
}

function updateTextVisibility(index) {
  const slide1Text = document.getElementById('slide1-text');
  const slide2Text = document.getElementById('slide2-text');
  const slide3Text = document.getElementById('slide3-text');
  const slide4Text = document.getElementById('slide4-text');
  const slide5Text = document.getElementById('slide5-text');
  const slide6Text = document.getElementById('slide6-text');
  const slide7Text = document.getElementById('slide7-text');
  const slide8Text = document.getElementById('slide8-text');
  const slide9Text = document.getElementById('slide9-text');
  const slide10Text = document.getElementById('slide10-text');

  // Verstecke alle Texte zuerst
  slide1Text.style.display = 'none';
  slide2Text.style.display = 'none';
  slide3Text.style.display = 'none';
  slide4Text.style.display = 'none';
  slide5Text.style.display = 'none';
  slide6Text.style.display = 'none';
  slide7Text.style.display = 'none';
  slide8Text.style.display = 'none';
  slide9Text.style.display = 'none';  
  slide10Text.style.display = 'none'; 

  // Zeige den entsprechenden Text basierend auf dem Index
  if (index === 0) {
    slide1Text.style.display = 'block';
  } else if (index === 1) {
    slide2Text.style.display = 'block';
  }
  else if (index === 2) {
  slide3Text.style.display = 'block';
  }
  else if (index === 3) {
    slide4Text.style.display = 'block';
  }
  else if (index === 4) {
    slide5Text.style.display = 'block';
  }
  else if (index === 5) {
    slide6Text.style.display = 'block';
  }
  else if (index === 6) {
    slide7Text.style.display = 'block';
  }
  else if (index === 7) {
    slide8Text.style.display = 'block';
  }
  else if (index === 8) {
    slide9Text.style.display = 'block';
  }
  else if (index === 9) {
    slide10Text.style.display = 'block';
  }
}

updateArrowPositions(currentIndex);

window.addEventListener('resize', () => {updateArrowPositions(currentIndex); updateTextVisibility(currentIndex)});
