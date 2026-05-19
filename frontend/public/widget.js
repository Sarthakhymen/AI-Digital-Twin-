(function() {
    // Prevent multiple initializations
    if (window.AIDigitalTwinWidgetConfigured) return;
    window.AIDigitalTwinWidgetConfigured = true;

    // Find the script tag that loaded this file
    const scripts = document.getElementsByTagName('script');
    let currentScript = null;
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.includes('widget.js')) {
            currentScript = scripts[i];
            break;
        }
    }

    if (!currentScript) {
        console.error('AI Digital Twin Widget: Could not find script tag.');
        return;
    }

    const twinId = currentScript.getAttribute('data-twin-id');
    if (!twinId) {
        console.error('AI Digital Twin Widget: Missing data-twin-id attribute.');
        return;
    }

    // You can host this domain in an env variable or hardcode for production
    const BASE_URL = 'https://www.ai-digitaltwin.tech'; 
    // Fallback to localhost if developing locally (can be configured via a data attribute too)
    const widgetUrl = currentScript.getAttribute('data-host') || BASE_URL;

    // Create container
    const container = document.createElement('div');
    container.id = 'ai-twin-widget-container';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '999999';
    container.style.fontFamily = 'system-ui, -apple-system, sans-serif';

    // Create chat iframe (hidden initially)
    const iframe = document.createElement('iframe');
    iframe.src = `${widgetUrl}/embed/${twinId}`;
    iframe.style.display = 'none';
    iframe.style.width = '350px';
    iframe.style.height = '600px';
    iframe.style.maxHeight = '80vh';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '16px';
    iframe.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
    iframe.style.marginBottom = '16px';
    iframe.style.backgroundColor = 'white';
    iframe.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    iframe.style.opacity = '0';
    iframe.style.transform = 'translateY(20px)';

    // Create toggle button
    const button = document.createElement('button');
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
    `;
    button.style.width = '60px';
    button.style.height = '60px';
    button.style.borderRadius = '30px';
    button.style.backgroundColor = '#3b82f6';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)';
    button.style.display = 'flex';
    button.style.justifyContent = 'center';
    button.style.alignItems = 'center';
    button.style.marginLeft = 'auto';
    button.style.transition = 'transform 0.2s ease, background-color 0.2s ease';

    button.onmouseover = () => button.style.transform = 'scale(1.05)';
    button.onmouseout = () => button.style.transform = 'scale(1)';

    let isOpen = false;

    button.onclick = () => {
        isOpen = !isOpen;
        if (isOpen) {
            iframe.style.display = 'block';
            // Slight delay to allow display:block to apply before animating opacity
            setTimeout(() => {
                iframe.style.opacity = '1';
                iframe.style.transform = 'translateY(0)';
            }, 10);
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            `;
            button.style.backgroundColor = '#0f172a';
        } else {
            iframe.style.opacity = '0';
            iframe.style.transform = 'translateY(20px)';
            setTimeout(() => {
                iframe.style.display = 'none';
            }, 300);
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            `;
            button.style.backgroundColor = '#3b82f6';
        }
    };

    // Listen for messages from the iframe (like closing the widget from inside)
    window.addEventListener('message', (event) => {
        // Validate origin if needed, but for now just check the message
        if (event.data && event.data.type === 'CLOSE_WIDGET') {
            if (isOpen) button.click(); // trigger the close logic
        }
    });

    container.appendChild(iframe);
    container.appendChild(button);
    document.body.appendChild(container);

    // Mobile responsiveness adjustment
    const mediaQuery = window.matchMedia('(max-width: 480px)');
    function handleMobileChange(e) {
        if (e.matches) {
            iframe.style.width = 'calc(100vw - 40px)';
            iframe.style.height = 'calc(100vh - 120px)';
            iframe.style.maxHeight = 'none';
        } else {
            iframe.style.width = '350px';
            iframe.style.height = '600px';
            iframe.style.maxHeight = '80vh';
        }
    }
    mediaQuery.addListener(handleMobileChange);
    handleMobileChange(mediaQuery);

})();
