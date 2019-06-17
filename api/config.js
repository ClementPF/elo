const BASE_LOCAL_URL = "https://localhost:5000";
const BASE_REMOTE_URL = "https://api.shrkltr.com";

const API_CONF = {
  BASE_LOCAL_URL,
  BASE_REMOTE_URL,
  BASE_URL: BASE_REMOTE_URL
};

const API_ENDPOINTS = {
  AUTH: "/auth",
  TOURNAMENT: "/tournament",
  TOURNAMENTS: "/tournaments",
  USER: "/user",
  USERS: "/users",
  SPORTS: "/sports",
  STATS: "/stats",
  RIVALRY: "/rivalry",
  RIVALRIES: "/rivalries"
};

export { API_CONF, API_ENDPOINTS };
