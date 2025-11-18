use chrono::Utc;
use dirs::home_dir;
use serde::{Deserialize, Serialize};
use serde_json;
use std::{fs, path::PathBuf};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UndoLogEntry {
  pub from: String,
  pub to: String,
}

#[derive(Debug, Serialize)]
pub struct UndoSummary {
  pub restored: usize,
  pub log_path: Option<String>,
}

pub fn persist_log(entries: Vec<UndoLogEntry>) -> anyhow::Result<String> {
  let Some(mut home) = home_dir() else {
    anyhow::bail!("cannot resolve home directory");
  };
  home.push(".clarifile/logs");
  fs::create_dir_all(&home)?;
  let timestamp = Utc::now().format("%Y%m%dT%H%M%S");
  let file_name = format!("{}.json", timestamp);
  home.push(&file_name);
  let json = serde_json::to_string_pretty(&entries)?;
  fs::write(&home, json)?;
  Ok(home.display().to_string())
}

pub fn undo_last_log() -> anyhow::Result<UndoSummary> {
  let Some(mut home) = home_dir() else {
    anyhow::bail!("cannot resolve home directory");
  };
  home.push(".clarifile/logs");
  let Ok(dir) = fs::read_dir(&home) else {
    return Ok(UndoSummary {
      restored: 0,
      log_path: None,
    });
  };

  let mut entries: Vec<PathBuf> = dir.filter_map(|entry| entry.ok().map(|e| e.path())).collect();
  if entries.is_empty() {
    return Ok(UndoSummary {
      restored: 0,
      log_path: None,
    });
  }

  entries.sort_by_key(|path| fs::metadata(path).and_then(|m| m.modified()).ok());
  let latest_path = entries.pop().unwrap();
  let content = fs::read_to_string(&latest_path)?;
  let entries: Vec<UndoLogEntry> = serde_json::from_str(&content)?;
  let mut restored = 0;
  for entry in entries {
    if std::fs::rename(&entry.from, &entry.to).is_ok() {
      restored += 1;
    }
  }

  Ok(UndoSummary {
    restored,
    log_path: Some(latest_path.display().to_string()),
  })
}
