/**
 * Run all startup functions
 */
function runStartup() {
    handleTooltipCopy();
    const themeChanger = new ThemeChanger();
}

/**
 * Set event handlers for all element with copyable class,
 * Copy their data-text attribute to clipboard on click
 * and sets a help text for 2 seconds
 */
function handleTooltipCopy() {
    document.querySelectorAll(".copyable").forEach(tooltip => {
        tooltip.addEventListener("click", (event) => {
            const dataToCopy = event.target.getAttribute("data-text");
            // Workaround to copy a text from textarea
            const tempTextArea = document.createElement("textarea");
            tempTextArea.value = dataToCopy;
            tempTextArea.setAttribute('readonly', '');
            tempTextArea.style.position = 'absolute';
            tempTextArea.style.left = '-9999px';
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand("copy");
            document.body.removeChild(tempTextArea);

            event.target.setAttribute("data-text", "Copied!");
            setTimeout(() => {
                event.target.setAttribute("data-text", dataToCopy);
            }, 2000);
        });
    });
}

class ThemeChanger {
    /** Possible values: "light" | "dark" */
    currentTheme;
    triggerElement;
    parentElement;

    constructor() {
        this.triggerElement = document.querySelector(".theme-changer");
        this.parentElement = document.querySelector("body");
        this.currentTheme = this.getThemeCookie();
        if (this.currentTheme == "dark") this.changeToDark();
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.triggerElement.addEventListener("click", () => {
            switch (this.currentTheme) {
                case "light":
                    this.changeToDark();
                    break;
                case "dark":
                    this.changeToLight();
                    break;
                default:
                    break;
            }
        });
    }

    changeToDark() {
        this.currentTheme = "dark";
        this.triggerElement.innerText = "light";
        this.parentElement.className = "theme-dark";
        setGlobalCookie("theme", "dark");
    }

    changeToLight() {
        this.currentTheme = "light";
        this.triggerElement.innerText = "dark";
        this.parentElement.className = "theme-light";
        setGlobalCookie("theme", "light");
    }

    getThemeCookie() {
        let themeCookie = document.cookie.split("; ").find(cookie => cookie.startsWith("theme="));
        if (themeCookie) {
            themeCookie = themeCookie.split("=")[1];
        } else {
            themeCookie = "light";
        }
        return themeCookie;
    }
}

function setGlobalCookie(key, value) {
    document.cookie = `${key}=${value}; path=/`
}

runStartup();
