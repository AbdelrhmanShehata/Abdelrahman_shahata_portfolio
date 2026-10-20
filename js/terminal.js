/**
 * ABDELRAHMAN SHEHATA ELSAYED - CYBER PORTFOLIO
 * INTERACTIVE CYBERSECURITY CLI TERMINAL (MODAL)
 * Allows recruiters & engineers to run cyber commands, inspect artifacts, and query data.
 */

(function () {
  'use strict';

  const modal = document.getElementById('terminal-modal');
  const backdrop = document.getElementById('terminal-backdrop');
  const openBtn = document.getElementById('open-terminal-btn');
  const closeBtn = document.getElementById('close-terminal-btn');
  const termInput = document.getElementById('terminal-cli-input');
  const termOutput = document.getElementById('terminal-output');

  let commandHistory = [];
  let historyIndex = -1;

  // Exact contact integrity constants
  const PROFILE_DATA = {
    name: 'Abdelrahman Shehata Elsayed',
    title: 'Cybersecurity & SOC Analyst | Computer Engineering Student',
    email: 'abdoshehatalil9@gmail.com',
    phone: '+201061624475',
    location: 'Benha - Alqaliobia, Egypt',
    linkedin: 'https://www.linkedin.com/in/abdelrahman-shehata-14b53530a',
    github: 'https://github.com/AbdelrhmanShehata',
    siemRepo: 'https://github.com/Mostafa-174/SIEM-Detection-Engineering-Alert-Triage-SOC-Operations-',
    mipsRepo: 'https://github.com/AbdelrhmanShehata/mips-assemply-project-',
    education: 'Computer and Control Systems Engineering, Benha University (GPA: 3.47 / 4.0)'
  };

  function openTerminal() {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    if (termInput) {
      setTimeout(() => termInput.focus(), 100);
    }
  }

  function closeTerminal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (openBtn) openBtn.addEventListener('click', openTerminal);
  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);
  if (backdrop) backdrop.addEventListener('click', closeTerminal);

  // Keyboard shortcut Ctrl + ~ or ` or ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeTerminal();
    }
    if ((e.ctrlKey && e.key === '`') || (e.ctrlKey && e.key === '~')) {
      e.preventDefault();
      if (modal && modal.classList.contains('active')) {
        closeTerminal();
      } else {
        openTerminal();
      }
    }
  });

  function appendLine(text, className = 'output') {
    if (!termOutput) return;
    const div = document.createElement('div');
    div.className = `term-line ${className}`;
    div.innerHTML = text;
    termOutput.appendChild(div);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  function handleCommand(rawCmd) {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    // Echo input
    appendLine(`<span class="prompt-user">shehata@soc:~$</span> ${escapeHtml(cmd)}`, 'cmd-echo');
    commandHistory.push(cmd);
    historyIndex = commandHistory.length;

    const parts = cmd.split(' ');
    const root = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    switch (root) {
      case 'help':
        appendLine(`
<strong>AVAILABLE COMMANDS:</strong>
  <span class="term-highlight">about</span>       : Display executive dossier and academic summary
  <span class="term-highlight">skills</span>      : List SOC & Software Engineering matrix
  <span class="term-highlight">projects</span>    : Review SIEM & MIPS Architecture operations
  <span class="term-highlight">contact</span>     : Show official email, phone, and profile links
  <span class="term-highlight">neofetch</span>    : Output SOC workstation system architecture
  <span class="term-highlight">mitre</span>       : Inspect MITRE ATT&CK correlation capabilities
  <span class="term-highlight">cv</span>          : Launch quick dossier preview modal
  <span class="term-highlight">clear</span>       : Wipe terminal output buffer
  <span class="term-highlight">exit</span>        : Close terminal emulator
        `);
        break;

      case 'about':
      case 'dossier':
      case 'bio':
        appendLine(`
<strong>[IDENTITY]:</strong> ${PROFILE_DATA.name}
<strong>[ROLE]:</strong> ${PROFILE_DATA.title}
<strong>[ACADEMICS]:</strong> ${PROFILE_DATA.education}
<strong>[SYNOPSIS]:</strong> Cybersecurity Incident Response Analyst specializing in SIEM architecture, detection engineering, and SOC operations. Core expertise in Splunk, Wazuh, Elastic, MITRE ATT&CK framework, SOAR workflows, and Local AI (Ollama).
        `);
        break;

      case 'skills':
      case 'arsenal':
        appendLine(`
<strong>[1. SOC & DETECTION ENGINEERING]:</strong>
  • SIEM: Splunk, Wazuh, Elastic SIEM (Custom SPL & XML rules)
  • Endpoint & Logs: EDR, Sysmon, Windows Event Logs, Linux Syslog
  • Network: Suricata, Zeek, CCNA Network Security
  • Triage & Intel: TheHive SOAR, VirusTotal, AbuseIPDB, IOC Analysis
  • Frameworks: MITRE ATT&CK, Local AI (Ollama)

<strong>[2. SOFTWARE ENGINEERING, DATA SCIENCE & AI]:</strong>
  • Languages: Python, C++, SQL, Bash, PowerShell, MATLAB, VHDL, MIPS
  • Computer Science: Data Structures & Algorithms (DSA), System Design
  • Data & AI: Machine Learning, Scikit-learn, Pandas, NumPy, Microsoft SQL Server
        `);
        break;

      case 'projects':
      case 'ops':
        appendLine(`
<strong>[OPERATION 01: SIEM DETECTION ENGINEERING & SOC OPERATIONS]</strong>
  • Status: Graduation Capstone Project (Centralized Architecture)
  • Stack: Wazuh, Splunk, Elastic SIEM, Ollama, Sysmon, TheHive
  • Description: Custom MITRE ATT&CK correlation rules & automated SOAR/AI triage.
  • GitHub: <a href="${PROFILE_DATA.siemRepo}" target="_blank" class="term-highlight">${PROFILE_DATA.siemRepo}</a>

<strong>[OPERATION 02: MIPS ASSEMBLER & PROCESSOR ARCHITECTURE]</strong>
  • Stack: MIPS Assembly, Python, VHDL
  • Description: Custom Python-based assembler and VHDL hardware description modules.
  • GitHub: <a href="${PROFILE_DATA.mipsRepo}" target="_blank" class="term-highlight">${PROFILE_DATA.mipsRepo}</a>
        `);
        break;

      case 'contact':
      case 'comms':
        appendLine(`
<strong>[SECURE CHANNELS & VERIFIED LINKS]:</strong>
  • Email: <a href="mailto:${PROFILE_DATA.email}" class="term-highlight">${PROFILE_DATA.email}</a>
  • Phone: <a href="tel:${PROFILE_DATA.phone}" class="term-highlight">${PROFILE_DATA.phone}</a>
  • Location: ${PROFILE_DATA.location}
  • LinkedIn: <a href="${PROFILE_DATA.linkedin}" target="_blank" class="term-highlight">${PROFILE_DATA.linkedin}</a>
  • GitHub: <a href="${PROFILE_DATA.github}" target="_blank" class="term-highlight">${PROFILE_DATA.github}</a>
        `);
        break;

      case 'neofetch':
      case 'sys':
        appendLine(`
<pre style="color: #ff1e38; margin: 0; font-family: monospace;">
    /\\_       shehata@soc-analyst-station
   /  -\\      ---------------------------
  / /\\ \\     OS: CyberOS Linux x86_64 / SOC Hardened
 / /__\\ \\    Host: Benha University (Control Systems)
/_/    \\_\\   GPA: 3.47 / 4.0
             SIEM: Wazuh 4.8 / Splunk 9.2 / Elastic 8.x
             SOAR Engine: TheHive + Ollama AI
             Shell: zsh 5.9 (cyber-red-theme)
             Defense State: DEFCON 2 [ELEVATED]
</pre>
        `);
        break;

      case 'mitre':
        appendLine(`
<strong>[MITRE ATT&CK FRAMEWORK MATRIX]:</strong>
  • Initial Access: Phishing, Valid Accounts (T1078)
  • Execution: Command and Scripting Interpreter: PowerShell (T1059.001)
  • Persistence: Scheduled Task/Job (T1053)
  • Defense Evasion: Obfuscated Files, Masquerading (T1027, T1036)
  • Automation: Integrated with Wazuh & Splunk Correlation Engines
        `);
        break;

      case 'cv':
        appendLine(`Triggering dossier preview window...`);
        const cvModal = document.getElementById('cv-quick-modal');
        if (cvModal) {
          cvModal.classList.add('active');
          cvModal.setAttribute('aria-hidden', 'false');
        }
        break;

      case 'clear':
      case 'cls':
        if (termOutput) termOutput.innerHTML = '';
        break;

      case 'exit':
      case 'quit':
        closeTerminal();
        break;

      case 'sudo':
        appendLine(`[AUTH]: User 'shehata' is already granted root SOC privileges.`);
        break;

      case 'whoami':
        appendLine(`${PROFILE_DATA.name} - Cybersecurity & SOC Analyst`);
        break;

      case 'date':
        appendLine(new Date().toUTCString());
        break;

      default:
        appendLine(`bash: command not found: <span class="term-highlight">${escapeHtml(cmd)}</span>. Type 'help' for command listing.`, 'error');
        break;
    }
  }

  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = termInput.value;
        termInput.value = '';
        handleCommand(cmd);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0 && historyIndex > 0) {
          historyIndex--;
          termInput.value = commandHistory[historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          termInput.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          termInput.value = '';
        }
      }
    });
  }

})();
