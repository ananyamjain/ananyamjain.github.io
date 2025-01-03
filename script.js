document.addEventListener('DOMContentLoaded', () => {
    const terminalContent = document.querySelector('.terminal-content');
    let commandInput;
    let commandText;
    const terminal = document.querySelector('.terminal');
    let commandInputContainer;

    const initialContent = `
        <div class="line">
            <span class="prompt">$</span>
            <span class="command">whoami</span>
        </div>
        <div class="output">
            <pre class="ascii-art">
 █████╗ ███╗   ██╗ █████╗ ███╗   ██╗██╗   ██╗ █████╗         ██╗ █████╗ ██╗███╗   ██╗
██╔══██╗████╗  ██║██╔══██╗████╗  ██║╚██╗ ██╔╝██╔══██╗        ██║██╔══██╗██║████╗  ██║
███████║██╔██╗ ██║███████║██╔██╗ ██║ ╚████╔╝ ███████║        ██║███████║██║██╔██╗ ██║
██╔══██║██║╚██╗██║██╔══██║██║╚██╗██║  ╚██╔╝  ██╔══██║   ██   ██║██╔══██║██║██║╚██╗██║
██║  ██║██║ ╚████║██║  ██║██║ ╚████║   ██║   ██║  ██║    █████╔╝██║  ██║██║██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝    ╚════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝
            </pre>
            <p>Student • Developer • Researcher</p>
        </div>
        <div class="line">
            <span class="prompt">$</span>
            <span class="command">cat experience.txt</span>
        </div>
        <div class="output">
            <div class="section">
                <div class="section-content">
                    <h2>Software Engineering Intern</h2>
                    <p class="company">Uber</p>
                    <p class="location">San Francisco, CA</p>
                    <p class="date">Sep 2024 - Present</p>
                    <ul>
                        <li>Enhanced the end-to-end ML model development experience...</li>
                        <li>Enabled users to add and integrate their own custom integration...</li>
                        <li>Designed and implemented the pipeline in Python...</li>
                    </ul>
                </div>
                <img src="uber-logo.png" alt="Uber Logo" class="company-logo">
            </div>
            <div class="section">
                <div class="section-content">
                    <h2>Data Engineering and AI Intern</h2>
                    <p class="company">Bell Canada</p>
                    <p class="location">Toronto, ON</p>
                    <p class="date">May 2024 - August 2024</p>
                    <ul>
                        <li>Worked on the ML Eng team to productionize ML models on the Google Cloud Platform.</li>
                        <li>Streamlined model validation, testing, and deployment processes for efficiency and reliability.</li>
                        <li>Optimized data processing workflows to handle large-scale datasets effectively.</li>
                        <li>Enhanced a churn prediction model, increasing detection rates and business impact.</li>
                    </ul>
                </div>
                <img src="bell-logo.svg" alt="Bell Canada Logo" class="company-logo">
            </div>
        </div>
        <div class="line">
            <span class="prompt">$</span>
            <span class="command">cat education.txt</span>
        </div>
        <div class="output">
            <div class="section">
                <div class="section-content">
                    <h2>University of Toronto</h2>
                    <p>Bachelor of Science in Computer Science</p>
                    <p class="location">Toronto, ON</p>
                    <p class="date">2021 - 2026</p>
                    <ul>
                        <li>Relevant Coursework: Data Structures, Algorithms, Machine Learning, Deep Learning, Analysis and Complexity</li>
                    </ul>
                </div>
            <img src="uoft-logo.png" alt="University Logo" class="company-logo">
            </div>
        </div>

        <div class="line">
            <span class="prompt">$</span>
            <span class="command">ls ./skills/</span>
        </div>
        <div class="output">
            <div class="skills-grid">
                <div class="skill-category">
                    <h3>Languages</h3>
                    <ul>
                        <li>Python</li>
                        <li>Java</li>
                        <li>Kotlin</li>
                        <li>SQL</li>
                        <li>SPARQL</li>
                    </ul>
                </div>
                <div class="skill-category">
                    <h3>Technologies and Libraries</h3>
                    <ul>
                        <li>React</li>
                        <li>Numpy</li>
                        <li>PyTorch</li>
                        <li>Tensorflow</li>
                        <li>dimod</li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    const commands = {
        'cat about.txt': generateAbout,
        'cat projects.txt': generateProjects,
        'cat achievements.txt': generateAchievements,
        'ls ./certificates/': generateCertificates,
        'whereis socials': generateSocials,
        'clear': clearTerminal
    };

    // Insert initial content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = initialContent.trim();
    terminalContent.innerHTML = ''; // Clear existing content
    terminalContent.appendChild(tempDiv);

    // Create command input container
    commandInputContainer = document.createElement('div');
    commandInputContainer.className = 'command-input-container';
    commandInputContainer.innerHTML = `
        <span class="prompt">$</span>
        <span class="command-text"></span>
        <span class="cursor">▋</span>
        <input type="text" class="command-input">
    `;
    terminalContent.appendChild(commandInputContainer);

    // Update references
    commandInput = commandInputContainer.querySelector('.command-input');
    commandText = commandInputContainer.querySelector('.command-text');

    // Keep input focused
    terminal.addEventListener('click', () => commandInput.focus());
    commandInput.focus();
    
    // Update visible text
    commandInput.addEventListener('input', () => {
        commandText.textContent = commandInput.value;
    });

    // Process commands
    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = commandInput.value.trim();
            
            if (command) {
                addToTerminal('command', command);
                
                if (Object.prototype.hasOwnProperty.call(commands, command)) {
                    commands[command]();
                } else {
                    addToTerminal('error', 'Command not found. Check the cheatsheet for available commands.');
                }
            }
            
            commandInput.value = '';
            commandText.textContent = '';
        }
    });

    function addToTerminal(type, content) {
        const line = document.createElement('div');
        
        if (type === 'command') {
            line.className = 'line';
            line.innerHTML = `<span class="prompt">$</span> <span class="command">${content}</span>`;
        } else if (type === 'error') {
            line.className = 'error';
            line.textContent = content;
        } else {
            line.className = 'output';
            line.innerHTML = content;
        }
        
        terminalContent.insertBefore(line, commandInputContainer);
        terminalContent.scrollTop = terminalContent.scrollHeight; // Scroll to bottom after command
    }

    // Ensure the terminal starts at the top
    terminalContent.scrollTop = 0;

    // Define command functions
    function generateAbout() {
        addToTerminal('output', `
            <div class="section">
                <h2>About Me</h2>
                <ul>
                    <li>I'm a Computer Science student at the University of Toronto, passionate about Machine Learning, AI, and software development.</li>
                    <li>Currently focused on ML Engineering and creating scalable AI solutions.</li>
                </ul>
            </div>
        `);
    }

    function generateProjects() {
        addToTerminal('output', `
            <div class="section">
                <h2 class="section-title">Featured Projects</h2>
                <div class="projects-list">
                    <div class="project-item">
                        <div class="project-name">
                            <i class="fas fa-code-branch"></i>
                            ML Pipeline Development
                        </div>
                        <div class="project-tech-tags">
                            <span class="tech-tag">Python</span>
                            <span class="tech-tag">Piper</span>
                            <span class="tech-tag">Buildkite</span>
                        </div>
                        <div class="project-desc">
                            Developed end-to-end ML model testing pipeline at Uber using Python, Piper, and Buildkite.
                        </div>
                    </div>

                    <div class="project-item">
                        <div class="project-name">
                            <i class="fas fa-chart-line"></i>
                            Churn Prediction Model
                        </div>
                        <div class="project-tech-tags">
                            <span class="tech-tag">GCP</span>
                            <span class="tech-tag">ML</span>
                            <span class="tech-tag">Python</span>
                        </div>
                        <div class="project-desc">
                            Enhanced customer churn prediction model at Bell Canada using GCP and ML techniques.
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    function generateAchievements() {
        addToTerminal('output', `
            <div class="section">
                <h2 class="section-title">Achievements</h2>
                <div class="section-content">
                    <ul>
                        <li>Dean's List - University of Toronto</li>
                        <li>Grace Hopper Scholarship 2022</li>
                    </ul>
                </div>
            </div>
        `);
    }

    function generateCertificates() {
        addToTerminal('output', `
            <div class="section">
                <h2 class="section-title">Certifications</h2>
                <div class="section-content">
                    <ul>
                        <li><a href="https://www.uoft.ai/learnai" target="_blank">Learn AI - UofT AI</a></li>
                        <li><a href="https://learn.dwavesys.com/courses/quantum-programming-101-core" target="_blank">Quantum Programming Core - D-wave</a></li>
                        <li><a href="https://education.scinet.utoronto.ca/course/view.php?id=1332" target="_blank">Introduction to Quantum Computing</a></li>
                    </ul>
                </div>
            </div>
        `);
    }

    function generateSocials() {
        addToTerminal('output', `
            <div class="social-section">
                <h2 class="social-title">Connect With Me</h2>
                <div class="social-list">
                    <div class="social-item">
                        <i class="fab fa-github social-icon"></i>
                        <a href="https://github.com/ananyamjain" target="_blank">github.com/ananyamjain</a>
                    </div>
                    <div class="social-item">
                        <i class="fab fa-linkedin-in social-icon"></i>
                        <a href="https://linkedin.com/in/ananyamjain" target="_blank">linkedin.com/in/ananyamjain</a>
                    </div>
                    <div class="social-item">
                        <i class="fas fa-envelope social-icon"></i>
                        <a href="mailto:ananyamj1@gmail.com">ananyamj1@gmail.com</a>
                    </div>
                </div>
            </div>
        `);
    }

    function clearTerminal() {
        const elements = Array.from(terminalContent.children);
        elements.forEach(el => {
            if (!el.classList.contains('command-input-container')) {
                el.remove();
            }
        });
    }

    function setupCheatsheetCommands() {
        const commandExamples = document.querySelectorAll('.command-example');
        
        commandExamples.forEach(example => {
            example.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent any default behavior
                
                // Get the command text
                const command = example.textContent;
                
                // Set the command input value
                commandInput.value = command;
                commandText.textContent = command;
                
                // Execute the command directly
                if (commands[command]) {
                    addToTerminal('command', command);
                    commands[command]();
                }
                
                // Clear the input
                commandInput.value = '';
                commandText.textContent = '';
                
                // Focus back on the input
                commandInput.focus();
            });
        });
    }

    // Call setupCheatsheetCommands at the end
    setTimeout(() => {
        setupCheatsheetCommands();
    }, 100);
});