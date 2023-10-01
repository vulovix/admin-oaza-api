const Config = {
  DB_STRING: import.meta.env.VITE_DB_STRING || process.env.DB_STRING,
  ACCOUNT_SECRET: import.meta.env.VITE_ACCOUNT_SECRET || process.env.ACCOUNT_SECRET,
};

export default Config;
