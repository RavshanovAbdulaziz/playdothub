// ============= ASOSIY O'ZGARUVCHILAR =============
let touchStartY = 0;
let touchEndY = 0;
const pullThreshold = 100;
let isPulling = false;

// ============= O'YINLARNI KO'RSATISH =============
function displayGames(filteredGames = games) {
    const gamesContainer = document.getElementById('games-grid');
    if (!gamesContainer) return;

    showLoading();
    gamesContainer.innerHTML = '';
    
    filteredGames.forEach(game => {
        const gameCard = `
            <div class="game-card">
                <img 
                    src="${game.image}" 
                    alt="${game.title}" 
                    class="game-image" 
                    loading="lazy"
                    onerror="handleImageError(this)"
                >
                <div class="game-info">
                    <span class="category-badge">${game.category}</span>
                    <h3>${game.title}</h3>
                    <p class="game-description">${game.description || ''}</p>
                    <button 
                        class="play-button" 
                        onclick='openGameModal(${JSON.stringify(game).replace(/'/g, "\\'")})'
                    >
                        Play Now
                    </button>
                </div>
            </div>
        `;
        gamesContainer.innerHTML += gameCard;
    });

    hideLoading();
}

// ============= MODAL FUNKSIYALARI =============
function openGameModal(game) {
    const modal = document.getElementById('gameModal');
    const gameFrame = document.getElementById('gameFrame');
    const gameTitle = document.getElementById('gameTitle');
    
    gameTitle.textContent = game.title;
    gameFrame.src = game.url;
    modal.style.display = 'block';
    
    document.body.style.overflow = 'hidden';
}

function closeGameModal() {
    const modal = document.getElementById('gameModal');
    const gameFrame = document.getElementById('gameFrame');
    
    gameFrame.src = '';
    modal.style.display = 'none';
    modal.classList.remove('fullscreen');
    
    document.body.style.overflow = 'auto';
}

// ============= FULLSCREEN FUNKSIYALARI =============
function toggleFullscreen() {
    const modal = document.getElementById('gameModal');
    const modalContent = modal.querySelector('.modal-content');
    
    if (!document.fullscreenElement) {
        // Fullscreen ga o'tish
        if (modal.requestFullscreen) {
            modal.requestFullscreen();
        } else if (modal.webkitRequestFullscreen) {
            modal.webkitRequestFullscreen();
        } else if (modal.msRequestFullscreen) {
            modal.msRequestFullscreen();
        }
        modal.classList.add('fullscreen');
    } else {
        // Fullscreen dan chiqish
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        modal.classList.remove('fullscreen');
    }
}

// ============= TOUCH FUNKSIYALARI =============
function initializeTouchEvents() {
    const gamesContainer = document.getElementById('games-grid');
    const pullIndicator = document.querySelector('.pull-to-refresh');

    gamesContainer.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        if (window.scrollY === 0) {
            isPulling = true;
        }
    });

    gamesContainer.addEventListener('touchmove', (e) => {
        if (!isPulling) return;
        
        touchEndY = e.touches[0].clientY;
        const pullDistance = touchEndY - touchStartY;

        if (pullDistance > 0 && pullDistance < pullThreshold) {
            pullIndicator.style.transform = `translateY(${pullDistance}px)`;
            e.preventDefault();
        }
    });

    gamesContainer.addEventListener('touchend', () => {
        if (!isPulling) return;

        const pullDistance = touchEndY - touchStartY;
        if (pullDistance > pullThreshold) {
            // Refresh games
            displayGames();
        }

        pullIndicator.style.transform = '';
        isPulling = false;
    });
}

// ============= PULL TO REFRESH =============
function handlePullToRefresh() {
    // Pull to refresh logikasi
}

// ============= ORIENTATION O'ZGARISHI =============
function handleOrientationChange() {
    // Orientation o'zgarishini boshqarish
}

// ============= DOUBLE TAP =============
function initializeDoubleTap() {
    // Double tap funksionalligi
}

// ============= ERROR HANDLING =============
function handleError(error) {
    // Xatolarni boshqarish
}

// Fullscreen o'zgarishini kuzatish
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    const modal = document.getElementById('gameModal');
    if (!document.fullscreenElement && 
        !document.webkitFullscreenElement && 
        !document.mozFullScreenElement && 
        !document.msFullscreenElement) {
        modal.classList.remove('fullscreen');
    }
}

// Loading functions
function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'block';
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
}

// Xatoliklarni ushlash uchun
function handleImageError(img) {
    img.onerror = null;
    img.src = 'assets/placeholder.jpg';
}

function filterGames(category) {
    const filteredGames = category === 'all' 
        ? games 
        : games.filter(game => game.category.toLowerCase() === category.toLowerCase());
    
    // Active class ni yangilash
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        if (link.dataset.category === category) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    displayGames(filteredGames);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    try {
        displayGames();
        
        const categoryLinks = document.querySelectorAll('[data-category]');
        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.dataset.category;
                filterGames(category);
            });
        });

        // Modal control listeners
        document.getElementById('closeModal').addEventListener('click', closeGameModal);
        document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
        
        // Close modal when clicking outside
        document.getElementById('gameModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                closeGameModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeGameModal();
            }
        });

        // Add mobile-specific event listeners
        if ('ontouchstart' in window) {
            initializeTouchEvents();
            initializeDoubleTap();
        }

        // Add orientation change handler
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                const modal = document.getElementById('gameModal');
                if (modal.style.display === 'block') {
                    adjustModalSize();
                }
            }, 100);
        });

    } catch (error) {
        console.error('Error initializing app:', error);
    }
});

// Modal size adjustment
function adjustModalSize() {
    const modal = document.getElementById('gameModal');
    const modalContent = modal.querySelector('.modal-content');
    
    if (window.innerWidth < 768) {
        modalContent.style.width = '100%';
        modalContent.style.height = '100vh';
        modalContent.style.margin = '0';
        modalContent.style.borderRadius = '0';
    } else {
        modalContent.style.width = '90%';
        modalContent.style.height = '90vh';
        modalContent.style.margin = '2vh auto';
        modalContent.style.borderRadius = '12px';
    }
}
