# 🚀 Sites Rápidos

Projeto de vitrine de **templates de sites profissionais para pequenos negócios**.

A ideia é simples: apresentar modelos prontos de sites que podem ser rapidamente personalizados para clientes reais. O visitante pode visualizar os templates disponíveis e acessar uma prévia funcional de cada um.

Este projeto funciona como o **hub principal** dos templates.

---

# 🌐 Objetivo do projeto

Criar uma plataforma simples e visual para:

- Apresentar templates de sites
- Permitir que visitantes visualizem os modelos
- Demonstrar a qualidade dos layouts
- Facilitar a venda de sites personalizados baseados nesses templates

Cada template possui sua própria rota dentro do projeto.

Exemplo:

```
/barbearia
/restaurante
/clinica
/imobiliaria
```

---

# 🎨 Características do site

- Design **moderno e minimalista**
- Paleta **azul + preto (estilo tech / startup)**
- Layout **responsivo**
- Estrutura **escalável**
- Fácil manutenção
- Código simples e organizado

---

# 🧱 Estrutura do projeto

```
/public

index.html
style.css
script.js
```

**index.html**  
Página principal que apresenta os templates disponíveis.

**style.css**  
Responsável pelo design e layout do site.

**script.js**  
Pequenas animações e efeitos de entrada das seções.

---

# 📦 Templates disponíveis

Atualmente o projeto possui:

- 💈 Barbearia

Cada template possui sua própria página ou rota.

Exemplo:

```
/barbearia
```

---

# ➕ Adicionando novos templates

Para adicionar um novo template basta duplicar um card na seção de templates.

Exemplo:

```html
<div class="card">

<div class="preview"></div>

<h3>Restaurante</h3>

<p>Template ideal para restaurantes e hamburguerias.</p>

<a href="/restaurante" class="card-btn">
Visualizar
</a>

</div>
```

Depois basta criar a página correspondente:

```
/restaurante
```

Nenhuma alteração no CSS será necessária.

---

# 🧑‍💻 Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Google Fonts (Inter)

---

# 📈 Expansão futura

O projeto foi pensado para crescer com o tempo.  
Novos templates planejados incluem:

- Restaurante
- Clínica / Odontologia
- Imobiliária
- Academia
- Salão de beleza
- Portfólio profissional

---

# 💡 Ideia do projeto

Muitos pequenos negócios precisam de um site simples, moderno e rápido de implementar.

Com esse sistema de templates é possível:

- reduzir tempo de desenvolvimento
- padronizar qualidade visual
- entregar sites profissionais rapidamente

---

⭐ Se você gostou do projeto, considere dar uma estrela no repositório!
