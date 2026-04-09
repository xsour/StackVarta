'use client';

import { useEffect, useState } from 'react';

import { siteConfig } from '../../lib/site-config';

const EMPTY_LOGIN_FORM = {
  email: '',
  password: ''
};

function createArticleForm(categories = [], authors = []) {
  return {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverUrl: '',
    authorId: authors[0]?.id ? String(authors[0].id) : '',
    categoryId: categories[0]?.id ? String(categories[0].id) : '',
    status: 'draft',
    publishedAt: '',
    metaTitle: '',
    metaDescription: '',
    tagIds: []
  };
}

const EMPTY_CATEGORY_FORM = {
  name: '',
  slug: '',
  description: ''
};

const EMPTY_TAG_FORM = {
  name: '',
  slug: ''
};

function formatDateTime(value) {
  if (!value) {
    return '—';
  }

  try {
    return new Intl.DateTimeFormat('uk-UA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function toDatetimeLocalValue(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function normalizeErrorMessage(error) {
  if (typeof error === 'string') {
    return error;
  }

  return error?.message || 'Щось пішло не так. Спробуй ще раз.';
}

export default function AdminApp() {
  const [loginForm, setLoginForm] = useState(EMPTY_LOGIN_FORM);
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedUploadFile, setSelectedUploadFile] = useState(null);

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [authors, setAuthors] = useState([]);

  const [editingArticleId, setEditingArticleId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingTagId, setEditingTagId] = useState(null);

  const [articleForm, setArticleForm] = useState(createArticleForm());
  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY_FORM);
  const [tagForm, setTagForm] = useState(EMPTY_TAG_FORM);

  useEffect(() => {
    const storedToken = window.localStorage.getItem('it-blog-admin-token') || '';
    const storedUser = window.localStorage.getItem('it-blog-admin-user');

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          window.localStorage.removeItem('it-blog-admin-user');
        }
      }

      loadDashboardData(storedToken).finally(() => {
        setInitializing(false);
      });
    } else {
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    if (categories.length || authors.length) {
      setArticleForm((current) => ({
        ...current,
        authorId: current.authorId || (authors[0]?.id ? String(authors[0].id) : ''),
        categoryId: current.categoryId || (categories[0]?.id ? String(categories[0].id) : '')
      }));
    }
  }, [authors, categories]);

  async function apiRequest(path, options = {}, activeToken = token) {
    const isFormData = options.body instanceof FormData;
    const response = await fetch(`${siteConfig.apiBaseUrl}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        ...(options.headers || {})
      }
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const serverMessage = payload?.error?.message || 'Запит не виконано';
      const errorToThrow = new Error(serverMessage);
      errorToThrow.status = response.status;
      errorToThrow.payload = payload;
      throw errorToThrow;
    }

    return payload;
  }

  function clearSession() {
    window.localStorage.removeItem('it-blog-admin-token');
    window.localStorage.removeItem('it-blog-admin-user');
    setToken('');
    setUser(null);
    setArticles([]);
    setCategories([]);
    setTags([]);
    setAuthors([]);
    setEditingArticleId(null);
    setEditingCategoryId(null);
    setEditingTagId(null);
    setArticleForm(createArticleForm());
    setCategoryForm(EMPTY_CATEGORY_FORM);
    setTagForm(EMPTY_TAG_FORM);
  }

  async function loadDashboardData(activeToken = token) {
    if (!activeToken) {
      return;
    }

    setLoadingData(true);
    setError('');

    try {
      const [mePayload, articlesPayload, categoriesPayload, tagsPayload, authorsPayload] = await Promise.all([
        apiRequest('/api/auth/me', {}, activeToken),
        apiRequest('/api/admin/articles?perPage=100', {}, activeToken),
        apiRequest('/api/admin/categories', {}, activeToken),
        apiRequest('/api/admin/tags', {}, activeToken),
        apiRequest('/api/admin/authors', {}, activeToken)
      ]);

      setUser(mePayload.data);
      window.localStorage.setItem('it-blog-admin-user', JSON.stringify(mePayload.data));
      setArticles(articlesPayload.data || []);
      setCategories(categoriesPayload.data || []);
      setTags(tagsPayload.data || []);
      setAuthors(authorsPayload.data || []);
      setArticleForm((current) => {
        if (current.title || current.content || editingArticleId) {
          return current;
        }
        return createArticleForm(categoriesPayload.data || [], authorsPayload.data || []);
      });
    } catch (requestError) {
      if (requestError.status === 401 || requestError.status === 403) {
        clearSession();
      }
      setError(normalizeErrorMessage(requestError));
    } finally {
      setLoadingData(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const payload = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginForm)
      });

      const nextToken = payload.data?.token;
      const nextUser = payload.data?.user;
      window.localStorage.setItem('it-blog-admin-token', nextToken);
      window.localStorage.setItem('it-blog-admin-user', JSON.stringify(nextUser));
      setToken(nextToken);
      setUser(nextUser);
      setMessage('Вхід виконано успішно.');
      await loadDashboardData(nextToken);
    } catch (requestError) {
      setError(normalizeErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    try {
      if (token) {
        await apiRequest('/api/auth/logout', {
          method: 'POST'
        });
      }
    } catch {
      // ignore logout transport errors for stateless JWT flow
    } finally {
      clearSession();
      setMessage('Сесію завершено.');
      setError('');
    }
  }

  function resetArticleForm() {
    setEditingArticleId(null);
    setSelectedUploadFile(null);
    setArticleForm(createArticleForm(categories, authors));
  }

  function resetCategoryForm() {
    setEditingCategoryId(null);
    setCategoryForm(EMPTY_CATEGORY_FORM);
  }

  function resetTagForm() {
    setEditingTagId(null);
    setTagForm(EMPTY_TAG_FORM);
  }

  function beginArticleEdit(article) {
    setEditingArticleId(article.id);
    setArticleForm({
      title: article.title || '',
      slug: article.slug || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      coverUrl: article.coverUrl || '',
      authorId: article.authorId ? String(article.authorId) : '',
      categoryId: article.categoryId ? String(article.categoryId) : '',
      status: article.status || 'draft',
      publishedAt: toDatetimeLocalValue(article.publishedAt),
      metaTitle: article.metaTitle || '',
      metaDescription: article.metaDescription || '',
      tagIds: (article.tagIds || []).map((item) => String(item))
    });
  }

  function beginCategoryEdit(category) {
    setEditingCategoryId(category.id);
    setCategoryForm({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || ''
    });
  }

  function beginTagEdit(tag) {
    setEditingTagId(tag.id);
    setTagForm({
      name: tag.name || '',
      slug: tag.slug || ''
    });
  }

  function toggleTag(tagId) {
    setArticleForm((current) => {
      const id = String(tagId);
      const hasTag = current.tagIds.includes(id);
      return {
        ...current,
        tagIds: hasTag ? current.tagIds.filter((item) => item !== id) : [...current.tagIds, id]
      };
    });
  }

  async function handleArticleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        ...articleForm,
        authorId: Number(articleForm.authorId),
        categoryId: Number(articleForm.categoryId),
        tagIds: articleForm.tagIds.map((item) => Number(item))
      };

      const requestPath = editingArticleId ? `/api/admin/articles/${editingArticleId}` : '/api/admin/articles';
      const requestMethod = editingArticleId ? 'PUT' : 'POST';

      await apiRequest(requestPath, {
        method: requestMethod,
        body: JSON.stringify(payload)
      });

      setMessage(editingArticleId ? 'Статтю оновлено.' : 'Статтю створено.');
      resetArticleForm();
      await loadDashboardData();
    } catch (requestError) {
      setError(normalizeErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleArticleDelete(articleId) {
    const isConfirmed = window.confirm('Видалити цю статтю?');
    if (!isConfirmed) {
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      await apiRequest(`/api/admin/articles/${articleId}`, {
        method: 'DELETE'
      });
      if (editingArticleId === articleId) {
        resetArticleForm();
      }
      setMessage('Статтю видалено.');
      await loadDashboardData();
    } catch (requestError) {
      setError(normalizeErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpload() {
    if (!selectedUploadFile) {
      setError('Спочатку обери файл для завантаження.');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', selectedUploadFile);
      const payload = await apiRequest(
        '/api/admin/upload',
        {
          method: 'POST',
          body: formData
        },
        token
      );

      setArticleForm((current) => ({
        ...current,
        coverUrl: payload.data?.url || current.coverUrl
      }));
      setMessage('Зображення завантажено, URL підставлено у форму статті.');
      setSelectedUploadFile(null);
    } catch (requestError) {
      setError(normalizeErrorMessage(requestError));
    } finally {
      setUploading(false);
    }
  }

  async function handleCategorySubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const requestPath = editingCategoryId
        ? `/api/admin/categories/${editingCategoryId}`
        : '/api/admin/categories';
      const requestMethod = editingCategoryId ? 'PUT' : 'POST';

      await apiRequest(requestPath, {
        method: requestMethod,
        body: JSON.stringify(categoryForm)
      });
      setMessage(editingCategoryId ? 'Категорію оновлено.' : 'Категорію створено.');
      resetCategoryForm();
      await loadDashboardData();
    } catch (requestError) {
      setError(normalizeErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCategoryDelete(categoryId) {
    const isConfirmed = window.confirm('Видалити цю категорію?');
    if (!isConfirmed) {
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      await apiRequest(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE'
      });
      if (editingCategoryId === categoryId) {
        resetCategoryForm();
      }
      setMessage('Категорію видалено.');
      await loadDashboardData();
    } catch (requestError) {
      setError(normalizeErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTagSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const requestPath = editingTagId ? `/api/admin/tags/${editingTagId}` : '/api/admin/tags';
      const requestMethod = editingTagId ? 'PUT' : 'POST';

      await apiRequest(requestPath, {
        method: requestMethod,
        body: JSON.stringify(tagForm)
      });
      setMessage(editingTagId ? 'Тег оновлено.' : 'Тег створено.');
      resetTagForm();
      await loadDashboardData();
    } catch (requestError) {
      setError(normalizeErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTagDelete(tagId) {
    const isConfirmed = window.confirm('Видалити цей тег?');
    if (!isConfirmed) {
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      await apiRequest(`/api/admin/tags/${tagId}`, {
        method: 'DELETE'
      });
      if (editingTagId === tagId) {
        resetTagForm();
      }
      setMessage('Тег видалено.');
      await loadDashboardData();
    } catch (requestError) {
      setError(normalizeErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  if (initializing) {
    return (
      <section className="panel admin-shell">
        <h1>Панель адміністрування</h1>
        <p className="muted">Завантажуємо сесію адміністратора…</p>
      </section>
    );
  }

  if (!token) {
    return (
      <section className="panel admin-shell narrow-panel">
        <p className="admin-note">Службова зона</p>
        <h1>Логін в адмін панель</h1>
        <p className="muted">
          Увійди через JWT-авторизацію, щоб керувати статтями, категоріями, тегами та авторами.
        </p>
        {error ? <p className="message message-error">{error}</p> : null}
        {message ? <p className="message message-success">{message}</p> : null}
        <form onSubmit={handleLogin} className="admin-form stacked-form" autoComplete="off">
          <label className="field">
            <span>Email</span>
            <input
              className="input"
              type="email"
              autoComplete="off"
              placeholder="Введіть email"
              value={loginForm.email}
              onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </label>
          <label className="field">
            <span>Пароль</span>
            <input
              className="input"
              type="password"
              autoComplete="off"
              placeholder="Введіть пароль"
              value={loginForm.password}
              onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </label>
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? 'Входимо…' : 'Увійти'}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="admin-layout">
      <div className="panel admin-shell">
        <div className="admin-toolbar">
          <div>
            <p className="admin-note">Службова зона</p>
            <h1>Панель адміністрування</h1>
            <p className="muted">
              Увійшов: <strong>{user?.name || user?.email}</strong>
            </p>
          </div>
          <div className="inline-list">
            <button className="button button-secondary" type="button" onClick={() => loadDashboardData()}>
              Оновити дані
            </button>
            <button className="button button-secondary" type="button" onClick={handleLogout}>
              Вийти
            </button>
          </div>
        </div>

        {loadingData ? <p className="muted">Оновлюємо дані адмін панелі…</p> : null}
        {error ? <p className="message message-error">{error}</p> : null}
        {message ? <p className="message message-success">{message}</p> : null}
      </div>

      <div className="admin-grid">
        <section className="panel admin-card">
          <div className="section-heading">
            <div>
              <h2>{editingArticleId ? 'Редагування статті' : 'Нова стаття'}</h2>
              <p className="muted">CRUD статей, SEO-поля, статус та теги.</p>
            </div>
            <button className="button button-secondary" type="button" onClick={resetArticleForm}>
              Очистити форму
            </button>
          </div>

          <form onSubmit={handleArticleSubmit} className="admin-form">
            <div className="form-grid two-columns">
              <label className="field">
                <span>Заголовок</span>
                <input
                  className="input"
                  value={articleForm.title}
                  onChange={(event) => setArticleForm((current) => ({ ...current, title: event.target.value }))}
                  required
                />
              </label>
              <label className="field">
                <span>Slug</span>
                <input
                  className="input"
                  value={articleForm.slug}
                  onChange={(event) => setArticleForm((current) => ({ ...current, slug: event.target.value }))}
                />
              </label>
            </div>

            <label className="field">
              <span>Короткий опис</span>
              <textarea
                className="input textarea"
                rows={3}
                value={articleForm.excerpt}
                onChange={(event) => setArticleForm((current) => ({ ...current, excerpt: event.target.value }))}
              />
            </label>

            <label className="field">
              <span>Контент</span>
              <textarea
                className="input textarea"
                rows={10}
                value={articleForm.content}
                onChange={(event) => setArticleForm((current) => ({ ...current, content: event.target.value }))}
                required
              />
            </label>

            <div className="form-grid two-columns">
              <label className="field">
                <span>Автор</span>
                <select
                  className="input"
                  value={articleForm.authorId}
                  onChange={(event) => setArticleForm((current) => ({ ...current, authorId: event.target.value }))}
                  required
                >
                  <option value="">Оберіть автора</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Категорія</span>
                <select
                  className="input"
                  value={articleForm.categoryId}
                  onChange={(event) => setArticleForm((current) => ({ ...current, categoryId: event.target.value }))}
                  required
                >
                  <option value="">Оберіть категорію</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-grid three-columns">
              <label className="field">
                <span>Статус</span>
                <select
                  className="input"
                  value={articleForm.status}
                  onChange={(event) => setArticleForm((current) => ({ ...current, status: event.target.value }))}
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </select>
              </label>
              <label className="field">
                <span>Дата публікації</span>
                <input
                  className="input"
                  type="datetime-local"
                  value={articleForm.publishedAt}
                  onChange={(event) => setArticleForm((current) => ({ ...current, publishedAt: event.target.value }))}
                />
              </label>
              <label className="field">
                <span>URL обкладинки</span>
                <input
                  className="input"
                  value={articleForm.coverUrl}
                  onChange={(event) => setArticleForm((current) => ({ ...current, coverUrl: event.target.value }))}
                />
              </label>
            </div>

            <div className="upload-box">
              <label className="field grow">
                <span>Завантаження обкладинки</span>
                <input
                  className="input"
                  type="file"
                  accept="image/*"
                  onChange={(event) => setSelectedUploadFile(event.target.files?.[0] || null)}
                />
              </label>
              <button className="button button-secondary" type="button" onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Завантажуємо…' : 'Upload image'}
              </button>
            </div>

            <div className="form-grid two-columns">
              <label className="field">
                <span>Meta title</span>
                <input
                  className="input"
                  value={articleForm.metaTitle}
                  onChange={(event) => setArticleForm((current) => ({ ...current, metaTitle: event.target.value }))}
                />
              </label>
              <label className="field">
                <span>Meta description</span>
                <input
                  className="input"
                  value={articleForm.metaDescription}
                  onChange={(event) => setArticleForm((current) => ({ ...current, metaDescription: event.target.value }))}
                />
              </label>
            </div>

            <div className="field">
              <span>Теги</span>
              <div className="checkbox-grid">
                {tags.map((tag) => (
                  <label key={tag.id} className="checkbox-pill">
                    <input
                      type="checkbox"
                      checked={articleForm.tagIds.includes(String(tag.id))}
                      onChange={() => toggleTag(tag.id)}
                    />
                    <span>{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="button" type="submit" disabled={submitting}>
              {submitting ? 'Зберігаємо…' : editingArticleId ? 'Оновити статтю' : 'Створити статтю'}
            </button>
          </form>
        </section>

        <section className="panel admin-card">
          <div className="section-heading">
            <div>
              <h2>Статті</h2>
              <p className="muted">Всі статті, включно з чернетками.</p>
            </div>
          </div>
          <div className="admin-list article-admin-list">
            {articles.map((article) => (
              <article key={article.id} className="admin-list-item">
                <div>
                  <h3>{article.title}</h3>
                  <p className="muted">
                    {article.status} · {article.category?.name || 'Без категорії'} · {article.author?.name || 'Без автора'}
                  </p>
                  <p className="muted">Опубліковано: {formatDateTime(article.publishedAt)}</p>
                </div>
                <div className="inline-list admin-actions">
                  <button className="button button-secondary" type="button" onClick={() => beginArticleEdit(article)}>
                    Редагувати
                  </button>
                  <button className="button button-danger" type="button" onClick={() => handleArticleDelete(article.id)}>
                    Видалити
                  </button>
                </div>
              </article>
            ))}
            {!articles.length ? <p className="muted">Статей ще немає.</p> : null}
          </div>
        </section>

        <section className="panel admin-card">
          <div className="section-heading">
            <div>
              <h2>{editingCategoryId ? 'Редагування категорії' : 'Категорії'}</h2>
              <p className="muted">CRUD категорій.</p>
            </div>
            <button className="button button-secondary" type="button" onClick={resetCategoryForm}>
              Нова категорія
            </button>
          </div>
          <form onSubmit={handleCategorySubmit} className="admin-form stacked-form">
            <label className="field">
              <span>Назва</span>
              <input
                className="input"
                value={categoryForm.name}
                onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </label>
            <label className="field">
              <span>Slug</span>
              <input
                className="input"
                value={categoryForm.slug}
                onChange={(event) => setCategoryForm((current) => ({ ...current, slug: event.target.value }))}
              />
            </label>
            <label className="field">
              <span>Опис</span>
              <textarea
                className="input textarea"
                rows={4}
                value={categoryForm.description}
                onChange={(event) => setCategoryForm((current) => ({ ...current, description: event.target.value }))}
              />
            </label>
            <button className="button" type="submit" disabled={submitting}>
              {editingCategoryId ? 'Оновити категорію' : 'Створити категорію'}
            </button>
          </form>
          <div className="admin-list compact-list">
            {categories.map((category) => (
              <article key={category.id} className="admin-list-item">
                <div>
                  <h3>{category.name}</h3>
                  <p className="muted">/{category.slug}</p>
                </div>
                <div className="inline-list admin-actions">
                  <button className="button button-secondary" type="button" onClick={() => beginCategoryEdit(category)}>
                    Редагувати
                  </button>
                  <button className="button button-danger" type="button" onClick={() => handleCategoryDelete(category.id)}>
                    Видалити
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel admin-card">
          <div className="section-heading">
            <div>
              <h2>{editingTagId ? 'Редагування тегу' : 'Теги'}</h2>
              <p className="muted">CRUD тегів.</p>
            </div>
            <button className="button button-secondary" type="button" onClick={resetTagForm}>
              Новий тег
            </button>
          </div>
          <form onSubmit={handleTagSubmit} className="admin-form stacked-form">
            <label className="field">
              <span>Назва</span>
              <input
                className="input"
                value={tagForm.name}
                onChange={(event) => setTagForm((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </label>
            <label className="field">
              <span>Slug</span>
              <input
                className="input"
                value={tagForm.slug}
                onChange={(event) => setTagForm((current) => ({ ...current, slug: event.target.value }))}
              />
            </label>
            <button className="button" type="submit" disabled={submitting}>
              {editingTagId ? 'Оновити тег' : 'Створити тег'}
            </button>
          </form>
          <div className="admin-list compact-list">
            {tags.map((tag) => (
              <article key={tag.id} className="admin-list-item">
                <div>
                  <h3>{tag.name}</h3>
                  <p className="muted">#{tag.slug}</p>
                </div>
                <div className="inline-list admin-actions">
                  <button className="button button-secondary" type="button" onClick={() => beginTagEdit(tag)}>
                    Редагувати
                  </button>
                  <button className="button button-danger" type="button" onClick={() => handleTagDelete(tag.id)}>
                    Видалити
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel admin-card full-span">
          <div className="section-heading">
            <div>
              <h2>Автори</h2>
              <p className="muted">Список авторів, доступний в адмін панелі.</p>
            </div>
          </div>
          <div className="admin-list compact-list">
            {authors.map((author) => (
              <article key={author.id} className="admin-list-item">
                <div>
                  <h3>{author.name}</h3>
                  <p className="muted">{author.email}</p>
                  <p className="muted">{author.bio}</p>
                </div>
                <span className="pill">{author.publishedCount ?? 0} статей</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
