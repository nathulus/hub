// Configuration Supabase
        const SUPABASE_URL = 'https://yfxbheoyavydissfpvwh.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmeGJoZW95YXZ5ZGlzc2ZwdndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwOTI0NTEsImV4cCI6MjA2MzY2ODQ1MX0.n10JVF_CSap7fmdbQYcgpmtrfacOX9HBaSB779KrV1o';

        // Corriger la configuration des matières
        const SUBJECTS_CONFIG = {
            'Histoire': { emoji: '🏛️', color: 'var(--primary-color)', type: 'histoire', display: 'Histoire' },
            'Géographie': { emoji: '🗺️', color: 'var(--primary-color)', type: 'geographie', display: 'Géographie' },
            'EMC': { emoji: '⚖️', color: 'var(--primary-color)', type: 'emc', display: 'EMC' },
            'Français': { emoji: '📚', color: 'var(--primary-color)', type: 'francais', display: 'Français' },
            'Mathématiques': { emoji: '📐', color: 'var(--primary-color)', type: 'mathematiques', display: 'Mathématiques' },
            'Physique': { emoji: '⚡', color: 'var(--primary-color)', type: 'physique', display: 'Physique' },
            'Chimie': { emoji: '🧪', color: 'var(--primary-color)', type: 'chimie', display: 'Chimie' },
            'SVT': { emoji: '🧬', color: 'var(--primary-color)', type: 'svt', display: 'SVT' },
            'Technologie': { emoji: '🔧', color: 'var(--primary-color)', type: 'techno', display: 'Technologie' },
            'Anglais': { emoji: '🇬🇧', color: 'var(--primary-color)', type: 'anglais', display: 'Anglais' },
            'Espagnol': { emoji: '🇪🇸', color: 'var(--primary-color)', type: 'espagnol', display: 'Espagnol' }
        };

        // Map de correspondance pour gérer la casse
        const TYPE_MAP = {
            'histoire': 'Histoire',
            'geographie': 'Geographie',
            'emc': 'emc',
            'francais': 'Francais',
            'mathematiques': 'Mathematiques',
            'physique': 'Physique',
            'chimie': 'Chimie',
            'svt': 'SVT',
            'techno': 'Techno',
            'anglais': 'Anglais',
            'espagnol': 'Espagnol'
        };

        // 2. Remplacer la fonction createSubjectCard
        function createSubjectCard(subject) {
            const config = SUBJECTS_CONFIG[subject];
            if (!config) {
                console.error('Configuration manquante pour:', subject);
                return '';
            }
            // Ajoute la barre de progression à la catégorie
            return `
                <div class="subject-card ${config.type}">
                    <div class="subject-header" onclick="toggleSubject(this)">
                        <div class="subject-title">
                            <div class="subject-emoji">${config.emoji}</div>
                            <h3>${subject}</h3>
                        </div>
                        <div class="subject-controls">
                            <div class="subject-progress">
                                <span class="completed">0</span>/<span class="total">0</span>
                            </div>
                            <div class="subject-arrow">
                                <i class="fas fa-chevron-down"></i>
                            </div>
                        </div>
                    </div>
                    <div class="subject-category-progress">
                        <div class="subject-category-progress-bar">
                            <div class="subject-category-progress-fill" style="width:0%"></div>
                        </div>
                    </div>
                    <div class="chapters-content" style="display: none;">
                        <div class="chapters-list"></div>
                    </div>
                </div>
            `;
        }

        // Modifier la fonction addChapter pour mieux gérer l'affichage
        function addChapter(subject, chapterName, description, links, ressources, chapterId, termine = false) {
            // Trouver la bonne matière dans SUBJECTS_CONFIG
            const subjectEntry = Object.entries(SUBJECTS_CONFIG).find(([_, config]) => config.type === subject);
            if (!subjectEntry) {
                console.error("Matière non trouvée pour le type:", subject);
                return;
            }
            
            const [subjectKey] = subjectEntry;
            const subjectCard = document.querySelector(`.subject-card.${subject}`);
            if (subjectCard) {
                const chaptersList = subjectCard.querySelector('.chapters-list');
                if (chaptersList) {
                    const chapterItem = document.createElement('div');
                    chapterItem.className = 'chapter-item';
                    
                    // Calculer la progression
                    let progress = 0;
                    let totalResources = 0;
                    let completedResources = 0;
                    
                    // Compter les quiz
                    if (ressources.quiz) {
                        totalResources += ressources.quiz.length;
                    }
                    // Compter les vidéos
                    if (ressources.videos) {
                        totalResources += ressources.videos.length;
                    }
                    
                    // Si le chapitre est terminé, toutes les ressources sont complétées
                    if (termine) {
                        completedResources = totalResources;
                        progress = 100;
                    }
                    
                    // Construire les boutons de ressources dynamiquement
                    let resourceButtonsHTML = '';
                    // Tous les boutons Quiz appellent maintenant showResource
                    if (ressources.quiz && ressources.quiz[0]) {
                         resourceButtonsHTML += `
                            <button class="resource-btn quiz-btn" onclick="showResource('quiz', '${subject}', '${chapterName}', '${ressources.quiz[0]}', '${chapterId}')">
                                <i class="fas fa-question-circle"></i> Quiz 1
                            </button>
                        `;
                    }
                    if (ressources.quiz && ressources.quiz[1]) {
                         resourceButtonsHTML += `
                            <button class="resource-btn quiz-btn" onclick="showResource('quiz', '${subject}', '${chapterName}', '${ressources.quiz[1]}', '${chapterId}')">
                                <i class="fas fa-question-circle"></i> Quiz 2
                            </button>
                        `;
                    }
                    if (ressources.quiz && ressources.quiz[2]) {
                         resourceButtonsHTML += `
                            <button class="resource-btn quiz-btn" onclick="showResource('quiz', '${subject}', '${chapterName}', '${ressources.quiz[2]}', '${chapterId}')">
                                <i class="fas fa-question-circle"></i> Quiz 3
                            </button>
                        `;
                    }
                    // Boutons Vidéo 1, 2, et 3 (ouvrent directement le lien)
                    if (ressources.videos && ressources.videos[0]) {
                        resourceButtonsHTML += `
                            <button class="resource-btn video-btn" onclick="window.open('${ressources.videos[0]}', '_blank')">
                                <i class="fab fa-youtube"></i> Vidéo 1
                            </button>
                        `;
                    }
                     if (ressources.videos && ressources.videos[1]) {
                        resourceButtonsHTML += `
                            <button class="resource-btn video-btn" onclick="window.open('${ressources.videos[1]}', '_blank')">
                                <i class="fab fa-youtube"></i> Vidéo 2
                            </button>
                        `;
                    }
                     if (ressources.videos && ressources.videos[2]) {
                        resourceButtonsHTML += `
                            <button class="resource-btn video-btn" onclick="window.open('${ressources.videos[2]}', '_blank')">
                                <i class="fab fa-youtube"></i> Vidéo 3
                            </button>
                        `;
                    }

                    chapterItem.innerHTML = `
                        <div class="chapter-info">
                            <div class="chapter-header">
                                <div class="chapter-id">${chapterId}</div>
                                <div class="chapter-name">${chapterName}</div>
                                <button class="edit-btn" onclick="editChapter('${chapterId}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                            <div class="chapter-resources">
                                ${resourceButtonsHTML}
                            </div>
                        </div>
                        <div class="chapter-complete">
                            <input type="checkbox" id="complete-${chapterId}" onchange="updateProgress(this)" ${termine ? 'checked' : ''}>
                            <label for="complete-${chapterId}">Terminé</label>
                        </div>
                    `;
                    chaptersList.appendChild(chapterItem);
                    updateStats();
                } else {
                    console.error("Liste des chapitres non trouvée pour:", subject);
                }
            } else {
                console.error("Carte de matière non trouvée pour:", subject);
            }
        }

        // Fonction pour obtenir l'emoji correspondant à une matière
        function getEmojiForSubject(subject) {
            return SUBJECTS_CONFIG[subject]?.emoji || '📚';
        }

        // 3. Modifier la fonction loadChapters
        async function loadChapters() {
            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/revisions?select=*`, {
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`
                    }
                });
                
                if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
                
                const chapters = await response.json();
                const chaptersBySubject = {};
                
                chapters.forEach(chapter => {
                    const matiere = chapter.matiere.toLowerCase();
                    // Trouver la matière correspondante dans SUBJECTS_CONFIG
                    const subjectEntry = Object.entries(SUBJECTS_CONFIG).find(
                        ([_, config]) => config.type === matiere
                    );
                    
                    if (subjectEntry) {
                        const [subject] = subjectEntry;
                        if (!chaptersBySubject[subject]) {
                            chaptersBySubject[subject] = [];
                        }
                        chaptersBySubject[subject].push(chapter);
                    }
                });

                const subjectsContainer = document.querySelector('.subjects-container');
                subjectsContainer.innerHTML = '';

                // Créer les cartes pour toutes les matières
                Object.keys(SUBJECTS_CONFIG).forEach(subject => {
                    const newCard = createSubjectCard(subject);
                    subjectsContainer.insertAdjacentHTML('beforeend', newCard);
                });

                // Ajouter les chapitres
                Object.entries(chaptersBySubject).forEach(([subject, subjectChapters]) => {
                    // Trier les chapitres avant de les ajouter
                    subjectChapters.sort(compareChapterIds);
                    
                    subjectChapters.forEach(chapter => {
                        addChapter(
                            SUBJECTS_CONFIG[subject].type,
                            chapter.chapitre,
                            '',
                            [],
                            {
                                quiz: [chapter.lien_quiz_1, chapter.lien_quiz_2, chapter.lien_quiz_3].filter(Boolean),
                                videos: [chapter.lien_video_1, chapter.lien_video_2, chapter.lien_video_3].filter(Boolean)
                            },
                            chapter.id,
                            chapter.termine || false // Changé de 'completed' à 'termine'
                        );
                    });
                });

                updateStats();
            } catch (error) {
                console.error('Erreur lors du chargement des chapitres:', error);
                showCustomAlert('Erreur lors du chargement des chapitres: ' + error.message, 'error');
            }
        }

        // Ajouter cette nouvelle fonction de tri personnalisée avant loadChapters
        function compareChapterIds(a, b) {
            // Extraire la lettre et le numéro
            const aMatch = a.id.match(/^([A-Za-z]+)(.*)$/);
            const bMatch = b.id.match(/^([A-Za-z]+)(.*)$/);
            
            if (!aMatch || !bMatch) return 0;
            
            const [, aLetter, aNumber] = aMatch;
            const [, bLetter, bNumber] = bMatch;
            
            // Comparer d'abord les lettres
            if (aLetter !== bLetter) {
                return aLetter.localeCompare(bLetter);
            }
            
            // Fonction pour normaliser les numéros
            const normalizeNumber = (num) => {
                // Traiter les cas spéciaux comme "2 bis"
                if (num.includes('bis')) {
                    const baseNum = num.split(' ')[0];
                    return parseFloat(baseNum) + 0.5;
                }
                return parseFloat(num) || 0;
            };
            
            // Comparer les numéros
            return normalizeNumber(aNumber) - normalizeNumber(bNumber);
        }

        // Fonction pour créer un feu d'artifice
        function createFirework(x, y) {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = x + 'px';
            firework.style.top = y + 'px';
            document.body.appendChild(firework);

            // Créer les particules
            const particleCount = 24; // Beaucoup plus de particules
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'firework-particle';
                const angle = (i / particleCount) * Math.PI * 2;
                const velocity = 4 + Math.random() * 4; // Vitesse encore plus élevée
                particle.style.setProperty('--angle', angle + 'rad');
                particle.style.setProperty('--velocity', velocity);
                // Plus de couleurs
                const colors = [
                    'var(--success-color)', 
                    'var(--primary-color)', 
                    'var(--warning-color)', 
                    'var(--info-color)',
                    'var(--purple-color)',
                    'var(--pink-color)',
                    'var(--yellow-color)',
                    '#FF0000', // Rouge
                    '#00FF00', // Vert
                    '#0000FF', // Bleu
                    '#FF00FF', // Magenta
                    '#00FFFF'  // Cyan
                ];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                particle.style.setProperty('--particle-color', randomColor);
                firework.appendChild(particle);
            }

            // Supprimer le feu d'artifice après l'animation
            setTimeout(() => {
                firework.remove();
            }, 2000); // Animation plus longue
        }

        // Fonction pour créer plusieurs feux d'artifice
        function createFireworks(x, y) {
            const fireworkCount = 20; // Beaucoup plus de feux d'artifice
            for (let i = 0; i < fireworkCount; i++) {
                setTimeout(() => {
                    // Position aléatoire sur l'écran
                    const screenWidth = window.innerWidth;
                    const screenHeight = window.innerHeight;
                    const randomX = Math.random() * screenWidth;
                    const randomY = Math.random() * screenHeight;
                    createFirework(randomX, randomY);
                }, i * 100); // Délai encore plus court entre chaque feu d'artifice
            }

            // Créer une deuxième vague de feux d'artifice
            setTimeout(() => {
                for (let i = 0; i < fireworkCount; i++) {
                    setTimeout(() => {
                        const screenWidth = window.innerWidth;
                        const screenHeight = window.innerHeight;
                        const randomX = Math.random() * screenWidth;
                        const randomY = Math.random() * screenHeight;
                        createFirework(randomX, randomY);
                    }, i * 100);
                }
            }, 1000);
        }

        // Modifier la fonction updateProgress
        async function updateProgress(checkbox) {
            const chapterItem = checkbox.closest('.chapter-item');
            const chapterId = chapterItem.querySelector('.chapter-id').textContent;
            
            try {
                // Mettre à jour l'état dans Supabase
                const response = await fetch(`${SUPABASE_URL}/rest/v1/revisions?id=eq.${chapterId}`, {
                    method: 'PATCH',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({
                        termine: checkbox.checked // Changé de 'completed' à 'termine'
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Réponse Supabase:', errorData);
                    throw new Error(`Erreur lors de la mise à jour du statut: ${errorData.message || 'Erreur inconnue'}`);
                }

                const subjectCard = chapterItem.closest('.subject-card');
                const progressInfo = subjectCard.querySelector('.subject-progress');
                const totalChapters = subjectCard.querySelectorAll('.chapter-item').length;
                const completedChapters = subjectCard.querySelectorAll('.chapter-item input[type="checkbox"]:checked').length;

                progressInfo.querySelector('.completed').textContent = completedChapters;
                progressInfo.querySelector('.total').textContent = totalChapters;

                // Animation stuff...
                if (checkbox.checked) {
                    // Mettre à jour la barre de progression à 100%
                    const progressBar = chapterItem.querySelector('.chapter-progress-fill');
                    progressBar.style.width = '100%';
                    
                    // Mettre à jour l'emoji de la matière si tous les chapitres sont terminés
                    const subjectCard = chapterItem.closest('.subject-card');
                    const totalChapters = subjectCard.querySelectorAll('.chapter-item').length;
                    const completedChapters = subjectCard.querySelectorAll('.chapter-item input[type="checkbox"]:checked').length;
                    
                    if (totalChapters === completedChapters) {
                        const subjectEmoji = subjectCard.querySelector('.subject-emoji');
                        subjectEmoji.classList.add('completed');
                        subjectEmoji.textContent = '';
                    }
                    
                    const completeButton = chapterItem.querySelector('.chapter-complete');
                    completeButton.classList.add('celebrating');
                    createFireworks();
                    // Ajouter l'alerte personnalisée
                    const chapterName = chapterItem.querySelector('.chapter-name').textContent;
                    showCustomAlert(`Chapitre "${chapterName}" terminé !`, 'success', 3000);
                    setTimeout(() => {
                        completeButton.classList.remove('celebrating');
                    }, 500);
                } else {
                    // Remettre la barre de progression à 0%
                    const progressBar = chapterItem.querySelector('.chapter-progress-fill');
                    progressBar.style.width = '0%';
                    
                    // Restaurer l'emoji de la matière si ce n'est plus complet
                    const subjectCard = chapterItem.closest('.subject-card');
                    const subjectEmoji = subjectCard.querySelector('.subject-emoji');
                    subjectEmoji.classList.remove('completed');
                    // Restaurer l'emoji d'origine
                    const subject = subjectCard.querySelector('.subject-title h3').textContent;
                    subjectEmoji.textContent = SUBJECTS_CONFIG[subject].emoji;
                }
                
                updateStats();
            } catch (error) {
                console.error('Erreur détaillée:', error);
                checkbox.checked = !checkbox.checked;
                showCustomAlert('Erreur lors de la mise à jour: ' + error.message, 'error');
            }
        }

        // Fonction pour mettre à jour les statistiques
        function updateStats() {
            const totalChapters = document.querySelectorAll('.chapter-item').length;
            const completedChapters = document.querySelectorAll('.chapter-item input[type="checkbox"]:checked').length;
            const remainingChapters = totalChapters - completedChapters;
            // Définir la variable progress avant de l'utiliser
            const progress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

            // Mise à jour des statistiques
            document.getElementById('total-chapters').textContent = totalChapters;
            document.getElementById('completed-chapters').textContent = completedChapters;
            document.getElementById('remaining-chapters').textContent = remainingChapters;
            document.querySelector('.progress-fill').style.width = `${progress}%`;
            document.getElementById('progress-percentage').textContent = `${Math.round(progress)}%`;

            // Mise à jour des compteurs, barres et emoji par matière
            document.querySelectorAll('.subject-card').forEach(card => {
                const subjectChapters = card.querySelectorAll('.chapter-item').length;
                const subjectCompleted = card.querySelectorAll('.chapter-item input[type="checkbox"]:checked').length;
                const progressInfo = card.querySelector('.subject-progress');
                if (progressInfo) {
                    progressInfo.querySelector('.completed').textContent = subjectCompleted;
                    progressInfo.querySelector('.total').textContent = subjectChapters;
                }
                // Barre de progression catégorie
                const bar = card.querySelector('.subject-category-progress-fill');
                const percent = subjectChapters > 0 ? (subjectCompleted / subjectChapters) * 100 : 0;
                if (bar) bar.style.width = percent + '%';

                // Emoji : croix verte seulement si tout est fait
                const emoji = card.querySelector('.subject-emoji');
                const subject = card.querySelector('.subject-title h3').textContent;
                if (subjectChapters > 0 && subjectCompleted === subjectChapters) {
                    emoji.classList.add('completed');
                    emoji.textContent = '';
                } else {
                    emoji.classList.remove('completed');
                    emoji.textContent = SUBJECTS_CONFIG[subject].emoji;
                }
            });
        }

        // Gestion de l'affichage des révisions
        const showNotesBtn = document.getElementById('show-notes-btn');
        const showRevisionsBtn = document.getElementById('show-revisions-btn');
        const revisionsSection = document.querySelector('.revisions-section');
        const notesSection = document.querySelector('.notes-section');
        let isRevisionsVisible = false;
        let isNotesVisible = false;

        showNotesBtn.addEventListener('click', async () => {
            isNotesVisible = !isNotesVisible;
            
            // Fermer la section Révisions si elle est ouverte
            if (isRevisionsVisible) {
                isRevisionsVisible = false;
                revisionsSection.style.display = 'none';
                showRevisionsBtn.innerHTML = '<i class="fas fa-book"></i> Révisions';
            }

            // Gérer l'affichage de la section Notes
            notesSection.style.display = isNotesVisible ? 'block' : 'none';
            showNotesBtn.innerHTML = isNotesVisible ? 
                '<i class="fas fa-times"></i> Fermer' : 
                '<i class="fas fa-star"></i> Notes et Moyennes';
            
            if (isNotesVisible) {
                await loadNotes();
            }
        });

        showRevisionsBtn.addEventListener('click', () => {
            isRevisionsVisible = !isRevisionsVisible;
            
            // Fermer la section Notes si elle est ouverte
            if (isNotesVisible) {
                isNotesVisible = false;
                notesSection.style.display = 'none';
                showNotesBtn.innerHTML = '<i class="fas fa-star"></i> Notes et Moyennes';
            }

            // Gérer l'affichage de la section Révisions
            revisionsSection.style.display = isRevisionsVisible ? 'block' : 'none';
            showRevisionsBtn.innerHTML = isRevisionsVisible ? 
                '<i class="fas fa-times"></i> Fermer' : 
                '<i class="fas fa-book"></i> Révisions';
        });

        // Remplacer la fonction loadNotes
        async function loadNotes() {
            try {
                // Charger les résultats des quiz et les chapitres
                const [notesResponse, chaptersResponse] = await Promise.all([
                    fetch(`${SUPABASE_URL}/rest/v1/quiz_resultats?select=*`, {
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`
                        }
                    }),
                    fetch(`${SUPABASE_URL}/rest/v1/revisions?select=*`, {
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`
                        }
                    })
                ]);

                const notes = await notesResponse.json();
                const chapters = await chaptersResponse.json();
                
                // Créer un Map des chapitres pour un accès rapide
                const chaptersMap = new Map(chapters.map(chapter => [chapter.id, chapter]));
                
                // Organiser les notes par matière
                const notesBySubject = {};
                
                // Initialiser toutes les matières
                Object.keys(SUBJECTS_CONFIG).forEach(subject => {
                    notesBySubject[SUBJECTS_CONFIG[subject].type] = [];
                });

                // Ajouter les notes existantes
                notes.forEach(note => {
                    const chapter = chaptersMap.get(note.chapitre_id);
                    if (chapter) {
                        // Corriger la détection du numéro de quiz en utilisant une comparaison plus précise
                        let quizNumber;
                        if (note.quiz_url === chapter.lien_quiz_1) quizNumber = 1;
                        else if (note.quiz_url === chapter.lien_quiz_2) quizNumber = 2;
                        else if (note.quiz_url === chapter.lien_quiz_3) quizNumber = 3;
                        else quizNumber = 1; // Par défaut quiz 1 si on ne trouve pas de correspondance

                        if (!notesBySubject[note.matiere]) {
                            notesBySubject[note.matiere] = [];
                        }
                        notesBySubject[note.matiere].push({
                            ...note,
                            quizNumber,
                            chapitreName: chapter.chapitre
                        });
                    }
                });

                const container = document.querySelector('.subjects-container-notes');
                container.innerHTML = '';

                // Créer une carte pour chaque matière
                Object.keys(SUBJECTS_CONFIG).forEach(subject => {
                    const config = SUBJECTS_CONFIG[subject];
                    const subjectNotes = notesBySubject[config.type] || [];
                    
                    // Calculer la moyenne
                    const totalNotes = subjectNotes.reduce((acc, note) => {
                        return acc + (note.note * 20) / note.bareme;
                    }, 0);
                    const averageNote = subjectNotes.length > 0 ? 
                        (totalNotes / subjectNotes.length).toFixed(2) : 
                        'Pas de note';

                    const card = document.createElement('div');
                    card.className = `subject-card ${config.type}`;
                    card.innerHTML = `
                        <div class="subject-header" onclick="toggleSubject(this)">
                            <div class="subject-title">
                                <div class="subject-emoji">${config.emoji}</div>
                                <h3>${subject}</h3>
                            </div>
                            <div class="subject-controls">
                                <div class="subject-average">Moyenne: ${averageNote}${subjectNotes.length > 0 ? '/20' : ''}</div>
                                <div class="subject-arrow">
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                            </div>
                        </div>
                        <div class="chapters-content" style="display: none;">
                            <div class="notes-list">
                                ${subjectNotes.length > 0 ? subjectNotes.map(note => `
                                    <div class="note-item">
                                        <div class="note-info">
                                            <div class="note-chapter">${note.chapitre_id} - ${note.chapitreName}</div>
                                            <div class="note-value">Quiz ${note.quizNumber}: ${note.note}/${note.bareme}</div>
                                        </div>
                                        <div class="note-date">${new Date(note.date).toLocaleDateString()}</div>
                                    </div>
                                `).join('') : '<div class="note-item empty">Aucune note pour cette matière</div>'}
                            </div>
                        </div>
                    `;
                    
                    container.appendChild(card);
                });
            } catch (error) {
                console.error('Erreur lors du chargement des notes:', error);
                showCustomAlert('Erreur lors du chargement des notes: ' + error.message, 'error');
            }
        }

        // Fonction pour basculer l'affichage d'une matière
        function toggleSubject(header) {
            const card = header.closest('.subject-card');
            const content = card.querySelector('.chapters-content');
            const arrow = header.querySelector('.subject-arrow i');
            
            if (content.style.display === 'none') {
                content.style.display = 'block';
                arrow.classList.remove('fa-chevron-down');
                arrow.classList.add('fa-chevron-up');
            } else {
                content.style.display = 'none';
                arrow.classList.remove('fa-chevron-up');
                arrow.classList.add('fa-chevron-down');
            }
        }

        // Initialisation des matières
        document.addEventListener('DOMContentLoaded', function() {
            // Charger les chapitres depuis Supabase
            loadChapters();
        });

        // Variables globales pour stocker les informations du quiz
        let currentQuizInfo = {
            subject: '',
            chapter: '',  // nom du chapitre
            chapterId: '', // ID du chapitre
            url: ''
        };

        // Remplacer la fonction showResource
        function showResource(type, subject, chapterName, resourceUrl, chapterId) {
            if (type === 'quiz') {
                currentQuizInfo = {
                    subject: subject,
                    chapter: chapterName,
                    chapterId: chapterId,
                    url: resourceUrl
                };

                // Afficher le popup de note
                const popup = document.getElementById('notePopup');
                popup.style.display = 'flex';
                setTimeout(() => {
                    popup.classList.add('active');
                    document.getElementById('noteInput').focus();
                }, 10);

                // Ouvrir le quiz dans un nouvel onglet
                if (resourceUrl) {
                    window.open(resourceUrl, '_blank');
                }
            } else if (resourceUrl) {
                window.open(resourceUrl, '_blank');
            }
        }

        // Remplacer la fonction closeNotePopup
        function closeNotePopup() {
            const popup = document.getElementById('notePopup');
            popup.classList.remove('active');
            setTimeout(() => {
                popup.style.display = 'none';
                document.getElementById('noteInput').value = '';
            }, 300);
        }

        // Fonction pour fermer le popup
        function closeNotePopup() {
            document.getElementById('notePopup').classList.remove('active');
            document.getElementById('noteInput').value = '';
        }

        // Fonction pour afficher une alerte personnalisée
        function showCustomAlert(message, type = 'info', duration = 2000) {
            const container = document.getElementById('custom-alert-container');
            const alertElement = document.createElement('div');
            alertElement.classList.add('custom-alert', type);
            
            // Ajouter l'icône appropriée selon le type
            let icon = '';
            switch(type) {
                case 'success':
                    icon = '<i class="fas fa-check-circle"></i>';
                    break;
                case 'error':
                    icon = '<i class="fas fa-exclamation-circle"></i>';
                    break;
                case 'warning':
                    icon = '<i class="fas fa-exclamation-triangle"></i>';
                    break;
                case 'info':
                    icon = '<i class="fas fa-info-circle"></i>';
                    break;
            }
            
            alertElement.innerHTML = `${icon}${message}`;
            container.appendChild(alertElement);

            // Forcer le reflow pour l'animation CSS
            void alertElement.offsetWidth;

            alertElement.classList.add('show');

            // Masquer l'alerte après la durée spécifiée
            setTimeout(() => {
                alertElement.classList.remove('show');
                // Retirer l'élément du DOM après la fin de la transition
                alertElement.addEventListener('transitionend', () => alertElement.remove());
            }, duration);
        }

        // Fonction pour soumettre la note
        async function submitNote() {
            const note = document.getElementById('noteInput').value;
            const scale = document.getElementById('noteScale').value;
            const maxNote = parseInt(scale);
            
            if (note && note >= 0 && note <= maxNote) {
                try {
                    // Créer un ID unique
                    const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    
                    const data = {
                        id: uniqueId,
                        chapitre_id: currentQuizInfo.chapterId, // Utiliser l'ID correct du chapitre
                        matiere: currentQuizInfo.subject,
                        note: parseFloat(note),
                        bareme: parseInt(scale),
                        date: new Date().toISOString(),
                        quiz_url: currentQuizInfo.url || null
                    };

                    console.log('Envoi des données:', data); // Pour debug

                    const response = await fetch(`${SUPABASE_URL}/rest/v1/quiz_resultats`, {
                        method: 'POST',
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify(data)
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Erreur lors de l\'enregistrement');
                    }

                    closeNotePopup();
                    showCustomAlert('Note enregistrée avec succès !', 'success');
                } catch (error) {
                    console.error('Erreur détaillée:', error);
                    showCustomAlert('Erreur lors de l\'enregistrement de la note: ' + error.message, 'error');
                }
            } else {
                showCustomAlert(`Veuillez entrer une note valide entre 0 et ${maxNote}`, 'warning');
            }
        }

        // Fermer le popup si on clique en dehors
        document.getElementById('notePopup').addEventListener('click', function(e) {
            if (e.target === this) {
                closeNotePopup();
            }
        });

        // Gérer la touche Entrée
        document.getElementById('noteInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitNote();
            }
        });

        // Modifier les fonctions de gestion du popup
        function showAddChapterPopup(isEditing = false) {
            const popup = document.getElementById('addChapterPopup');
            const deleteBtn = document.getElementById('deleteChapterBtn');
            popup.style.display = 'flex';
            popup.classList.add('active');
            
            // Afficher/masquer le bouton supprimer selon le mode
            deleteBtn.style.display = isEditing ? 'block' : 'none';
            
            if (!isEditing) {
                resetAddChapterForm();
            }
        }

         function resetAddChapterForm() {
            const chapterIdInput = document.getElementById('chapterId');
            chapterIdInput.readOnly = false;
            chapterIdInput.value = '';
            document.getElementById('subjectSelect').value = '';
            document.getElementById('chapterName').value = '';
            document.getElementById('quizLink1').value = '';
            document.getElementById('quizLink2').value = '';
            document.getElementById('quizLink3').value = '';
            document.getElementById('videoLink1').value = '';
            document.getElementById('videoLink2').value = '';
            document.getElementById('videoLink3').value = '';
         }

        function closeAddChapterPopup() {
            const popup = document.getElementById('addChapterPopup');
            popup.style.display = 'none';
            popup.classList.remove('active');
            resetAddChapterForm();
        }

        // Ajouter l'écouteur d'événement pour le bouton d'ajout
        document.addEventListener('DOMContentLoaded', function() {
            const addChapterBtn = document.getElementById('add-chapter-btn');
            if (addChapterBtn) {
                addChapterBtn.addEventListener('click', () => showAddChapterPopup());
            }

            // Fermer le popup si on clique en dehors
            const addChapterPopup = document.getElementById('addChapterPopup');
            if (addChapterPopup) {
                addChapterPopup.addEventListener('click', function(e) {
                    if (e.target === this) {
                        closeAddChapterPopup();
                    }
                });
            }
        });

        async function submitNewChapter(event) {
            if (event) event.preventDefault();
            
            const selectedSubject = document.getElementById('subjectSelect').value;
            const config = SUBJECTS_CONFIG[selectedSubject];
            const chapterId = document.getElementById('chapterId').value;
            const chapterName = document.getElementById('chapterName').value;
            const isEditing = document.getElementById('chapterId').readOnly;

            if (!config || !chapterId || !chapterName) {
                showCustomAlert('Veuillez remplir tous les champs obligatoires', 'warning');
                return;
            }

            try {
                const data = {
                    id: chapterId,
                    chapitre: chapterName,
                    matiere: config.type,
                    termine: false, // Changé de 'completed' à 'termine'
                    lien_quiz_1: document.getElementById('quizLink1').value || null,
                    lien_quiz_2: document.getElementById('quizLink2').value || null,
                    lien_quiz_3: document.getElementById('quizLink3').value || null,
                    lien_video_1: document.getElementById('videoLink1').value || null,
                    lien_video_2: document.getElementById('videoLink2').value || null,
                    lien_video_3: document.getElementById('videoLink3').value || null
                };

                const response = await fetch(`${SUPABASE_URL}/rest/v1/revisions${isEditing ? `?id=eq.${chapterId}` : ''}`, {
                    method: isEditing ? 'PATCH' : 'POST',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error(isEditing ? 'Erreur lors de la modification du chapitre' : 'Erreur lors de la création du chapitre');
                }

                showCustomAlert(isEditing ? 'Chapitre modifié avec succès!' : 'Chapitre ajouté avec succès!', 'success');
                closeAddChapterPopup();
                await loadChapters();
            } catch (error) {
                console.error('Erreur:', error);
                showCustomAlert(error.message, 'error');
            }
        }

        // Modifier la fonction editChapter
        async function editChapter(chapterId) {
            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/revisions?id=eq.${chapterId}`, {
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur lors du chargement du chapitre');
                }

                const chapters = await response.json();
                if (chapters.length > 0) {
                    const chapter = chapters[0];
                    // Rechercher la matière correspondante
                    const subjectEntry = Object.entries(SUBJECTS_CONFIG).find(
                        ([_, config]) => config.type.toLowerCase() === chapter.matiere.toLowerCase()
                    );
                    
                    if (subjectEntry) {
                        const [subjectKey] = subjectEntry;
                        document.getElementById('subjectSelect').value = subjectKey;
                        const chapterIdInput = document.getElementById('chapterId');
                        chapterIdInput.value = chapter.id;
                        chapterIdInput.readOnly = true;
                        document.getElementById('chapterName').value = chapter.chapitre;
                        document.getElementById('quizLink1').value = chapter.lien_quiz_1 || '';
                        document.getElementById('quizLink2').value = chapter.lien_quiz_2 || '';
                        document.getElementById('quizLink3').value = chapter.lien_quiz_3 || '';
                        document.getElementById('videoLink1').value = chapter.lien_video_1 || '';
                        document.getElementById('videoLink2').value = chapter.lien_video_2 || '';
                        document.getElementById('videoLink3').value = chapter.lien_video_3 || '';
                        showAddChapterPopup(true);
                    } else {
                        console.error('Matière non trouvée:', chapter.matiere);
                        showCustomAlert('Erreur: Matière non trouvée', 'error');
                    }
                }
            } catch (error) {
                console.error('Erreur:', error);
                showCustomAlert(error.message, 'error');
            }
        }

        // Fonction pour supprimer un chapitre
        async function deleteChapter(chapterId) {
            showConfirmPopup('Êtes-vous sûr de vouloir supprimer ce chapitre ?', async () => {
                try {
                    const response = await fetch(`${SUPABASE_URL}/rest/v1/revisions?id=eq.${chapterId}`, {
                        method: 'DELETE',
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Erreur lors de la suppression du chapitre');
                    }

                    showCustomAlert('Chapitre supprimé avec succès!', 'success');
                    closeAddChapterPopup();
                    await loadChapters();
                } catch (error) {
                    console.error('Erreur:', error);
                    showCustomAlert(error.message, 'error');
                }
            });
        }

        // Fonction pour afficher la notification temporaire
        function showNotification(message) {
            const notificationPopup = document.getElementById('notification-popup');
            notificationPopup.textContent = message;
            notificationPopup.classList.add('show');

            setTimeout(() => {
                notificationPopup.classList.remove('show');
            }, 2000); // 2000 millisecondes = 2 secondes
        }

        // Ajouter ces nouvelles fonctions
        function showConfirmPopup(message, callback) {
            const popup = document.getElementById('confirmPopup');
            const messageEl = document.getElementById('confirmMessage');
            const confirmBtn = document.getElementById('confirmYesBtn');
            
            messageEl.textContent = message;
            popup.style.display = 'flex';
            
            // Animation d'entrée
            setTimeout(() => popup.classList.add('active'), 10);
            
            // Configurer le bouton de confirmation
            confirmBtn.onclick = () => {
                closeConfirmPopup();
                callback();
            };
        }

        function closeConfirmPopup() {
            const popup = document.getElementById('confirmPopup');
            popup.classList.remove('active');
            setTimeout(() => popup.style.display = 'none', 300);
        }
