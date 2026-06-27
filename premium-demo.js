(function () {
    'use strict';

    // ─── 1. Signal JS ready for CSS ────────
    document.documentElement.classList.add('js-ready');

    // ─── 2. prefers‑reduced‑motion check ───────
    const prefersReducedMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ─── 3. Detect niche ───────
    const urlPath = window.location.pathname;
    const niches = ['academia', 'advocacia', 'barbearia', 'imobiliaria', 'odontologia', 'restaurante'];
    let currentNiche = 'default';
    for (const niche of niches) {
        if (urlPath.includes('/' + niche + '/')) {
            currentNiche = niche;
            break;
        }
    }

    // ─── 4. Safe config load ───────
    let config;
    try {
        config = window.SITE_CONFIG || null;
        if (!config || typeof config !== 'object') throw new Error('SITE_CONFIG inválido');
    } catch (_) {
        config = {
            whatsappUrl: 'https://wa.me/5541996092712',
            realSites: {}
        };
    }

    const whatsappUrl = (config.whatsappUrl && config.whatsappUrl !== '#')
        ? config.whatsappUrl
        : 'https://wa.me/5541996092712';

    const realSiteUrl = (config.realSites && config.realSites[currentNiche])
        ? config.realSites[currentNiche].trim()
        : '';

    // ─── 5. Guard against double injection ───────
    if (document.querySelector('.premium-conversion-block')) {
        return; // already injected
    }

    // ─── 6. Real‑site button (conditional) ───────
    const realSiteButtonHtml = realSiteUrl
        ? `<a href="${realSiteUrl}" target="_blank" rel="noopener noreferrer" class="premium-btn premium-btn-secondary">
               Acessar site real
               <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9"/><path d="M11 1h2m0 0v2m0-2L7 7"/></svg>
           </a>`
        : '';

    // ─── 7. Build conversion block ───────
    const block = document.createElement('section');
    block.className = 'premium-conversion-block premium-reveal';
    block.setAttribute('aria-label', 'Solicitar orçamento');
    block.innerHTML = `
        <button class="premium-close" aria-label="Fechar">×</button>
        <div class="premium-conversion-content">
            <h2 class="premium-conversion-title">Gostou deste modelo?</h2>
            <p class="premium-conversion-subtitle">
                Este layout pode ser adaptado para sua marca e publicado rapidamente com identidade própria.
            </p>
            <ul class="premium-benefits-list" aria-label="Diferenciais inclusos">
                <li><span aria-hidden="true">✓</span> Design premium</li>
                <li><span aria-hidden="true">✓</span> Performance otimizada</li>
                <li><span aria-hidden="true">✓</span> Responsivo</li>
                <li><span aria-hidden="true">✓</span> SEO preparado</li>
                <li><span aria-hidden="true">✓</span> Personalização completa</li>
            </ul>
            <div class="premium-actions">
                <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="premium-btn premium-btn-primary">Solicitar orçamento</a>
                <a href="../" class="premium-btn premium-btn-secondary">Ver outros modelos</a>
                ${realSiteButtonHtml}
            </div>
        </div>
    `;

    // ─── 8. Insert block before footer or at end of body ───────
    const footer = document.querySelector('footer');
    if (footer) {
        footer.parentNode.insertBefore(block, footer);
    } else {
        document.body.appendChild(block);
    }

    // ─── 9. Close‑button behavior ───────
    const closeBtn = block.querySelector('.premium-close');
    closeBtn.addEventListener('click', () => {
        closeBtn.classList.add('closing');
        block.classList.add('closing');
        setTimeout(() => {
            block.remove();
        }, 180);
    });

    // ─── 10. Entrance animations via IntersectionObserver ───────
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const sections = document.querySelectorAll('section');
        sections.forEach(sec => sec.classList.add('premium-reveal'));

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.add('visible');
                    // make content visible
                    const content = el.querySelector('.premium-conversion-content');
                    if (content) content.classList.add('visible');
                    // staggered benefits (max 20 ms)
                    const items = el.querySelectorAll('.premium-benefits-list li');
                    items.forEach((li, i) => {
                        setTimeout(() => li.classList.add('visible'), i * 20);
                    });
                    observer.unobserve(el);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -10%'
        });

        document.querySelectorAll('.premium-reveal').forEach(el => observer.observe(el));
    } else {
        // No animation – show everything instantly
        document.querySelectorAll('.premium-reveal').forEach(el => {
            el.classList.add('visible');
            const content = el.querySelector('.premium-conversion-content');
            if (content) content.classList.add('visible');
            el.querySelectorAll('.premium-benefits-list li').forEach(li => li.classList.add('visible'));
        });
    }
})();
