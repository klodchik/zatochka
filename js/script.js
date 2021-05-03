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
      img.setAttribute('src', value['image'] || './img/placeholder.png');
      img.setAttribute('alt', value['Title'] || '');
      card.appendChild(img);

      const body = document.createElement('div');
      body.classList.add('card-body');
      card.appendChild(body);

      const title = document.createElement('h3');
      title.classList.add('card-title');
      title.innerText = value['Имя Ментора'] || 'N/A';
      body.appendChild(title);

      const desc = document.createElement('p');
      desc.classList.add('card-text');
      desc.innerText = value['Город проживания ментора'] || '';
      body.appendChild(desc);



  //     <div class="card" style="width: 18rem;">
  // <img src="..." class="card-img-top" alt="...">
  // <div class="card-body">
  //   <h5 class="card-title">Card title</h5>
  //   <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  //   <a href="#" class="btn btn-primary">Go somewhere</a>
  // </div>
// </div>
      // console.log(value);
    }
    container.parentNode.replaceChild(clone, container);
  }
}())


