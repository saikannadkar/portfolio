const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf-8');
const css = fs.readFileSync('style.css', 'utf-8');
const js = fs.readFileSync('main.js', 'utf-8');
let passed = 0;
let failed = 0;

function test(name, condition) {
  if (condition) {
    console.log(`PASS ${name}`);
    passed++;
  } else {
    console.error(`FAIL ${name}`);
    failed++;
  }
}

// Primary file wiring
test('index.html exists', fs.existsSync('index.html'));
test('style.css exists', fs.existsSync('style.css'));
test('main.js exists', fs.existsSync('main.js'));
test('does not keep beta html file', !fs.existsSync('beta.html'));
test('does not keep beta css file', !fs.existsSync('beta.css'));
test('does not keep beta js file', !fs.existsSync('beta.js'));
test('links to style.css', html.includes('href="style.css"'));
test('loads main.js', html.includes('src="main.js"'));
test('does not reference beta assets', !/beta\.(html|css|js)/.test(html));

// Required document basics
test('has viewport meta tag', html.includes('name="viewport"'));
test('has charset UTF-8', html.includes('charset="UTF-8"'));
test('has portfolio title', html.includes('<title>Sai Kannadkar</title>'));
test('contains name', html.includes('Sai Kannadkar'));

// Portfolio content
test('has hero section', html.includes('class="hero section-shell"'));
test('has about section', html.includes('id="about"'));
test('has experience section', html.includes('id="experience"'));
test('has projects section', html.includes('id="projects"'));
test('has skills section', html.includes('id="skills"'));
test('has contact section', html.includes('id="contact"'));
test('has resume download link', html.includes('Sai_Kannadkar_Resume.pdf'));
test('has GitHub link', html.includes('github.com/saikannadkar'));
test('has LinkedIn link', html.includes('linkedin.com/in/saikannadkar'));
test('has email link', html.includes('saikannadkar@gmail.com'));
test('has n8n link', html.includes('n8n.saikannadkar.me'));

// Current interaction model
test('has canvas field background', html.includes('id="field"'));
test('has typed text target', html.includes('id="typedText"'));
test('main.js has typing animation', js.includes('function typeLoop()'));
test('main.js has reveal observer', js.includes('IntersectionObserver'));
test('main.js has canvas animation', js.includes('function drawField()'));
test('main.js honors reduced motion', js.includes('prefers-reduced-motion'));

// Styling expectations
test('style.css has CSS variables', css.includes('--bg:'));
test('style.css has responsive media query', css.includes('@media'));
test('style.css styles hero layout', css.includes('.hero'));
test('style.css styles contact links', css.includes('.contact-links'));

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
