const fileElement = document.getElementById('csv-data');
fileElement.addEventListener('input', _ => {
    const file = document.getElementById('csv-data').files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        let jsonObj = $.csv.toObjects(reader.result);;
        const aggregate = {};
        const projects = new Set();
        jsonObj.forEach(e => {
            const k = e['Work date'].split(" ")[0];
            if (!aggregate[k]) {
                aggregate[k] = {};
            }
            let p = e['Tenrox Project'] ? e['Tenrox Project'] : 'Global' ;
            projects.add(p);
            if (!aggregate[k][p]){
                aggregate[k][p] = 0; 
            }
            aggregate[k][p] += parseFloat( e['Hours']);
        });
        createTable(aggregate, projects);
    }
    reader.readAsText(file);
})

function createTable(data, projects) {
    results.innerHTML = '';
    const table = document.createElement('table');
    table.className = 'table table-striped';
    results.appendChild(table);
    const thead = document.createElement('thead');
    table.appendChild(thead);
    const headerRow = document.createElement('tr'); 
    thead.appendChild(headerRow);
    headerRow.appendChild(document.createElement('td'));
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    const rowMap = new Map();
    projects.forEach(e => {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = e;
        tr.appendChild(th);
        tbody.appendChild(tr);
        rowMap.set(e, tr);
    })

    const total = document.createElement('tr');
    const totalTh = document.createElement('th');
    totalTh.textContent = 'Total';
    total.appendChild(totalTh);
    tbody.appendChild(total);

    const dates = Object.keys(data);
    dates.forEach(e => {
        const th = document.createElement('th');
        th.textContent = e;
        headerRow.appendChild(th);
        let sum = 0;
        projects.forEach(p => {
            const td = document.createElement('td');
            td.textContent = data[e]?.[p] ?? '';
            sum += data[e]?.[p] ?? 0;
            rowMap.get(p).appendChild(td);
        });
        const colSum = document.createElement('td');
        colSum.textContent = sum;
        total.appendChild(colSum);
    });
}