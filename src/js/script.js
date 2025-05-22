document.addEventListener('DOMContentLoaded', () => {
    const carouselImages = document.querySelector('.carousel-images');
    const allImages = document.querySelectorAll('.carousel-images img'); // Todas las imágenes, incluyendo copias
    const originalImagesCount = 7; // **IMPORTANTE:** Aquí defines el número de tus imágenes ORIGINALES (7 en tu caso)

    // Ajusta el número de copias al principio y al final.
    // Esto debe coincidir con las imágenes que duplicaste manualmente en el HTML.
    const numClonedBefore = 2; // Número de copias de las últimas imágenes al inicio
    const numClonedAfter = 2;  // Número de copias de las primeras imágenes al final

    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const carouselDotsContainer = document.querySelector('.carousel-dots');

    // El índice actual se inicializa en la primera imagen REAL, no en la primera copia
    let currentIndex = numClonedBefore; // Empieza en la primera imagen original

    // Crear los puntos de navegación (dots) solo para las imágenes originales
    for (let i = 0; i < originalImagesCount; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.dataset.index = i; // El índice del dot corresponde al índice de la imagen original
        carouselDotsContainer.appendChild(dot);
        dot.addEventListener('click', () => {
            // Cuando se hace clic en un dot, vamos a la imagen real + el desplazamiento inicial
            goToSlide(parseInt(dot.dataset.index) + numClonedBefore);
        });
    }

    const dots = document.querySelectorAll('.dot');

    // Función para actualizar la imagen visible
    const updateCarousel = (smoothTransition = true) => {
        // Asegúrate de que las imágenes tengan un ancho definido antes de intentar leer clientWidth
        if (allImages.length === 0) return;
        const imageWidth = allImages[0].clientWidth; // Ancho de una sola imagen

        if (smoothTransition) {
            carouselImages.style.transition = 'transform 0.5s ease-in-out';
        } else {
            carouselImages.style.transition = 'none'; // Sin transición para el salto
        }

        carouselImages.style.transform = `translateX(-${currentIndex * imageWidth}px)`;

        // Actualizar los puntos de navegación
        // El índice del dot corresponde a (currentIndex - numClonedBefore)
        const activeDotIndex = (currentIndex - numClonedBefore + originalImagesCount) % originalImagesCount;
        dots.forEach((dot, index) => {
            if (index === activeDotIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    // Función para ir a una diapositiva específica
    const goToSlide = (index) => {
        currentIndex = index;
        updateCarousel();
    };

    // Navegación con botón "Siguiente"
    nextButton.addEventListener('click', () => {
        currentIndex++;
        updateCarousel();
    });

    // Navegación con botón "Anterior"
    prevButton.addEventListener('click', () => {
        currentIndex--;
        updateCarousel();
    });

    // Event listener para manejar el "salto" infinito después de la transición
    carouselImages.addEventListener('transitionend', () => {
        // Si estamos en una de las imágenes clonadas al final, saltar a la imagen real al principio
        if (currentIndex >= originalImagesCount + numClonedBefore) {
            currentIndex = numClonedBefore; // Volver a la primera imagen original
            updateCarousel(false); // Salto instantáneo
        }
        // Si estamos en una de las imágenes clonadas al principio, saltar a la imagen real al final
        else if (currentIndex < numClonedBefore) {
            currentIndex = originalImagesCount + numClonedBefore - 1; // Volver a la última imagen original
            updateCarousel(false); // Salto instantáneo
        }
    });

    // Inicializar el carrusel al cargar la página
    // Retrasar la inicialización ligeramente para asegurar que las imágenes estén cargadas y sus anchos calculados
    setTimeout(() => {
        updateCarousel(false); // La primera carga debe ser sin transición para posicionar correctamente
    }, 50);


    // Opcional: Carrusel automático
    let autoSlideInterval;

    const startAutoSlide = () => {
        stopAutoSlide(); // Asegúrate de limpiar cualquier intervalo existente
        autoSlideInterval = setInterval(() => {
            currentIndex++;
            updateCarousel();
        }, 3000); // Cambia cada 3 segundos
    };

    const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
    };

    // Iniciar el carrusel automático
    startAutoSlide();

    // Pausar el carrusel automático al pasar el ratón por encima
    carouselImages.addEventListener('mouseenter', stopAutoSlide);
    carouselImages.addEventListener('mouseleave', startAutoSlide);
});

// Ajustar el carrusel si la ventana cambia de tamaño
window.addEventListener('resize', () => {
    const carouselImages = document.querySelector('.carousel-images');
    const allImages = document.querySelectorAll('.carousel-images img');
    // Si no hay imágenes o aún no se han cargado, salir para evitar errores
    if (allImages.length === 0) return;

    const imageWidth = allImages[0].clientWidth;
    carouselImages.style.transition = 'none'; // Desactiva la transición temporalmente
    const currentIndex = parseInt(carouselImages.style.transform.split('(')[1]) / -imageWidth; // Recalcula el currentIndex basado en la posición actual
    carouselImages.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
    setTimeout(() => {
        carouselImages.style.transition = 'transform 0.5s ease-in-out'; // Vuelve a activar la transición
    }, 0);
});