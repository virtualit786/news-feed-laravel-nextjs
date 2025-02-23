const auth = "auth";
const articles = "articles";
const preferences = "preferences";

export const appRoutes = {
  auth: {
    login: `/${auth}/login`,
    signUp: `/${auth}/signup`,
  },
  articles: `/${articles}`,
  preferences: `/${preferences}`,
} 