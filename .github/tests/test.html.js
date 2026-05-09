const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf-8');
let passed = 0;
let failed = 0;

function test(name, condition) {
  if (condition) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.error(`❌ ${name}`);
    failed++;
  }
}

// Content checks
test('Contains name', html.includes('Sai Kannadkar'));
test('Has hero section', html.includes('hero'));
test('Has about section', html.includes('id="about"'));
test('Has experience section', html.includes('id="experience"'));
test('Has projects section', html.includes('id="projects"'));
test('Has skills section', html.includes('id="skills"'));
test('Has contact section', html.includes('id="contact"'));
test('Has resume download link', html.includes('Sai_Kannadkar_Resume.pdf'));
test('Has GitHub link', html.includes('github.com/saikannadkar'));
test('Has LinkedIn link', html.includes('linkedin.com/in/saikannadkar'));
test('Has email link', html.includes('saikannadkar@gmail.com'));
test('Has n8n link', html.includes('n8n.saikannadkar.me'));
test('Has dark mode toggle', html.includes('themeBtn'));
test('Has typing animation', html.includes('typed'));
test('No console.log left in code', !html.includes('console.log'));
test('Has viewport meta tag', html.includes('viewport'));
test('Has charset UTF-8', html.includes('charset="UTF-8"'));

// Resume file check
test('Resume PDF exists', fs.existsSync('Sai_Kannadkar_Resume.pdf'));

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);