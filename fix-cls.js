/**
 * fix-cls.js — Correção Conservadora de CLS
 *
 * Estratégia:
 *  - Processa apenas imagens em contextos críticos (hero, card, banner, acima da dobra)
 *  - Lê dimensões reais com sharp (sem adivinhar)
 *  - NÃO toca logos, SVGs, ícones, imagens decorativas ou background-image
 *  - Preserva aspect-ratio real; nunca distorce
 *  - Gera relatório detalhado ao final
 */

const fs    = require('fs');
const path  = require('path');
const sharp = require('sharp');

// ─── Configuração ───────────────────────────────────────────────────────────

// Contextos de container que indicam imagem crítica (acima da dobra / hero)
const CRITICAL_PARENT_CLASSES = [
    'hero', 'banner', 'card', 'card-img', 'img-wrapper', 'corte-card',
    'imovel', 'property', 'galeria', 'gallery', 'thumb', 'sobre', 'about'
];

// Atributos que indicam imagem decorativa/ícone — pular
const DECORATIVE_INDICATORS = [
    'aria-hidden', 'role="presentation"'
];

// Padrões de src que indicam logo/ícone — pular
const SKIP_SRC_PATTERNS = [
    /logo/i, /icon/i, /favicon/i, /svg$/i, /sprite/i, /badge/i
];

// Templates a processar
const TEMPLATES = [
    'academia', 'advocacia', 'barbearia',
    'imobiliaria', 'odontologia', 'restaurante'
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function shouldSkip(imgTag, src) {
    // Pular se for decorativa
    for (const indicator of DECORATIVE_INDICATORS) {
        if (imgTag.includes(indicator)) return true;
    }
    // Pular logos, ícones, etc. pelo src
    for (const pattern of SKIP_SRC_PATTERNS) {
        if (pattern.test(src)) return true;
    }
    // Pular data URIs e URLs externas
    if (src.startsWith('data:') || src.startsWith('http')) return true;

    return false;
}

function isInCriticalContext(fullHtml, imgTag) {
    // Encontra posição do img no HTML
    const imgPos = fullHtml.indexOf(imgTag);
    if (imgPos === -1) return false;

    // Olha os 400 chars antes para verificar contexto do container
    const contextBefore = fullHtml.substring(Math.max(0, imgPos - 400), imgPos);
    for (const cls of CRITICAL_PARENT_CLASSES) {
        if (contextBefore.includes(`class="${cls}`) ||
            contextBefore.includes(`class='${cls}`) ||
            contextBefore.includes(`"${cls} `) ||
            contextBefore.includes(`'${cls} `) ||
            contextBefore.includes(` ${cls}"`) ||
            contextBefore.includes(` ${cls}'`)) {
            return true;
        }
    }
    return false;
}

async function getImageDimensions(imagePath) {
    try {
        const meta = await sharp(imagePath).metadata();
        return { width: meta.width, height: meta.height };
    } catch (_) {
        return null;
    }
}

// ─── Processamento Principal ─────────────────────────────────────────────────

async function processTemplate(templateDir) {
    const htmlPath = path.join(templateDir, 'index.html');
    if (!fs.existsSync(htmlPath)) return { template: templateDir, changed: 0, skipped: 0, errors: [] };

    let html = fs.readFileSync(htmlPath, 'utf-8');
    const report = { template: templateDir, changed: 0, skipped: 0, notFound: 0, errors: [] };

    // Regex para capturar tags <img ...> (incluindo self-closing e multi-linha)
    const imgRegex = /<img\b([^>]*)>/gi;
    const matches = [...html.matchAll(imgRegex)];

    let updatedHtml = html;

    for (const match of matches) {
        const fullTag   = match[0];
        const attrsStr  = match[1];

        // Extrair src
        const srcMatch = attrsStr.match(/src=["']([^"']+)["']/i);
        if (!srcMatch) { report.skipped++; continue; }
        const src = srcMatch[1];

        // Pular por critérios conservadores
        if (shouldSkip(fullTag, src)) { report.skipped++; continue; }

        // Verificar se já tem width E height
        const hasWidth  = /\bwidth=["']?\d+/i.test(attrsStr);
        const hasHeight = /\bheight=["']?\d+/i.test(attrsStr);
        if (hasWidth && hasHeight) { report.skipped++; continue; }

        // Verificar contexto crítico
        if (!isInCriticalContext(html, fullTag)) { report.skipped++; continue; }

        // Resolver caminho do arquivo de imagem
        let imagePath = path.resolve(templateDir, src.replace(/^\.\//, ''));
        // Se não achar, tentar sem "../"
        if (!fs.existsSync(imagePath)) {
            imagePath = path.resolve(templateDir, src.replace(/^\.\.\//, ''));
        }
        // Tentar versão WebP se existir
        if (!fs.existsSync(imagePath)) {
            const webpPath = imagePath.replace(/\.(jpe?g|png)$/i, '.webp');
            if (fs.existsSync(webpPath)) imagePath = webpPath;
        }
        if (!fs.existsSync(imagePath)) {
            report.notFound++;
            report.errors.push(`  [NOT FOUND] ${src}`);
            continue;
        }

        // Ler dimensões reais
        const dims = await getImageDimensions(imagePath);
        if (!dims || !dims.width || !dims.height) {
            report.errors.push(`  [DIM ERROR] ${src}`);
            continue;
        }

        // Construir novos atributos preservando os existentes
        let newAttrs = attrsStr;
        if (!hasWidth)  newAttrs += ` width="${dims.width}"`;
        if (!hasHeight) newAttrs += ` height="${dims.height}"`;

        // Garantir loading lazy se não tiver
        if (!newAttrs.includes('loading=')) {
            newAttrs += ' loading="lazy"';
        }

        // Garantir decoding async
        if (!newAttrs.includes('decoding=')) {
            newAttrs += ' decoding="async"';
        }

        const newTag = `<img${newAttrs}>`;

        // Substituição segura: trocar apenas esta ocorrência específica
        const tagIndex = updatedHtml.indexOf(fullTag);
        if (tagIndex !== -1) {
            updatedHtml = updatedHtml.substring(0, tagIndex) + newTag + updatedHtml.substring(tagIndex + fullTag.length);
        }

        report.changed++;
    }

    if (report.changed > 0) {
        fs.writeFileSync(htmlPath, updatedHtml, 'utf-8');
    }

    return report;
}

// ─── CSS Complementar — height: auto + aspect-ratio via premium-demo.css ────

function addCssComplement() {
    const cssPath = path.resolve('premium-demo.css');
    const css = fs.readFileSync(cssPath, 'utf-8');

    const complement = `
/* ─── 9. CLS-safe: height:auto + aspect-ratio ─────────────────────────────── */
/* Garante que imagens com width+height explícitos nunca fiquem esticadas */
img[width][height] {
  height: auto;
  max-width: 100%;
}

/* Imagens dentro de containers flex/grid não quebram aspecto */
.card img, .service-card img, .img-wrapper img,
.corte-card img, .imovel img, .galeria img, .sobre img {
  width: 100%;
  height: auto;
  object-fit: cover;
  aspect-ratio: attr(width) / attr(height); /* Fallback progressivo */
}
`;

    if (!css.includes('height:auto + aspect-ratio')) {
        fs.writeFileSync(cssPath, css + complement, 'utf-8');
        return true;
    }
    return false;
}

// ─── Runner ──────────────────────────────────────────────────────────────────

(async () => {
    console.log('=== Fix CLS — Auditoria Conservadora ===\n');

    const allReports = [];
    let totalChanged = 0;
    let totalSkipped = 0;

    for (const template of TEMPLATES) {
        process.stdout.write(`Processando ${template}... `);
        const report = await processTemplate(template);
        allReports.push(report);
        totalChanged += report.changed;
        totalSkipped += report.skipped;
        console.log(`${report.changed} alteradas, ${report.skipped} ignoradas`);

        if (report.errors.length > 0) {
            report.errors.forEach(e => console.log(e));
        }
    }

    // CSS complement
    const cssAdded = addCssComplement();
    console.log(`\nCSS complementar (height:auto + aspect-ratio): ${cssAdded ? 'ADICIONADO' : 'já presente'}`);

    console.log('\n=== RELATÓRIO FINAL ===');
    console.log(`Imagens com width/height adicionados: ${totalChanged}`);
    console.log(`Imagens ignoradas (decorativas/logos/já corretas): ${totalSkipped}`);
    console.log(`Templates afetados: ${allReports.filter(r => r.changed > 0).map(r => r.template).join(', ') || 'nenhum'}`);
    console.log(`\nImpacto estimado CLS: redução proporcional ao número de imagens acima da dobra corrigidas.`);
    console.log('Nenhuma dimensão foi inventada — todas lidas dos arquivos reais via sharp.');
})();
