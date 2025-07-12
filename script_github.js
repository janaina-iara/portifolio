// Portfolio dynamic image loading - GitHub Pages Version
class PortfolioManager {
    constructor() {
        this.portfolioImages = [];
        this.portfolioGrid = document.getElementById('portfolioGrid');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.modal = null;
        // URL da API do Render - será atualizada quando você hospedar o backend
        this.apiBaseUrl = 'https://janaina-api.onrender.com'; // SUBSTITUA pela URL do seu Render
        this.init();
    }

    async init() {
        await this.loadImagesFromAPI();
        this.setupEventListeners();
        this.displayPortfolioItems();
    }

    async loadImagesFromAPI() {
        try {
            console.log('Carregando imagens da API...');
            const response = await fetch(`${this.apiBaseUrl}/api/portfolio-images`);
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Dados recebidos da API:', data);
            
            // Converter dados da API para o formato esperado
            this.portfolioImages = [];
            
            // Adicionar imagens de cada categoria
            Object.entries(data).forEach(([category, images]) => {
                images.forEach(image => {
                    this.portfolioImages.push({
                        src: `${this.apiBaseUrl}/${image.src}`, // URL completa da API
                        category: category,
                        alt: image.alt
                    });
                });
            });
            
            console.log('Total de imagens carregadas:', this.portfolioImages.length);
            
        } catch (error) {
            console.error('Erro ao carregar imagens da API:', error);
            // Fallback para imagens estáticas se a API falhar
            this.loadFallbackImages();
        }
    }

    loadFallbackImages() {
        console.log('API indisponível. Usando imagens de fallback...');
        // Lista de imagens de fallback caso a API não funcione
        const fallbackImages = [
            { src: 'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Pequeno+Porte+1', category: 'small', alt: 'Trabalho profissional - Pequeno Porte' },
            { src: 'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Pequeno+Porte+2', category: 'small', alt: 'Trabalho profissional - Pequeno Porte' },
            { src: 'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Pequeno+Porte+3', category: 'small', alt: 'Trabalho profissional - Pequeno Porte' },
            { src: 'https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Medio+Porte+1', category: 'medium', alt: 'Trabalho profissional - Médio Porte' },
            { src: 'https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Medio+Porte+2', category: 'medium', alt: 'Trabalho profissional - Médio Porte' },
            { src: 'https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Medio+Porte+3', category: 'medium', alt: 'Trabalho profissional - Médio Porte' },
            { src: 'https://via.placeholder.com/400x300/E74C3C/FFFFFF?text=Grande+Porte+1', category: 'large', alt: 'Trabalho profissional - Grande Porte' },
            { src: 'https://via.placeholder.com/400x300/E74C3C/FFFFFF?text=Grande+Porte+2', category: 'large', alt: 'Trabalho profissional - Grande Porte' },
            { src: 'https://via.placeholder.com/400x300/E74C3C/FFFFFF?text=Grande+Porte+3', category: 'large', alt: 'Trabalho profissional - Grande Porte' }
        ];
        
        this.portfolioImages = fallbackImages;
        
        // Mostrar mensagem para o usuário
        const portfolioSection = document.querySelector('#portfolio .section-subtitle');
        if (portfolioSection) {
            portfolioSection.innerHTML = 'Alguns dos meus trabalhos<br><small style="color: #666; font-size: 0.8em;">⚠️ Conectando com servidor de imagens...</small>';
        }
    }

    displayPortfolioItems(category = 'all') {
        this.portfolioGrid.innerHTML = '';
        
        const filteredImages = category === 'all' 
            ? this.portfolioImages 
            : this.portfolioImages.filter(img => img.category === category);
        
        console.log(`Exibindo ${filteredImages.length} imagens para categoria: ${category}`);
        
        // Limitar a 12 imagens para melhor performance
        const displayImages = filteredImages.slice(0, 12);
        
        if (displayImages.length === 0) {
            this.portfolioGrid.innerHTML = '<p class="no-images">Nenhuma imagem encontrada para esta categoria.</p>';
            return;
        }
        
        displayImages.forEach((image, index) => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item fade-in';
            portfolioItem.innerHTML = `
                <img src="${image.src}" alt="${image.alt}" loading="lazy" onerror="this.style.display='none'">
                <div class="portfolio-overlay">
                    <i class="fas fa-search-plus"></i>
                </div>
            `;
            
            // Adicionar evento de clique para modal
            portfolioItem.addEventListener('click', () => this.openModal(image.src, image.alt));
            
            this.portfolioGrid.appendChild(portfolioItem);
            
            // Trigger animation
            setTimeout(() => {
                portfolioItem.classList.add('visible');
            }, index * 100);
        });
    }

    setupEventListeners() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remover classe active de todos os botões
                this.filterBtns.forEach(b => b.classList.remove('active'));
                // Adicionar classe active ao botão clicado
                btn.classList.add('active');
                
                // Filtrar itens do portfólio
                const category = btn.getAttribute('data-filter');
                this.displayPortfolioItems(category);
            });
        });
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <img src="" alt="">
            </div>
        `;
        document.body.appendChild(modal);
        
        // Eventos para fechar modal
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
        
        return modal;
    }

    openModal(src, alt) {
        if (!this.modal) {
            this.modal = this.createModal();
        }
        
        const modalImg = this.modal.querySelector('img');
        modalImg.src = src;
        modalImg.alt = alt;
        this.modal.style.display = 'block';
    }
}

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const contactForm = document.getElementById('contactForm');

// Mobile Navigation
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form Handler
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const petName = formData.get('petName');
    const service = formData.get('service');
    const message = formData.get('message');
    
    // Create WhatsApp message
    let whatsappMessage = `🐾 *CONTRATAÇÃO DE SERVIÇOS* 🐾\n\n`;
    whatsappMessage += `Olá Janaina! Gostaria de contratar seus serviços de tosa profissional.\n\n`;
    whatsappMessage += `*Nome:* ${name}\n`;
    whatsappMessage += `*Telefone:* ${phone}\n`;
    whatsappMessage += `*Nome do Pet:* ${petName}\n`;
    whatsappMessage += `*Serviço:* ${service}\n`;
    if (message) {
        whatsappMessage += `*Observações:* ${message}\n`;
    }
    whatsappMessage += `\nQuando você tem disponibilidade para atender?`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/5517988146826?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Reset form
    this.reset();
});

// Scroll animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(252, 252, 252, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(252, 252, 252, 0.95)';
        header.style.boxShadow = 'none';
    }
}

// Event Listeners
window.addEventListener('scroll', () => {
    handleScrollAnimations();
    handleHeaderScroll();
});

window.addEventListener('load', () => {
    handleScrollAnimations();
});

// Initialize portfolio on page load
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar o gerenciador de portfólio
    new PortfolioManager();
    
    // Add fade-in class to elements
    const elementsToAnimate = document.querySelectorAll('.hero-content, .hero-image, .about-text, .about-image, .service-card, .contact-item, .contact-form');
    elementsToAnimate.forEach(element => {
        element.classList.add('fade-in');
    });
    
    // Trigger initial animations
    setTimeout(handleScrollAnimations, 100);
});

// Keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal');
        if (modal && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    }
});

// Performance optimization: Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    // Observar imagens com data-src
    setTimeout(() => {
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }, 1000);
}

