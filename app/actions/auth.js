export const CREATE_USER = 'CREATE_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const LOGIN_USER = 'LOGIN_USER';
export const RESTORE_SESSION = 'RESTORE_SESSION';
export const LOGOUT_USER = 'LOGOUT_USER';
export const FAILED_REQUEST = 'FAILED_REQUEST';

export const createUser = token => ({
  type: CREATE_USER,
  token: token,
});

export const updateUser = name => ({
  type: UPDATE_USER,
  name: name,
});

export const loginUser = name => ({
  type: LOGIN_USER,
  name: name,
});

export const restoreSession = token => ({
  type: RESTORE_SESSION,
  token: token,
});

export const logoutUser = name => ({
  type: LOGOUT_USER,
  name: name,
});
