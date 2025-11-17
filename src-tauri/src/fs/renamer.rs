use crate::fs::undo::{self, UndoLogEntry};
use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf};

#[derive(Debug, Deserialize, Serialize)]
pub struct ProposedMove {
  pub from: String,
  pub to: String,
  pub include: bool,
}

#[derive(Debug, Serialize)]
pub struct ApplySummary {
  pub moved: usize,
  pub skipped: usize,
  pub log_path: String,
}

pub fn apply_moves(entries: Vec<ProposedMove>) -> anyhow::Result<ApplySummary> {
  let total = entries.len();
  let mut moved = 0;
  let mut log_entries = Vec::new();

  for entry in entries.into_iter().filter(|e| e.include) {
    let from_path = PathBuf::from(&entry.from);
    let to_path = PathBuf::from(&entry.to);
    if let Some(parent) = to_path.parent() {
      fs::create_dir_all(parent)?;
    }
    fs::rename(&from_path, &to_path)?;
    log_entries.push(UndoLogEntry {
      from: to_path.display().to_string(),
      to: from_path.display().to_string(),
    });
    moved += 1;
  }

  let log_path = undo::persist_log(log_entries)?;

  Ok(ApplySummary {
    moved,
    skipped: total.saturating_sub(moved),
    log_path,
  })
}
