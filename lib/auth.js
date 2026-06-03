const API = 'https://finale-beacon-backend.vercel.app'

export const authAPI = {
  login: async (email, password) => {
    const res = await fetch(`${API}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json(); // { success, data: { token, name, email } }
  },

  register: async (name, email, password) => {
    const res = await fetch(`${API}/api/admin/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  },
};

// Token helpers

export const getToken = () => localStorage.getItem("admin_token");

export const saveToken = (token) => {
  localStorage.setItem("admin_token", token);
  document.cookie = `admin_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
};
export const removeToken = () => {
  localStorage.removeItem("admin_token");
  document.cookie = "admin_token=; path=/; max-age=0";
};
export const isLoggedIn = () => !!getToken();