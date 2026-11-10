import https from 'https';

function fetchForm(url) {
  https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log('Redirecting to:', res.headers.location);
      fetchForm(res.headers.location);
      return;
    }
    let html = '';
    res.on('data', chunk => html += chunk);
    res.on('end', () => {
      console.log('Final URL fetched. Status:', res.statusCode);
      const match = html.match(/FB_PUBLIC_LOAD_DATA_\s*=\s*(\[.+?\]);\s*<\/script>/s);
      if (match) {
        try {
          const raw = JSON.parse(match[1]);
          const formTitle = raw[1][8] || raw[1][0];
          console.log('=== GOOGLE FORM DETECTED ===');
          console.log('Title:', formTitle);
          const items = raw[1][1];
          console.log('Total Questions:', items ? items.length : 0);
          const mapping = {};
          if (items) {
            items.forEach((item, idx) => {
              if (item && item[1]) {
                const title = item[1];
                const typeCode = item[3];
                const entryId = item[4] && item[4][0] && item[4][0][0];
                const options = item[4] && item[4][0] && item[4][0][1] ? item[4][0][1].map(o => o[0]) : [];
                console.log(`[Field ${idx + 1}] "${title}" (Type: ${typeCode}, Entry: entry.${entryId})`);
                if (entryId) {
                  mapping[title] = `entry.${entryId}`;
                }
                if (options.length > 0) {
                  console.log(`   Options: ${options.join(' | ')}`);
                }
              }
            });
          }
          console.log('\n--- JSON MAPPING ---');
          console.log(JSON.stringify(mapping, null, 2));
        } catch (e) {
          console.error('Error parsing JSON:', e.message);
        }
      } else {
        console.log('Could not find FB_PUBLIC_LOAD_DATA_');
      }
    });
  }).on('error', (err) => {
    console.error('Fetch error:', err.message);
  });
}

const target = process.argv[2] || 'https://forms.gle/fD4sCK9HbiGSEA6g9';
fetchForm(target);
