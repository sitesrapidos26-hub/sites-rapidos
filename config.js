const SITE_CONFIG = {
    // WhatsApp centralizado para orçamentos e contato principal
    whatsappUrl: "https://wa.me/5541996092712?text=Olá! Gostaria de solicitar um orçamento baseado em um dos modelos premium.",
    
    // URL real dos projetos publicados de cada nicho
    // Se o valor for null ou vazio, o botão "Acessar site real" será ocultado automaticamente na demonstração.
    realSites: {
        academia: null,         // Insira a URL real aqui quando houver (ex: "https://minhaacademia.com")
        advocacia: null,
        barbearia: null,
        imobiliaria: null,
        odontologia: null,
        restaurante: null
    }
};

// Torna o config disponível globalmente
window.SITE_CONFIG = SITE_CONFIG;
