use chrono::Utc;
use std::{fs, path::PathBuf};

pub fn telemetry_path() -> Option<PathBuf> {
  let Some(mut home) = dirs::home_dir() else {
    return None;
  };
  home.push(".clarifile/telemetry");
  if fs::create_dir_all(&home).is_ok() {
    let file = format!("{}.log", Utc::now().format("%Y%m%d"));
    home.push(file);
    Some(home)
  } else {
    None
  }
}
