let allData = [];
const imagePath = 'Bilder/'; // WICHTIG: Pfad zu Ihrem Bilder-Ordner

/**
 * Simples CSV-Parsing für die Struktur Ihrer Datei.
 */
async function loadCSV(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Konnte Datei nicht laden: ${response.statusText}`);
    }
    const text = await response.text();
    const rows = text.split('\r\n').filter(line => line.trim() !== ''); // Zeilen trennen
    
    if (rows.length === 0) return [];

    const header = rows[0].split(';').map(h => h.trim());
    const data = [];

    for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(';');
        const item = {};
        if (values.length === header.length) {
            header.forEach((key, index) => {
                item[key] = values[index].trim();
            });
            data.push(item);
        }
    }
    return data;
}

/**
 * Initialisiert die Anwendung: lädt Daten, füllt Filter, rendert.
 */
async function init() {
    try {
        allData = await loadCSV('Mappe1.csv');
        // Bereinigen Sie die Kopfzeilen, da sie in der CSV Sonderzeichen/Leerzeichen enthalten können
        allData = allData.map(item => {
            return {
                Title: item.Title || '',
                Quelle: item['Quelle - Tags'] || '',
                Datum: item.Datum || '',
                Beschreibung: item.Beschreibung || '',
                Art: item['Art der Visualisierung - Tags'] || '',
                Unsicherheit: item['Visualisierung der Unsicherheit'] || '',
                Link: item.Link || '',
                Bild: item.Bild || '',
                TypUnsicherheit: item['type of uncertainty'] || ''
            };
        });

        populateFilters();
        renderVisualizations(allData);
    } catch (error) {
        console.error('Fehler beim Laden oder Parsen der Daten:', error);
        document.getElementById('visualizationGrid').innerHTML = '<p style="color: red;">Fehler beim Laden der Daten. Bitte prüfen Sie den Dateinamen und das Format der CSV-Datei.</p>';
    }
}

/**
 * Füllt die Dropdown-Filter mit eindeutigen Werten.
 */
function populateFilters() {
    const quelleSet = new Set();
    const artSet = new Set();
    const unsicherheitSet = new Set();

    allData.forEach(item => {
        if (item.Quelle) quelleSet.add(item.Quelle);
        if (item.Art) artSet.add(item.Art);
        if (item.TypUnsicherheit) unsicherheitSet.add(item.TypUnsicherheit);
    });

    // Füllen der Dropdowns
    fillSelect('quelleFilter', [...quelleSet]);
    fillSelect('artFilter', [...artSet]);
    fillSelect('unsicherheitFilter', [...unsicherheitSet]);
}

function fillSelect(elementId, values) {
    const select = document.getElementById(elementId);
    select.innerHTML = '<option value="">Alle</option>'; // Standardoption
    values.sort().forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });
}

/**
 * Wendet die Filter an und rendert neu.
 */
function filterVisualizations() {
    const quelle = document.getElementById('quelleFilter').value;
    const art = document.getElementById('artFilter').value;
    const unsicherheit = document.getElementById('unsicherheitFilter').value;

    const filteredData = allData.filter(item => {
        const matchQuelle = !quelle || item.Quelle.includes(quelle);
        const matchArt = !art || item.Art.includes(art); // Mit 'includes', da Art oft mehrere Tags hat
        const matchUnsicherheit = !unsicherheit || item.TypUnsicherheit.includes(unsicherheit);

        return matchQuelle && matchArt && matchUnsicherheit;
    });

    renderVisualizations(filteredData);
}

/**
 * Setzt alle Filter zurück und rendert neu.
 */
function resetFilters() {
    document.getElementById('quelleFilter').value = '';
    document.getElementById('artFilter').value = '';
    document.getElementById('unsicherheitFilter').value = '';
    filterVisualizations();
}

/**
 * Rendert die Visualisierungen im Grid.
 */
function renderVisualizations(data) {
    const grid = document.getElementById('visualizationGrid');
    grid.innerHTML = ''; // Vorherige Elemente löschen

    if (data.length === 0) {
        grid.innerHTML = '<p>Keine Visualisierungen gefunden, die den Filtern entsprechen.</p>';
        return;
    }

    data.forEach(item => {
        const visItem = document.createElement('div');
        visItem.className = 'vis-item';
        visItem.onclick = () => showDetails(item); // Klick-Handler
        
        // Verwenden Sie das 'Bild'-Attribut für den Dateinamen
        const imageSrc = imagePath + item.Bild;
        
        visItem.innerHTML = `
            <img src="${imageSrc}" alt="Visualisierung: ${item.Title}">
            <h4>${item.Title || item.Bild}</h4>
            <p>Quelle: ${item.Quelle}</p>
        `;
        grid.appendChild(visItem);
    });
}

/**
 * Zeigt das Modal mit den Detailinformationen an.
 */
function showDetails(item) {
    document.getElementById('modalTitle').textContent = item.Title;
    document.getElementById('modalQuelle').textContent = item.Quelle;
    document.getElementById('modalDatum').textContent = item.Datum;
    document.getElementById('modalBeschreibung').textContent = item.Beschreibung;
    document.getElementById('modalArt').textContent = item.Art;
    document.getElementById('modalUnsicherheit').textContent = item.Unsicherheit;
    document.getElementById('modalTypUnsicherheit').textContent = item.TypUnsicherheit;
    document.getElementById('modalLink').href = item.Link;
    document.getElementById('modalImage').src = imagePath + item.Bild;
    
    document.getElementById('detailModal').style.display = 'block';
}

/**
 * Schließt das Modal.
 */
function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
}

// Startet die Anwendung, wenn das Skript geladen ist
init();