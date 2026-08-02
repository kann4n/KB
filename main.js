async function loadArticles() {
    const main = document.querySelector("main");
    if (!main) return;

    try {
        const res = await fetch("db.json");
        if (!res.ok) throw new Error("Failed to load db.json");

        const data = await res.json();
        const articles = data.articles || [];

        if (articles.length === 0) {
            main.innerHTML = "<p>No articles found.</p>";
            return;
        }

        // remove skeleton + replace with real posts
        main.innerHTML = "";

        articles.forEach((article) => {
            const el = document.createElement("article");
            el.className = "blog-post";

            el.innerHTML = `
          <div class="separator-tb">
            <div>
              <h2 class="article-title">
                <a href="${article.url}">${article.title}</a>
              </h2>
              <time datetime="${article.date}" class="article-date">
                ${new Date(article.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })}
              </time>
            </div>
            <p class="article-short-desc">${article.description}</p>
            <a href="${article.url}" class="read-more article-read-more-link">Read more →</a>
          </div>
        `;

            main.appendChild(el);
        });
    } catch (err) {
        console.error(err);
        main.innerHTML = "<p>Could not load articles right now.</p>";
    }
}

loadArticles();
