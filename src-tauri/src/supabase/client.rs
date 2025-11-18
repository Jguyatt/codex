use serde::Serialize;
use std::env;

#[derive(Debug, Serialize)]
pub struct SupabaseConfig {
  pub url: String,
  pub anon_key: String,
  pub service_key: Option<String>,
}

pub fn load_config() -> SupabaseConfig {
  SupabaseConfig {
    url: env::var("SUPABASE_URL").unwrap_or_default(),
    anon_key: env::var("SUPABASE_ANON_KEY").unwrap_or_default(),
    service_key: env::var("SUPABASE_SERVICE_ROLE_KEY").ok(),
  }
}
