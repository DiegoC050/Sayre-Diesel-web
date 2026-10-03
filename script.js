// ===== TEMA DIURNO/NOCTURNO =====
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Limpiar estilos inline del navbar para que las variables CSS tomen efecto inmediato
    const nav = document.querySelector('nav');
    if (nav) {
        nav.style.background = '';
        nav.style.boxShadow = '';
    }
}

// Cargar tema guardado al iniciar
(function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

// ===== WHATSAPP DROPDOWN =====
function toggleWhatsappMenu() {
    const menu = document.getElementById('whatsappMenu');
    const btn = document.querySelector('.whatsapp-btn');
    if (menu && btn) {
        menu.classList.toggle('active');
        btn.classList.toggle('menu-open');
    }
}

// Cerrar menú de WhatsApp al hacer clic fuera
document.addEventListener('click', function(event) {
    const menu = document.getElementById('whatsappMenu');
    const btn = document.querySelector('.whatsapp-btn');
    if (menu && btn && !menu.contains(event.target) && !btn.contains(event.target)) {
        menu.classList.remove('active');
        btn.classList.remove('menu-open');
    }
});

// ===== CARRUSEL HERO =====
let currentSlide = 0;
const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

// Solo inicializar el carrusel si existe en la página
if (track && slides.length > 0) {
    function showSlide(n) {
        currentSlide = (n + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentSlide].classList.add('active');
    }

    function changeSlide(n) {
        showSlide(currentSlide + n);
    }

    function goToSlide(n) {
        showSlide(n);
    }

    // Auto-avance del carrusel cada 6 segundos (con pausa al hover)
    let carouselInterval = setInterval(() => {
        changeSlide(1);
    }, 6000);

    const carousel = document.querySelector('.carousel');

    // Pausar auto-avance cuando el mouse está sobre el carrusel
    carousel.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });

    // Reanudar auto-avance cuando el mouse sale del carrusel
    carousel.addEventListener('mouseleave', () => {
        // Esperar 1 segundo antes de avanzar al siguiente slide
        setTimeout(() => {
            changeSlide(1);
        }, 0);
        // Reiniciar el intervalo
        carouselInterval = setInterval(() => {
            changeSlide(1);
        }, 6000);
    });
}

// ===== SISTEMA DE LOGIN Y EDICIÓN =====

// Usuarios del sistema
const users = [
    { username: 'admin', password: 'admin123', role: 'Administrador' },
    { username: 'asistente1', password: 'asistente123', role: 'Asistente' },
    { username: 'asistente2', password: 'asistente456', role: 'Asistente' }
];

let currentUser = null;

// Abrir modal de login
function openLogin() {
    document.getElementById('loginModal').classList.add('active');
}

// Cerrar modal de login
function closeLogin() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('loginError').textContent = '';
}

// Manejar login
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        closeLogin();
        showEditToolbar();
        enableEditing();
        document.getElementById('loginForm').reset();
    } else {
        document.getElementById('loginError').textContent = 'Usuario o contraseña incorrectos';
    }
}

// Mostrar barra de herramientas
function showEditToolbar() {
    document.getElementById('editToolbar').style.display = 'flex';
    document.getElementById('userInfo').textContent = `${currentUser.role}: ${currentUser.username}`;
}

// Cerrar sesión
function logout() {
    currentUser = null;
    document.getElementById('editToolbar').style.display = 'none';
    disableEditing();
    location.reload();
}

// Habilitar edición
function enableEditing() {
    // Hacer editables los precios
    document.querySelectorAll('.precio').forEach(el => {
        el.classList.add('editable');
        el.addEventListener('click', function() {
            editPrice(this);
        });
    });

    // Hacer editables las imágenes de productos
    document.querySelectorAll('.producto img').forEach(img => {
        img.classList.add('editable');
        img.addEventListener('click', function() {
            changeImage(this);
        });
    });

    // Hacer editables las descripciones
    document.querySelectorAll('.descripcion').forEach(el => {
        el.classList.add('editable');
        el.addEventListener('click', function() {
            editDescription(this);
        });
    });
}

// Deshabilitar edición
function disableEditing() {
    document.querySelectorAll('.editable').forEach(el => {
        el.classList.remove('editable');
    });
}

// Editar precio
function editPrice(element) {
    const currentPrice = element.textContent;
    const newPrice = prompt('Ingresa el nuevo precio:', currentPrice);
    if (newPrice && newPrice.trim() !== '') {
        element.textContent = newPrice.trim();
    }
}

// Cambiar imagen
function changeImage(imgElement) {
    const newUrl = prompt('Ingresa la URL de la nueva imagen:', imgElement.src);
    if (newUrl && newUrl.trim() !== '') {
        imgElement.src = newUrl.trim();
    }
}

// Editar descripción
function editDescription(element) {
    const currentDesc = element.textContent;
    const newDesc = prompt('Ingresa la nueva descripción:', currentDesc);
    if (newDesc && newDesc.trim() !== '') {
        element.textContent = newDesc.trim();
    }
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (modal && event.target === modal) {
        closeLogin();
    }
}

// ===== FUNCIONALIDADES EXISTENTES =====

// Smooth scroll para enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Si es la sección inicio, sin separación
            if (target.id === 'inicio') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Smooth scroll para enlaces a otras páginas
document.querySelectorAll('a[href$=".html"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Permitir navegación normal a otras páginas
    });
});

// Animación de entrada para las tarjetas
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar tarjetas de servicios y productos
const cards = document.querySelectorAll('.card, .producto, .contacto-item');
if (cards.length > 0) {
    cards.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Navbar con efecto de scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.background = getComputedStyle(document.documentElement).getPropertyValue('--nav-bg-scrolled');
        nav.style.boxShadow = '0 5px 30px var(--shadow-color)';
    } else {
        nav.style.background = getComputedStyle(document.documentElement).getPropertyValue('--nav-bg');
        nav.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Lazy loading para imágenes
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}