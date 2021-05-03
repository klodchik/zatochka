console.log(SIMPLE_STORE_CONFIG);

(async function(){
  window.handleData = (json) => {
    const data = json.feed.entry;
    const transformed = transformData(data);
    addHtml(transformed);
  }

  function transformData(data) {
    const headers = {};
    const rows = {};

    for (const entry of data) {
      const content = entry.gs$cell;
      if (content.row === '1') {
        headers[content.col] = content.$t
      } else if (!content.$t) {
        continue;
      } else {
        if (!rows[content.row]) {
          rows[content.row] = {}
        }
        rows[content.row][headers[content.col]] = content.$t;
      }
    }
    return rows;
  }

  function addHtml (entries) {
    const container = window.content;
    const clone = container.cloneNode();
    clone.innerHTML = '';

    for (const value of Object.values(entries)) {
      const card = document.createElement('div');
      card.classList.add('card');
      clone.appendChild(card);

      const img = document.createElement('img');
      img.classList.add('card-img-top')
      img.setAttribute('src', value[SIMPLE_STORE_CONFIG.sheetImgColName] || './img/placeholder.png');
      img.setAttribute('alt', value[SIMPLE_STORE_CONFIG.sheetTitleColName] || '');
      card.appendChild(img);

      const body = document.createElement('div');
      body.classList.add('card-body');
      card.appendChild(body);

      const title = document.createElement('h3');
      title.classList.add('card-title');
      title.innerText = value[SIMPLE_STORE_CONFIG.sheetTitleColName] || 'N/A';
      body.appendChild(title);

      const desc = document.createElement('p');
      desc.classList.add('card-text');
      desc.innerText = value[SIMPLE_STORE_CONFIG.sheetDescColName] || '';
      body.appendChild(desc);
    }
    container.parentNode.replaceChild(clone, container);
  }

  if (SIMPLE_STORE_CONFIG && SIMPLE_STORE_CONFIG.sheetId) {
    const script = document.createElement('script');
    script.setAttribute('src', `https://spreadsheets.google.com/feeds/cells/${SIMPLE_STORE_CONFIG.sheetId}/1/public/values?alt=json-in-script&callback=handleData`)
    document.body.appendChild(script);
  }
}())


