document.addEventListener('DOMContentLoaded', function() {
    const o = document.getElementById('o'); // Output element
    const iEl = document.getElementById('i'); // Input element
    const p = document.getElementById('p'); // Prompt element
    const fullscreenBtn = document.getElementById('fullscreen-btn'); // Fullscreen button

    // Centralized timer and animation management
    let activeTimers = [];
    let animationInProgress = false;

    // --- GLOBAL INPUT HANDLERS ---
    let menuInputHandler;
    let blogContentHandler;
    let archiveHandler;
    let mainInputHandler; // Ensure this is also globally accessible

    // Introduction steps with improved structure for clarity
    const introSteps = [
        { text: 'Hello!', pause: 900 },
        { text: 'Welcome to my website.', pause: 1200 },
        { text: "Type <span class='cc' data-c='help' tabindex='0'>'help'</span> to see available commands.", pause: 0, final: true }
    ];

    // Help message with correct styling for 'command' and 'command-name'
    const helpHTML = '<div>' +
        "<span class='cc' data-c='blog' tabindex='0' style='cursor:pointer'>blog</span>: read my blog<br>" +
        "<span class='cc' data-c='about' tabindex='0' style='cursor:pointer'>about</span>: find out more on what you've stumbled upon<br>" +
        "<span class='cc' data-c='contact' tabindex='0' style='cursor:pointer'>contact</span>: get my contact info<br>" +
        "<span class='cc' data-c='skills' tabindex='0' style='cursor:pointer'>skills</span>: see what I'm good at<br>" +
        "<span class='cc' data-c='hobbies' tabindex='0' style='cursor:pointer'>hobbies</span>: discover my hobbies and interests<br>" +
        "<span class='cc' data-c='dino' tabindex='0' style='cursor:pointer'>dino</span>: play the dino game<br>" +
        "<span class='cc' data-c='clear' tabindex='0' style='cursor:pointer'>clear</span>: clear the terminal<br>" +
        "<span class='cc' data-c='restart' tabindex='0' style='cursor:pointer'>restart</span>: restart the programme<br>" +
        '<br>For more information on a specific command, type help <span class=\'help-command-name\'>command-name</span></div>';

    // Main command handler
    mainInputHandler = function(e) { // Define mainInputHandler here once
        if (e.key === 'Enter' || e.keyCode === 13) {
            if (animationInProgress) {
                // If animation is in progress, attempt to skip it
                // Handled by individual animation's skip handler
            } else {
                e.preventDefault(); // Prevent default form submission
                if (iEl.value.trim() === '') {
                    // If input is empty, add a new prompt line
                    let promptDiv = document.createElement('div');
                    promptDiv.className = 'font-mono';
                    promptDiv.innerHTML = '<span class="text-green-400">&gt;</span>';
                    o.appendChild(promptDiv); o.scrollTop = o.scrollHeight;
                    iEl.value = '';
                } else {
                    handleCommand(iEl.value);
                }
            }
        }
    };
    iEl.addEventListener('keydown', mainInputHandler); // Attach initially

    // Blog Menu Input Handler
    menuInputHandler = function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            const val = iEl.value.trim().toLowerCase();
            iEl.value = '';
            if (val === 'clear' || val === 'reset') {
                // Remove blog menu handler
                iEl.removeEventListener('keydown', menuInputHandler);
                // Restore main handler (done by handleCommand)
                handleCommand(val);
            } else if (val === '1') {
                iEl.removeEventListener('keydown', menuInputHandler);
                showBlogContent();
            } else if (val === '2') {
                iEl.removeEventListener('keydown', menuInputHandler);
                showArchive();
            } else {
                typeAnim(o, 'Error: Invalid selection. Enter choice:', (typedDiv) => {
                    eraseAnim(typedDiv, 'Error: Invalid selection. Enter choice:', () => {
                        iEl.value = '';
                        iEl.focus();
                    }, 22);
                }, 32);
            }
        }
    };

    // Blog Content Input Handler
    blogContentHandler = function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            const val = iEl.value.trim().toLowerCase();
            iEl.value = '';
            if (val === '1') {
                iEl.removeEventListener('keydown', blogContentHandler);
                showArchive();
            } else if (val === 'exit') {
                iEl.removeEventListener('keydown', blogContentHandler);
                o.innerHTML = '';
                iEl.value = '';
                // Show the starting help page with typing animation
                typeAnim(o, introSteps[introSteps.length - 1].text, () => {
                    iEl.addEventListener('keydown', mainInputHandler);
                    iEl.focus();
                    attachClickHandlers(o.lastChild);
                }, 40);
            } else {
                typeAnim(o, "Type 'exit' to close or '1' to view archives.", (typedDiv) => {
                    eraseAnim(typedDiv, "Type 'exit' to close or '1' to view archives.", () => {
                        iEl.value = '';
                        iEl.focus();
                    }, 22);
                }, 32);
            }
        }
    };

    // Archive Input Handler
    archiveHandler = function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            const val = iEl.value.trim().toLowerCase();
            iEl.value = '';
            if (val === 'clear' || val === 'reset') {
                iEl.removeEventListener('keydown', archiveHandler);
                handleCommand(val);
            } else if (val === '1') { // Assuming '1' to view the featured blog from archives
                iEl.removeEventListener('keydown', archiveHandler);
                showBlogContent();
            } else if (val === 'back') {
                iEl.removeEventListener('keydown', archiveHandler);
                o.innerHTML = '';
                showBlogMenu();
            } else if (val === 'exit') {
                iEl.removeEventListener('keydown', archiveHandler);
                o.innerHTML = '';
                iEl.value = '';
                // Show the starting help page with typing animation
                typeAnim(o, introSteps[introSteps.length - 1].text, () => {
                    iEl.addEventListener('keydown', mainInputHandler);
                    iEl.focus();
                    attachClickHandlers(o.lastChild);
                }, 40);
            } else {
                typeAnim(o, "Type a number, 'back' to return, or 'exit' to close.", (typedDiv) => {
                    eraseAnim(typedDiv, "Type a number, 'back' to return, or 'exit' to close.", () => {
                        iEl.value = '';
                        iEl.focus();
                    }, 22);
                }, 32);
            }
        }
    };

    // Utility to stop all active animations/timers
    function stopAllAnimations() {
        animationInProgress = false;
        activeTimers.forEach(id => clearTimeout(id)); // Clear timeouts
        activeTimers = []; // Reset array
    }

    // Function to attach click handlers to .cc elements
    function attachClickHandlers(containerElement) {
        const clickableElements = containerElement.querySelectorAll('.cc');
        clickableElements.forEach(el => {
            // Ensure the element doesn't already have a click listener to prevent duplicates
            el.removeEventListener('click', handleCcClick);
            el.addEventListener('click', handleCcClick);
        });
    }

    function handleCcClick(e) {
        const command = e.target.getAttribute('data-c');
        if (command) {
            stopAllAnimations(); // Stop any ongoing animations
            iEl.value = command; // Set the input field with the command
            handleCommand(command); // Execute the command
        }
    }

    // Show/hide skip hint
    let skipHintTimeout;
    function showSkipHint() {
        let hint = document.getElementById('skip-hint');
        if (!hint) {
            hint = document.createElement('div');
            hint.id = 'skip-hint';
            hint.style.position = 'fixed';
            hint.style.bottom = '4.2rem';
            hint.style.right = '2.5rem';
            hint.style.left = 'auto';
            hint.style.transform = 'none';
            hint.style.background = 'rgba(24,24,27,0.95)';
            hint.style.color = '#facc15';
            hint.style.fontSize = '0.95em';
            hint.style.padding = '0.4em 1.2em';
            hint.style.borderRadius = '8px';
            hint.style.zIndex = '9999';
            hint.style.boxShadow = '0 2px 8px #000a';
            hint.style.pointerEvents = 'none';
            hint.style.opacity = '0';
            hint.style.transition = 'opacity 0.5s';
            hint.innerText = 'Press Enter to skip animation';
            document.body.appendChild(hint);
        } else {
            hint.style.display = '';
            hint.style.opacity = '0';
        }
        clearTimeout(skipHintTimeout);
        // Show immediately, no delay
        setTimeout(() => {
            hint.style.opacity = '1';
        }, 10);
    }
    function hideSkipHint() {
        let hint = document.getElementById('skip-hint');
        clearTimeout(skipHintTimeout);
        if (hint) {
            hint.style.opacity = '0';
            setTimeout(() => { if (hint) hint.style.display = 'none'; }, 500);
        }
    }

    // Unified typing animation utility with inline cursor handling
    function typeAnim(targetEl, html, cb, speed = 40, suppressBlankCursor = false, hideCursorOnDone = false) {
        stopAllAnimations(); // Stop any previous animations before starting a new one
        animationInProgress = true;
        showSkipHint();

        // Hide native input cursor when typing animation starts
        iEl.style.caretColor = 'transparent';

        // Detect if user is at (or near) the bottom before animation
        let shouldAutoScroll = Math.abs(o.scrollHeight - o.scrollTop - o.clientHeight) < 5;
        function onUserScroll() {
            if (Math.abs(o.scrollHeight - o.scrollTop - o.clientHeight) > 10) {
                shouldAutoScroll = false;
            }
        }
        o.addEventListener('scroll', onUserScroll);

        let tempDiv = document.createElement('div');
        targetEl.appendChild(tempDiv); // Append a temporary div for typing into
        if (shouldAutoScroll) o.scrollTop = o.scrollHeight;

        // Split HTML into tags and text
        const parts = [];
        let regex = /(<[^>]+>|[^<]+)/g;
        let match;
        while ((match = regex.exec(html)) !== null) {
            parts.push(match[0]);
        }
        let partIdx = 0;
        let charIdx = 0;
        let currentTimeoutId;
        let skipHandlerActive = true;
        let callbackCalled = false; // Prevent double-calling

        function isBlankPart(part) {
            if (!part) return true;
            if (part.trim() === '') return true;
            // Treat any <div ...></div> with no content as blank (even with attributes/styles)
            if (part.match(/^<div(\s+[^>]*)?>\s*<\/div>$/i)) return true;
            return false;
        }

        function finishAnimation() {
            if (callbackCalled) return;
            callbackCalled = true;
            animationInProgress = false;
            if (skipHandlerActive) {
                if (suppressBlankCursor) {
                    iEl.removeEventListener('keydown', skipAnyKeyHandler);
                } else {
                    iEl.removeEventListener('keydown', skipKeyboardSkipHandler);
                }
            }
            o.removeEventListener('scroll', onUserScroll); // Remove scroll listener
            hideSkipHint();
            cb && cb(tempDiv);
            // Show native input cursor when typing animation finishes
            iEl.style.caretColor = 'currentcolor';
            iEl.focus(); // Re-focus the input field
        }

        function anim() {
            if (!animationInProgress) return;
            let output = '';
            let done = false;
            for (let i = 0; i < partIdx; i++) {
                output += parts[i];
            }
            if (partIdx < parts.length) {
                if (parts[partIdx][0] === '<') {
                    output += parts[partIdx];
                    partIdx++;
                    charIdx = 0;
                } else {
                    output += parts[partIdx].slice(0, charIdx + 1);
                    charIdx++;
                    if (charIdx >= parts[partIdx].length) {
                        partIdx++;
                        charIdx = 0;
                    }
                }
            } else {
                done = true;
            }
            // Show cursor only if not done and current part is not blank
            let showCursor = !done && !isBlankPart(parts[partIdx]);
            tempDiv.innerHTML = output + (showCursor ? '<span class="blink-cursor">|</span>' : '');
            if (shouldAutoScroll) o.scrollTop = o.scrollHeight;
            if (!done) {
                currentTimeoutId = setTimeout(anim, speed);
                activeTimers.push(currentTimeoutId);
            } else {
                tempDiv.innerHTML = hideCursorOnDone ? html : html + '<span class="blink-cursor">|</span>';
                finishAnimation();
            }
        }
        anim();

        // Keyboard skip handler for typeAnim
        const skipKeyboardSkipHandler = function(e) {
            if (animationInProgress && (e.key === 'Enter' || e.keyCode === 13)) {
                stopAllAnimations();
                tempDiv.innerHTML = hideCursorOnDone ? html : html + '<span class="blink-cursor">|</span>';
                o.scrollTop = o.scrollHeight;
                iEl.removeEventListener('keydown', skipKeyboardSkipHandler);
                finishAnimation();
                e.preventDefault();
            }
        };
        // New: skip on any key for blog menu/post
        const skipAnyKeyHandler = function(e) {
            if (animationInProgress) {
                stopAllAnimations();
                tempDiv.innerHTML = hideCursorOnDone ? html : html + '<span class="blink-cursor">|</span>';
                o.scrollTop = o.scrollHeight;
                iEl.removeEventListener('keydown', skipAnyKeyHandler);
                finishAnimation();
                e.preventDefault();
            }
        };
        if (suppressBlankCursor) {
            iEl.addEventListener('keydown', skipAnyKeyHandler);
        } else {
        iEl.addEventListener('keydown', skipKeyboardSkipHandler);
        }
        // Removed iEl.focus() from here, handled in finishAnimation
    }

    // Erase animation utility with inline cursor handling
    function eraseAnim(elementToErase, msg, cb, speed = 25) { // elementToErase is the specific div to erase from
        stopAllAnimations(); // Stop any previous animations
        animationInProgress = true;

        // Hide native input cursor when erase animation starts
        iEl.style.caretColor = 'transparent';

        // Detect if user is at (or near) the bottom before animation
        let shouldAutoScroll = Math.abs(o.scrollHeight - o.scrollTop - o.clientHeight) < 5;
        function onUserScroll() {
            if (Math.abs(o.scrollHeight - o.scrollTop - o.clientHeight) > 10) {
                shouldAutoScroll = false;
            }
        }
        o.addEventListener('scroll', onUserScroll);

        if (!elementToErase || !elementToErase.parentNode) {
            console.error("Invalid element passed to eraseAnim:", elementToErase);
            animationInProgress = false;
            o.removeEventListener('scroll', onUserScroll);
            cb && cb();
            return;
        }

        let n = msg.length;
        let currentTimeoutId;

        function erase() {
            if (!animationInProgress) return;

            elementToErase.innerHTML = msg.slice(0, n) + '<span class="blink-cursor">|</span>'; // Embed cursor directly
            if (shouldAutoScroll) o.scrollTop = o.scrollHeight;

            if (n >= 0) {
                n--;
                currentTimeoutId = setTimeout(erase, speed);
                activeTimers.push(currentTimeoutId);
            } else {
                // Animation finished
                elementToErase.remove(); // Remove the element itself
                animationInProgress = false;
                o.removeEventListener('scroll', onUserScroll); // Remove scroll listener
                cb && cb();
                // Show native input cursor when erase animation finishes
                iEl.style.caretColor = 'currentcolor';
                iEl.focus(); // Re-focus the input field
            }
        }
        erase();
        // Removed iEl.focus() from here, handled in erase() completion
    }

    // Refactored clearTerminal to chain animations correctly
    function clearTerminal() {
        stopAllAnimations();
        animationInProgress = true;

        o.style.transition = 'filter 0.4s, opacity 0.4s';
        o.style.filter = 'blur(2px)'; o.style.opacity = '0.3';
        
        const fadeOutTimeout = setTimeout(() => {
            o.style.filter = ''; o.style.opacity = '';
            o.innerHTML = ''; // Clear content after fade

            typeAnim(o, 'Terminal cleared.', (typedClearedDiv) => { // Pass the typed div to callback
                eraseAnim(typedClearedDiv, 'Terminal cleared.', () => { // Pass the div to erase from
                    typeAnim(o, introSteps[introSteps.length - 1].text, () => {
                        animationInProgress = false;
                        iEl.focus();
                        attachClickHandlers(o.lastChild); // Attach handlers after clear
                    }, 40, false, true); // Slower typing for intro to be visible after clear, hideCursorOnDone: true
            }, 40); // Slower typing for 'Terminal cleared.'
            }, 40, false, true); // Slower typing for 'Terminal cleared.', hideCursorOnDone: true
        }, 200); // Faster fade out
        activeTimers.push(fadeOutTimeout);
    }

    // Instagram redirect animation logic (updated for inline cursor)
    function handleInstagramRedirect() {
        stopAllAnimations();
        animationInProgress = true;

        let confirmDiv = document.createElement('div');
        confirmDiv.className = 'font-mono'; // Remove text-yellow-400
        confirmDiv.innerHTML = `Redirect to <span class='underline'>Instagram</span>? (y/n)`;
        o.appendChild(confirmDiv); o.scrollTop = o.scrollHeight;
        iEl.value = '';
        iEl.removeAttribute('disabled');
        iEl.focus();

        // Remove main input handler
        iEl.removeEventListener('keydown', mainInputHandler);

        function cleanup() {
            animationInProgress = false;
            confirmDiv.remove();
            iEl.value = '';
            iEl.focus();
            // Restore main input handler
            iEl.removeEventListener('keydown', inputHandler);
            iEl.addEventListener('keydown', mainInputHandler);
        }

        function exitAnim(msg, cb) {
            typeAnim(o, msg, (typedDiv) => {
                eraseAnim(typedDiv, msg, cb, 22);
            }, 32, false, true); // hideCursorOnDone: true
        }

        function doRedirect() {
            cleanup();
            // Animated 'redirecting...' effect for 2 seconds
            let animDiv = document.createElement('div');
            animDiv.className = 'font-mono';
            o.appendChild(animDiv); o.scrollTop = o.scrollHeight;
            let dots = 0;
            let steps = 0;
            let maxSteps = 13; // ~2 seconds at 150ms per step
            function animate() {
                if (steps < maxSteps) {
                    let dotStr = '.'.repeat(dots);
                    animDiv.innerHTML = 'redirecting' + dotStr + '<span class="blink-cursor">|</span>';
                    dots = (dots + 1) % 4;
                    steps++;
                    setTimeout(animate, 150);
                } else {
                    animDiv.innerHTML = 'redirecting...';
            setTimeout(() => {
                animDiv.remove();
                window.open('http://instagram.zafar.co.in/', '_blank');
                    }, 200);
                }
            }
            animate();
        }
        function cancelRedirect() {
            cleanup();
            exitAnim('Redirect cancelled.', () => {});
        }

        function invalidInput() {
            typeAnim(o, 'Please type y or n and press Enter.', (typedDiv) => {
                eraseAnim(typedDiv, 'Please type y or n and press Enter.', () => {
                    iEl.value = '';
                    iEl.focus();
                }, 22);
            }, 32, false, true); // hideCursorOnDone: true
        }

        function inputHandler(e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                const val = iEl.value.trim().toLowerCase();
                if (val === 'y') {
                    doRedirect();
                } else if (val === 'n') {
                    cancelRedirect();
                } else {
                    iEl.value = '';
                    invalidInput();
                }
            }
        }
        iEl.addEventListener('keydown', inputHandler);
    }

    function showPrompt(cmd) {
        let promptDiv = document.createElement('div');
        promptDiv.style.marginTop = '1.2em';
        promptDiv.innerHTML = '<span class=\'text-green-400\'>&gt;</span> <span class=\'text-white\'>' + cmd + '</span>';
        o.appendChild(promptDiv); o.scrollTop = o.scrollHeight;
    }

    function handleEmailCopy() {
        const email = 'zafaer213133@gmail.com';
        navigator.clipboard.writeText(email);
        typeAnim(o, 'email id copied', (typedEmailDiv) => eraseAnim(typedEmailDiv, 'email id copied', () => {}), 16, false, true); // Pass typed div to erase, hideCursorOnDone: true
    }

    // helpText function with map for command-specific help
    function helpText(arg) {
        // No arg means show general helpHTML
        if (!arg) return helpHTML; 

        // Map of specific help contents
        const map = {
            contact: '<div class=\'text-white\'><span class=\'font-bold text-green-400\'>contact</span>: Get my contact info.<br><br>Type <span class=\'font-mono\'>contact instagram</span> to get my Instagram link.<br>Type <span class=\'font-mono\'>contact email</span> to copy my email address.<br><br></div>',
            about: '<div class=\'text-white\'><span class=\'font-bold text-green-400\'>about</span>: Learn more about this website and its creator.<br></div>',
            clear: '<div class=\'text-white\'><span class=\'font-bold text-green-400\'>clear</span>: Clears the terminal and shows the help prompt again.<br></div>',
            skills: '<div class=\'text-white\'><span class=\'font-bold text-green-400\'>skills</span>: See a list of my main skills and strengths.<br></div>',
            hobbies: '<div class=\'text-white\'><span class=\'font-bold text-green-400\'>hobbies</span>: Discover my hobbies and interests.<br></div>'
        };

        // Return specific help or a 'no additional help' message
        return map[arg] || '<div class=\'text-gray-400\'>No additional help available for <span class=\'font-mono\'>' + arg + '</span>.</div>';
    }

    // --- MULTI-LINE OUTPUTS ---
    // Helper to split HTML by <br> and output with typeStep
    function typeMultiLine(targetEl, html, cb, speed = 40) {
        // Split by <br> (preserving tags)
        let lines = html.split(/<br\s*\/?>(?![^<]*>)/gi).map(line => line.trim()).filter(Boolean);
        let steps = lines.map(line => ({ text: line, pause: 0 }));
        typeStep(targetEl, steps, cb, 0, speed);
    }

    // Main command handler
    async function handleCommand(cmd) {
        stopAllAnimations(); // Stop any ongoing animations
        const c = cmd.trim().toLowerCase();
        showPrompt(c); // Display the entered command

        iEl.value = ''; // Clear input box immediately after command execution

        if (c === 'clear') {
            clearTerminal();
        } else if (c === 'restart') {
            // Show restarting animation for 3 seconds
            let animDiv = document.createElement('div');
            animDiv.className = 'font-mono';
            o.appendChild(animDiv); o.scrollTop = o.scrollHeight;
            let dots = 0;
            let steps = 0;
            let maxSteps = 14; // ~3 seconds at 220ms per step
            function animate() {
                if (steps < maxSteps) {
                    let dotStr = '.'.repeat(dots);
                    animDiv.innerHTML = 'restarting' + dotStr + '<span class="blink-cursor">|</span>';
                    dots = (dots + 1) % 4;
                    steps++;
                    setTimeout(animate, 220);
                } else {
                    animDiv.innerHTML = 'restarting...';
                    setTimeout(() => {
                        animDiv.remove();
                        // Show 'restart complete.' with typing and erase
                        typeAnim(o, 'restart complete.', (typedDiv) => {
                            setTimeout(() => {
                                eraseAnim(typedDiv, 'restart complete.', () => {
                                    o.innerHTML = '';
                                    runIntro();
                                }, 32);
                            }, 1200);
                        }, 32);
                    }, 220);
                }
            }
            animate();
        } else if (c === 'help' || c.startsWith('help ')) {
            typeAnim(o, helpText(c.slice(4).trim()), (typedDiv) => {
                attachClickHandlers(typedDiv);
            }, 16, false, true); // Fast typing for help
        } else if (c === 'about') {
            const aboutContent = [
                "Originally from Mars, currently trying to survive college on Planet Earth. After making the long journey across the solar system, I've made it my mission to help advance Earth's technology to match the superior standards we've achieved back home on the Red Planet.",
                "I'm passionate about technology, creativity, and learning new things—always exploring how to make life a little more interesting and fun. Whether it's building something new, solving a tricky problem, or just connecting with curious minds, I'm always up for a challenge and a good conversation.",
                "I'm currently working on a few projects that I hope will make a positive impact, and I'll be updating this website soon with more details. If you're interested in tech, creativity, or just want to say hi, feel free to reach out!",
                "Ready to join the adventure? You can find me here: <span class='cc' data-c='contact' tabindex='0'>contact</span>"
            ];
            let steps = aboutContent.map(line => ({ text: line, pause: 0 }));
            typeStep(o, steps, (typedDiv) => { attachClickHandlers(typedDiv); }, 0, 40);
        } else if (c === 'contact') {
            typeAnim(o, '<div><span class=\'cc text-green-400\' data-c=\'instagram\' tabindex=\'0\' style=\'cursor:pointer\'>instagram</span>: <span class=\'text-white\'>get my instagram link</span><br><span class=\'cc text-green-400\' data-c=\'email\' tabindex=\'0\' style=\'cursor:pointer\'>email</span>: <span class=\'text-white\'>get my email address</span><br><br><span class=\'text-gray-400\'>For more information on a specific contact, type <span class=\'font-mono text-yellow-400\'>contact contact-type</span></span></div>', (typedContactDiv) => { // Pass typed div to callback
                attachClickHandlers(typedContactDiv);
            });
        } else if (c === 'instagram' || c === 'contact instagram') {
            handleInstagramRedirect();
        } else if (c === 'email' || c === 'contact email') {
            handleEmailCopy();
        } else if (c === 'skills') {
            const skillsContent = [
                "My skills include:",
                "- Software Development (Python, JavaScript, Go, Java)",
                "- Web Technologies (HTML, CSS, React, Node.js)",
                "- Cloud Platforms (AWS, Google Cloud)",
                "- Databases (SQL, NoSQL)",
                "- Machine Learning & AI Fundamentals",
                "Always learning and expanding my expertise!"
            ];
            let steps = skillsContent.map(line => ({ text: line, pause: 0 }));
            typeStep(o, steps, null, 0, 40);
        } else if (c === 'hobbies') {
            const hobbiesContent = [
                "When I'm not coding, I enjoy:",
                "- Exploring new tech gadgets",
                "- Reading sci-fi and fantasy novels",
                "- Playing video games (especially Minecraft, since I love building stuff!)",
                "- Hiking and spending time in nature",
                "- Learning new languages (currently dabbling in Japanese!)",
                "- Following F1 racing (for the technology and fast cars that go vroom vroom!)",
                "Life's an adventure, and I try to make the most of it!"
            ];
            let steps = hobbiesContent.map(line => ({ text: line, pause: 0 }));
            typeStep(o, steps, null, 0, 40);
        } else if (c === 'whoami') {
            typeAnim(o, '<span class=\'text-white\'>You are currently logged in as guest.</span>', () => { /* Optional callback */ }, 16, false, true);
        } else if (c === 'ls') {
            typeAnim(o, '<span class=\'text-white\'>index.html<br>script.js<br>style.css<br>terminal-icon.svg<br>type-sound.html<br>mech-keyboard-02-102918.mp3</span>', () => { /* Optional callback */ }, 16, false, true);
        } else if (c === 'cat index.html') {
            typeAnim(o, '<span class=\'text-gray-400\'>... (displaying content of index.html, truncated for brevity) ...</span>', () => { /* Optional callback */ }, 16, false, true);
        } else if (c === 'date') {
            typeAnim(o, '<span class=\'text-white\'>' + new Date().toLocaleString() + '</span>', () => { /* Optional callback */ }, 16, false, true);
        } else if (c === 'echo') {
            typeAnim(o, '<span class=\'text-white\'>' + cmd.slice(4).trim() + '</span>', () => { /* Optional callback */ }, 16, false, true);
        } else if (c === 'dino') {
            // Show clearing animation
            let animDiv = document.createElement('div');
            animDiv.className = 'font-mono';
            o.appendChild(animDiv); o.scrollTop = o.scrollHeight;
            let dots = 0;
            let steps = 0;
            let maxSteps = 13; // ~2 seconds at 150ms per step
            function animate() {
                if (steps < maxSteps) {
                    let dotStr = '.'.repeat(dots);
                    animDiv.innerHTML = 'clearing terminal' + dotStr + '<span class="blink-cursor">|</span>';
                    dots = (dots + 1) % 4;
                    steps++;
                    setTimeout(animate, 150);
                } else {
                    animDiv.innerHTML = 'clearing terminal...';
                    setTimeout(() => {
                        o.innerHTML = '';
                        // Embed Dino game with forced black background
                        let dinoContainer = document.createElement('div');
                        dinoContainer.style.position = 'relative';
                        dinoContainer.style.width = '100%';
                        dinoContainer.style.height = '400px';
                        dinoContainer.style.maxWidth = '800px';
                        dinoContainer.style.margin = '0 auto 2rem auto';
                        dinoContainer.style.border = 'none';
                        dinoContainer.style.borderRadius = '10px';
                        dinoContainer.style.overflow = 'hidden';
                        dinoContainer.style.background = '#000';
                        dinoContainer.style.boxShadow = '0 4px 24px #000a';
                        // Black overlay behind iframe
                        let overlay = document.createElement('div');
                        overlay.style.position = 'absolute';
                        overlay.style.top = '0';
                        overlay.style.left = '0';
                        overlay.style.width = '100%';
                        overlay.style.height = '100%';
                        overlay.style.background = '#000';
                        overlay.style.zIndex = '0';
                        dinoContainer.appendChild(overlay);
                        let iframe = document.createElement('iframe');
                        iframe.src = 'https://chromedino.com/';
                        iframe.frameBorder = '0';
                        iframe.scrolling = 'no';
                        iframe.width = '100%';
                        iframe.height = '100%';
                        iframe.loading = 'lazy';
                        iframe.style.width = '100%';
                        iframe.style.height = '100%';
                        iframe.style.background = '#000';
                        iframe.style.position = 'relative';
                        iframe.style.zIndex = '1';
                        dinoContainer.appendChild(iframe);
                        dinoContainer.tabIndex = 0;
                        o.appendChild(dinoContainer);
                        o.scrollTop = 0;
                    }, 200);
                }
            }
            animate();
        } else if (c === 'blog') {
            // Step 1: clearing terminal animation
            let animDiv1 = document.createElement('div');
            animDiv1.className = 'font-mono';
            o.appendChild(animDiv1); o.scrollTop = o.scrollHeight;
            let dots1 = 0, steps1 = 0, maxSteps1 = 7; // ~1.5s at 220ms
            function animate1() {
                if (steps1 < maxSteps1) {
                    let dotStr = '.'.repeat(dots1);
                    animDiv1.innerHTML = 'clearing terminal' + dotStr + '<span class="blink-cursor">|</span>';
                    dots1 = (dots1 + 1) % 4;
                    steps1++;
                    setTimeout(animate1, 220);
                } else {
                    animDiv1.innerHTML = 'clearing terminal...';
                    setTimeout(() => {
                        o.innerHTML = '';
                        // Step 2: running blog animation
                        let animDiv2 = document.createElement('div');
                        animDiv2.className = 'font-mono';
                        o.appendChild(animDiv2); o.scrollTop = o.scrollHeight;
                        let dots2 = 0, steps2 = 0, maxSteps2 = 8; // ~1.8s at 220ms
                        function animate2() {
                            if (steps2 < maxSteps2) {
                                let dotStr = '.'.repeat(dots2);
                                animDiv2.innerHTML = 'running blog' + dotStr + '<span class="blink-cursor">|</span>';
                                dots2 = (dots2 + 1) % 4;
                                steps2++;
                                setTimeout(animate2, 220);
                            } else {
                                animDiv2.innerHTML = 'running blog...';
                                setTimeout(() => {
                                    o.innerHTML = '';
                                    showBlogMenu();
                                }, 220);
                            }
                        }
                        animate2();
                    }, 220);
                }
            }
            animate1();
        } else {
            typeAnim(o, '<span class=\'text-red-400\'>Command not found: ' + c + '. Type \'help\' for a list of commands.</span>', () => { /* Optional callback */ }, 16, false, true);
        }
    }

    // Initial run intro animation
    function runIntro() {
        stopAllAnimations(); // Ensure no animations are running before starting intro
        iEl.removeEventListener('keydown', mainInputHandler); // Disable main input handler during intro
        
        function appendStep(targetEl, steps, onDone, stepIndex = 0) {
            if (stepIndex < steps.length) {
                let div = document.createElement('div');
                targetEl.appendChild(div); // Append BEFORE animating
                typeAnim(div, steps[stepIndex].text, () => {
                    setTimeout(() => {
                        appendStep(targetEl, steps, onDone, stepIndex + 1);
                    }, steps[stepIndex].pause || 0);
                }, 60, false, true);
            } else {
                onDone && onDone(targetEl.lastChild);
            }
        }
        
        appendStep(o, introSteps, (finalDiv) => {
            animationInProgress = false;
            iEl.addEventListener('keydown', mainInputHandler); // Re-enable after intro
            iEl.focus();
            attachClickHandlers(finalDiv); // Attach handlers after intro is complete
        });
    }

    // Recursive function to animate steps (type and erase)
    function typeStep(targetEl, steps, onDone, stepIndex = 0, speed = 60) {
        if (stepIndex < steps.length) {
            const step = steps[stepIndex];
            let skipStep = false;
            // Handler to skip only this step
            function skipCurrentStep(e) {
                if ((e.key === 'Enter' || e.keyCode === 13) && animationInProgress) {
                    skipStep = true;
                }
            }
            iEl.addEventListener('keydown', skipCurrentStep);
            if (step.erase) {
                // Find the last div created by typeAnim to erase it
                const lastDiv = targetEl.lastChild; 
                if (lastDiv) {
                    eraseAnim(lastDiv, lastDiv.textContent, () => {
                        iEl.removeEventListener('keydown', skipCurrentStep);
                        typeStep(targetEl, steps, onDone, stepIndex + 1, speed);
                    }, 22);
                } else {
                    iEl.removeEventListener('keydown', skipCurrentStep);
                    typeStep(targetEl, steps, onDone, stepIndex + 1, speed);
                }
            } else {
                // Wrap typeAnim to allow skipping this step only
                let animDone = false;
                function wrappedCb(typedDiv) {
                    if (!animDone) {
                        animDone = true;
                        iEl.removeEventListener('keydown', skipCurrentStep);
                        setTimeout(() => {
                            typeStep(targetEl, steps, onDone, stepIndex + 1, speed);
                        }, 32);
                    }
                }
                // Patch typeAnim's skip handler to only skip this step
                let originalSkipHandler = function(e) {
                    if ((e.key === 'Enter' || e.keyCode === 13) && animationInProgress) {
                        skipStep = true;
                    }
                };
                iEl.addEventListener('keydown', originalSkipHandler);
                typeAnim(targetEl, step.text, (typedDiv) => {
                    iEl.removeEventListener('keydown', originalSkipHandler);
                    wrappedCb(typedDiv);
                }, speed, false, true);
            }
        } else {
            onDone && onDone(targetEl.lastChild);
        }
    }

    // Fullscreen toggle logic (green button)
    fullscreenBtn.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            document.body.classList.remove('fullscreen-terminal');
        } else {
            document.documentElement.requestFullscreen().catch(e => {
                console.error("Error attempting to enable fullscreen:", e);
            });
            document.body.classList.add('fullscreen-terminal');
        }
    });

    // Focus input on body click
    document.body.addEventListener('click', () => {
        iEl.focus();
    });

    function showBlogMenu() {
        let menuHTML = `
            <div style='font-size:1.35em;font-weight:bold;margin-bottom:0.7em;text-align:center;letter-spacing:0.01em;color:#b5e853;'>Welcome to my blog</div>
            <div style='height:1.2em'></div>
            <div><span class='cc text-green-400' data-c='1' tabindex='0' style='font-weight:bold;margin-right:0.7em;cursor:pointer;'>1.</span><span class='text-white' style='font-weight:bold;'>Featured Blog</span></div>
            <div><span class='cc text-green-400' data-c='2' tabindex='0' style='font-weight:bold;margin-right:0.7em;cursor:pointer;'>2.</span><span class='text-white' style='font-weight:bold;'>Archives</span></div>
            <div style='height:1.2em'></div>
            <div><span class='text-yellow-400' style='font-weight:bold;'>Enter the number for your choice (e.g., 1 or 2), or type exit to leave:</span></div>
        `;
        o.innerHTML = '';
        typeAnim(o, menuHTML, () => {
            iEl.value = '';
            iEl.removeAttribute('disabled');
            iEl.removeEventListener('keydown', mainInputHandler);
            iEl.removeEventListener('keydown', menuInputHandler);
            iEl.removeEventListener('keydown', blogContentHandler);
            iEl.removeEventListener('keydown', archiveHandler);
            setTimeout(() => {
                iEl.addEventListener('keydown', menuInputHandler);
                iEl.focus();
            }, 0);
            attachClickHandlers(o.lastChild.previousElementSibling);
        }, 18, false, true);
    }
    function showBlogContent() {
        o.innerHTML = '';
        const blogSteps = [
            { text: `<div style='font-size:clamp(1em, 4vw, 1.35em);font-weight:bold;margin-bottom:0.7em;text-align:center;letter-spacing:0.01em;color:#b5e853;'>First Entry: A Personal Milestone and New Beginnings</div>`, pause: 0 },
            { text: `<div style='color:#aaa;font-size:0.98em;margin-bottom:1.5em;text-align:center;'>July 9th, 2025 &mdash; by Mohamed Zafar</div>`, pause: 0 },
            { text: `<div style='margin-bottom:1.5em;line-height:1.7;'>Hello everyone! Welcome to my personal website and blog. Today feels like the perfect day to launch this space - not just because I'm officially going live with the site, but because I'm celebrating my 19th birthday today. What better way to mark this milestone than by sharing something I've been working on for quite some time?</div>`, pause: 0 },
            { text: `<div style='margin-bottom:1.5em;line-height:1.7;'>For the past month and a half, I've been dedicated to building this personal website from the ground up. Now, I'll be honest - it took longer than I initially expected, but that's because I spent a significant amount of time learning along the way. Every challenge I encountered became a learning opportunity, and every bug I fixed taught me something valuable about web development.<br><br><span style='color:#b5e853;'>Fun fact:</span> I probably consumed enough coffee during this process to power a small server farm. My keyboard has definitely seen some things.</div>`, pause: 0 },
            { text: `<div style='display:flex;justify-content:center;align-items:center;margin-bottom:2em;'><img src='IMG_20250708_131839.jpg' alt='Laptop with code editor in the dark' style='max-width:min(220px, 80vw);width:100%;border-radius:10px;box-shadow:0 2px 16px #000a;margin:0 auto;border:2px solid #23272e;background:#111;padding:4px;display:block;'></div>`, pause: 0 },
            { text: `<div style='font-weight:bold;margin-bottom:0.5em;font-size:1.08em;color:#b5e853;'>The Journey Behind This Website</div>`, pause: 0 },
            { text: `<div style='margin-bottom:1.5em;line-height:1.7;'>The process has been incredibly rewarding. From designing the layout to writing the code, debugging issues, and fine-tuning the user experience - each step has been a chance to grow as a developer and creator. Plus, I've gotten really good at talking to my computer screen when the code doesn't cooperate (it's surprisingly therapeutic).</div>`, pause: 0 },
            { text: `<div style='font-weight:bold;margin-bottom:0.5em;font-size:1.08em;color:#b5e853;'>A Meaningful Gift</div>`, pause: 0 },
            { text: `<div style='margin-bottom:1.5em;line-height:1.7;'>One of the most touching moments in this journey came when my dad saw my dedication to another project I'd been working on - a KEAM rank predictor tool. After witnessing the late nights, the problem-solving sessions, and my genuine passion for creating something useful (and probably my dramatic sighs when debugging), he offered to buy me this domain. Having that kind of support and recognition from family means everything to me.<br><br>That previous project taught me so much about data analysis, user interface design, and the importance of creating tools that genuinely help people. It was a stepping stone that led me here, to this personal space where I can share my thoughts, projects, and experiences - and maybe some of my coding mishaps that turned into happy accidents.</div>`, pause: 0 },
            { text: `<div style='font-weight:bold;margin-bottom:0.5em;font-size:1.08em;color:#b5e853;'>Let's Connect and Grow Together</div>`, pause: 0 },
            { text: `<div style='margin-bottom:1.5em;line-height:1.7;'>Here's something that would truly make this journey even more meaningful: your feedback and suggestions. If you've read this far, you're already part of this community I'm building. I'd love to hear from you! Seriously, even if it's just to tell me my color scheme needs work or that you spotted a typo - I'm all ears!<br><br><span style='color:#e0e0e0;'>Whether you have suggestions for topics or feedback on projects, or just want to connect or share your coding stories, please reach out through the contact section on this website. Your input would be incredibly motivating!</span></div>`, pause: 0 },
            { text: `<div style='font-weight:bold;margin-bottom:0.5em;font-size:1.08em;color:#b5e853;'>Looking Forward</div>`, pause: 0 },
            { text: `<div style='margin-bottom:1.5em;line-height:1.7;'>Turning 19 feels like stepping into a new chapter, and launching this website feels like the perfect way to document that journey. I'm excited about the projects I have planned, the things I'll learn, and the connections I'll make along the way.<br><br>Who knows? Maybe by my 20th birthday, I'll have figured out why CSS sometimes has a mind of its own. A developer can dream, right?</div>`, pause: 0 },
            { text: `<div style='margin-bottom:1.5em;line-height:1.7;'>Thank you for being here at the beginning of this adventure. Here's to regular updates, continuous learning, building something meaningful together, and hopefully sharing some laughs along the way!</div>`, pause: 0 },
            { text: `<div style='margin-bottom:1.5em;font-style:italic;text-align:right;color:#b5e853;'>Mohamed Zafar</div>`, pause: 0 },
            { text: `<div style='margin-bottom:1.5em;color:#aaa;font-size:0.98em;'>Have thoughts, suggestions, or just want to connect? I'd love to hear from you - check out my contacts page and let's start a conversation!</div>`, pause: 0 },
            { text: `<div style='margin-top:2em;color:#facc15;text-align:center;font-weight:bold;'>Type <b>exit</b> to close or <b>1</b> to view archives.</div>`, pause: 0 }
        ];
        function stepper(targetEl, steps, onDone, stepIndex = 0, speed = 18) {
            if (stepIndex < steps.length) {
                typeAnim(targetEl, steps[stepIndex].text, () => {
                    stepper(targetEl, steps, onDone, stepIndex + 1, speed);
                }, speed, false, true);
            } else {
                onDone && onDone(targetEl.lastChild);
            }
        }
        stepper(o, blogSteps, (typedDiv) => {
            iEl.value = '';
            iEl.removeAttribute('disabled');
            iEl.removeEventListener('keydown', mainInputHandler);
            iEl.removeEventListener('keydown', menuInputHandler);
            iEl.removeEventListener('keydown', blogContentHandler);
            iEl.removeEventListener('keydown', archiveHandler);
            setTimeout(() => {
                iEl.addEventListener('keydown', blogContentHandler);
                iEl.focus();
            }, 0);
        }, 0, 18);
    }

    function showArchive() {
        o.innerHTML = '';
        let archiveDiv = document.createElement('div');
        archiveDiv.className = 'font-mono';
        archiveDiv.style.maxWidth = '700px';
        archiveDiv.style.margin = '2em auto';
        archiveDiv.innerHTML = `<div style='font-size:1.2em;font-weight:bold;margin-bottom:0.5em;'>Archives</div><div style='margin-bottom:1.5em'><span class='cc' data-c='1' tabindex='0' style='cursor:pointer;'>1.</span> First Entry: A Personal Milestone and New Beginnings <span style='color:#aaa'>(${new Date().toLocaleDateString()})</span></div><div style='margin-top:2em;color:#facc15;font-weight:bold;'>Enter the number for your choice, or type exit to leave:</div>`;
        o.appendChild(archiveDiv); o.scrollTop = 0;
        iEl.value = '';
        iEl.removeAttribute('disabled');
        iEl.removeEventListener('keydown', mainInputHandler);
        iEl.removeEventListener('keydown', menuInputHandler);
        iEl.removeEventListener('keydown', blogContentHandler);
        iEl.removeEventListener('keydown', archiveHandler);
        setTimeout(() => {
            iEl.addEventListener('keydown', archiveHandler);
            iEl.focus();
        }, 0);
        attachClickHandlers(archiveDiv);
    }

    runIntro(); // Start intro animation on page load
});
