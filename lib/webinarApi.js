// Client API helper for Webinars

export const getWebinarsApi = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.status && params.status !== "ALL") query.append("status", params.status);
    if (params.category && params.category !== "All") query.append("category", params.category);
    if (params.search) query.append("search", params.search);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const res = await fetch(`/api/webinars${queryString}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data?.data || [];
  } catch (err) {
    console.warn("Failed to fetch webinars from API:", err);
    return [];
  }
};

export const createWebinarApi = async (webinarData) => {
  const res = await fetch("/api/webinars", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(webinarData),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to create webinar");
  }
  return await res.json();
};

export const updateWebinarApi = async (id, webinarData) => {
  const res = await fetch(`/api/webinars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(webinarData),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to update webinar");
  }
  return await res.json();
};

export const deleteWebinarApi = async (id) => {
  const res = await fetch(`/api/webinars/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to delete webinar");
  }
  return await res.json();
};
