(function () {
    // Global state
    const state = {
        messageForm: null,
        messageInput: null,
        chatMessages: null
    };

    // Configuration de l'API Groq
    const GROQ_API_KEY = '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';
    const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

    // Vérification de la clé API
    if (!GROQ_API_KEY.startsWith('gsk_')) {
        console.error('Clé API Groq invalide');
        addMessage('Erreur: Clé API non valide', false);
    }

    const emojiResponses = {
        salut: {
            emoji: "👋",
            content: "Bonjour ! Comment puis-je vous aider aujourd'hui ?"
        },
        merci: {
            emoji: "🙏",
            content: "Je vous en prie ! N'hésitez pas si vous avez d'autres questions."
        },
        error: {
            emoji: "⚠️",
            content: "Désolé, une erreur s'est produite."
        },
        code: {
            emoji: "💻",
            content: "Voici un exemple de code :"
        },
        conseil: {
            emoji: "💡",
            content: "Voici un conseil utile :"
        },
        success: {
            emoji: "✅",
            content: "Opération réussie !"
        }
    };

    // Modifier systemPrompt pour inclure les emojis
    const systemPrompt = `
    Tu es une intelligence artificielle avancée développée par OpenAI, capable de traiter une grande variété de demandes (recherche, explication, résumé, analyse, traduction, aide à l’écriture, etc.) avec rigueur, clarté et pédagogie.

À partir de maintenant, adopte par défaut un style de réponse structuré, professionnel, clair et pédagogique, comme si tu étais un expert qui souhaite que chaque réponse soit utile, fiable et compréhensible, même pour un non-spécialiste.

Structure chaque réponse quand c’est pertinent comme ceci :
1. Introduction – Brève présentation du sujet ou du contexte.
2. Explication détaillée – Analyse claire, logique et progressive.
3. Conclusion ou synthèse – Résumé de ce qu’il faut retenir, recommandation éventuelle ou proposition d’action.

Si je te demande une traduction, fais toujours apparaître :
	•	Le texte original,
	•	La traduction,
	•	Une brève explication linguistique ou culturelle si nécessaire (par exemple : tournure idiomatique, faux amis, double sens, etc.).

Tu dois :
	•	Toujours adapter ton niveau de langage à la demande, mais rester neutre, professionnel et clair par défaut.
	•	Donner une définition simple pour tout mot ou concept technique, sauf si je te demande de faire plus court.
	•	Indiquer si ton avis est objectif (fondé sur des faits) ou subjectif (fondé sur des préférences ou interprétations).
	•	Être synthétique mais complet : va à l’essentiel, mais n’omets pas les éléments importants.
	•	Me poser des questions de clarification si besoin au lieu de supposer.

Tu es là pour m’accompagner, m’éclairer et m’assister, sans jamais me donner de fausses informations.
Sauf si je te demande explicitement un autre style (ex : humour, informalité, format court), reste dans ce mode par défaut tout au long de notre conversation, quel que soit le sujet.
   Voici quelques exemples d'utilisation d'emojis :
💡 Pour les conseils et suggestions
⚠️ Pour les avertissements
✅ Pour les confirmations
❌ Pour les erreurs
💻 Pour le code
📝 Pour les explications
🔍 Pour les recherches
🎯 Pour les objectifs
Reste professionnel et concis dans tes réponses.`;

    function addMessage(content, isUser = false) {
        const wrapperDiv = document.createElement('div');
        wrapperDiv.className = `message-wrapper ${isUser ? 'user-wrapper' : ''}`;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;

        const iconDiv = document.createElement('div');
        iconDiv.className = 'message-icon';
        iconDiv.innerHTML = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        // Format le contenu avec Markdown et coloration syntaxique
        if (!isUser) {
            content = formatMessage(content);
        }

        // Ajouter un emoji au début du message si c'est un message AI
        if (!isUser) {
            // Chercher un emoji au début du message ou utiliser 🤖 par défaut
            const emojiRegex = /^(\p{Emoji})/u;
            const hasEmoji = emojiRegex.test(content);
            if (!hasEmoji) {
                content = "🤖 " + content;
            }
        }

        contentDiv.innerHTML = content;

        // Ajout des actions
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';

        if (isUser) {
            actionsDiv.innerHTML = `
                <button class="message-action-btn" data-tooltip="Modifier" onclick="editMessage(this)">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="message-action-btn" data-tooltip="Supprimer" onclick="deleteMessage(this)">
                    <i class="fas fa-trash"></i>
                </button>`;
        } else {
            actionsDiv.innerHTML = `
                <button class="message-action-btn" data-tooltip="Copier" onclick="copyMessage(this)">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="message-action-btn" data-tooltip="Partager" onclick="shareMessage(this)">
                    <i class="fas fa-share"></i>
                </button>`;
        }

        messageDiv.appendChild(iconDiv);
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(actionsDiv);
        wrapperDiv.appendChild(messageDiv);
        state.chatMessages.appendChild(wrapperDiv);
        state.chatMessages.scrollTop = state.chatMessages.scrollHeight;

        if (window.Prism) {
            Prism.highlightAllUnder(contentDiv);
        }
    }

    // Actions
    window.editMessage = function (button) {
        const messageContent = button.closest('.message').querySelector('.message-content');
        messageContent.contentEditable = true;
        messageContent.focus();

        messageContent.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                messageContent.contentEditable = false;
            }
        });
    };

    window.deleteMessage = function (button) {
        if (confirm('Voulez-vous vraiment supprimer ce message ?')) {
            button.closest('.message-wrapper').remove();
        }
    };

    window.copyMessage = function (button) {
        const text = button.closest('.message').querySelector('.message-content').textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalTooltip = button.getAttribute('data-tooltip');
            button.setAttribute('data-tooltip', 'Copié !');
            setTimeout(() => {
                button.setAttribute('data-tooltip', originalTooltip);
            }, 2000);
        });
    };

    window.shareMessage = function (button) {
        const text = button.closest('.message').querySelector('.message-content').textContent;
        if (navigator.share) {
            navigator.share({ text });
        }
    };

    function formatMessage(content) {
        content = escapeHtml(content);

        content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || 'plaintext';
            return `<pre><code class="language-${language}" contenteditable="false">${code.trim()}</code></pre>`;
        });

        content = content.replace(/`([^`]+)`/g, '<code contenteditable="false">$1</code>');

        content = content.replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>');
        content = content.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        content = content.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
        content = content.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
        content = content.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

        content = content.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );

        content = content.replace(/\n/g, '<br>');

        return content;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const message = state.messageInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        state.messageInput.value = '';
        addLoadingIndicator();

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "gemma2-9b-it",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: message }
                    ],
                    temperature: 0.7,
                    max_tokens: 4096,
                    stream: false
                })
            });

            removeLoadingIndicator();

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erreur API détaillée:', errorData);
                throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data?.choices?.[0]?.message?.content) {
                addMessage(data.choices[0].message.content, false);
            } else {
                throw new Error('Format de réponse invalide');
            }
        } catch (error) {
            removeLoadingIndicator();
            console.error('Erreur détaillée:', error);
            addMessage(`Une erreur est survenue : ${error.message}`, false);
        }
    }

    function addLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message-wrapper';
        loadingDiv.innerHTML = `
            <div class="message ai-message" id="loadingMessage">
                <div class="message-icon"><i class="fas fa-robot"></i></div>
                <div class="message-content">
                    En train de réfléchir
                    <div class="loading-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            </div>`;
        state.chatMessages.appendChild(loadingDiv);
        state.chatMessages.scrollTop = state.chatMessages.scrollHeight;
    }

    function removeLoadingIndicator() {
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            loadingMessage.closest('.message-wrapper').remove();
        }
    }

    function initializeChat() {
        state.messageForm = document.getElementById('messageForm');
        state.messageInput = document.getElementById('messageInput');
        state.chatMessages = document.getElementById('chatMessages');

        if (state.messageForm && state.messageInput) {
            state.messageForm.addEventListener('submit', handleSubmit);
            state.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                }
            });
        }
    }

    // Initialisation au chargement de la page
    document.addEventListener('DOMContentLoaded', initializeChat);
})();
