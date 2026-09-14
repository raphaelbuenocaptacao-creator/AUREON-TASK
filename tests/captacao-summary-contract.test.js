const fs = require('fs');
const html = fs.readFileSync('captacao-resumo.html', 'utf8');

const required = [
  'id="reconciliation"',
  'id="actionHealth"',
  'function calcMeetingHealth',
  'Conferência da equipe',
  'Acompanhamento das ações',
  '@supabase/supabase-js',
  "from('task_user_data')",
  'async function syncSummaryFromCloud',
  'id="cloudState"'
];

const missing = required.filter(token => !html.includes(token));
if (missing.length) {
  console.error('Captação summary contract missing:', missing.join(', '));
  process.exit(1);
}

console.log('Captação summary contract OK');
