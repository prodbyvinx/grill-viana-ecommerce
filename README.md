# Grill Viana E-commerce

Repositório oficial do site de e-commerce **Grill Viana**, uma loja especializada em churrasqueiras de baixo e médio custo. Este projeto foi construído com Next.js (App Router), Tailwind CSS, Shadcn UI, TypeScript e integrações com Prisma ORM, MercadoPago e Bling ERP.

---

## 🔧 Tecnologias Utilizadas

* **Framework:** Next.js 13 (App Router)
* **Estilização:** Tailwind CSS + Shadcn UI
* **Linguagem:** TypeScript
* **ORM:** Prisma
* **Pagamentos:** API MercadoPago
* **ERP / Faturamento:** Bling ERP
* **Hospedagem:** Vercel

---

## 📋 Descrição dos Componentes

* **`CatalogFilters`**: Dropdowns e inputs para filtrar por material (`type`), finalidade, quantidade de grelhas, preço mínimo e máximo. Os filtros sincronizam com a URL (query string) usando `useSearchParams` e `useRouter` do Next.js.

* **`CatalogContent`**: Exibe o grid de produtos filtrados ou mensagem de "Nenhum produto encontrado".

* **`ProductCard`**: Componente de apresentação de cada produto (nome, descrição, preço, imagem, atributos como `type`, `finalidade`, `grelhas`).

* **`Header`** e **`BackButton`**: Layout padrão do site.

---

## 🔎 Filtros de Catálogo e Sincronização de URL

* Ao selecionar opções nos filtros, a query string da URL é atualizada (ex.: `/catalogo?type=inox&grelhas=2`).
* No carregamento da página, o estado inicial dos filtros é derivado de `useSearchParams()`, permitindo compartilhar links com filtros pré-aplicados.
* A filtragem é feita no cliente com `Array.filter`, comparando cada campo de `filters` com os atributos do produto.

---

## 💳 Integração de Pagamentos e ERP

* **MercadoPago**: Configurar chave pública/sdk no frontend e access token no backend para criar preferências de pagamento.
* **Bling ERP**: Webhooks ou chamada direta à API para emissão de notas fiscais e gestão de estoque.

Detalhes na documentação interna de cada integração.

---

**Grill Viana** © 2025 | Desenvolvido por Vinícius Henrique Beira
