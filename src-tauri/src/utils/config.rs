use std::env;

pub fn app_env() -> String {
  env::var("CLARIFILE_ENV").unwrap_or_else(|_| "development".to_string())
}
