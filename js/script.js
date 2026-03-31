/*
 * ============================================================
 *  PORTFÓLIO — Gabriel Mendonça
 *  js/script.js — Interatividade principal
 *
 *  Índice:
 *   1. Efeito de digitação (Typing Effect)
 *   2. Menu mobile (hamburguer)
 *   3. Link ativo na navegação conforme o scroll
 *   4. Reveal on Scroll (Intersection Observer)
 *   5. Animação das skill bars
 *   6. Contadores de estatísticas
 *   7. Filtro de projetos por categoria
 *   8. Filtro de vídeos por categoria
 *   9. Barra de progresso de scroll
 *  10. Sombra no header ao rolar
 *  11. Formulário de contato
 *  12. Ano atual no rodapé
 * ============================================================
 */


/* ============================================================
   1. EFEITO DE DIGITAÇÃO
   ============================================================ */

// Frases que serão digitadas no hero
const phrases = [
    "Desenvolvedor Front-end",
    "Estudante de Eng. de Software",
    "Criador de Interfaces",
    "Explorador de APIs",
    "Game Developer",
];

const typedEl    = document.getElementById("typedText");
let phraseIndex  = 0;  // qual frase está sendo exibida
let charIndex    = 0;  // posição do cursor dentro da frase
let isDeleting   = false;

function typeEffect() {
    if (!typedEl) return;

    const currentPhrase = phrases[phraseIndex];

    // Avança ou recua um caractere
    if (!isDeleting) {
        typedEl.textContent = currentPhrase.slice(0, charIndex + 1);
        charIndex++;
    } else {
        typedEl.textContent = currentPhrase.slice(0, charIndex - 1);
        charIndex--;
    }

    // Chegou ao fim da frase: pausa e começa a apagar
    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1600);
        return;
    }

    // Apagou tudo: avança para a próxima frase
    if (isDeleting && charIndex === 0) {
        isDeleting   = false;
        phraseIndex  = (phraseIndex + 1) % phrases.length;
    }

    // Velocidade: apagar é mais rápido que digitar
    const speed = isDeleting ? 40 : 85;
    setTimeout(typeEffect, speed);
}

// Inicia o efeito de digitação
typeEffect();


/* ============================================================
   2. MENU MOBILE (HAMBURGUER)
   ============================================================ */

const navToggle = document.getElementById("navToggle");
const navList   = document.getElementById("navList");

if (navToggle && navList) {

    navToggle.addEventListener("click", () => {
        const isOpen = navList.classList.toggle("open");
        navToggle.classList.toggle("open", isOpen);
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Fecha o menu quando qualquer link é clicado (em mobile)
    navList.querySelectorAll(".nav__link").forEach((link) => {
        link.addEventListener("click", () => {
            navList.classList.remove("open");
            navToggle.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener("click", (e) => {
        if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
            navList.classList.remove("open");
            navToggle.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
        }
    });
}


/* ============================================================
   3. LINK ATIVO NA NAVEGAÇÃO CONFORME O SCROLL
   ============================================================ */

const allNavLinks = document.querySelectorAll(".nav__link");
const allSections = document.querySelectorAll("main section[id]");

function updateActiveLink() {
    // Adiciona deslocamento para detectar a seção ligeiramente antes
    const scrollY = window.scrollY + 100;

    allSections.forEach((section) => {
        const top    = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id     = section.getAttribute("id");
        const link   = document.querySelector(`.nav__link[href="#${id}"]`);

        if (link) {
            if (scrollY >= top && scrollY < bottom) {
                // Remove ativo de todos e aplica apenas ao atual
                allNavLinks.forEach((l) => l.classList.remove("active"));
                link.classList.add("active");
            }
        }
    });
}

window.addEventListener("scroll", updateActiveLink, { passive: true });


/* ============================================================
   4. REVEAL ON SCROLL (INTERSECTION OBSERVER)
   ============================================================ */

const revealEls = document.querySelectorAll(".reveal");

// Cria o observer: dispara quando o elemento chega a 12% na viewport
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");

                // Aciona as skill bars de elementos dentro do revelado
                animateSkillBarsIn(entry.target);

                // Para de observar após revelar (executa apenas uma vez)
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

revealEls.forEach((el) => revealObserver.observe(el));


/* ============================================================
   5. ANIMAÇÃO DAS SKILL BARS
   ============================================================ */

/**
 * Encontra todas as .skill-bar__fill dentro de um elemento pai
 * e aplica a largura definida pela propriedade CSS --level.
 * Chamada quando o elemento pai entra na viewport.
 */
function animateSkillBarsIn(parent) {
    parent.querySelectorAll(".skill-bar__fill").forEach((fill) => {
        const level = fill.style.getPropertyValue("--level");
        if (level) {
            fill.style.width = level;
        }
    });
}


/* ============================================================
   6. CONTADORES DE ESTATÍSTICAS (HERO)
   ============================================================ */

const counterEls    = document.querySelectorAll("[data-target]");
let countersStarted = false;

/**
 * Anima os contadores de 0 até o valor alvo.
 * Só dispara quando o usuário rolar abaixo da seção hero.
 */
function animateCounters() {
    if (countersStarted) return;

    const heroSection = document.getElementById("home");
    if (!heroSection) return;

    // Verifica se o fundo do hero já saiu da viewport
    if (heroSection.getBoundingClientRect().bottom > window.innerHeight * 0.7) return;

    countersStarted = true;

    counterEls.forEach((counter) => {
        const target    = Number(counter.getAttribute("data-target")) || 0;
        const increment = Math.ceil(target / 30);
        let current     = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = current;
        }, 40);
    });
}

window.addEventListener("scroll", animateCounters, { passive: true });
animateCounters(); // Roda na carga, caso a página já esteja rolada


/* ============================================================
   7. FILTRO DE PROJETOS POR CATEGORIA
   ============================================================ */

const projectFilterBtns = document.querySelectorAll(".filter-btn[data-filter]");
const projectCards      = document.querySelectorAll(".project-card[data-category]");

projectFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");

        // Atualiza botão ativo
        projectFilterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Exibe ou oculta cada card conforme a categoria (suporta múltiplas categorias por card)
        projectCards.forEach((card) => {
            const categoryAttr = card.getAttribute("data-category") || "";
            // Divide em palavras (categorias)
            const categories = categoryAttr.split(/\s+/);
            const isVisible = filter === "all" || categories.includes(filter);

            if (isVisible) {
                card.classList.remove("hidden");
                card.classList.remove("visible");
                void card.offsetWidth;
                card.classList.add("visible");
            } else {
                card.classList.add("hidden");
            }
        });
    });
});


/* ============================================================
   8. FILTRO DE VÍDEOS POR CATEGORIA
   ============================================================ */

const videoFilterBtns = document.querySelectorAll(".filter-btn[data-video-filter]");
const videoCards      = document.querySelectorAll(".video-card[data-video-category]");

videoFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-video-filter");

        // Atualiza botão ativo
        videoFilterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        videoCards.forEach((card) => {
            const category  = card.getAttribute("data-video-category");
            const isVisible = filter === "all" || category === filter;

            if (isVisible) {
                card.classList.remove("hidden");
                card.classList.remove("visible");
                void card.offsetWidth;
                card.classList.add("visible");
            } else {
                card.classList.add("hidden");
            }
        });
    });
});


/* ============================================================
   9. BARRA DE PROGRESSO DE SCROLL
   ============================================================ */

const scrollProgressBar = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {
    if (!scrollProgressBar) return;

    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    scrollProgressBar.style.width = `${percentage}%`;
}, { passive: true });


/* ============================================================
   10. SOMBRA NO HEADER AO ROLAR
   ============================================================ */

const header = document.getElementById("header");

window.addEventListener("scroll", () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });


/* ============================================================
   11. FORMULÁRIO DE CONTATO
   ============================================================ */

const contactForm = document.getElementById("contactForm");
// Nota: se a seção de contato não tiver <form id="contactForm"> no HTML,
// este bloco permanece inativo sem gerar erro.

/**
 * Exibe uma mensagem toast na parte inferior da tela.
 * @param {string} message - Texto a exibir
 * @param {"default"|"success"} type - Estilo do toast
 */
function showToast(message, type = "default") {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.className   = `toast show${type === "success" ? " toast--success" : ""}`;

    // Remove o toast após 3 segundos
    setTimeout(() => {
        toast.className = "toast";
    }, 3000);
}

if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Valida os campos obrigatórios antes de "enviar"
        const name    = contactForm.querySelector("#name");
        const email   = contactForm.querySelector("#email");
        const message = contactForm.querySelector("#message");

        if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
            showToast("⚠️ Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        // Simulação de envio bem-sucedido
        // Em produção: substitua por uma chamada fetch() para um back-end ou serviço como EmailJS
        showToast("✅ Mensagem enviada! Retorno em breve.", "success");
        contactForm.reset();
    });
}


/* ============================================================
   12. ANO ATUAL NO RODAPÉ
   ============================================================ */

const yearEl = document.getElementById("year");
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}
