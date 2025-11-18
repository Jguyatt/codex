use rand::seq::SliceRandom;
use rand::thread_rng;
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct MockAiResponse {
  pub category: String,
  pub title: String,
}

const DOCS: &[&str] = &["Project Notes", "Statement", "Syllabus"]; 
const IMAGES: &[&str] = &["Sunset Memory", "Roadtrip", "Family Portrait"];
const VIDEOS: &[&str] = &["Weekend Ride", "Workshop Clip", "Birthday"];

pub fn name_document() -> MockAiResponse {
  respond("docs", DOCS)
}

pub fn name_image() -> MockAiResponse {
  respond("images", IMAGES)
}

pub fn name_video() -> MockAiResponse {
  respond("videos", VIDEOS)
}

fn respond(category: &str, options: &[&str]) -> MockAiResponse {
  let mut rng = thread_rng();
  MockAiResponse {
    category: category.to_string(),
    title: options.choose(&mut rng).unwrap_or(&"Clarifile Item").to_string(),
  }
}
