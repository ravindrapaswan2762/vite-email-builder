// localStorageUtils.js

/**
 * Safely update `myDroppedItemsList` in localStorage
 * and dispatch a custom event for same-tab re-renders.
 */
export function updateMyDroppedItemsList(updatedList) {
    // 1. Write to localStorage
    localStorage.setItem("myDroppedItemsList", JSON.stringify(updatedList));
  
    // 2. Dispatch a custom event so other components can listen
    window.dispatchEvent(new Event("myDroppedItemsListUpdated"));
  }
  

export function extractSocialMediaHTML(currentStyles) {
        // Select the main SocialMedia component
        const socialMediaElement = document.querySelector("[data-social-media]");
    
        if (!socialMediaElement) {
            console.error("SocialMedia component not found.");
            return;
        }
    
        // Clone the element to avoid modifying the original
        const clonedElement = socialMediaElement.cloneNode(true);
    
        // Remove event listeners and dynamic attributes
        clonedElement.removeAttribute("data-social-media");
        clonedElement.querySelectorAll("[onClick]").forEach(el => el.removeAttribute("onClick"));
    
        // **Remove the first SVG (drag dots icon)**
        const firstSvg = clonedElement.querySelector("svg");
        if (firstSvg) firstSvg.remove();
    
        // **Find the parent div of icons and apply gap**
        const iconsParent = clonedElement.querySelector(".flex.items-center.w-full");
        if (iconsParent) {
            iconsParent.style.gap = "15px"; // ✅ Added gap in parent div of icons
        }
    
        // **Function to merge computed styles and `currentStyles`**
        function applyComputedStyles(element) {
            const computedStyle = window.getComputedStyle(element);
    
            // Merge computed styles with `currentStyles`
            let finalStyles = { ...computedStyle };
    
            // Apply `currentStyles` dynamically
            for (const key in currentStyles) {
                if (currentStyles[key]) {
                    finalStyles[key] = currentStyles[key];
                }
            }
    
            // **Remove padding from parent div**
            if (element === clonedElement) {
                delete finalStyles.padding;
                delete finalStyles.paddingTop;
                delete finalStyles.paddingBottom;
                delete finalStyles.paddingLeft;
                delete finalStyles.paddingRight;
            }
    
            // Convert styles into inline styles
            let inlineStyle = "";
            for (const [key, value] of Object.entries(finalStyles)) {
                if (value && value !== "initial" && value !== "auto" && value !== "0px") {
                    inlineStyle += `${key}: ${value}; `;
                }
            }
    
            // Apply styles correctly
            if (inlineStyle.trim().length > 0) {
                element.setAttribute("style", inlineStyle.trim());
            }
    
            // **Recursively apply styles to all children**
            [...element.children].forEach(child => applyComputedStyles(child));
        }
    
        // **Start applying styles from the root element**
        applyComputedStyles(clonedElement);
    
        // **Serialize and format the HTML properly**
        function formatHTML(htmlString) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, "text/html");
            return new XMLSerializer().serializeToString(doc);
        }
    
        // **Get final formatted static HTML**
        const staticHTML = formatHTML(clonedElement.outerHTML);
    
        console.log(staticHTML); // ✅ Output structured HTML
        return staticHTML; // ✅ Return formatted HTML string
    }