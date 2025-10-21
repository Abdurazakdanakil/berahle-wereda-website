/* global L */
// Initialize the map
        function initMap() {
            const mapContainer = document.getElementById('berahle-map');
            const loadingIndicator = mapContainer?.querySelector('.map-loading');
            if (!mapContainer || !loadingIndicator) {
                console.error('Map container or loading indicator not found');
                return;
            }
            loadingIndicator.style.display = 'block';
            
            try {
                // Coordinates for Berahle Wereda (approximate)
                const berahleCoords = [13.83, 40.33];
                
                // Create the map
                const map = L.map('berahle-map').setView(berahleCoords, 10);
                
                // Add OpenStreetMap tiles
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map).on('load', () => {
                    loadingIndicator.style.display = 'none';
                });
                
                // Add a marker for Berahle Woreda
                L.marker(berahleCoords).addTo(map)
                    .bindPopup('<b>Berahle Wereda</b><br>Administrative Zone 2, Afar Region')
                    .openPopup();
                
                // Add a circle to show the approximate area
                L.circle(berahleCoords, {
                    color: '#078930',
                    fillColor: '#078930',
                    fillOpacity: 0.1,
                    radius: 15000
                }).addTo(map).bindPopup("Berahle Woreda Area");
            } catch (error) {
                console.error('Map initialization failed:', error);
                loadingIndicator.textContent = 'Failed to load map';
            }
        }

        // Debounce function
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // Smooth scroll with fallback
        function smoothScroll(targetId) {
            try {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Try scrollIntoView for better compatibility
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Fallback to window.scrollTo for precise offset
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    console.debug(`Scrolled to ${targetId}`);
                } else {
                    console.warn(`Target element for ${targetId} not found`);
                }
            } catch (error) {
                console.error(`Smooth scroll failed for ${targetId}:`, error);
            }
        }

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            try {
                // Initialize map
                initMap();

                // Log available sections for debugging
                const sections = document.querySelectorAll('section[id]');
                console.debug('Found sections:', Array.from(sections).map(s => s.id));

                // Smooth scrolling for navigation links
                document.querySelectorAll('nav a').forEach(anchor => {
                    anchor.addEventListener('click', function(e) {
                        try {
                            e.preventDefault();
                            const targetId = this.getAttribute('href');
                            console.debug(`Nav link clicked: ${targetId}`);
                            
                            smoothScroll(targetId);
                            
                            // Update active state
                            document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
                            this.classList.add('active');
                            
                            // Close mobile menu if open
                            const nav = document.querySelector('#main-nav ul');
                            if (nav) nav.classList.remove('active');
                        } catch (error) {
                            console.error(`Nav link click failed for ${this.getAttribute('href')}:`, error);
                        }
                    });
                });

                // Smooth scrolling for other internal links (e.g., feature-link, service-btn, card-button)
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function(e) {
                        try {
                            e.preventDefault();
                            const targetId = this.getAttribute('href');
                            console.debug(`Internal link clicked: ${targetId}`);
                            smoothScroll(targetId);
                        } catch (error) {
                            console.error(`Internal link click failed for ${this.getAttribute('href')}:`, error);
                        }
                    });
                });

                // Scroll-based active navigation
                window.addEventListener('scroll', debounce(() => {
                    try {
                        const sections = document.querySelectorAll('section[id]');
                        const scrollPos = window.scrollY + 100;

                        sections.forEach(section => {
                            if (!section || typeof section.offsetTop === 'undefined') {
                                console.warn('Invalid section detected:', section);
                                return;
                            }

                            const sectionTop = section.offsetTop;
                            const sectionHeight = section.offsetHeight;
                            const sectionId = section.getAttribute('id');

                            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                                document.querySelectorAll('nav a').forEach(link => {
                                    link.classList.remove('active');
                                    if (link.getAttribute('href') === `#${sectionId}`) {
                                        link.classList.add('active');
                                    }
                                });
                            }
                        });
                    } catch (error) {
                        console.error('Scroll event handler failed:', error);
                    }
                }, 100));

                // Mobile menu toggle
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu) {
                    mobileMenu.addEventListener('click', () => {
                        try {
                            console.debug('Mobile menu toggled');
                            toggleMenu();
                        } catch (error) {
                            console.error('Mobile menu toggle failed:', error);
                        }
                    });
                } else {
                    console.warn('Mobile menu button not found');
                }
            } catch (error) {
                console.error('DOMContentLoaded handler failed:', error);
            }
        });

        // Mobile menu toggle
        function toggleMenu() {
            try {
                const nav = document.querySelector('#main-nav ul');
                if (nav) {
                    nav.classList.toggle('active');
                    console.debug('Nav menu toggled:', nav.classList.contains('active') ? 'open' : 'closed');
                } else {
                    console.warn('Navigation menu not found');
                }
            } catch (error) {
                console.error('Toggle menu failed:', error);
            }
        }

        // FAQ toggle functionality
        function toggleFaq(element) {
            try {
                const faqItem = element.parentElement;
                if (!faqItem) {
                    console.warn('FAQ item parent not found');
                    return;
                }
                const isActive = faqItem.classList.toggle('active');
                const toggle = element.querySelector('.faq-toggle');
                if (toggle) toggle.textContent = isActive ? '-' : '+';
                element.setAttribute('aria-expanded', isActive);
                console.debug(`FAQ toggled: ${isActive ? 'expanded' : 'collapsed'}`);
            } catch (error) {
                console.error('FAQ toggle failed:', error);
            }
        }

        // Tourism details toggle
        function toggleDetails(id) {
            try {
                const details = document.getElementById(id);
                if (!details) {
                    console.warn(`Details element not found: ${id}`);
                    return;
                }
                const isHidden = details.classList.toggle('details-hidden');
                details.classList.toggle('details-visible', !isHidden);
                console.debug(`Details toggled for ${id}: ${isHidden ? 'hidden' : 'visible'}`);
            } catch (error) {
                console.error(`Details toggle failed for ${id}:`, error);
            }
        }

        // Form submission with validation
        document.getElementById('contactForm')?.addEventListener('submit', function(e) {
            try {
                e.preventDefault();
                const formMessage = document.getElementById('formMessage');
                if (!formMessage) {
                    console.warn('Form message element not found');
                    return;
                }

                const name = document.getElementById('name')?.value.trim();
                const email = document.getElementById('email')?.value.trim();
                const subject = document.getElementById('subject')?.value;
                const message = document.getElementById('message')?.value.trim();

                if (!name || name.length < 2) {
                    formMessage.textContent = 'Please enter a valid name (minimum 2 characters).';
                    formMessage.className = 'form-message error';
                    formMessage.style.display = 'block';
                    console.debug('Form validation failed: Invalid name');
                    return;
                }

                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    formMessage.textContent = 'Please enter a valid email address.';
                    formMessage.className = 'form-message error';
                    formMessage.style.display = 'block';
                    console.debug('Form validation failed: Invalid email');
                    return;
                }

                if (!subject) {
                    formMessage.textContent = 'Please select a subject.';
                    formMessage.className = 'form-message error';
                    formMessage.style.display = 'block';
                    console.debug('Form validation failed: No subject selected');
                    return;
                }

                if (!message || message.length < 10) {
                    formMessage.textContent = 'Please enter a message (minimum 10 characters).';
                    formMessage.className = 'form-message error';
                    formMessage.style.display = 'block';
                    console.debug('Form validation failed: Invalid message');
                    return;
                }

                // Simulate successful submission (replace with actual backend integration)
                formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
                this.reset();
                console.debug('Form submitted successfully');
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            } catch (error) {
                console.error('Form submission failed:', error);
            }
        });

        // Global error handler for uncaught errors
        window.addEventListener('error', function(event) {
            console.error('Uncaught error:', event.error);
        });

        // Export functions used from HTML attributes so ESLint doesn't flag them as unused
window.toggleFaq = toggleFaq;
window.toggleDetails = toggleDetails;