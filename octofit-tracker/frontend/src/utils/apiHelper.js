export const getBaseUrl = () => {
  return process.env.REACT_APP_CODESPACE_NAME ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev` : 'http://localhost:8000';
};

export const getApiUrl = (endpoint) => {
  return `${getBaseUrl()}/api/${endpoint}/`;
};