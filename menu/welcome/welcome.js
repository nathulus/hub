// Script spécifique pour charger les liens dans welcome.html
const infraSitesListElement = document.getElementById('infra-sites-list');
const collegeSitesListElement = document.getElementById('college-sites-list');

// Correction de la fonction getFaviconUrl
const getFaviconUrl = (url) => {
    try {
        const urlObject = new URL(url);
        // Utilise favicon Google, mais fallback si erreur de chargement
        return `https://www.google.com/s2/favicons?domain=${urlObject.hostname}&sz=32`;
    } catch (e) {
        return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌐</text></svg>';
    }
};

// Ajouter la fonction formatDateFr
function formatDateFr(dateStr) {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Erreur format date:', error);
        return dateStr;
    }
}

const URL_BASE = "https://yfxbheoyavydissfpvwh.supabase.co";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmeGJoZW95YXZ5ZGlzc2ZwdndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwOTI0NTEsImV4cCI6MjA2MzY2ODQ1MX0.n10JVF_CSap7fmdbQYcgpmtrfacOX9HBaSB779KrV1o";

async function chargerLiens() {
    const res = await fetch(`${URL_BASE}/rest/v1/URL`, {
        headers: {
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
        },
    });
    const liens = await res.json();
    const infraList = document.getElementById('infra-sites-list');
    const collegeList = document.getElementById('college-sites-list');
    infraList.innerHTML = '';
    collegeList.innerHTML = '';
    liens.forEach(lien => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.src = getFaviconUrl(lien.url);
        img.alt = `Icone ${lien.nom}`;
        img.classList.add('site-icon');
        img.onerror = function() {
            this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌐</text></svg>';
            this.style.backgroundColor = 'transparent';
            this.onerror = null;
        };
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('infra-site-info');
        const h3 = document.createElement('h3');
        h3.textContent = lien.nom;
        const description = document.createElement('p');
        description.classList.add('description');
        description.textContent = lien.description || 'Pas de description.';
        const urlP = document.createElement('p');
        urlP.classList.add('url');
        urlP.textContent = lien.url;
        const visitLink = document.createElement('a');
        visitLink.href = lien.url;
        visitLink.textContent = "Visiter";
        visitLink.classList.add('visit-link');
        visitLink.target = "_blank";
        visitLink.rel = "noopener noreferrer";
        infoDiv.appendChild(h3);
        infoDiv.appendChild(description);
        infoDiv.appendChild(urlP);
        infoDiv.appendChild(visitLink);
        li.appendChild(img);
        li.appendChild(infoDiv);

        // Utilisation de la catégorie pour déterminer où placer le lien
        if (lien.categorie === 'college') {
            collegeList.appendChild(li);
        } else if (lien.categorie === 'server') {
            infraList.appendChild(li);
        }
        // Les liens de catégorie 'app' ne sont pas affichés sur la page d'accueil
    });
}

// Affichage de la date du jour
function afficherDate(dateLimite) {
    const el = document.getElementById('date-jour');
    if (dateLimite) {
        el.textContent = `Prochaine date limite : ${formatDateFr(dateLimite)}`;
    } else {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const dateStr = new Date().toLocaleDateString('fr-FR', options);
        el.textContent = dateStr;  // Affiche juste la date sans "Nous sommes le"
    }
}

// Affichage météo (utilisation de wttr.in pour simplicité)
async function afficherMeteo() {
    const el = document.getElementById('meteo');
    try {
        const res = await fetch('https://wttr.in/Saint-Just-34400?format=%t+%c');
        if (!res.ok) throw new Error();
        const meteo = await res.text();
        
        // Conversion des codes météo en emojis
        const emojiMap = {
            "☀️": "☀️",  // Soleil
            "☁️": "☁️",  // Nuageux
            "⛅": "⛅",   // Partiellement nuageux
            "🌧️": "🌧️",  // Pluie
            "⛈️": "⛈️",  // Orage
            "🌫️": "🌫️"   // Brouillard
        };

        // Extraction de la température et du code météo
        const [temp, condition] = meteo.split(' ');
        const emoji = emojiMap[condition] || '🌡️';
        
        // Formatage de la température (suppression du +/- initial si présent)
        const tempFormatted = temp.replace(/^[+]/, '');
        
        el.textContent = `${emoji} ${tempFormatted}`;
    } catch {
        el.textContent = "Météo indisponible";
    }
}

// Remplacer la constante TACHES_PAR_CATEGORIE par un chargement depuis Supabase
async function chargerTaches() {
    try {
        const res = await fetch(`${URL_BASE}/rest/v1/taches?select=*`, {
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`,
            },
        });
        const taches = await res.json();
        console.log('Tâches brutes reçues:', taches);
        
        // Normalisation des priorités pour l'affichage
        return taches.map(t => ({
            id: t.id,
            titre: t.title || t.titre || t.name || 'Sans titre',
            description: t.description,
            fait: t.completed || false,
            date: t.due_date || t.date_prevue || new Date().toISOString(), // Utilise due_date en priorité
            priorite: (t.priority || t.priorite || 'NORMAL').toUpperCase()
        }));
    } catch (error) {
        console.error('Erreur chargement tâches:', error);
        return [];
    }
}

async function toggleTache(id, completed) {
    try {
        await fetch(`${URL_BASE}/rest/v1/taches?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: completed })
        });
    } catch (error) {
        console.error('Erreur mise à jour tâche:', error);
    }
}

function afficherTaches() {
    const el = document.getElementById('tasks-list');
    const catBar = document.getElementById('tasks-categories');
    let selectedPriority = "Toutes";
    let tachesData = [];

    const PRIORITY_LABELS = {
        "HIGH": "Haute",
        "NORMAL": "Normale",
        "LOW": "Basse"
    };
    const PRIORITY_COLORS = {
        "Haute": "#ef4444",
        "Normale": "#3b82f6",
        "Basse": "#10b981"
    };
    const PRIORITIES = ["Toutes", "Haute", "Normale", "Basse"];

    async function loadAndRender() {
        tachesData = await chargerTaches();

        // Calcul de la prochaine date limite (due_date)
        const now = new Date();
        now.setHours(0,0,0,0);
        
        const nonDone = tachesData
            .filter(t => !t.fait && t.date)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .find(t => {
                const taskDate = new Date(t.date);
                taskDate.setHours(0,0,0,0);
                return taskDate >= now;
            });

        // Si on trouve une tâche, on utilise sa date
        const prochaineDate = nonDone ? nonDone.date.split('T')[0] : null;
        afficherDate(prochaineDate);

        renderPriorities();
        renderTasks();
    }

    function renderPriorities() {
        catBar.innerHTML = "";
        PRIORITIES.forEach(prio => {
            const btn = document.createElement("button");
            btn.className = "tasks-tab-btn" + (prio === selectedPriority ? " active" : "");
            btn.textContent = prio;
            btn.setAttribute("data-priority", prio);
            btn.style.setProperty('--priority-color', PRIORITY_COLORS[prio] || '#6366f1');
            btn.onclick = () => {
                selectedPriority = prio;
                renderPriorities();
                renderTasks();
            };
            catBar.appendChild(btn);
        });
    }

    function renderTasks() {
        let taches = tachesData;
        if (selectedPriority !== "Toutes") {
            // Correction du filtrage des priorités
            taches = taches.filter(t => {
                const taskPrioLabel = PRIORITY_LABELS[t.priorite] || "Normale";
                return taskPrioLabel === selectedPriority;
            });
        }
        const priorityOrder = { "HIGH": 0, "NORMAL": 1, "LOW": 2 };
        taches.sort((a, b) => {
            const dateA = a.date ? new Date(a.date) : new Date('2099-12-31');
            const dateB = b.date ? new Date(b.date) : new Date('2099-12-31');
            if (dateA.getTime() !== dateB.getTime()) {
                return dateA - dateB;
            }
            return (priorityOrder[a.priorite] ?? 1) - (priorityOrder[b.priorite] ?? 1);
        });

        const tachesParDate = {};
        taches.forEach(t => {
            // N'affiche pas la date du jour si la tâche n'a pas de date
            if (!t.date) return;
            const date = t.date.split('T')[0];
            if (!tachesParDate[date]) tachesParDate[date] = [];
            tachesParDate[date].push(t);
        });

        let html = '<div class="tasks-timeline">';
        if (Object.keys(tachesParDate).length === 0) {
            html += '<div class="no-tasks">Aucune tâche trouvée</div>';
        } else {
            Object.keys(tachesParDate).sort().forEach(date => {
                html += `
                    <div class="tasks-list-date-separator">
                        <span class="date-dot"></span>
                        <span class="date-label">${formatDateFr(date)}</span>
                    </div>
                    <ul class="tasks-list">
                `;
                tachesParDate[date].forEach(t => {
                    const prioLabel = PRIORITY_LABELS[t.priorite] || "Normale";
                    html += `
                        <li class="${t.fait ? 'done' : ''}" 
                            data-priority="${prioLabel}"
                            data-id="${t.id}">
                            <span class="task-check"></span>
                            <span class="priority-indicator"></span>
                            <div class="task-content">
                                <div class="task-title">${t.titre || 'Sans titre'}</div>
                                ${t.description ? 
                                    `<div class="task-description">${t.description}</div>` : 
                                    ''}
                            </div>
                        </li>`;
                });
                html += '</ul>';
            });
        }
        html += '</div>';
        el.innerHTML = html;

        // Gestion des clics
        el.querySelectorAll('li:not(.done)').forEach(li => {
            li.addEventListener('click', async () => {
                const id = li.getAttribute('data-id');
                if (id) {
                    try {
                        await toggleTache(id, true);
                        li.classList.add('done');
                        await loadAndRender();
                    } catch (error) {
                        console.error('Erreur lors de la mise à jour:', error);
                    }
                }
            });
        });
    }

    loadAndRender();
}

function updateHeure() {
    const el = document.getElementById('heure');
    const now = new Date();
    const heureStr = now.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    el.textContent = heureStr;
}

document.addEventListener('DOMContentLoaded', () => {
    afficherDate();
    afficherMeteo();
    afficherTaches();
    chargerLiens();
    updateHeure();
    // Mise à jour de l'heure toutes les secondes
    setInterval(updateHeure, 1000);
});

