(async function(){
  function handleData(json) {
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

  function getImageLink(driveLink) {
    if (driveLink) {
      const fileId = driveLink.replace(/.*?file\/d\/(.*?)\/.*/, '$1');
      if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`
      }
    }
    return './img/placeholder.png'
  }

  function addHtml (entries) {
    const container = window.content;
    const clone = container.cloneNode();
    clone.innerHTML = '';

    for (const value of Object.values(entries)) {
      const card = document.createElement('div');
      card.classList.add('card');
      clone.classList.add('cards-container--grid');
      clone.appendChild(card);

      const imgContainer = document.createElement('div');
      imgContainer.classList.add('card-img-container')
      card.appendChild(imgContainer);

      const img = document.createElement('img');
      img.classList.add('card-img-top')
      img.setAttribute('src', getImageLink(value[SIMPLE_STORE_CONFIG.imgColName]))
      img.setAttribute('alt', value[SIMPLE_STORE_CONFIG.titleColName] || '');
      imgContainer.appendChild(img);

      const body = document.createElement('div');
      body.classList.add('card-body');
      card.appendChild(body);

      const title = document.createElement('h3');
      title.classList.add('card-title');
      title.innerText = value[SIMPLE_STORE_CONFIG.titleColName] || 'N/A';
      title.setAttribute('title', value[SIMPLE_STORE_CONFIG.titleColName] || 'N/A')
      body.appendChild(title);

      const priceContainer = document.createElement('div');
      priceContainer.classList.add('card-prices');
      body.appendChild(priceContainer);

      const price = document.createElement('div');

      if (value[SIMPLE_STORE_CONFIG.priceBeforeDiscountColName]) {
        price.classList.add('price-discount');

        const priceOld = document.createElement('div');
        priceOld.classList.add('card-old-price');
        priceOld.innerText = value[SIMPLE_STORE_CONFIG.priceBeforeDiscountColName];
        priceContainer.appendChild(priceOld);
      }

      price.classList.add('card-price');
      price.innerText = value[SIMPLE_STORE_CONFIG.priceColName] || 'N/A';
      priceContainer.appendChild(price);

      const desc = document.createElement('p');
      desc.classList.add('card-text');
      desc.innerText = value[SIMPLE_STORE_CONFIG.descColName] || '';
      body.appendChild(desc);
    }
    container.parentNode.replaceChild(clone, container);
  }

  function cleanContent() {
    const container = window.content;
    container.innerHTML = '';
  }

  if (SIMPLE_STORE_CONFIG && SIMPLE_STORE_CONFIG.sheetId) {
    try {
      const url = `https://spreadsheets.google.com/feeds/cells/${SIMPLE_STORE_CONFIG.sheetId}/1/public/values?alt=json`;
      const res = await fetch(url);
      if (res.ok) {
        const body = await res.body;
        const reader = await body.getReader();
        var content = new Uint8Array();
        var done = false;
        while (!done) {
          const data = await reader.read();
          if (!data.done) {
            content = new Uint8Array([...content, ...data.value])
          }
          done = data.done;
        }
        var encodedString = String.fromCharCode.apply(null, content),
        json = decodeURIComponent(escape(encodedString));
        handleData(JSON.parse(json));
        return;
      }
    } catch (err) {
      console.log('error', err);
    }
    cleanContent();
    window.alert("Помилка завантаження даних!\n Спробуйте знову пізніше.\n\n У разі, якщо помилка з'явиться повторно - будь-ласка повідомте власника або адміністратора сайту");
  }
}())


