/**
 * View Transition API - MPA Implementation
 *
 * This script enables smooth page transitions using the View Transition API
 * in a Multi-Page Application (MPA) context. When a user clicks on internal
 * links, the browser will animate between the old and new page states.
 *
 * Browser Support: Chrome 111+, Edge 111+
 * Fallback: Graceful degradation to standard navigation
 */

(function() {
    'use strict';

    /**
     * Check if the browser supports the View Transition API
     */
    function supportsViewTransitions() {
        return 'startViewTransition' in document;
    }

    /**
     * Enable view transitions for same-origin navigation
     */
    function enableViewTransitions() {
        if (!supportsViewTransitions()) {
            console.log('View Transition API not supported in this browser');
            return;
        }

        // Add meta tag to enable view transitions for cross-document navigations
        // This is the key for MPA transitions
        const meta = document.createElement('meta');
        meta.name = 'view-transition';
        meta.content = 'same-origin';
        document.head.appendChild(meta);

        console.log('View Transition API enabled for MPA navigation');
    }

    /**
     * Optional: Add custom transition classes based on navigation direction
     * This can be used to create different animations for forward/back navigation
     */
    function setupNavigationTypes() {
        if (!supportsViewTransitions()) {
            return;
        }

        // Listen for navigation events to add custom classes
        window.addEventListener('pagereveal', (event) => {
            // Page is being revealed (navigated to)
            if (event.viewTransition) {
                const fromURL = document.referrer;
                const toURL = window.location.href;

                // You can add logic here to determine navigation direction
                // and apply different transition styles
                console.log('View transition active:', {
                    from: fromURL,
                    to: toURL
                });
            }
        });

        window.addEventListener('pagehide', (event) => {
            // Page is being hidden (navigated away from)
            if (event.viewTransition) {
                console.log('Page transitioning out');
            }
        });
    }

    /**
     * Initialize view transitions when DOM is ready
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                enableViewTransitions();
                setupNavigationTypes();
            });
        } else {
            enableViewTransitions();
            setupNavigationTypes();
        }
    }

    // Start the initialization
    init();

})();
