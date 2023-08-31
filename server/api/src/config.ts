const Config = {
  DB_STRING: import.meta.env.VITE_DB_STRING || process.env.DB_STRING,
  ACCOUNT_SECRET: import.meta.env.VITE_ACCOUNT_SECRET || process.env.ACCOUNT_SECRET,
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  OPENAI_ORGANIZATION: import.meta.env.VITE_OPENAI_ORGANIZATION || process.env.OPENAI_ORGANIZATION,
};

export default Config;
