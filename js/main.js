// SPA Router Logic
function handleRouting() {
    const hash = window.location.hash || '#home';
    const pageId = 'page-' + hash.substring(1);
    
    // Hide all pages
    document.querySelectorAll('.page-view').forEach(page => {
        page.classList.add('hidden');
    });
    
    // Show target page, fallback to home
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    } else {
        document.getElementById('page-home').classList.remove('hidden');
    }
    
    // Reset scroll to top smoothly or instantly
    window.scrollTo({ top: 0, behavior: 'instant' });
    lucide.createIcons();
}

// Listen for hash changes (when user clicks links or uses back button)
window.addEventListener('hashchange', handleRouting);
// Initial route on load
window.addEventListener('DOMContentLoaded', handleRouting);

// Initialize Lucide Icons
lucide.createIcons();

// Sticky Header Logic
const header = document.getElementById('header');
const scrollThreshold = 50;

window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
        header.classList.add('header-scrolled');
        header.classList.remove('bg-white/80'); // Let the CSS handle it cleanly
    } else {
        header.classList.remove('header-scrolled');
        header.classList.add('bg-white/80');
    }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking a link
mobileLinks.forEach(link => {
    link.addEventListener('click', toggleMobileMenu);
});

// Form Submission Logic (Web3Forms)
async function submitForm(e) {
    e.preventDefault();
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error');
    
    // Disable button and show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 mr-2 animate-spin"></i> Enviando...';
    lucide.createIcons();
    
    successMsg.classList.add('hidden');
    if (errorMsg) errorMsg.classList.add('hidden');

    const formData = new FormData(form);

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();

        if (data.success) {
            form.reset();
            successMsg.classList.remove('hidden');
            setTimeout(() => {
                successMsg.classList.add('hidden');
            }, 8000);
        } else {
            if (errorMsg) errorMsg.classList.remove('hidden');
            console.error('Web3Forms Error:', data);
        }
    } catch (error) {
        if (errorMsg) errorMsg.classList.remove('hidden');
        console.error('Submission Error:', error);
    } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        lucide.createIcons();
    }
}

// Attach the new submit handler
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', submitForm);
    }
});

// Modal Logic
function openModal(modalId, titleText) {
    const modal = document.getElementById(modalId);
    const title = document.getElementById('modal-title-text');
    const contentArea = document.getElementById('modal-content-area');
    
    if (titleText && title) {
        title.innerText = titleText;
    }

    // Inject dynamic content if it's the legal modal
    if (modalId === 'legal-modal' && contentArea) {
        let templateId = '';
        if (titleText === 'Aviso Legal') templateId = 'tpl-aviso-legal';
        else if (titleText === 'Política de Privacidad') templateId = 'tpl-politica-privacidad';
        else if (titleText === 'Política de Cookies') templateId = 'tpl-politica-cookies';
        
        if (templateId) {
            const template = document.getElementById(templateId);
            contentArea.innerHTML = template.innerHTML;
        }
    }
    
    modal.classList.remove('hidden');
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('hidden');
    // Restore background scrolling
    document.body.style.overflow = 'auto';
}

// Close modal on Escape key press
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.fixed.z-\\[100\\]:not(.hidden)');
        openModals.forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// Cookie Banner Logic
document.addEventListener('DOMContentLoaded', () => {
    const cookieBanner = document.getElementById('cookie-banner');
    const btnAccept = document.getElementById('btn-accept-cookies');
    const btnReject = document.getElementById('btn-reject-cookies');
    const btnConfig = document.getElementById('btn-config-cookies');

    // Check if user has already made a choice
    if (!localStorage.getItem('cookies_accepted') && cookieBanner) {
        // Show banner after a short delay for smooth animation
        setTimeout(() => {
            cookieBanner.classList.remove('translate-y-full');
            cookieBanner.classList.add('translate-y-0');
        }, 500);
    }

    function hideCookieBanner() {
        if(cookieBanner) {
            cookieBanner.classList.remove('translate-y-0');
            cookieBanner.classList.add('translate-y-full');
        }
    }

    if(btnAccept) {
        btnAccept.addEventListener('click', () => {
            localStorage.setItem('cookies_accepted', 'all');
            hideCookieBanner();
            // Here you would normally load Google Analytics scripts
        });
    }

    if(btnReject) {
        btnReject.addEventListener('click', () => {
            localStorage.setItem('cookies_accepted', 'rejected');
            hideCookieBanner();
        });
    }

    if(btnConfig) {
        btnConfig.addEventListener('click', () => {
            // Open the cookies policy modal where they could configure it
            openModal('legal-modal', 'Política de Cookies');
        });
    }
});
