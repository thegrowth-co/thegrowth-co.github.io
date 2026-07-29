/* ============================================================
   TheGrowthCo. — blog listing
   Renders the blog index from data/blogs.json.

   To publish a new article:
     1. Add an entry to data/blogs.json (see "_example" in that file)
     2. Create the article page at blog/<slug>.html
   ============================================================ */
(function () {
  "use strict";

  var DATA_URL = "/data/blogs.json";
  var PAGE_SIZE = 6;

  var state = { posts: [], category: "All Posts", visible: PAGE_SIZE };

  var els = {};

  function formatDate(value) {
    var date = new Date(value);
    if (isNaN(date.getTime())) return value || "";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[ch];
    });
  }

  function imageMarkup(post, label) {
    if (post.image) {
      return (
        '<img src="' +
        escapeHtml(post.image) +
        '" alt="' +
        escapeHtml(post.title) +
        '" loading="lazy" />'
      );
    }
    return '<div class="img-placeholder">' + label + "</div>";
  }

  function postUrl(post) {
    return post.url || "/blog/" + escapeHtml(post.slug) + ".html";
  }

  function filtered() {
    if (state.category === "All Posts") return state.posts;
    return state.posts.filter(function (post) {
      return post.category === state.category;
    });
  }

  /* ---------- Renderers ---------- */

  function renderCategories() {
    var categories = ["All Posts"];
    state.posts.forEach(function (post) {
      if (post.category && categories.indexOf(post.category) === -1) {
        categories.push(post.category);
      }
    });

    els.categories.innerHTML = categories
      .map(function (name) {
        return (
          '<button type="button" class="' +
          (name === state.category ? "active" : "") +
          '" data-category="' +
          escapeHtml(name) +
          '">' +
          escapeHtml(name) +
          "</button>"
        );
      })
      .join("");

    els.categories.hidden = state.posts.length === 0;
  }

  function renderFeatured(posts) {
    var post = posts.filter(function (p) { return p.featured; })[0] || posts[0];

    if (!post) {
      els.featured.hidden = true;
      els.featured.innerHTML = "";
      return null;
    }

    els.featured.hidden = false;
    els.featured.innerHTML =
      '<div class="container">' +
      '<a href="' + postUrl(post) + '" class="card">' +
      imageMarkup(post, "Featured image · 800x600") +
      "<div>" +
      '<span class="tag">' + escapeHtml(post.category) + "</span>" +
      "<h2>" + escapeHtml(post.title) + "</h2>" +
      "<p>" + escapeHtml(post.excerpt) + "</p>" +
      '<div class="meta">' +
      (post.author ? "<span>" + escapeHtml(post.author) + '</span><span class="dot"></span>' : "") +
      "<span>" + formatDate(post.date) + "</span>" +
      (post.readTime ? '<span class="dot"></span><span>' + escapeHtml(post.readTime) + "</span>" : "") +
      "</div>" +
      '<span class="btn-read">Read article →</span>' +
      "</div></a></div>";

    return post;
  }

  function renderGrid(posts) {
    els.grid.innerHTML = posts
      .map(function (post) {
        return (
          '<a href="' + postUrl(post) + '" class="post-card">' +
          imageMarkup(post, "Post image · 600x412") +
          '<span class="tag">' + escapeHtml(post.category) + "</span>" +
          "<h4>" + escapeHtml(post.title) + "</h4>" +
          "<p>" + escapeHtml(post.excerpt) + "</p>" +
          '<div class="meta"><span>' + formatDate(post.date) + "</span>" +
          (post.readTime ? '<span class="dot"></span><span>' + escapeHtml(post.readTime) + "</span>" : "") +
          "</div></a>"
        );
      })
      .join("");
  }

  function render() {
    var posts = filtered();
    var featured = renderFeatured(posts);

    var rest = posts.filter(function (post) {
      return post !== featured;
    });
    var shown = rest.slice(0, state.visible);

    renderGrid(shown);

    els.empty.hidden = posts.length !== 0;
    els.gridHead.hidden = rest.length === 0;
    els.loadMore.hidden = rest.length <= shown.length;
  }

  /* ---------- Init ---------- */

  function init() {
    els.categories = document.getElementById("blog-categories");
    els.featured = document.getElementById("blog-featured");
    els.grid = document.getElementById("blog-grid");
    els.gridHead = document.getElementById("blog-grid-head");
    els.empty = document.getElementById("blog-empty");
    els.loadMore = document.getElementById("blog-load-more");
    if (!els.grid) return;

    els.categories.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-category]");
      if (!button) return;
      state.category = button.dataset.category;
      state.visible = PAGE_SIZE;
      renderCategories();
      render();
    });

    els.loadMore.addEventListener("click", function () {
      state.visible += PAGE_SIZE;
      render();
    });

    fetch(DATA_URL)
      .then(function (response) {
        if (!response.ok) throw new Error("Could not load " + DATA_URL);
        return response.json();
      })
      .then(function (data) {
        state.posts = Array.isArray(data.posts) ? data.posts : [];
        renderCategories();
        render();
      })
      .catch(function (err) {
        console.error("Blog load error:", err);
        renderCategories();
        render();
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
